var earthquakeData = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
var earthquakes = L.layerGroup()

var grayscaleMap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/light-v10",
  accessToken: API_KEY
});

var myMap = L.map("mapid", {
    center: [
        38.0, -96.0
    ],
    zoom: 2,
    layers: [grayscalemap, earthquakes]
});

// Determine the color of the earth quake
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

// Determine the size of the marker based on earthquake magnitude
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

d3.json(earthquakeData).then(function(data){
    L.geoJson(data,{
        pointToLayer: function (feature,latlng){ 
            return L.circleMarker(latlng, {
                radius: getRadius(feature.properties.mag),
                fillColor: getColor(feature.properties.mag),
                color: "#000",
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            });
        },
        onEachFeature: function(feature, layer){
            layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><span>Magnitude: ${feature.properties.mag}</span>`)
        }
    }).addTo(myMap);

    var legend = L.control({position: 'bottomright'});
    legend.onAdd = function (map) {

        var div = L.DomUtil.create('div', 'info legend'),
            mag = [0, 1, 2, 3, 4, 5]
        
        div.innerHTML += "<h4>Magnitude Level</h4><hr>"
          for (var i = 0; i < mag.length; i++) {
            div.innerHTML +=
                '<i style="background:' + getColor(mag[i] + 1) + '"></i> ' +
                mag[i] + (mag[i + 1] ? '&ndash;' + mag[i + 1] + '<br>' : '+');
        }
        return div;
    };
    legend.addTo(myMap);

});

