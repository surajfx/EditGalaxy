const CACHE_NAME='editgalaxy-v30';

const CORE=[
  './',
  './index.html',
  './about.html',
  './contact.html',
  './privacy.html',
  './terms.html',
  './trust.html',
  './copyright.html',
  './team.html',
  './manifest.webmanifest',
  './editgalaxy-ai-icon.png'
];

self.addEventListener('install',event=>{
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache=>cache.addAll(CORE))
      .then(()=>self.skipWaiting())
  );
});

self.addEventListener('activate',event=>{
  event.waitUntil(
    caches.keys()
      .then(keys=>Promise.all(
        keys
          .filter(k=>k!==CACHE_NAME)
          .map(k=>caches.delete(k))
      ))
      .then(()=>self.clients.claim())
  );
});

self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET') return;

  const url=new URL(event.request.url);

  if(url.origin!==location.origin) return;

  event.respondWith(
    caches.match(event.request)
      .then(cached=>{
        if(cached) return cached;

        return fetch(event.request)
          .then(response=>{
            const copy=response.clone();

            caches.open(CACHE_NAME)
              .then(cache=>cache.put(event.request,copy));

            return response;
          })
          .catch(()=>caches.match('./index.html'));
      })
  );
});
