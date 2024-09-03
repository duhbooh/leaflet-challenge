// Initialize the map
const map = L.map('map').setView([37.7749, -122.4194], 5);  // Center on California with zoom level 5

// Add a tile layer (the map background)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Function to set the marker size based on magnitude
function markerSize(magnitude) {
    return magnitude * 4;
}

// Function to set the marker color based on depth
function markerColor(depth) {
    return depth > 90 ? '#FF0000' :
           depth > 70 ? '#FF4500' :
           depth > 50 ? '#FF8C00' :
           depth > 30 ? '#FFA500' :
           depth > 10 ? '#FFD700' :
                        '#ADFF2F';
}

// Load the earthquake data
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then((data) => {
    // Process each earthquake in the dataset
    data.features.forEach((earthquake) => {
        const magnitude = earthquake.properties.mag;
        const depth = earthquake.geometry.coordinates[2];  // Depth is the third coordinate
        const [longitude, latitude] = earthquake.geometry.coordinates;

        // Create a circle marker with customized size and color
        L.circleMarker([latitude, longitude], {
            radius: markerSize(magnitude),
            fillColor: markerColor(depth),
            color: "#000",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8
        }).bindPopup(`<h3>Magnitude: ${magnitude}</h3><hr><p>Depth: ${depth} km</p><p>Location: ${earthquake.properties.place}</p>`)
          .addTo(map);
    });

    // Add a legend to the map
    const legend = L.control({position: 'bottomright'});

    legend.onAdd = function(map) {
        const div = L.DomUtil.create('div', 'legend');
        const depths = [-10, 10, 30, 50, 70, 90];
        const colors = ['#ADFF2F', '#FFD700', '#FFA500', '#FF8C00', '#FF4500', '#FF0000'];

        div.innerHTML += "<h4>Depth (km)</h4>";

        for (let i = 0; i < depths.length; i++) {
            div.innerHTML +=
                '<i style="background:' + markerColor(depths[i] + 1) + '"></i> ' +
                depths[i] + (depths[i + 1] ? '&ndash;' + depths[i + 1] + '<br>' : '+');
        }

        return div;
    };

    legend.addTo(map);
});
