ymaps.ready(init);

function init() {
    const map = new ymaps.Map("map", {
        center: [55.76, 37.64], // Москва
        zoom: 10
    });

    window.findNearestCafes = function() {
        navigator.geolocation.getCurrentPosition(function(position) {
            const userLocation = position.coords;
            map.setCenter([userLocation.latitude, userLocation.longitude], 15);

            ymaps.geocode(userLocation, { results: 10 }).then(function(res) {
                const objects = res.geoObjects.toArray();
                const nearestCafes = [];

                for (let i = 0; i < objects.length; i++) {
                    const obj = objects[i];
                    if (obj.properties.get('name').includes('кафе')) {
                        nearestCafes.push(obj);
                        if (nearestCafes.length >= 3) {
                            break;
                        }
                    }
                }

                if (nearestCafes.length > 0) {
                    displayCafeInfo(nearestCafes);
                } else {
                    alert('Рядом нет кафе.');
                }
            });
        }, function(error) {
            alert('Ошибка получения геолокации: ' + error.message);
        });
    };

    function displayCafeInfo(cafes) {
        const cafeInfoDiv = document.getElementById('cafe-info');
        cafeInfoDiv.innerHTML = '';

        cafes.forEach(function(cafe) {
            const name = cafe.properties.get('name');
            const address = cafe.properties.get('text');
            const coords = cafe.geometry.getCoordinates();

            const div = document.createElement('div');
            div.innerHTML = `<h3>${name}</h3><p>${address}</p><button onclick="buildRoute(${coords[0]}, ${coords[1]})">Построить маршрут</button>`;
            cafeInfoDiv.appendChild(div);
        });
    }

    window.buildRoute = function(lat, lon) {
        const userLocation = map.getCenter();
        const route = new ymaps.multiRouter.MultiRoute({
            referencePoints: [
                userLocation,
                [lat, lon]
            ]
        }, {
            // Автоматически центрируем карту по маршруту.
            boundsAuto: true
        });
        map.geoObjects.add(route);
    };
}
