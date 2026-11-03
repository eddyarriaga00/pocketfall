/* PocketFall offline cache: the page itself always comes from the network when there is one (so updates arrive at once) and from the cache when there is not; three.js, fonts, music and icons come from the cache after the first visit. */
const C='pocketfall-v3';
self.addEventListener('install',e=>{self.skipWaiting();});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET')return;const u=new URL(r.url);
  if(r.mode==='navigate'||(u.origin===location.origin&&/(\/|\.html)$/.test(u.pathname))){e.respondWith(fetch(r).then(res=>{const cp=res.clone();caches.open(C).then(c=>c.put(r,cp));return res;}).catch(()=>caches.match(r).then(m=>m||caches.match('./'))));return;}
  if(/cdnjs\.cloudflare\.com|fonts\.(googleapis|gstatic)\.com/.test(u.host)||(u.origin===location.origin&&/\.(mp3|png|webmanifest|js)$/.test(u.pathname)&&!/sw\.js$/.test(u.pathname))){
    e.respondWith(caches.match(r).then(m=>m||fetch(r).then(res=>{if(res&&(res.ok||res.type==='opaque')){const cp=res.clone();caches.open(C).then(c=>c.put(r,cp));}return res;})));}});
