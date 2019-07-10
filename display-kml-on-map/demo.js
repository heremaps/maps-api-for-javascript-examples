/**
 *  Renders specified a KML file on the map
 *
 *  Note that the maps data module https://js.api.here.com/v3/3.1/mapsjs-data.js
 *  must be loaded for KML parsing to occcur
 *
 * @param {H.Map} map A HERE Map instance within the application
 */
function renderKML(map) {
  // Create a reader object passing in the URL of our KML file
  reader = new H.data.kml.Reader('data/us-states.kml');
  reader.addEventListener("statechange", function(evt){
    if (evt.state === H.data.AbstractReader.State.READY) {
      // Get KML layer from the reader object and add it to the map
      map.addLayer(reader.getLayer());
      reader.getLayer().getProvider().addEventListener("tap", (evt) => {
        logEvent(evt.target.getData().name)
      });
    }
    if (evt.state === H.data.AbstractReader.State.ERROR) {
      logEvent('KML parsing error')
    }
  });

  // Parse the document
  reader.parse();
}

/**
 * Boilerplate map initialization code starts below:
 */

// Step 1: initialize communication with the platform
// In your own code, replace variable window.apikey with your own apikey
var platform = new H.service.Platform({
  apikey: window.apikey
});
var defaultLayers = platform.createDefaultLayers();

// Step 2: initialize a map
var map = new H.Map(document.getElementById('map'), defaultLayers.vector.normal.map, {
  zoom: 2.5,
  center: {lat: 48.30432303555956, lng: -104.94466241321628}
});
// add a resize listener to make sure that the map occupies the whole container
window.addEventListener('resize', () => map.getViewPort().resize());

// Step 3: make the map interactive
// MapEvents enables the event system
// Behavior implements default interactions for pan/zoom (also on mobile touch environments)
var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));

// Step 4: create the default UI component, for displaying bubbles
var ui = H.ui.UI.createDefault(map, defaultLayers);

// Step 5: create custom logging facilities
var logContainer = document.createElement('ul');
logContainer.className ='log';
logContainer.innerHTML = '<li class="log-entry">Try clicking on the map</li>';
map.getElement().appendChild(logContainer);

// Helper for logging events
function logEvent(str) {
  var entry = document.createElement('li');
  entry.className = 'log-entry';
  entry.textContent = str;
  logContainer.insertBefore(entry, logContainer.firstChild);
}

// Step 6: main logic goes here
renderKML(map);