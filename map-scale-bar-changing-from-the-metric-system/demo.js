/**
 * Boilerplate map initialization code starts below:
 */

//Step 1: initialize communication with the platform
// In your own code, replace variable window.apikey with your own apikey
var platform = new H.service.Platform({
  apikey: window.apikey
});
var defaultLayers = platform.createDefaultLayers();

//Step 2: initialize a map - this map is centered over Boston.
var map = new H.Map(
  document.getElementById("map"),
  defaultLayers.vector.normal.map,
  {
    center: { lat: 42.3572, lng: -71.0596 },
    zoom: 14,
    pixelRatio: window.devicePixelRatio || 1,
  }
);
// add a resize listener to make sure that the map occupies the whole container
window.addEventListener("resize", () => map.getViewPort().resize());

//Step 3: make the map interactive
// MapEvents enables the event system
// Behavior implements default interactions for pan/zoom (also on mobile touch environments)
var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));

/**
 * Alters the UI to use imperial measurements.
 *
 * @param  {H.Map} map      A HERE Map instance within the application
 * @param  {Object.<string, H.service.MapType>} defaultLayers
 *         an object holding the three default HERE Map types
 */

function useImperialMeasurements(map, defaultLayers) {
  // Create the default UI components
  var ui = H.ui.UI.createDefault(map, defaultLayers);

  // Set the UI unit system to imperial measurement
  ui.setUnitSystem(H.ui.UnitSystem.IMPERIAL);
}

// Now use the map as required...
useImperialMeasurements(map, defaultLayers);
