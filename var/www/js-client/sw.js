const appCache = "gruppe7_app-cache";

//add the files to the cache
self.addEventListener("install", event => {
    event.waitUntil(
      caches.open(appCache)
      .then(cache => {
        return cache.addAll(
          [
            "app.js",
            "index.html",
            "style.css"
          ]
        )
      })
      .catch(error => console.log(error))
    );
});

//activates the service worker
self.addEventListener("activate", event => event.waitUntil(clients.claim()));

//caches the requests
self.addEventListener("fetch", event => {
  console.log("Fetch event for ", event.request.url);
  event.respondWith(
    caches.match(event.request)
    .then(response => {
      if (response) {
        console.log("Found ", event.request.url, " in cache");
        return response;
      }
      console.log("Network request for ", event.request.url);
      return fetch(event.request)
    })
  );
});