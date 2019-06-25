    
/**
 * Switches the map language to simplified Chinese
 *
 * @param  {H.Map} map      A HERE Map instance within the application
 * @pama   {H.service.Platform} platform    A stub class to access HERE services
 */
function switchMapLanguage(map, platform){
  var mapTileService = platform.getMapTileService({
      type: 'base'
    }),
    // Our layer will load tiles from the HERE Map Tile API
    chineseMapLayer = mapTileService.createTileLayer(
      'maptile',
      'normal.day',
      pixelRatio === 1 ? 256 : 512,
      'png8',
      {lg: 'CHI', ppi: pixelRatio === 1 ? undefined : 320}
    );
  map.setBaseLayer(chineseMapLayer);

  // Display default UI components on the map and change default
  // language to simplified Chinese.
  // Besides supported language codes you can also specify your custom translation
  // using H.ui.i18n.Localization.
  var ui = H.ui.UI.createDefault(map, defaultLayers, 'zh-CN');

  // Remove not needed settings control
  ui.removeControl('mapsettings');
}





/**
 * Boilerplate map initialization code starts below:
 */

//Step 1: initialize communication with the platform
var platform = new H.service.Platform({
  app_id: window.app_id,
  app_code: window.app_code,
  useHTTPS: true
});
var pixelRatio = window.devicePixelRatio || 1;
var defaultLayers = platform.createDefaultLayers({
  tileSize: pixelRatio === 1 ? 256 : 512,
  ppi: pixelRatio === 1 ? undefined : 320
});

//Step 2: initialize a map - this map is centered over Hong Kong.
var map = new H.Map(document.getElementById('map'),
  defaultLayers.normal.map,{
  center: {lat:22.2783, lng:114.1588},
  zoom: 12,
  pixelRatio: pixelRatio
});
// add a resize listener to make sure that the map occupies the whole container
window.addEventListener('resize', () => map.getViewPort().resize());

//Step 3: make the map interactive
// MapEvents enables the event system
// Behavior implements default interactions for pan/zoom (also on mobile touch environments)
var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));

// Now use the map as required...
switchMapLanguage(map, platform);