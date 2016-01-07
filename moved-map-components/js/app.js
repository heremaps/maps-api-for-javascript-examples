
/**
 * Moves all the map controls moved to the top-left corner
 *
 * @param  {H.Map} map      A HERE Map instance within the application
 * @param  {Object.<string, H.service.MapType>} defaultLayers
 *         an object holding the three default HERE Map types
 */
function moveUiComponents(map, defaultLayers){
  // Create the default UI components
  var ui = H.ui.UI.createDefault(map, defaultLayers);

  // Obtain references to the standard controls.
  var mapSettings = ui.getControl('mapsettings');
  var zoom = ui.getControl('zoom');
  var scalebar = ui.getControl('scalebar');

  // Move the controls to the top-left of the map.
  mapSettings.setAlignment('top-left');
  zoom.setAlignment('top-left');
  scalebar.setAlignment('top-left');
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

//Step 2: initialize a map - this map is centered over berlin.
var map = new H.Map(document.getElementById('map'),
  defaultLayers.normal.map,{
  center: {lat:52.5160, lng:13.3779},
  zoom: 12
});

//Step 3: make the map interactive
// MapEvents enables the event system
// Behavior implements default interactions for pan/zoom (also on mobile touch environments)
var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));

// Now use the map as required...
moveUiComponents(map, defaultLayers);