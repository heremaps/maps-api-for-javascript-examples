/**
 * Shows how to add venue objects to the map, change default styling
 * and change a floor level for all venues.
 * @see http://developer.here.com/rest-apis/documentation/venue-maps
 *
 * @param {H.Map} map A HERE Map instance within the application
 * @param {H.service.Platform} platform Platform instance within the application
 * @param {Function} renderControls Custom helper function for adding buttons
 */
function addVenueLayer(map, platform, renderControls) {
  // Create a tile layer, which will display venues
  var customVenueLayer = platform.getVenueService().createTileLayer({
    // Provide a callback that will be called for each newly created space
    onSpaceCreated: onSpaceCreated
  });

  // Get TileProvider from Venue Layer
  var venueProvider = customVenueLayer.getProvider();
  // Add venues layer to the map
  map.addLayer(customVenueLayer);

  // Use the custom function (i.e. not a part of the API)
  // to render buttons with corresponding click callbacks
  renderControls('Change floor', {
    '+1 Level': function () {
      // Increase global floor level on the venue provider
      venueProvider.setCurrentLevel(venueProvider.getCurrentLevel() + 1);
    },
    '-1 Level': function () {
      // Decrease global floor level on the venue provider
      venueProvider.setCurrentLevel(venueProvider.getCurrentLevel() - 1);
    }
  });
}

/**
 * Changes the default style for H&M shops
 *
 * @param {H.service.venues.Space}
 */
function onSpaceCreated(space) {
  // getData for spaces contains data from the Venue Interaction Tile API,
  // see https://developer.here.com/rest-apis/documentation/venue-maps/topics/resource-type-venue-interaction-tile.html
  if (space.getData().preview === 'H&M') {
    space.setStyle({
      fillColor: 'rgba(0,255,0,0.3)'
    });
  }
}

/**
 * Boilerplate map initialization code starts below:
 */

// Step 1: initialize communication with the platform
var platform = new H.service.Platform({
  app_id: "{YOUR_APP_ID}",
  app_code: "{YOUR_APP_CODE}",
  useCIT: true,
  useHTTPS: true
});
var defaultLayers = platform.createDefaultLayers();

// Step 2: initialize a map
var map = new H.Map(document.getElementById('map'), defaultLayers.normal.map, {
  // initial center and zoom level of the map
  center: new H.geo.Point(52.5189, 13.4158),
  zoom: 17
});

// Step 3: make the map interactive
// MapEvents enables the event system
// Behavior implements default interactions for pan/zoom (also on mobile touch environments)
var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));

// Step 4: Create the default UI:
var ui = H.ui.UI.createDefault(map, defaultLayers, 'en-US');

// Template function for displaying controls with a heading and buttons
function renderControls(title, buttons) {
  var containerNode = document.createElement('div');

  containerNode.innerHTML = '<h4 class="title">' + title + '</h4><div class="btn-group"></div>';
  containerNode.setAttribute('style',
      'position:absolute;top:0;left:0;background-color:#fff; padding:10px;text-align:center');

  Object.keys(buttons).forEach(function (label) {
    var input = document.createElement('input');
    input.value = label;
    input.type = 'button';
    input.onclick = buttons[label];
    input.className="btn btn-sm btn-default"
    containerNode.lastChild.appendChild(input);
  });

  map.getElement().appendChild(containerNode);
}

// Step 5: main logic goes here
addVenueLayer(map, platform, renderControls);