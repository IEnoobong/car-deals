import {appendCars} from "./template.js";
import {addCars, getCars, getLastCardId} from "./clientStorage.js";

const apiUrlPath = 'https://bstavroulakis.com/pluralsight/courses/progressive-web-apps/service';
const apiUrlCar = `${apiUrlPath}/car.php?carId`;

export function loadCarPage(carId) {
    fetch(`${apiUrlCar}=${carId}`)
        .then(response => response.text())
        .then(data => {
            document.body.insertAdjacentHTML('beforeend', data);
        })
        .catch(error => {
            alert(error.message)
        })
}


export function loadMoreRequest() {
    fetchPromise().then(message => {
        document.getElementById("connection-status").innerHTML = message;
        loadMore()
    })
}

const fetchPromise = () => new Promise(resolve => {
    const apiUrlLatest = `${apiUrlPath}/latest-deals.php?carId=${getLastCardId()}`;
    fetch(apiUrlLatest)
        .then(response => response.json())
        .then(data => {
            const cars = data.cars;
            addCars(cars)
                .then(() => {
                    cars.forEach(preCacheDetailsPage);
                    resolve("Connection dey bam. Showing latest results");
                });
        }).catch(error => {
        console.log(error);
        resolve("Connection no dey, showing offline results")
    });

    setTimeout(() => resolve("Connection dey hang, showing offline results"), 3000)
});

const preCacheDetailsPage = car => {
    if ('serviceWorker' in navigator) {
        const carDetailsUrl = `${apiUrlCar}=${car.value.details_id}`;
        window.caches.open('carDealsCachePagesV1').then(cache => {
            cache.match(carDetailsUrl).then(response => {
                if (!response) {
                    cache.add(new Request(carDetailsUrl))
                }
            })
        })
    }
};

const loadMore = () => {
    getCars().then(cars => {
        appendCars(cars)
    })
};