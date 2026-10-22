/* ============ service worker: the app keeps working without internet ============ */
// bump VER with the ?v= of index.html on every release; old caches are removed when the new worker starts
const VER='2026-10-22',CACHE='ayobaca-'+VER,EMOJI='ayobaca-emoji',FONTS='ayobaca-fonts';
const local=u=>!/^(https?:)?\/\//.test(u)&&!u.startsWith('#')&&!u.startsWith('data:');
// install: the page and every file index.html links to (css, js, data, icons)
self.addEventListener('install',e=>e.waitUntil((async()=>{
  const html=await(await fetch('./',{cache:'reload'})).text();
  const urls=['./',...[...html.matchAll(/(?:src|href)="([^"]+)"/g)].map(m=>m[1]).filter(local)];
  await(await caches.open(CACHE)).addAll([...new Set(urls)]);self.skipWaiting();})()));
self.addEventListener('activate',e=>e.waitUntil((async()=>{
  for(const k of await caches.keys())if(k!==CACHE&&k!==EMOJI&&k!==FONTS)await caches.delete(k);
  await self.clients.claim();})()));
// the page sends the list of emoji pictures; they are stored a few at a time in the background
self.addEventListener('message',e=>{const list=e.data&&e.data.emoji;if(!list)return;
  e.waitUntil((async()=>{const c=await caches.open(EMOJI);for(let i=0;i<list.length;i+=20)
    await Promise.all(list.slice(i,i+20).map(async u=>{if(!(await c.match(u)))try{const r=await fetch(u);if(r.ok)await c.put(u,r);}catch(err){}}));})());});
async function cacheFirst(req,name){const c=await caches.open(name),hit=await c.match(req);if(hit)return hit;
  const r=await fetch(req);if(r.ok||r.type==='opaque')c.put(req,r.clone());return r;}
self.addEventListener('fetch',e=>{const req=e.request,url=new URL(req.url);if(req.method!=='GET')return;
  // the page: newest from the network, the saved copy when offline
  if(req.mode==='navigate')return e.respondWith((async()=>{try{const r=await fetch(req);if(r.ok)(await caches.open(CACHE)).put('./',r.clone());return r;}
    catch(err){return(await caches.match('./'))||Response.error();}})());
  if(url.origin===location.origin)return e.respondWith(url.pathname.includes('/assets/emoji/')?cacheFirst(req,EMOJI):
    caches.match(req).then(hit=>hit||cacheFirst(req,CACHE)));
  if(/fonts\.(googleapis|gstatic)\.com$/.test(url.hostname))e.respondWith(cacheFirst(req,FONTS));});
