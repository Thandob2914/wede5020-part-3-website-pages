document.addEventListener("DOMContentLoaded", function () {
  var mapElement = document.getElementById("map");
  // Checks if the map element exists and if Leaflet is loaded
  if (!mapElement || typeof L === "undefined") {
    return;
  }
  // Location coordinates and place name
  var location = [-25.99738, 28.12476];

  var map = L.map("map", {
    scrollWheelZoom: false
  }).setView(location, 16);
   // Adds a tile layer to the map using OpenStreetMap tiles
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: "&copy; <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors"
  }).addTo(map);
  // Adds a marker to the map at the specified location with a popup
  L.marker(location)
    .addTo(map)
    .bindPopup("<strong>Golden Aura Cosmetics</strong><br>Boulders Shopping Centre")
    .openPopup();

  map.on("click", function () {
    map.scrollWheelZoom.enable();
  });

  map.on("mouseout", function () {
    map.scrollWheelZoom.disable();
  });
});
