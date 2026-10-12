"""Map emoji code points to Fluent Emoji (Iconify) icons and export SVG files.
<dl_dir> holds the extracted npm package @iconify-json/fluent-emoji (package/icons.json)
and emojibase-data en/data.json saved as emojibase.json (labels give the icon names).
After exporting, append the new keys to EMO in js/emoji-index.js.
usage: python -I emoji_tool.py <dl_dir> check <repo>          -> coverage of existing files
       python -I emoji_tool.py <dl_dir> export <repo> <list>  -> write assets/emoji/<hex>.svg for emoji in <list file>
"""
import json, re, sys, os
dl, cmd, repo = sys.argv[1], sys.argv[2], sys.argv[3]
ic = json.load(open(os.path.join(dl, 'package/icons.json'), encoding='utf-8'))
icons, aliases = ic['icons'], ic.get('aliases', {})
W, H = ic.get('width', 32), ic.get('height', 32)
base = json.load(open(os.path.join(dl, 'emojibase.json'), encoding='utf-8'))

def slug(label):
    s = label.lower().replace('’', '').replace("'", '').replace('&', 'and')
    s = re.sub(r'[^a-z0-9]+', '-', s).strip('-')
    return s

hexname = {}
for e in base:
    hx = e['hexcode'].lower().replace('-fe0f', '')
    hexname[hx] = slug(e['label'])
def key(ch):
    return '-'.join('%x' % ord(c) for c in ch.replace('️', ''))

def body(name):
    if name in icons: return icons[name]
    if name in aliases: return icons.get(aliases[name]['parent'])
    return None

def svg(name):
    b = body(name)
    if not b: return None
    w, h = b.get('width', W), b.get('height', H)
    return f'<svg xmlns="http://www.w3.org/2000/svg" width="{w}" height="{h}" viewBox="0 0 {w} {h}" fill="none">{b["body"]}</svg>'

if cmd == 'check':
    have = [f[:-4] for f in os.listdir(os.path.join(repo, 'assets/emoji')) if f.endswith('.svg')]
    miss = [h for h in have if not body(hexname.get(h, '?'))]
    print('existing', len(have), 'mapped', len(have) - len(miss), 'unmapped', miss[:30])
    print('icons in set', len(icons), 'with code point', sum(1 for h, n in hexname.items() if body(n)))
elif cmd == 'export':
    want = re.findall(r'\S+', open(sys.argv[4], encoding='utf-8').read())
    out, miss = 0, []
    for ch in want:
        hx = key(ch); p = os.path.join(repo, 'assets/emoji', hx + '.svg')
        if os.path.exists(p): continue
        s = svg(hexname.get(hx, '?'))
        if not s: miss.append(ch); continue
        open(p, 'w', encoding='utf-8', newline='').write(s); out += 1
    print('written', out, 'missing', ' '.join(miss))
elif cmd == 'available':
    # print every emoji that has an icon, for choosing pictures
    res = []
    for e in base:
        hx = e['hexcode'].lower().replace('-fe0f', '')
        if '-1f3f' in hx: continue  # skin tones
        if body(hexname[hx]): res.append(e['emoji'] + ' ' + e['label'])
    open(sys.argv[4], 'w', encoding='utf-8').write('\n'.join(res))
    print(len(res))
