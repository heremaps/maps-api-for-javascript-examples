

/**
 * Adds a polyline between Dublin, London, Paris and Berlin to the map
 *
 * @param  {H.Map} map      A HERE Map instance within the application
 */
function addPolylineToMap(map) {
  var strip = new H.geo.Strip();

  strip.pushPoint({lat:53.3477, lng:-6.2597});
  strip.pushPoint({lat:51.5008, lng:-0.1224});
  strip.pushPoint({lat:48.8567, lng:2.3508});
  strip.pushPoint({lat:52.5166, lng:13.3833});

  map.addObject(new H.map.Polyline(
    strip, { style: { lineWidth: 4 }}
  ));
}





/**
 * Boilerplate map initialization code starts below:
 */

//Step 1: initialize communication with the platform
var platform = new H.service.Platform({
  app_id: '{YOUR_APP_ID}',
  app_code: '{YOUR_APP_CODE}',
  useCIT: true,
  useHTTPS: true
});
var defaultLayers = platform.createDefaultLayers();

//Step 2: initialize a map - this map is centered over Europe
var map = new H.Map(document.getElementById('map'),
  defaultLayers.normal.map,{
  center: {lat:52, lng:5},
  zoom: 5
});

//Step 3: make the map interactive
// MapEvents enables the event system
// Behavior implements default interactions for pan/zoom (also on mobile touch environments)
var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));

// Create the default UI components
var ui = H.ui.UI.createDefault(map, defaultLayers);


// Now use the map as required...
addPolylineToMap(map);