var myMap = L.map("map", {
    center: [45.09, -100.71],
    zoom: 4
  });
  
  // Adding tile layer
  L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
  }).addTo(myMap);
  
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
  
// Perform a GET request to the query URL
d3.json(url, function(data) {
    // Once we get a response, send the data.features object to the createFeatures function
    createFeatures(data.features);
});
  
function createFeatures(earthquakeData) {
  
    // Define a function we want to run once for each feature in the features array
    // Give each feature a popup describing the place and time of the earthquake
    function onEachFeature(feature, layer) {

        //console.log(feature.properties.mag);
        console.log(feature.geometry.coordinates);

        var color = "";

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
        
        // Add circles to map
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
            "</h3>").addTo(myMap);
    }
  
    // Create a GeoJSON layer containing the features array on the earthquakeData object
    // Run the onEachFeature function once for each piece of data in the array
    var earthquakes = L.geoJSON(earthquakeData, {
      onEachFeature: onEachFeature
    });
  
    // Add legend (don't forget to add the CSS from index.html)
    var legend = L.control({ position: "bottomright" });
    legend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend");
    var limits = ["0", "1-2", "2-3", "3-4", "4-5", "5+"];
    var colors = ["#ffffb2", "#fed976", "#feb24c", "#fd8d3c", "#f03b20", "#bd0026"];
    var labels = [];

    // Add min & max
    var legendInfo = "<h1>Median Income</h1>" +
        "<div class=\"labels\">" +
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
    }
  