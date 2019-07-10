/**
 * Shows the postcode layer provided by Platform Data Extension REST API
 * https://developer.here.com/platform-extensions/documentation/platform-data/topics/introduction.html
 *
 * @param  {H.Map} map      A HERE Map instance within the application
 */
function showPostcodes(map, bubble){
  var service = platform.getPlatformDataService();

  style = new H.map.SpatialStyle();
  // create tile provider and layer that displays postcode boundaries
  var boundariesProvider = new H.service.extension.platformData.TileProvider(service,
  {
    layerId: 'PSTLCB_GEN', level: 12
  }, {
      resultType: H.service.extension.platformData.TileProvider.ResultType.POLYLINE,
      styleCallback: function(data) {return style}
  });
  var boundaries = new H.map.layer.TileLayer(boundariesProvider);
  map.addLayer(boundaries);

  // create tile provider and layer that displays postcode centroids
  var centroidsProvider = new H.service.extension.platformData.TileProvider(service,
  {
    layerId: 'PSTLCB_MP', level: 12
  }, {
      resultType: H.service.extension.platformData.TileProvider.ResultType.MARKER
  });
  var centroids = new H.map.layer.MarkerTileLayer(centroidsProvider);
  map.addLayer(centroids);

  // add event listener that shows infobubble with basic information
  // about the postcode
  centroidsProvider.addEventListener('tap', function(ev) {
    var marker = ev.target;
    bubble.setPosition(marker.getGeometry());
    var str = '<nobr>Postal code: ' + marker.getData().getCell('POSTAL_CODE') + '</nobr><br>' +
              'Country code: ' + marker.getData().getCell('ISO_COUNTRY_CODE') + '<br>'
    bubble.setContent(str);
    bubble.open();
  });
}

/**
 * Boilerplate map initialization code starts below:
 */

//Step 1: initialize communication with the platform
// In your own code, replace variable window.apikey with your own apikey
var platform = new H.service.Platform({
  apikey: window.apikey
});
var pixelRatio = window.devicePixelRatio || 1;
var defaultLayers = platform.createDefaultLayers({
  tileSize: pixelRatio === 1 ? 256 : 512,
  ppi: pixelRatio === 1 ? undefined : 320
});

//Step 2: initialize a map  - not specificing a location will give a whole world view.
var map = new H.Map(document.getElementById('map'),
  defaultLayers.vector.normal.map, {pixelRatio: pixelRatio});
// add a resize listener to make sure that the map occupies the whole container
window.addEventListener('resize', () => map.getViewPort().resize());

map.setCenter({lat:52.5159, lng:13.3777});
map.setZoom(13);

//Step 3: make the map interactive
// MapEvents enables the event system
// Behavior implements default interactions for pan/zoom (also on mobile touch environments)
var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));

// Create the default UI components
var ui = H.ui.UI.createDefault(map, defaultLayers);

// create info bubble that is used to display the postcode data
bubble = new H.ui.InfoBubble(map.getCenter(), {
  content: ''
});
bubble.close();
ui.addBubble(bubble);

// Now use the map as required...
showPostcodes(map, bubble);