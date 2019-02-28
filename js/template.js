function generateCarCard(car) {
    let template = document.querySelector('#car-card').innerHTML;
    const title = `${car.brand} ${car.model} ${car.year}`;
    template = template.replace('{{title}}', title);
    template = template.replace('{{details-id}}', car.details_id);
    template = template.replace('{{image}}', car.image);
    /** @namespace car.price */
    template = template.replace('{{price}}', car.price);
    return template;
}

export function appendCars(cars) {
    document.getElementById('first-load').innerHTML = "";
    let cardHtml = "";
    for (let i = 0; i < cars.length; i++) {
        cardHtml += generateCarCard(cars[i])
    }

    document.querySelector('.mdl-grid').insertAdjacentHTML('beforeend', cardHtml);

    //Force Redraw Fix for IE
    document.querySelector('.mdl-layout__content').style.display = 'none';
    document.querySelector('.mdl-layout__content').style.display = "inline-block";
}