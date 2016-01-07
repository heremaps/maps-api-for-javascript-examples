/**
 * Stores the map tiles for offline usage
 * @param {H.Map} map Reference to the map instance
 * @param {Object<string , H.service.MapType>} defaultLayers Default layers provided by
 *                                                           the H.service.Platform
 */
function storeTiles(map, defaultLayers) {
  // Zoom level to cache
  var currentZoomLevel = map.getZoom(),
      // View bounds to store. By default visible area of the map.
      viewBounds;

  // Cache the layer area within current view bounds for the current and next zoom level.
  map.storeContent(function(req) {
    // If all tiles are stored switch on the layer
    if (req.getState() === H.util.Request.State.COMPLETE) {
      alert('Disable Internet connection and click the button below to see the cached satellite layer.');
      map.setBaseLayer(defaultLayers.satellite.map);
    }
  }, viewBounds, currentZoomLevel, currentZoomLevel + 1, defaultLayers.satellite.map);
}


/**
 * Clears the stored tiles
 * @param {H.Map} map Reference to the map instance
 */
function clearTiles(map) {
  map.clearContent();
}


/**
 * Boilerplate map initialization code starts below:
 */

// Step 1: initialize communication with the platform
var platform = new H.service.Platform({
  app_id: '{YOUR_APP_ID}',
  app_code: '{YOUR_APP_CODE}',
  useHTTPS: true,
  useCIT: true
});
var defaultLayers = platform.createDefaultLayers();

// Step 2: initialize a map
var map = new H.Map(document.getElementById('map'), defaultLayers.normal.map, {
  // initial center and zoom level of the map
  center: {lat: 19.969202, lng: -156.007712},
  zoom: 7
});

// Step 3: make the map interactive
// MapEvents enables the event system
// Behavior implements default interactions for pan/zoom (also on mobile touch environments)
new H.mapevents.Behavior(new H.mapevents.MapEvents(map));

// Step 4: Create the default UI:
H.ui.UI.createDefault(map, defaultLayers, 'en-US');


/**
 * Template function for our controls
 * @param  {Object} buttons       Configuration of labels and click handlers of the buttons
 */
function renderControls(buttons) {
  var containerNode = document.createElement('div');
  containerNode.setAttribute('style', 'position:absolute;top:0;left:0;background-color:#fff; padding:10px;');
  containerNode.className = 'btn-group';

  Object.keys(buttons).forEach(function(label) {
    var input = document.createElement('input');
    input.value = label;
    input.type = 'button';
    input.onclick = buttons[label];
    input.className = 'btn btn-sm btn-default';
    containerNode.appendChild(input);
  });

  map.getElement().appendChild(containerNode);
}

// Step 5: Render buttons for storing and retrieving tiles from the cache.
//         Function is not a part of API. Scroll to the bottom to see the source.
renderControls({
  // Key is a button label and value is an click/tap callback
  'Store satellite layer': function() {
    storeTiles(map, defaultLayers);
  },
  'Clear': function() {
    clearTiles(map);
  }
});
