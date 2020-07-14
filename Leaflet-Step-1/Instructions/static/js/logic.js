const API_KEY = "pk.eyJ1Ijoia2hhbGVka2FybWFuIiwiYSI6ImNqbXNhejNxYzAxdjczd216eHRuYzJza28ifQ.PdkNYGf3m8txl_r1sLebKw";

  
// Function to determine marker size based on earthquake magnitude
function markerSize(feature) {
  return Math.sqrt(Math.abs(feature.properties.mag)) * 5;
}

// Function to determine marker color based on earthquake magnitude
var colors = ["#EA860F", "#D3EA0F", "#EA3A0F", "#47DD1B", "	#FA8072", "#BD0707"]
function fillColor(feature) {
  var mag = feature.properties.mag;
  if (mag <= 1) {
    return colors[0]
  }
  else if (mag <= 2) {
    return colors[1]
  }
  else if (mag <= 3) {
    return colors[2]
  }
  else if (mag <= 4) {
    return colors[3]
  }
  else if (mag <= 5) {
    return colors[4]
  }
  else {
    return colors[5]
  }
}

// Base layers for maps (no data yet)
var attribution = "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery Â© <a href=\"https://www.mapbox.com/\">Mapbox</a>";


var lightMap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/streets-v11",
  accessToken: API_KEY
})


// Create a baseMaps object
var baseMaps = {
  "Grayscale": lightMap,
  
};

// Store API endpoint as queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson"


// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
    

          // Earthquake layer
    var earthquakes = L.geoJSON(data, {

        // Create circle markers
        pointToLayer: function (feature, latlng) {
          var geojsonMarkerOptions = {
            radius: 8,
            stroke: false,
            //fillColor: "#ff7800",
            radius: markerSize(feature),
            fillColor: fillColor(feature),
            //color: "white",
            weight: 5,
            opacity: .8,
            fillOpacity: .8
          };
          return L.circleMarker(latlng, geojsonMarkerOptions);
        },
  
        // Create popups
        onEachFeature: function (feature, layer) {
          return layer.bindPopup(`<strong>Place:</strong> ${feature.properties.place}<br><strong>Magnitude:</strong> ${feature.properties.mag}`);
        }
      });

        
  
      // Create an overlay object
      var overlayMaps = {
        "Earthquakes": earthquakes,
      };
  
      // Define a map object
      var map = L.map("map", {
        center: [37.09, -95.71],
        zoom: 3,
        layers: [ lightMap,earthquakes]
      });
  
      // // Add the layer control to the map
      // L.control.layers(baseMaps, overlayMaps, {
      //   collapsed: false
      // }).addTo(map);
  
      // Setting up the legend
      var legend = L.control({ position: "bottomright" });
      legend.onAdd = function() {
        var div = L.DomUtil.create("div", "info legend");
        var limits = ["0-1", "1-2", "2-3", "3-4", "4-5", "5+"];
        var labelsColor = [];
        var labelsText = [];
  
        // Add min & max
        limits.forEach(function(limit, index) {
          labelsColor.push(`<li style="background-color: ${colors[index]};"></li>`); // <span class="legend-label">${limits[index]}</span>
          labelsText.push(`<span class="legend-label">${limits[index]}</span>`)
        });
  
        var labelsColorHtml =  "<ul>" + labelsColor.join("") + "</ul>";
        var labelsTextHtml = `<div id="labels-text">${labelsText.join("<br>")}</div>`;
  
        var legendInfo = "<h4>Earthquake<br>Magnitude</h4>" +
          "<div class=\"labels\">" + labelsColorHtml + labelsTextHtml
          "</div>";
        div.innerHTML = legendInfo;
  
        return div;
      };
  
      // Adding legend to the map
      legend.addTo(map);
  
    
  })

  