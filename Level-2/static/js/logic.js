// STEP 1: Basic Map
var myMap = L.map("map", {
    center: [39.76, -111.89],
    zoom: 5
});

L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "light-v10",
    accessToken: API_KEY
}).addTo(myMap);

// STEP 4: Add colors
function getColor(depth) {
    switch(true) {
        case depth > 90:
            return "#ff1900";
        case depth > 70:
            return "#ff6200";
        case depth > 50:
            return "#ff8c00";
        case depth > 30:
            return "#ffc400";
        case depth > 10:
            return "#ffea00";
        default:
            return "#66ff00";
    }
}

// STEP 2: Get data
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

d3.json(url).then(data => {
    console.log(data);

    // STEP 3: Add circles at the locations of earthquake
    L.geoJson(data, {
        pointToLayer: (feature, latlng) => {
            return L.circleMarker(latlng, {
                radius: feature.properties.mag * 5,
                color: "black", 
                fillColor: getColor(feature.geometry.coordinates[2]),
                fillOpacity: 0.75,
                weight: 1
            })
        },

        // STEP 5: Add tooltips
        onEachFeature : (feature, layer) => {
            layer.bindPopup(
                `<h3>Location: ${feature.properties.place}</h3><hr>Magnitude: ${feature.properties.mag}<br>Depth: ${feature.geometry.coordinates[2]}`
            )
        }

    }).addTo(myMap);

    // STEP 6: Add legend
    var legend = L.control({
        position: "bottomright"
    })
    legend.onAdd = function() {
        var div = L.DomUtil.create("div", "Legend")

        var depthList = [-10, 10, 30, 50, 70, 90];

        for (var i = 1; i < depthList.length; i++) {
            div.innerHTML += "<div>" 
                            + "<i style='background-color: " + getColor(depthList[i] - 1) + ";'>&nbsp;</i>"
            + depthList[i-1] + " - " + depthList[i] + "</div>";
        }

        div.innerHTML += "<div>" + "<i style='background-color: " + getColor(100) + ";'>&nbsp;</i>" + depthList[5] + "+ </div>"

        return div;
    }
    legend.addTo(myMap);


});