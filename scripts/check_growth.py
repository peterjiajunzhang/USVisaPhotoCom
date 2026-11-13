from pathlib import Path
from urllib.parse import urlsplit,parse_qs
import json,sys,xml.etree.ElementTree as ET
from bs4 import BeautifulSoup
root=Path(sys.argv[1]);sys.path.insert(0,str(root/'scripts'))
from play_campaigns import CONFIG,play_url
c=json.loads((root/'localization/config.json').read_text());origin=c['origin'];is_us='us.' in origin
assert CONFIG['package']=='com.loop.usvisaphoto' and CONFIG['medium']=='website'
assert CONFIG['placements']=={'home-android':{'source':'us_website','campaign':'us_home','content':'hero'},'home-footer-android':{'source':'us_website','campaign':'us_home','content':'footer'},'guide-android':{'source':'us_website','campaign':'us_guides','content':'guide'},'root-country-android':{'source':'root_website','campaign':'root_country','content':'us_card'}}
sm={e.find('{*}loc').text:e.find('{*}lastmod').text for e in ET.parse(root/'sitemap.xml').getroot()}
n=0
for loc in c['locales']:
 for f in c['pages']:
  path=loc['prefix'].lstrip('/')
  file=root/path/f; soup=BeautifulSoup(file.read_text(),'html.parser')
  route='/'+f.removesuffix('index.html') if f.endswith('index.html') else '/'+f
  canonical=origin+loc['prefix']+route
  assert soup.html['lang']==loc['code'] and soup.select_one('link[rel=canonical]')['href']==canonical
  langs={x['hreflang']:x['href'] for x in soup.select('link[rel=alternate][hreflang]')}
  assert len(langs)==8 and all(langs[l['code']]==origin+l['prefix']+route for l in c['locales'])
  assert sm[canonical]==c.get('pageModified',{}).get(f,c['modified'])
  expected=(2 if f=='index.html' else (0 if f=='guides/index.html' else 1)) if is_us else 1
  badges=soup.select('a[data-play-campaign]'); assert len(badges)==expected,(file,len(badges))
  for a in badges:
   placement=a['data-play-campaign'];url=a['href'];assert url==play_url(placement)
   u=urlsplit(url);q=parse_qs(u.query,strict_parsing=True);assert u.scheme=='https' and u.netloc=='play.google.com' and u.path=='/store/apps/details' and q['id']==[CONFIG['package']] and set(q)=={'id','referrer'}
   ref=parse_qs(q['referrer'][0],strict_parsing=True);p=CONFIG['placements'][placement]
   assert ref=={'utm_source':[p['source']],'utm_medium':[CONFIG['medium']],'utm_campaign':[p['campaign']],'utm_content':[p['content']]}
   assert a.img and a.img.get('src','').endswith('google-play.png')
  for a in soup.select('a[href*="apps.apple.com"]'):
   if a.find('img'): assert a.img.get('src','').endswith('app-store.svg')
  for ld in soup.select('script[type="application/ld+json"]'):
   data=json.loads(ld.string); assert 'referrer=' not in json.dumps(data)
  n+=1
print(f'{n} localized pages: campaigns, decoded referrers, badges, canonical, hreflang, sitemap and JSON-LD passed')
