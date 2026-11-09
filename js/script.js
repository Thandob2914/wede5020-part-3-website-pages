document.addEventListener("DOMContentLoaded", function () {
  var mapElement = document.getElementById("map");

  if (!mapElement || typeof L === "undefined") {
    return;
  }

  var location = [-25.99738, 28.12476];

  var map = L.map("map", {
    scrollWheelZoom: false
  }).setView(location, 16);

  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: "&copy; <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors"
  }).addTo(map);

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
