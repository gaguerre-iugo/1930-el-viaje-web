# -*- coding: utf-8 -*-
import json
import pathlib
from PIL import Image

base = pathlib.Path(r'C:\Users\germa\DeepSeek Bot\1930-kiosk')
pages = base / 'pages'
pngs = sorted(pages.glob('*.png'))
before = sum(p.stat().st_size for p in pngs)

for i, p in enumerate(pngs, 1):
    im = Image.open(p).convert('RGB')
    im.save(p.with_suffix('.webp'), 'WEBP', quality=82, method=4)
    if i % 50 == 0:
        print(f'  {i}/{len(pngs)}')

webps = sorted(pages.glob('*.webp'))
after = sum(p.stat().st_size for p in webps)

for name in ('kiosk-manifest.json', 'kiosk-pages.json'):
    f = base / name
    if not f.exists():
        continue
    data = json.loads(f.read_text(encoding='utf-8'))
    if 'pages' in data:
        if isinstance(data['pages'], list) and data['pages'] and isinstance(data['pages'][0], dict):
            for item in data['pages']:
                if 'img' in item:
                    item['img'] = item['img'].replace('.png', '.webp')
        elif isinstance(data['pages'], list):
            data['pages'] = [x.replace('.png', '.webp') for x in data['pages']]
    f.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding='utf-8')

print(f'PNG: {before/1048576:.1f} MB -> WebP: {after/1048576:.1f} MB ({len(webps)} pages)')
