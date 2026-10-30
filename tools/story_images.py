"""Pictures for Buku Cerita from Wikimedia Commons, saved into the repo (assets/stories/) with their credits.

Only free licences are accepted (public domain, CC0, CC BY, CC BY-SA); each picture keeps author, licence and source link.
Uses the normal Commons pages (the API is often rate limited from shared addresses) and waits between requests.

usage: python3 -I tools/story_images.py cat  "<Category name>" ...      -> subcategories and files of a category
       python3 -I tools/story_images.py info "<File name>" ...          -> licence, author, size
       python3 -I tools/story_images.py look <outdir> "<File name>" ... -> small previews to look at (not saved in the repo)
       python3 -I tools/story_images.py fetch <list.json>               -> download the pictures of one list
       python3 -I tools/story_images.py build                           -> write js/data/gambar-cerita.js from all lists
A list (tools/story-images/<group>.json, licence details in <group>.meta.json): {"<tale id>": {"cover": "<File name>", "pages": {"<page number from 1>": "<File name>"}}}
"""
import sys, os, re, json, time, html, hashlib, io, glob, urllib.request, urllib.parse
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'assets', 'stories')
LISTS = os.path.join(ROOT, 'tools', 'story-images')
UA = 'AyoBacaStoryImages/1.0 (https://github.com/melanialani/belajar-baca)'
FREE = re.compile(r'^(public domain|pdm|pd|cc0|cc[ -]by( |-sa |-sa$|$)|cc by 2|cc by 3|cc by 4|cc by-sa)', re.I)
last = [0.0]

def get(url, binary=False):
    for i in range(6):
        wait = 2.0 - (time.time() - last[0])
        if wait > 0: time.sleep(wait)
        last[0] = time.time()
        try:
            r = urllib.request.urlopen(urllib.request.Request(url, headers={'User-Agent': UA}), timeout=60)
            data = r.read()
            return data if binary else data.decode('utf8', 'replace')
        except urllib.error.HTTPError as e:
            if e.code == 404: return None
            print('  wait, HTTP', e.code, file=sys.stderr); time.sleep(15 * (i + 1))
        except Exception as e:
            print('  wait,', e, file=sys.stderr); time.sleep(10 * (i + 1))
    return None

def norm(name):
    name = re.sub(r'^(File|Datei|Berkas):', '', name.strip()).replace(' ', '_')
    return name[0].upper() + name[1:]

def cat(name):
    s = get('https://commons.wikimedia.org/wiki/Category:' + urllib.parse.quote(name.replace(' ', '_'))) or ''
    s = html.unescape(s)
    subs = sorted(set(urllib.parse.unquote(m) for m in re.findall(r'href="/wiki/Category:([^"#?]+)"', s)))
    files = []
    for m in re.findall(r'href="/wiki/File:([^"#?]+)"', s):
        f = urllib.parse.unquote(m)
        if f not in files: files.append(f)
    return subs, files

def info(name):
    name = norm(name)
    s = get('https://commons.wikimedia.org/wiki/File:' + urllib.parse.quote(name))
    if not s: return None
    s = html.unescape(s)
    lic = [x.strip() for x in re.findall(r'class="licensetpl_short"[^>]*>([^<]*)<', s)]
    m = re.search(r'id="fileinfotpl_aut"[^>]*>.*?</td>\s*<td[^>]*>(.*?)</td>', s, re.S)
    aut = re.sub(r'\s+', ' ', re.sub(r'<[^>]+>', ' ', re.sub(r'<style.*?</style>', '', m.group(1), flags=re.S))).strip() if m else ''
    aut = re.sub(r'^(Creator:\s*)', '', aut).split(' Description ')[0]
    aut = re.sub(r'\s*(Unknown author|Unknown|unknown)\s*', ' ', aut).strip() or 'tidak diketahui'
    size = re.search(r'([\d,.]+) [×x] ([\d,.]+) pixels', s)
    w = int(re.sub(r'[,.]', '', size.group(1))) if size else 0
    return {'file': name, 'license': next((l for l in lic if FREE.match(l)), lic[0] if lic else ''), 'free': any(FREE.match(l) for l in lic),
            'author': aut[:120], 'url': 'https://commons.wikimedia.org/wiki/File:' + urllib.parse.quote(name), 'width': w}

def thumb(name, width):
    h = hashlib.md5(name.encode('utf8')).hexdigest(); q = urllib.parse.quote(name)
    ext = name.rsplit('.', 1)[-1].lower()
    suffix = '.jpg' if ext in ('tif', 'tiff') else '.png' if ext == 'svg' else ''
    return f'https://upload.wikimedia.org/wikipedia/commons/thumb/{h[0]}/{h[:2]}/{q}/{width}px-{q}{suffix}'

def original(name):
    h = hashlib.md5(name.encode('utf8')).hexdigest()
    return f'https://upload.wikimedia.org/wikipedia/commons/{h[0]}/{h[:2]}/{urllib.parse.quote(name)}'

def image(name, width=960):
    data = get(thumb(name, width), True)
    if not data and not name.lower().endswith(('.tif', '.tiff', '.svg')): data = get(original(name), True)
    if not data: return None
    im = Image.open(io.BytesIO(data))
    im = im.convert('RGBA' if im.mode in ('RGBA', 'LA', 'P') else 'RGB')
    return im

def save(im, path, maxw):
    if im.width > maxw: im = im.resize((maxw, round(im.height * maxw / im.width)), Image.LANCZOS)
    im.save(path, 'WEBP', quality=74, method=6)

# licence details are kept next to each list (<group>.meta.json), so several lists can be fetched at the same time
def fetch(listfile):
    os.makedirs(OUT, exist_ok=True)
    META = listfile[:-5] + '.meta.json'
    meta = json.load(open(META)) if os.path.exists(META) else {}
    data = json.load(open(listfile))
    for tid, v in data.items():
        jobs = ([('c', v['cover'])] if v.get('cover') else []) + [('p' + k, f) for k, f in sorted(v.get('pages', {}).items(), key=lambda x: int(x[0]))]
        for key, f in jobs:
            f = norm(f); out = os.path.join(OUT, f'{tid}-{key}.webp')
            if os.path.exists(out) and f in meta: continue
            inf = meta.get(f) or info(f)
            if not inf: print('MISSING', tid, key, f); continue
            if not inf['free']: print('NOT FREE', tid, key, f, inf['license']); continue
            im = image(f)
            if not im: print('NO IMAGE', tid, key, f); continue
            save(im, out, 900); meta[f] = inf
            print('ok', tid, key, f, '|', inf['license'], '|', inf['author'][:40])
            json.dump(meta, open(META, 'w'), ensure_ascii=False, indent=1, sort_keys=True)

def build():
    meta = {}
    for mf in glob.glob(os.path.join(LISTS, '*.meta.json')): meta.update(json.load(open(mf)))
    img, credits = {}, {}
    for lf in sorted(glob.glob(os.path.join(LISTS, '*.json'))):
        if lf.endswith('.meta.json'): continue
        for tid, v in json.load(open(lf)).items():
            e = {}
            if v.get('cover') and os.path.exists(os.path.join(OUT, f'{tid}-c.webp')): e['c'] = f'{tid}-c.webp'; credits.setdefault(norm(v['cover']), []).append(tid)
            for k, f in v.get('pages', {}).items():
                if os.path.exists(os.path.join(OUT, f'{tid}-p{k}.webp')): e.setdefault('p', {})[k] = f'{tid}-p{k}.webp'; credits.setdefault(norm(f), []).append(tid)
            if e: img[tid] = e
    cr = [[meta[f]['author'], meta[f]['license'], meta[f]['url'], sorted(set(t))] for f, t in sorted(credits.items()) if f in meta]
    js = ('/* ============ Buku Cerita pictures: files in assets/stories/ (from Wikimedia Commons, free licences) ============ */\n'
          '// generated by tools/story_images.py build; STORY_IMG[tale id] = {c: cover, p: {page number from 1: file}}\n'
          '// STORY_CREDITS = [[author, licence, source page, [tale ids]]]\n'
          'const STORY_IMG=' + json.dumps(img, ensure_ascii=False, separators=(',', ':')) + ';\n'
          'const STORY_CREDITS=' + json.dumps(cr, ensure_ascii=False, separators=(',', ':')).replace('],[', '],\n [') + ';\n')
    open(os.path.join(ROOT, 'js', 'data', 'gambar-cerita.js'), 'w').write(js)
    print(len(img), 'tales with pictures,', sum(1 + len(v.get('p', {})) - (0 if 'c' in v else 1) for v in img.values()), 'pictures,', len(cr), 'credits')

if __name__ == '__main__':
    cmd, args = sys.argv[1], sys.argv[2:]
    if cmd == 'cat':
        for n in args:
            subs, files = cat(n)
            print('##', n); print(' SUB:', ' | '.join(subs)); print(' FILES', len(files)); [print('  ', f) for f in files]
    elif cmd == 'info':
        for n in args: print(json.dumps(info(n), ensure_ascii=False))
    elif cmd == 'look':
        os.makedirs(args[0], exist_ok=True)
        for n in args[1:]:
            im = image(norm(n), 330)
            if im: p = os.path.join(args[0], re.sub(r'[^\w.-]', '_', norm(n))[:80] + '.jpg'); im.convert('RGB').save(p, 'JPEG', quality=80); print(p)
            else: print('NO IMAGE', n)
    elif cmd == 'fetch': fetch(args[0])
    elif cmd == 'build': build()
