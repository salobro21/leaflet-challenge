var myMap = L.map('map', {
    center: [38, -96],
    zoom: 5
})

L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/light-v10",
  accessToken: API_KEY
}).addTo(myMap);

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
        default:
            return '#bfbfbf';
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

var earthquakeData = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

d3.json(earthquakeData).then(function(data){

L.geoJson(data,{
    pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng, {
            radius: markerSize(feature.properties.mag),
            fillColor: chooseColor(feature.geometry.coordinates[2]),
            fillOpacity: 0.7,
            color: "#000000",
            stroke: true,
            weight: 1,
        });
    },
    onEachFeature: function(feature, layer){
        layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><span>Magnitude: ${feature.properties.mag}</span>`)
    }
}).addTo(myMap);

var legend = L.control({position: 'bottomright'});
legend.onAdd = function(map) {
var div = L.DomUtil.create('div', 'info legend'),
    magnitude = [0, 1, 2, 3, 4, 5]

for (var i = 0; i < magnitude.length; i++) {
    div.innerHTML +=
        '<i style="background:' + getColor(magnitude[i] + 1) + '"></i> ' +
        magnitude[i] + (magnitude[i + 1] ? '&ndash;' + magnitude[i + 1] + '<br>' : '+');
}

return div;
};

legend.addTo(myMap);

});
// https://leafletjs.com/examples/choropleth/ <-- for the above legend