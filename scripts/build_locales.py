#!/usr/bin/env python3
"""Build reviewed static localized pages from reviewed copy. No browser translation or locale redirects."""
from pathlib import Path
from bs4 import BeautifulSoup, Comment, Doctype
from urllib.parse import urljoin,urlsplit,urlunsplit
import json,re,copy,xml.etree.ElementTree as ET
ROOT=Path(__file__).resolve().parents[1]
CONFIG=json.loads((ROOT/'localization/config.json').read_text())
ORIGIN=CONFIG['origin'];FILES=CONFIG['pages'];LOCALES=CONFIG['locales']
PREFIX='';COPY={}
ALLOWED=set(CONFIG.get('keepEnglish',[]))
normalize=lambda t:re.sub(r'\s+',' ',str(t)).strip()
def route(f):return '/'+f.removesuffix('index.html') if f.endswith('index.html') else '/'+f
def translated_url(url):
 u=urlsplit(url)
 path=u.path
 for locale in LOCALES:
  prefix=locale['prefix']
  if prefix and (path==prefix or path.startswith(prefix+'/')):
   path=path[len(prefix):] or '/';break
 u=u._replace(path=path)
 hosts={'visaphoto1tap.com':{'/'},'us.visaphoto1tap.com':{'/','/guides/','/guides/us-visa-photo-requirements.html','/guides/ds-160-photo-upload-failed.html','/guides/us-visa-photo-privacy-and-pricing.html'}}
 if u.netloc=='us.visaphoto1tap.com' and u.path=='/support.html':return urlunsplit((u.scheme,u.netloc,u.path,u.query,LANG['code']))
 if u.netloc in hosts and u.path in hosts[u.netloc]:return urlunsplit((u.scheme,u.netloc,PREFIX+u.path,u.query,u.fragment))
 if u.netloc=='us.visaphoto1tap.com' and u.path=='/guides/ds-160-photo-upload-failed-zh.html':return urlunsplit((u.scheme,u.netloc,PREFIX+'/guides/ds-160-photo-upload-failed.html',u.query,u.fragment))
 return url

def clean(soup):
 for n in soup.select('#page-language, [data-page-language], link[rel="alternate"][hreflang]'):n.decompose()
 # An index lists article topics once; languages belong to the site selector.
 for n in soup.select('section.card[lang="zh-Hans"]'):n.decompose()
 for p in soup.find_all('p'):
  if normalize(p.get_text()).startswith(('Language: English','语言：简体中文')):p.decompose()
 for a in soup.find_all('a',href=True):
  if a['href'].endswith('/guides/ds-160-photo-upload-failed-zh.html') and a.find_parent('main') and not a.find_parent('section',class_='card'):
   p=a.find_parent('p')
   if p and len(p.find_all('a'))==1 and normalize(p.get_text())==normalize(a.get_text()):p.decompose()

def store_actions(soup,f):
 if not f.startswith('guides/') or f.endswith('index.html') or soup.select_one('.store-badges'):return
 source=BeautifulSoup((ROOT/'guides/us-visa-photo-privacy-and-pricing.html').read_text(),'html.parser')
 badges=copy.copy(source.select_one('.store-badges'))
 if badges is None:raise ValueError('Missing canonical guide store badges')
 sourceblock=soup.select_one('section.sources')
 if sourceblock:sourceblock.insert_before(badges)
 else:soup.main.append(badges)
 if not soup.select_one('link[href="/assets/store-badges.css"]'):soup.head.append(soup.new_tag('link',rel='stylesheet',href='/assets/store-badges.css'))

def language_ui(soup,f,lang):
 d=soup.new_tag('details',id='page-language',attrs={'class':'locale-switcher'})
 summary=soup.new_tag('summary',attrs={'aria-label':LANG['choose']})
 summary.string=LANG['name'];d.append(summary)
 ul=soup.new_tag('ul',attrs={'class':'locale-list'})
 for locale in LOCALES:
  code,label,path=locale['code'],locale['name'],locale['prefix']+route(f)
  li=soup.new_tag('li');a=soup.new_tag('a',href=path,lang=code,hreflang=code)
  a.string=label
  if lang==code:a['aria-current']='page'
  li.append(a);ul.append(li)
 d.append(ul)
 target=soup.select_one('.platform-links') or soup.select_one('.nav-links') or soup.select_one('header nav > div')
 if target is None:raise ValueError('Missing header for '+f)
 switcher=target.select_one('.relative')
 if switcher:switcher.insert_before(d)
 else:target.append(d)

missing=set()
def translate(soup):
 for n in list(soup.find_all(string=True)):
  if isinstance(n,(Comment,Doctype)) or n.parent.name in ['script','style']:continue
  text=normalize(n)
  if text in COPY:
   raw=str(n);n.replace_with((' ' if raw[:1].isspace() else '')+COPY[text]+(' ' if raw[-1:].isspace() else ''))
  elif re.search('[A-Za-z]',text) and text not in ALLOWED:missing.add(LANG['code']+': '+text)
 for el in soup.find_all(True):
  for attr in ['alt','aria-label','title','placeholder']:
   text=el.get(attr)
   if text in COPY:el[attr]=COPY[text]
   elif text and re.search('[A-Za-z]',text) and text not in ALLOWED:missing.add(LANG['code']+': '+text)
  if el.name=='meta' and el.get('name',el.get('property','')) in ['description','og:title','og:description','twitter:title','twitter:description']:
   text=normalize(el.get('content',''))
   if text in COPY:el['content']=COPY[text]
   elif text and text not in ALLOWED:missing.add(LANG['code']+': '+text)

def links(soup,f,lang):
 for el in soup.find_all(True):
  for attr in ['href','src']:
   v=el.get(attr)
   if not v or v.startswith(('#','mailto:','data:','javascript:')):continue
   absolute=urljoin(ORIGIN+route(f),v)
   if lang!='en' and not (el.name=='link' and el.get('rel')==['alternate']):absolute=translated_url(absolute)
   u=urlsplit(absolute)
   if u.netloc==urlsplit(ORIGIN).netloc:el[attr]=urlunsplit(('','',u.path,u.query,u.fragment))
   else:el[attr]=absolute
 # Language annotations and canonical always use fully qualified URLs.
 for n in soup.select('link[rel="canonical"],meta[property="og:url"]'):
  attr='href' if n.name=='link' else 'content';n[attr]=ORIGIN+(PREFIX if lang!='en' else '')+route(f)
 for code,path in [(locale['code'],locale['prefix']+route(f)) for locale in LOCALES]+[('x-default',route(f))]:
  soup.head.append(soup.new_tag('link',rel='alternate',hreflang=code,href=ORIGIN+path,attrs={'data-page-language':''}))
 for script in soup.select('script[type="application/ld+json"]'):
  data=json.loads(script.string)
  def localize(o,key=None):
   if isinstance(o,dict):
    result={k:localize(v,k) for k,v in o.items()}
    if o.get('@type') in ['WebSite','WebPage','Article']:result['inLanguage']=lang
    return result
   if isinstance(o,list):return [localize(v,key) for v in o]
   if isinstance(o,str):
    if o.startswith('https://') and lang!='en':return translated_url(o)
    if key=='inLanguage':return lang
    if lang!='en' and key in ['name','headline','description','text'] and o in COPY:return COPY[o]
   return o
  script.string=json.dumps(localize(data),ensure_ascii=False)

pending=[]
for f in FILES:
 source=(ROOT/f).read_text()
 for LANG in LOCALES:
  lang=LANG['code'];PREFIX=LANG['prefix']
  COPY=json.loads((ROOT/('localization/'+lang+'.json')).read_text()) if lang!='en' else {}
  override=CONFIG.get('sourceOverrides',{}).get(lang,{}).get(f)
  native=bool(override)
  soup=BeautifulSoup((ROOT/override).read_text() if native else source,'html.parser');clean(soup);store_actions(soup,f)
  if lang!='en' and not native:translate(soup)
  soup.html['lang']=lang
  links(soup,f,lang);language_ui(soup,f,lang)
  status=soup.select_one('#filter-status')
  if status:
   status['data-count-one']=LANG['filterOne'];status['data-count-many']=LANG['filterMany']
  if f=='index.html':
   # The live Google renderer intermittently failed to fetch these small stylesheets.
   # Keep the home layout available in the same response as its static content.
   for el in soup.select('link[rel="stylesheet"]'):
    if el.get('href','').split('?')[0] in ['/assets/home.css','/assets/platforms.css','/assets/locales.css']:el.decompose()
   css=soup.new_tag('style',attrs={'data-page-language':'','data-home-styles':''})
   platform_css=(ROOT/'assets/platforms.css').read_text().replace("@import url('/assets/store-badges.css');",'')
   css.string='\n'.join([(ROOT/'assets/home.css').read_text(),(ROOT/'assets/store-badges.css').read_text(),platform_css])
   first_style=soup.head.find('style')
   if first_style:first_style.insert_before(css)
   else:soup.head.append(css)
   # Keep the original cascade: base/platform, existing home overrides, locale.
   css=soup.new_tag('style',attrs={'data-page-language':'','data-locale-styles':''})
   css.string=(ROOT/'assets/locales.css').read_text()
  else:
   css=soup.new_tag('link',rel='stylesheet',href='/assets/locales.css?v=20261111-seven',attrs={'data-page-language':''})
  soup.head.append(css)
  control=soup.new_tag('script',src='/assets/locales.js',defer='',attrs={'data-page-language':''});soup.head.append(control)
  dest=ROOT/(PREFIX.lstrip('/')+'/'+f if PREFIX else f)
  pending.append((dest,str(soup).rstrip()+'\n'))
if missing:raise SystemExit('Missing reviewed translations:\n'+'\n'.join(sorted(missing)))
for dest,html in pending:
 dest.parent.mkdir(parents=True,exist_ok=True);dest.write_text(html)
if CONFIG.get('legacyChineseGuide'):
 old=ROOT/CONFIG['legacyChineseGuide'];new='/zh-hans/guides/ds-160-photo-upload-failed.html'
 old.write_text(f'<!doctype html>\n<html lang="zh-Hans"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>DS-160 照片上传指南</title><link rel="canonical" href="{ORIGIN+new}"><meta http-equiv="refresh" content="0;url={new}"><p>本指南已移至<a href="{new}">中文版照片指南</a>。</p><script>location.replace({json.dumps(new)}+location.search+location.hash);</script></html>\n')
ns='http://www.sitemaps.org/schemas/sitemap/0.9';ET.register_namespace('',ns)
site=ET.parse(ROOT/'sitemap.xml');tree=site.getroot();existing={n.find('{'+ns+'}loc').text:n for n in list(tree)}
if CONFIG.get('legacyChineseGuide'):
 old=ORIGIN+'/'+CONFIG['legacyChineseGuide']
 if old in existing:tree.remove(existing[old])
for f in FILES:
 for prefix in [locale['prefix'] for locale in LOCALES]:
  url=ORIGIN+prefix+route(f)
  if url in existing:n=existing[url]
  else:n=ET.SubElement(tree,'{'+ns+'}url');ET.SubElement(n,'{'+ns+'}loc').text=url
  last=n.find('{'+ns+'}lastmod')
  if last is None:last=ET.SubElement(n,'{'+ns+'}lastmod')
  last.text=CONFIG.get('pageModified',{}).get(f,CONFIG['modified'])
ET.indent(tree,space='  ');site.write(ROOT/'sitemap.xml',encoding='utf-8',xml_declaration=True)
print(f'Built {len(FILES)} topics in {len(LOCALES)} languages; sitemap has {len(tree)} URLs.')
