import {loadCarPage, loadMoreRequest} from "./carService.js";

window.pageEvents = {
    loadCarPage: carId => {
        loadCarPage(carId);
    },
    loadMoreRequest: () => {
        loadMoreRequest()
    }
};

loadMoreRequest();