"use strict";

const carDealsCacheName = 'carDealsCacheV1';
const carDealsCacheImagesName = 'carDealsCacheImagesV1';
const carDealsCachePagesName = 'carDealsCachePagesV1';

const carDealsCacheFiles = [
    'js/app.js',
    'js/carService.js',
    'js/clientStorage.js',
    'js/swRegister.js',
    'js/template.js',
    './',
    'node_modules/localforage/dist/localforage.min.js',
    'node_modules/material-design-lite/material.min.js',
    'https://fonts.googleapis.com/icon?family=Material+Icons',
    // 'https://code.getmdl.io/1.3.0/material.red-indigo.min.css'
];

const latestPath = '/pluralsight/courses/progressive-web-apps/service/latest-deals.php';
const imagePath = '/pluralsight/courses/progressive-web-apps/service/car-image.php';
const carPath = '/pluralsight/courses/progressive-web-apps/service/car.php';

self.addEventListener('install', evt => {
    console.log('From SW: Install Event');
    self.skipWaiting();
    evt.waitUntil(caches.open(carDealsCacheName)
        .then(cache => {
            return cache.addAll(carDealsCacheFiles)
        }).catch(err => {
            console.log(err)
        }))
});

self.addEventListener('activated', evt => {
    console.log('From SW: Activated');
    self.clients.claim();
    evt.waitUntil(
        caches.keys()
            .then(cacheKeys => {
                const deletePromises = [];
                for (let i = 0; i < cacheKeys.length; i++) {
                    if (cacheKeys[i] !== carDealsCacheName &&
                        cacheKeys[i] !== carDealsCacheImagesName &&
                        cacheKeys[i] !== carDealsCachePagesName) {
                        deletePromises.push(caches.delete(cacheKeys[i]));
                    }
                }
                return Promise.all(deletePromises);
            })
    );
});

self.addEventListener('fetch', evt => {
    const requestUrl = new URL(evt.request.url);
    const requestPath = requestUrl.pathname;
    const fileName = requestPath.substring(requestPath.lastIndexOf('/') + 1);

    if (requestPath === latestPath || fileName === "sw.js") {
        //Network Only Strategy
        evt.respondWith(fetch(evt.request));
    } else if (requestPath === imagePath) {
        //Network First then Offline Strategy
        evt.respondWith(networkFirstStrategy(evt.request));
    } else {
        //Offline First then Network Strategy
        evt.respondWith(cacheFirstStrategy(evt.request));
    }

});

function cacheFirstStrategy(request) {
    return caches.match(request).then(cacheResponse => {
        return cacheResponse || fetchRequestAndCache(request)
    })
}

function networkFirstStrategy(request) {
    return fetchRequestAndCache(request).catch(() => {
        return caches.match(request)
    })
}

const fetchRequestAndCache = request => fetch(request).then(networkResponse => {
    caches.open(getCacheName(request)).then(cache => {
        cache.put(request, networkResponse);
    });
    return networkResponse.clone();
});

const getCacheName = request => {
    const requestUrl = new URL(request.url);
    const requestPath = requestUrl.pathname;

    if (requestPath === imagePath) {
        return carDealsCacheImagesName;
    } else if (requestPath === carPath) {
        return carDealsCachePagesName;
    } else {
        return carDealsCacheName;
    }
};