#!/usr/bin/env python3
"""Notify IndexNow about this site's sitemap URLs, after verifying the deployed key.

Default is a dry run. Use --submit only after the new content and key are live.
The key is a public domain-verification file, not an account credential.
"""
import argparse
import json
from pathlib import Path
import re
from urllib.parse import urlparse
from urllib.request import Request, urlopen
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--submit', action='store_true', help='Verify the live key, then notify IndexNow once')
    parser.add_argument('--receipt', type=Path, help='Save response status as JSON')
    args = parser.parse_args()
    host = (ROOT / 'CNAME').read_text().strip()
    config = json.loads((ROOT / 'indexnow.json').read_text())
    key = config['key']
    if not re.fullmatch(r'[a-f0-9]{32}', key):
        raise SystemExit('Invalid public IndexNow key')
    if (ROOT / (key + '.txt')).read_text().strip() != key:
        raise SystemExit('Local key file mismatch')
    urls = [n.text for n in ET.parse(ROOT / 'sitemap.xml').iter('{http://www.sitemaps.org/schemas/sitemap/0.9}loc')]
    if not urls or any(urlparse(u).scheme != 'https' or urlparse(u).netloc != host for u in urls):
        raise SystemExit('Sitemap must contain only HTTPS URLs on the CNAME host')
    key_url = f'https://{host}/{key}.txt'
    payload = {'host': host, 'key': key, 'keyLocation': key_url, 'urlList': urls}
    if not args.submit:
        print(json.dumps({'mode': 'dry-run', 'endpoint': 'https://api.indexnow.org/indexnow', 'payload': payload}, indent=2))
        return
    with urlopen(key_url, timeout=30) as response:
        if response.status != 200 or response.read().decode().strip() != key:
            raise SystemExit('Live public key does not match; deploy before submitting')
    request = Request('https://api.indexnow.org/indexnow', data=json.dumps(payload).encode(), headers={'Content-Type': 'application/json; charset=utf-8'}, method='POST')
    with urlopen(request, timeout=30) as response:
        receipt = {'http_status': response.status, 'host': host, 'urls': urls, 'received_not_indexed': True}
    if args.receipt:
        args.receipt.parent.mkdir(parents=True, exist_ok=True)
        args.receipt.write_text(json.dumps(receipt, indent=2) + '\n')
    print(json.dumps(receipt, indent=2))


if __name__ == '__main__':
    main()
