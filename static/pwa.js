importScripts("/workbox-v7.3.0/workbox-sw.js");
workbox.setConfig({ modulePathPrefix: "/workbox-v7.3.0/" });

workbox.routing.registerRoute(
  ({ request }) => request.destination === "image",
  new workbox.strategies.CacheFirst(),
);
