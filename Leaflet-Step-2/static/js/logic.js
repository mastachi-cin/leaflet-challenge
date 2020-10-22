// Streetmap Layer
var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
  });

// Darkmap Layer
var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "dark-v10",
    accessToken: API_KEY
  });

// Create a map object
var myMap = L.map("map", {
    center: [45.09, -100.71],
    zoom: 4,
    layers: [streetmap, darkmap]
    });

// Create layer groups
var plates = new L.LayerGroup();
var earthquakes = new L.LayerGroup();

// Create a baseMaps object
var baseMaps = {
"Street Map": streetmap,
"Dark Map": darkmap
};

// Create an overlay object
var overlayMaps = {
"Fault Lines": plates,
"Earthquakes": earthquakes
};
    
  
// Pass our map layers into our layer control
// Add the layer control to the map
L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
}).addTo(myMap);

// Add legend
var legend = L.control({ position: "bottomright" });
legend.onAdd = function() {
var div = L.DomUtil.create("div", "info legend");
var limits = ["0", "1-2", "2-3", "3-4", "4-5", "5+"];
var colors = ["#ffffb2", "#fed976", "#feb24c", "#fd8d3c", "#f03b20", "#bd0026"];
var labels = [];

// Add min & max
var legendInfo = "<div class=\"labels\">" +
    "<div class=\"min\">" + limits[0] + "</div>" +
    "<div class=\"max\">" + limits[limits.length - 1] + "</div>" +
    "</div>";

div.innerHTML = legendInfo;

limits.forEach(function(limit, index) {
    labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");
});

div.innerHTML += "<ul>" + labels.join("") + "</ul>";    
return div;
};

// Adding legend to the map
legend.addTo(myMap);

var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
  
// Perform a GET request to the query URL
d3.json(url, function(data) {

    // Only features
    var featuresData = data.features;

    for (var i = 0; i < featuresData.length; i++) {

        // Create a new feature object with properties of both station objects
        var feature = Object.assign({}, featuresData[i]);

        var color = "";

        // Set color according to earthquake magnitude
        if (feature.properties.mag >= 5 ) {
            color = '#bd0026';
        }
        else if (feature.properties.mag >= 4) {
            color = "#f03b20";
        }
        else if (feature.properties.mag >= 3) {
            color = "#fd8d3c";
        }
        else if (feature.properties.mag >= 2) {
            color = "#feb24c";
        }
        else if (feature.properties.mag >= 1) {
            color = "#fed976";
        }
        else {
            color = "#ffffb2";
        }
        
        // Add circles to layer group
        L.circle([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], {
            fillOpacity: 0.75,
            color: "black",
            weight: 1,
            fillColor: color,
            // Adjust radius
            radius: feature.properties.mag * 20000
        }).bindPopup("<h2>" + feature.properties.place + 
            "</h2> <hr> <h3>Date: " + new Date(feature.properties.time) + 
            "</h3> <h3>Magnitude: " + feature.properties.mag + 
            "</h3>").addTo(earthquakes);
        
    }
    // Add layer to map
    earthquakes.addTo(myMap);

});

url = "../Leaflet-Step-2/static/data/PB2002_plates.json";
//url = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json";

// Perform a GET request to the query URL
d3.json(url, function(data) {
    
    // Add geoJson layer
    L.geoJson(data,{
        color: "yellow",
        weight: 2
    }).addTo(plates);

    // Add layer to map
    plates.addTo(myMap);

});

    

