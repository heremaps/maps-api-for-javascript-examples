

/**
 * Switches the map type to a topographical map
 *
 * @param  {H.Map} map      A HERE Map instance within the application
 * @param   {H.service.Platform} platform    A stub class to access HERE services
 */
function switchMapType(map, platform){
  var aerialMapTileService = platform.getMapTileService({
    type: 'aerial'
  });
  terrainMap = aerialMapTileService.createTileLayer(
    'maptile',
    'terrain.day',
    256,
    'png8'
  );
  map.setBaseLayer(terrainMap);
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

//Step 2: initialize a map - this map is centered over Mount Everest
var map = new H.Map(document.getElementById('map'),
  defaultLayers.normal.map,{
  center: {lat:27.98805, lng:86.9250},
  zoom: 10
});

//Step 3: make the map interactive
// MapEvents enables the event system
// Behavior implements default interactions for pan/zoom (also on mobile touch environments)
var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));

// Create the default UI components
var ui = H.ui.UI.createDefault(map, defaultLayers);
// Remove map settings as unnecessary
ui.removeControl('mapsettings');

// Now use the map as required...
switchMapType(map, platform);