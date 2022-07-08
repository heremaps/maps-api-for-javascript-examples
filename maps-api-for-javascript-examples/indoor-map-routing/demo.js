/**
 * Load and add Indoor Map data on the map.
 *
 * @param  {H.Map} map A HERE Map instance
 */
function addVenueToMap(map) {
  // Indoor Maps service provides a loadVenue method
  venuesService.loadVenue(7348).then((venue) => {
    // add Indoor Maps data to the Indoor Maps provider
    venuesProvider.addVenue(venue);
    venuesProvider.setActiveVenue(venue);

    // create a tile layer for the Indoor Maps provider
    map.addLayer(new H.map.layer.TileLayer(venuesProvider));

    // optionally select a different level
    venue.setActiveDrawing(7880);

    // create a level control
    const levelControl = new H.venues.ui.LevelControl(venue);
    ui.addControl('level-control', levelControl);

    // create a drawing control:
    const drawingControl = new H.venues.ui.DrawingControl(venue);
    ui.addControl('drawing-control', drawingControl);
  });
}

/**
 * Calculate a route and add result to the map.
 *
 * @param {H.map} map
 */
function addRouteToMap(map) {
  venuesService.calculateRoute({
    origin: { coordinates: [47.450022, 8.563396]},
    destination: { coordinates: [47.451259,8.560136], venueId: 7348, levelId: 9049 },
    transportMode: 'pedestrian',
    avoid: { features: 'elevator' }
  }).then((result) => {
    // Get objects for the calculated route
    const route = new H.venues.Route(result.routes[0]);

    const indoorObjects = route.getIndoorObjects();
    // Link route map objects with the Indoor Map levels for automatic visibility updates:
    for (let venueId in indoorObjects) {
      for (let levelIndex in indoorObjects[venueId]) {
        const venue = venuesProvider.getVenue(venueId);
        const objectGroup = indoorObjects[venueId][levelIndex];
        map.addObject(objectGroup);
        venue.setMapObjects(objectGroup.getObjects(), levelIndex);
      }
    }
    // Get H.map.Group that contains map objects representing outdoor segments:
    const outdoorObjects = route.getOutdoorObjects();
    map.addObject(outdoorObjects);
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
  zoom: 16,
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

// Step 5: load the indoor map data

// Get the instance of the Indoor Maps service using a valid apikey for Indoor Maps
var venuesService = platform.getVenuesService({ apikey: 'L7yi9YzsZUJMSMavFOYIL7yqWoUcTicYqYNxMOkox84' });

// Indoor Maps provider interacts with the tile layer to visualize and control the Indoor Map
var venuesProvider = new H.venues.Provider();

// Add the Indoor Map
addVenueToMap(map);

// Step 6: Add a route to the Indoor Map
addRouteToMap(map);
