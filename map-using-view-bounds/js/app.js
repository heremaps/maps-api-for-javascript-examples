
/**
 * Moves the map to display over Boston using viewBounds
 *
 * @param  {H.Map} map      A HERE Map instance within the application
 */
function setMapViewBounds(map){
  var bbox = new H.geo.Rect(42.3736,-71.0751,42.3472,-71.0408);
  map.setViewBounds(bbox);
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

//Step 2: initialize a map  - not specificing a location will give a whole world view.
var map = new H.Map(document.getElementById('map'),
  defaultLayers.normal.map);

//Step 3: make the map interactive
// MapEvents enables the event system
// Behavior implements default interactions for pan/zoom (also on mobile touch environments)
var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));

// Create the default UI components
var ui = H.ui.UI.createDefault(map, defaultLayers);

// Now use the map as required...
setMapViewBounds(map);