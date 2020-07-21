/**
 * Load and add venue data on the map.
 *
 * @param  {H.Map} map A HERE Map instance
 */
function addVenueToMap(map) {
  // Get instance of venues service using valid apikey for venues
  const venuesService = platform.getVenuesService({ apikey: 'QICW7garcjxE7C7sSguJcNolMZXqYCJ9m5o6Qq3ygjg' });

  // Venues provider interacts with tile layer to visualize and control the venue map
  const venuesProvider = new H.venues.Provider();

  // Venues service provides a loadVenue method
  venuesService.loadVenue(7348).then((venue) => {
    // add venue data to venues provider
    venuesProvider.addVenue(venue);
    venuesProvider.setActiveVenue(venue);

    // create a tile layer for the venues provider
    map.addLayer(new H.map.layer.TileLayer(venuesProvider));

    // optionally select drawing/level
    venue.setActiveDrawing(7880);

    // create level control
    const levelControl = new H.venues.ui.LevelControl(venue);
    ui.addControl('level-control', levelControl);

    // create drawing control:
    const drawingControl = new H.venues.ui.DrawingControl(venue);
    ui.addControl('drawing-control', drawingControl);
  });
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
  zoom: 18,
  center: { lat: 47.452353, lng: 8.562455 },
  pixelRatio: window.devicePixelRatio || 1
});

// add a resize listener to make sure that the map occupies the whole container
window.addEventListener('resize', () => map.getViewPort().resize());

// Step 3: make the map interactive
// MapEvents enables the event system
// Behavior implements default interactions for pan/zoom (also on mobile touch environments)
var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));

// Step 4: create the default UI component, for displaying bubbles
var ui = H.ui.UI.createDefault(map, defaultLayers);

// Step 5: load venue data
addVenueToMap(map);
