/**
 * Adds meta information layer to the map and makes supported geographic objects
 * (street names, city labels, parks, transit stations etc) "interactive".
 *
 * @param {H.Map} map Reference to initialized map object
 */
function addMetaInfoLayer(map) {
  // Subscribe to the metaInfo objects' pointermove event. The event bubbles up to
  // the TileProvider of the metaInfo layer.
  var tileProvider = defaultLayers.normal.metaInfo.getProvider();
  tileProvider.addEventListener('pointermove', updateMapCursor);

  // Change cursor back when not needed
  map.addEventListener('pointermove', updateMapCursor);

  // Add a metaInfo layer to the map
  map.addLayer(defaultLayers.normal.metaInfo);
}


/**
 * Sets cursor to pointer, when hovering over meta objects
 * @this {H.Map}
 * @param {H.mapevents.Event} e
 */
function updateMapCursor(e) {
  // Change cursor appearance when hovering over geographic objects
  map.getElement().style.cursor = (e.target === map) ? '' : 'pointer';
  if (e.target !== map){
    showMetaInfo(e);
  }
}


/**
 * Handler for metaInfo tap event
 *
 * @param {H.mapevents.Event} e Fired event
 */
function showMetaInfo(e) {
  var currentPointer = e.currentPointer,
      metaInfoData = e.target.getData(),
      // Format object's data for display
      content =  '<strong style="font-size: large;">' + metaInfoData.name  + '</strong></br>';
      content  += '<br/><strong>metaInfo:</strong><br/>';
      content  += '<div style="margin-left:5%; margin-right:5%;"><pre><code style="font-size: x-small;">' +
        JSON.stringify(metaInfoData, null, ' ') + '</code></pre></div>';

  locationsContainer.innerHTML = content;
}

/**
 * Boilerplate map initialization code starts below:
 */


// Step 1: initialize communication with the platform
var platform = new H.service.Platform({
  app_id: '{YOUR_APP_ID}',
  app_code: '{YOUR_APP_CODE}',
  useCIT: true,
  useHTTPS: true
});
var defaultLayers = platform.createDefaultLayers();

// Step 2: initialize a map
var map = new H.Map(document.getElementById('map'), defaultLayers.normal.map, {
  // initial center and zoom level of the map
  zoom: 16,
  // Champs-Ãƒâ€°lysÃƒÂ©es
  center: {lat: 48.869145, lng: 2.314298}
});

var locationsContainer = document.getElementById('panel');

// Step 3: make the map interactive
// MapEvents enables the event system
// Behavior implements default interactions for pan/zoom (also on mobile touch environments)
var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));

// Step 4: main logic goes here
addMetaInfoLayer(map);