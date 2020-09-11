var pos = sessionStorage.getItem("positions");
var geocoder, lat, lng, address;
var dayOrNight;
var map;
var marker;
var markers = [];
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

    var mapOptions = {
        center: pos,
        zoom: 12,
        styles: dayOrNight
    };

    geocoder = geocoder = new google.maps.Geocoder();
    infoWindow = new google.maps.InfoWindow;
  
    var mapElement = document.getElementById('editmaps');
    var map = new google.maps.Map(mapElement, mapOptions);
    marker = new google.maps.Marker({
        position: pos,
        map: map
        //draggable: true,
        //animation: google.maps.Animation.DROP
    });

    markers.push(marker);
   
   

    var contentString = '<div id="content">' +
        '<div id="siteNotice">' +
        '<input onclick="deleteMarkers();" type=button value="Delete Markers">' +
        '</div>';

    infowindow = new google.maps.InfoWindow({
        content: contentString
    });

    marker.addListener('click', function () {
        infowindow.open(map, marker);
    });


    map.addListener('click', function (e) {
        placeMarker(e.latLng, map);
    });

    GetMarkerPosition(marker);

   
}


function placeMarker(position, map) {
    if (markers.length == 0) {
        marker = new google.maps.Marker({
            position: position,
            map: map
            //draggable: true,
            //animation: google.maps.Animation.DROP
        });
        map.panTo(position);
        GetMarkerPosition(marker);
        markers.push(marker);

        var contentString = '<div id="content">' +
            '<div id="siteNotice">' +
            '<input onclick="deleteMarkers();" type=button value="Delete Markers">' +
            '</div>';

        infowindow = new google.maps.InfoWindow({
            content: contentString
        });

        marker.addListener('click', function () {
            infowindow.open(map, marker);
        });
        
    }
}


function deleteMarkers() {
    markers.length = 0;
    marker.setMap(null);
}


function GetMarkerPosition(marker) {
        geocoder.geocode({ 'latLng': marker.getPosition() }, function (results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                pos = {
                    lat: marker.getPosition().lat(),
                    lng: marker.getPosition().lng(),
                    address: results[0].formatted_address
                }
            }
        });
}