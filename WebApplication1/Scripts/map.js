var geocoder, lat, lng, address, pos;
var dayOrNight;
var map;
var marker;
var date = new Date();
hour = date.getHours();
if (8 <= hour && hour <= 21) {
    dayOrNight = [{ "featureType": "administrative", "elementType": "labels.text.fill", "stylers": [{ "color": "#444444" }] }, { "featureType": "landscape", "elementType": "all", "stylers": [{ "color": "#f2f2f2" }] }, { "featureType": "poi", "elementType": "all", "stylers": [{ "visibility": "off" }] }, { "featureType": "road", "elementType": "all", "stylers": [{ "saturation": -100 }, { "lightness": 45 }] }, { "featureType": "road.highway", "elementType": "all", "stylers": [{ "visibility": "simplified" }] }, { "featureType": "road.arterial", "elementType": "labels.icon", "stylers": [{ "visibility": "off" }] }, { "featureType": "transit", "elementType": "all", "stylers": [{ "visibility": "off" }] }, { "featureType": "water", "elementType": "all", "stylers": [{ "color": "#46bcec" }, { "visibility": "on" }] }];
}
else if (0 <= hour && hour <= 7 || 22 <= hour && hour <= 24) {
    dayOrNight = [{ "featureType": "water", "elementType": "geometry", "stylers": [{ "color": "#193341" }] }, { "featureType": "landscape", "elementType": "geometry", "stylers": [{ "color": "#2c5a71" }] }, { "featureType": "road", "elementType": "geometry", "stylers": [{ "color": "#29768a" }, { "lightness": -37 }] }, { "featureType": "poi", "elementType": "geometry", "stylers": [{ "color": "#406d80" }] }, { "featureType": "transit", "elementType": "geometry", "stylers": [{ "color": "#406d80" }] }, { "elementType": "labels.text.stroke", "stylers": [{ "visibility": "on" }, { "color": "#3e606f" }, { "weight": 2 }, { "gamma": 0.84 }] }, { "elementType": "labels.text.fill", "stylers": [{ "color": "#ffffff" }] }, { "featureType": "administrative", "elementType": "geometry", "stylers": [{ "weight": 0.6 }, { "color": "#1a3541" }] }, { "elementType": "labels.icon", "stylers": [{ "visibility": "off" }] }, { "featureType": "poi.park", "elementType": "geometry", "stylers": [{ "color": "#2c5a71" }] }];
}

google.maps.event.addDomListener(window, 'load', init);

function init() {

    pos = { lat: -82.862752, lng: 135.000000 }
    var mapOptions = {
        center: pos,
        zoom: 12,
        styles: dayOrNight
    };

    geocoder = geocoder = new google.maps.Geocoder();

  
    var mapElement = document.getElementById('maps');
    var map = new google.maps.Map(mapElement, mapOptions);
    marker = new google.maps.Marker({
        position: pos,
        map: map,
        draggable: true,
        animation: google.maps.Animation.DROP
    });

    // Try HTML5 geolocation.
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };

            map.setCenter(pos);
            marker.setPosition(pos);
        })
    }

    GetMarkerPosition(marker);

}

function GetMarkerPosition(marker) {
    google.maps.event.addListener(marker, "dragend", function (e) {
        geocoder.geocode({ 'latLng': marker.getPosition() }, function (results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                pos = {
                    lat: marker.getPosition().lat(),
                    lng: marker.getPosition().lng(),
                    address: results[0].formatted_address
                }
            }
        });
    });
}