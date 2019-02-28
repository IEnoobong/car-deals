const localForage = localforage;

const carsInstance = localForage.createInstance({
    name: "cars"
});

export function addCars(newCars) {
    return new Promise(resolve => {
        const setCars = newCars.map(car => carsInstance.setItem(car.key.toString(), car));
        Promise.all(setCars).then(resolve);
    });
}

const limit = 3;
let lastItemId = null;

export function getCars() {
    return new Promise(resolve => {
        carsInstance.keys().then(keys => {
            let index = keys.indexOf(lastItemId);
            if (index === -1) {
                index = keys.length
            }
            if (index === 0) {
                resolve([]);
                return;
            }

            const keysSpliced = keys.splice(index - limit, limit);

            const itemPromises = keysSpliced.map(key => carsInstance.getItem(key));
            Promise.all(itemPromises).then(results => {
                const returnArr = Object.keys(results).map(k => results[k].value).reverse();
                lastItemId = returnArr[returnArr.length - 1].id.toString();
                resolve(returnArr)
            });
        });
    })
}

export function getLastCardId() {
    return lastItemId;
}