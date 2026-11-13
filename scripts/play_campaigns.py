"""Generate static Play campaign links; keep this and the config in sync across sites."""
import json
from pathlib import Path
from urllib.parse import urlencode
CONFIG = json.loads((Path(__file__).resolve().parents[1] / 'play-campaigns.json').read_text())
def play_url(placement):
    p = CONFIG['placements'][placement]
    referrer = urlencode({'utm_source': p['source'], 'utm_medium': CONFIG['medium'], 'utm_campaign': p['campaign'], 'utm_content': p['content']})
    return 'https://play.google.com/store/apps/details?' + urlencode({'id': CONFIG['package'], 'referrer': referrer})
