var earthquakeData = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
var earthquakes = L.layerGroup()

var grayscaleMap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/light-v10",
  accessToken: API_KEY
}).addTo(myMap);

d3.json(earthquakesURL, function(earthquakeData) {
function getColor(magnitude){
    switch(true){
        case (magnitude <= 1):
            return '#bfff00';
            break;
        case (magnitude <= 2):
            return '#ffff00';
            break;
        case (magnitude <= 3):
            return '#ffbf00';
            break;
        case (magnitude <= 4):
            return '#ff8000';
            break;
        case (magnitude <= 5):
            return '#ff4000';
            break;
        case (magnitude > 5):
            return '#ff0080';
            break;
    }
}

function getRadius(magnitude){
    switch(true){
        case (magnitude <= 1):
            return 4;
            break;
        case (magnitude <= 2):
            return 6;
            break;
        case (magnitude <= 3):
            return 8;
            break;
        case (magnitude <= 4):
            return 10;
            break;
        case (magnitude <= 5):
            return 12;
            break;
        case (magnitude > 5):
            return 14;
            break;
        default:
            return 1;
            break;
    }
}
});
d3.json(earthquakeData).then(function(data){

    L.geoJson(data,{
        pointToLayer: function (feature, latlng) {
            // Create a circle marker
            return L.circleMarker(latlng, {
                radius: getRadius(feature.properties.mag), // different radius for different magnitude
                fillColor: getColor(feature.properties.mag), // different circle colors for different magnitude
                color: "#000000",
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            });
        },
        onEachFeature: function(feature, layer){
            layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><span>Magnitude: ${feature.properties.mag}</span>`)
        }
    }).addTo(myMap);
});