// Boulders Shopping Centre (latitude, longitude)
  var location = [-25.99738, 28.12476];
 
  // Create the map, centred on the business location
  var map = L.map("map", {
    scrollWheelZoom: false // stops the page from getting "stuck" when scrolling
  }).setView(location, 16);
 
  // Add the map tiles from OpenStreetMap
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: "&copy; <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors"
  }).addTo(map);
 
  // Add a marker with a popup
  L.marker(location)
    .addTo(map)
    .bindPopup("<strong>Golden Aura Cosmetics</strong><br>Boulders Shopping Centre")
    .openPopup();
 
  // Allow scroll-zoom only after the user clicks the map
  map.on("click", function () {
    map.scrollWheelZoom.enable();
  });
  map.on("mouseout", function () {
    map.scrollWheelZoom.disable();
  });
});
 
