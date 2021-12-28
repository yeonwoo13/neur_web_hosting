'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  "assets/AssetManifest.json": "3180486c35ab701c6448b1425629b068",
"assets/assets/appleStore.png": "9426609dab51ec47ecd58c547520f345",
"assets/assets/banner.png": "154904f2a039b31a6ce0f145ed82c152",
"assets/assets/bannerImage.png": "7a9069fb3fd5163af25a65dc8b9895c0",
"assets/assets/blog.png": "b8e829ebc870c57cdf509f66647c3738",
"assets/assets/carbonEmissions.png": "6143025511f44de76ffc138e42e0e7e6",
"assets/assets/child.jpg": "d898c5a647d28fe5262d580505eb4d8e",
"assets/assets/chiumMain.png": "e08cd67e5025fe2c5499a79b50368e90",
"assets/assets/data.png": "4aefeea9954987cfc3b9f344a3cc154c",
"assets/assets/facebook.png": "b7d9b4b2790081950322c5bb61e7e30c",
"assets/assets/font/NotoSansKR-Black.otf": "aef8424b7c9ece17f01cbc8618e4723b",
"assets/assets/font/NotoSansKR-Bold.otf": "b59ac7cf449e57469daf2480fafbddf4",
"assets/assets/font/NotoSansKR-Light.otf": "89816c0e22baa4f81a196a1c3b61bf46",
"assets/assets/font/NotoSansKR-Medium.otf": "de132efeffa48aef0bf5bdfe1c4602f4",
"assets/assets/font/NotoSansKR-Regular.otf": "913f146b0200b19b17eb4de8b4427a9c",
"assets/assets/font/NotoSansKR-Thin.otf": "5dac92efb94655ca5331df2505f3428a",
"assets/assets/googleStore.png": "1ec26132e9f8764596154d79f964474b",
"assets/assets/greenLogo.png": "a5b38bcb5419b6c25a52903046c1ab01",
"assets/assets/instargram.png": "921d93f6339089a3fdc171c298ff9315",
"assets/assets/truck.png": "838e52d49dcb999dfccf89f4a14345b4",
"assets/assets/waste.png": "a03ab5307b2a1394081cdb755fb33114",
"assets/assets/wasteDischarge.png": "27ccc22d0e80a1d4cba4601b08af2e41",
"assets/assets/wasteThroughput.png": "09bd951d13c9e501f4733fe73480cd8a",
"assets/assets/whiteLogo.png": "5631f391c2510b454797ba1ef9e0d97a",
"assets/assets/youtube.png": "3791c6b1a82281154257e29c98bcddd5",
"assets/assets/youtubeBanner.png": "115093b82c7fb5d4c6eec94de96ae3b9",
"assets/FontManifest.json": "f70d435f0d54568b9878770ebe763778",
"assets/fonts/MaterialIcons-Regular.otf": "4e6447691c9509f7acdbf8a931a85ca1",
"assets/NOTICES": "739c3625bf644c4138a38790a8dadfa6",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "6d342eb68f170c97609e9da345464e5e",
"assets/packages/flutter_inappwebview/t_rex_runner/t-rex.css": "5a8d0222407e388155d7d1395a75d5b9",
"assets/packages/flutter_inappwebview/t_rex_runner/t-rex.html": "16911fcc170c8af1c5457940bd0bf055",
"assets/packages/youtube_player_flutter/assets/speedometer.webp": "50448630e948b5b3998ae5a5d112622b",
"favicon.png": "5dcef449791fa27946b3d35ad8803796",
"icons/Icon-192.png": "ac9a721a12bbc803b44f645561ecb1e1",
"icons/Icon-512.png": "96e752610906ba2a93c65f8abe1645f1",
"icons/Icon-maskable-192.png": "c457ef57daa1d16f64b27b786ec2ea3c",
"icons/Icon-maskable-512.png": "301a7604d45b3e739efc881eb04896ea",
"index.html": "2917ecc8c8a58502d0ae905a8969017a",
"/": "2917ecc8c8a58502d0ae905a8969017a",
"main.dart.js": "2a5a42cffcba81e178a9fd652e4e2544",
"manifest.json": "f1fecb50f50e4219bf4fa4383528d853",
"version.json": "470fa31879cb8db882d5c0b8b87a3f3a"
};

// The application shell files that are downloaded before a service worker can
// start.
const CORE = [
  "/",
"main.dart.js",
"index.html",
"assets/NOTICES",
"assets/AssetManifest.json",
"assets/FontManifest.json"];
// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});

// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});

// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache.
        return response || fetch(event.request).then((response) => {
          cache.put(event.request, response.clone());
          return response;
        });
      })
    })
  );
});

self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});

// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}

// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
