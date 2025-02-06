ymaps.ready(init);

function init() {
    // Создаем карту
    var myMap = new ymaps.Map('map', {
        center: [55.75396, 37.62044], // Примерные координаты Москвы
        zoom: 15
    });

    // Определяем текущую геолокацию
    ymaps.geolocation.get().then(function (result) {
        myMap.setCenter(result.geoObjects.get(0).geometry.getCoordinates());

        // Поиск кафе в радиусе 1 км
        var myGeoObject = new ymaps.GeoObject({
            geometry: {
                type: "Circle",
                coordinates: result.geoObjects.get(0).geometry.getCoordinates(),
                radius: 1000
            }
        });

        myMap.geoObjects.add(myGeoObject);

        myMap.search('кафе', { results: 3, boundingBox: myGeoObject.geometry.getBounds() }).then(function (res) {
            // Отображаем результаты поиска
            res.geoObjects.each(function (obj) {
                var myPlacemark = new ymaps.Placemark(obj.geometry.getCoordinates(), {
                    balloonContent: obj.properties.get('name')
                });

                // Добавляем кнопку для построения маршрута
                myPlacemark.events.add('click', function () {
                    myMap.multiRouter.getRoutes([
                        [result.geoObjects.get(0).geometry.getCoordinates()],
                        this.geometry.getCoordinates()
                    ]).then(function (routes) {
                        myMap.geoObjects.add(routes.get(0));
                    });
                });

                myMap.geoObjects.add(myPlacemark);
            });
        });
    });
}
