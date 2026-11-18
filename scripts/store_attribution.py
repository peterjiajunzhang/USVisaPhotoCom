"""Apply deterministic per-canonical-page store attribution and initialize click counting."""
from html import escape, unescape
import json
from pathlib import Path
import re
from urllib.parse import parse_qsl, urlencode, urlsplit, urlunsplit

CONFIG = json.loads((Path(__file__).resolve().with_name("store-attribution.json")).read_text())
APP_BY_ID = {app_id: app for app, app_id in CONFIG["appleIds"].items()}
HOST_KEYS = {
    "visaphoto1tap.com": "root",
    "us.visaphoto1tap.com": "us",
    "china.visaphoto1tap.com": "cn",
    "canada.visaphoto1tap.com": "ca",
    "india.visaphoto1tap.com": "in",
    "japan.visaphoto1tap.com": "jp",
    "schengen.visaphoto1tap.com": "eu",
}
LANGUAGE_KEYS = {"en":"en", "en-AU":"au", "zh-Hans":"zhs", "zh-Hant":"zht", "es":"es", "ja":"ja", "de":"de", "fr":"fr"}
TOPICS = {
    "/": "home",
    "/guides/china-visa-photo-upload-failed.html": "cn-upload",
    "/guides/ds-160-photo-upload-error.html": "ds160",
    "/guides/ds-160-photo-upload-failed.html": "ds160",
    "/guides/dv-lottery-photo-requirements.html": "dv-photo",
    "/guides/india-e-visa-photo-requirements.html": "in-evisa",
    "/guides/schengen-visa-photo-requirements-by-country.html": "eu-sizes",
    "/guides/us-visa-photo-at-home-with-phone.html": "home-photo",
    "/guides/us-visa-photo-privacy-and-pricing.html": "pricing",
    "/guides/us-visa-photo-requirements.html": "reqs",
    "/china-visa-photo-australia/": "australia",
    "/france-visa-photo/": "france",
    "/germany-visa-photo/": "germany",
    "/spain-visa-photo/": "spain",
}
LANG_PREFIX = re.compile(r"^/(?:zh-hans|zh-hant|es|ja|de|fr)(?=/)")
ANCHOR = re.compile(r"""<a\b(?:"[^"]*"|'[^']*'|[^>'"])*>""", re.I)
HREF = re.compile(r'\bhref="([^"]+)"', re.I)
DATA_ATTR = re.compile(r'\sdata-acquisition-(?:store|app)="[^"]*"')
SCRIPT = re.compile(r'<script\b[^>]*src="/assets/store-clicks-v[123]\.js"[^>]*></script>')
REFERRAL_PAGES = {
    "https://us.visaphoto1tap.com/",
    "https://us.visaphoto1tap.com/guides/ds-160-photo-upload-failed.html",
}

def campaign_for(canonical, locale, app):
    page_url = urlsplit(canonical)
    topic_path = LANG_PREFIX.sub("", page_url.path) or "/"
    campaign = f"web-{HOST_KEYS[page_url.netloc]}-{LANGUAGE_KEYS[locale]}-{TOPICS[topic_path]}-{app}"
    if not re.fullmatch(r"[a-z0-9-]{1,30}", campaign):
        raise ValueError(f"Invalid campaign for {canonical}: {campaign}")
    return campaign

def store_destination(href, canonical, locale):
    dest = urlsplit(href)
    query = dict(parse_qsl(dest.query))
    if dest.netloc == "apps.apple.com":
        match = re.search(r"/id(\d+)$", dest.path)
        if not match or match[1] not in APP_BY_ID:
            raise ValueError(f"Unexpected App Store listing on {canonical}: {href}")
        app = APP_BY_ID[match[1]]
        store = "app-store"
        storefront = re.match(r"^/([a-z]{2})/app/", dest.path)
        prefix = f"/{storefront[1]}" if storefront else ""
        dest = dest._replace(path=f"{prefix}/app/apple-store/id{match[1]}")
        query.update(pt=CONFIG["appleProvider"], ct=campaign_for(canonical, locale, app), mt="8")
    elif dest.netloc == "play.google.com" and dest.path == "/store/apps/details":
        if query.get("id") != CONFIG["playPackage"]:
            raise ValueError(f"Unexpected Google Play listing on {canonical}: {href}")
        app = "us"
        store = "google-play"
        referrer = dict(parse_qsl(query.get("referrer", "")))
        referrer.setdefault("utm_source", "root_website" if urlsplit(canonical).netloc == "visaphoto1tap.com" else "us_website")
        referrer.setdefault("utm_medium", "website")
        referrer["utm_campaign"] = campaign_for(canonical, locale, app)
        referrer.setdefault("utm_content", "guide")
        query["referrer"] = urlencode(referrer)
    else:
        return None
    tagged = urlunsplit(dest._replace(query=urlencode(query)))
    return store, app, tagged

def tag_store_links(html, canonical, locale):
    added = False

    def update_anchor(match):
        nonlocal added
        a = match[0]
        href = HREF.search(a)
        if href is None:
            return a
        destination = store_destination(unescape(href[1]), canonical, locale)
        if destination is None:
            return a
        store, app, tagged = destination
        a = a[:href.start(1)] + escape(tagged, quote=True) + a[href.end(1):]
        a = DATA_ATTR.sub("", a)
        added = True
        return a[:-1] + f' data-acquisition-store="{store}" data-acquisition-app="{app}">'

    html = ANCHOR.sub(update_anchor, html)
    html = SCRIPT.sub("", html)
    if added:
        if "</head>" not in html:
            raise ValueError(f"Page with store links has no closing head: {canonical}")
        page = urlsplit(canonical)
        source = f"{page.scheme}://{page.netloc}{LANG_PREFIX.sub('', page.path) or '/'}"
        version = 3 if source in REFERRAL_PAGES else 1
        click_script = f'<script defer src="/assets/store-clicks-v{version}.js"></script>'
        html = html.replace("</head>", click_script + "</head>", 1)
    return html
