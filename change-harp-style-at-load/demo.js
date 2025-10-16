/**
 * Boilerplate map initialization code starts below:
 */

// Step 1: initialize communication with the platform
// In your own code, replace variable window.apikey with your own apikey

var platform = new H.service.Platform({
  apikey: window.apikey
});

// Step 2: create the style object from the style configuration
// exported from the HERE Style Editor. The argument is a style path
var style = new H.map.render.harp.Style(
  "https://heremaps.github.io/maps-api-for-javascript-examples/change-harp-style-at-load/data/night.json"
);

// Step 4: create a layer with the style object:
var vectorLayer = platform.getOMVService().createLayer(style);

// Step 5: initialize a map
var map = new H.Map(
  document.getElementById("map"),
  vectorLayer,
  {
    center: { lat: 52.51477270923461, lng: 13.39846691425174 },
    zoom: 13,
    pixelRatio: window.devicePixelRatio || 1,
  }
);
// add a resize listener to make sure that the map occupies the whole container
window.addEventListener("resize", () => map.getViewPort().resize());

//Step 6: make the map interactive
// MapEvents enables the event system
// Behavior implements default interactions for pan/zoom (also on mobile touch environments)
var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));