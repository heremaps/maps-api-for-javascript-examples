/**
 * Example for Indoor Map for JSMapsApi.
 */

// Replace with your HERE platform app api key 
const yourApikey = 'ZKBUeAgkzH4JWhg93AA7cIE_kZotbMGhVI0_UYC0COY';

// Replace with your indoor map platform collection hrn
const indoorMapHrn = 'hrn:here:data::org651595200:indoormap-ed6d5667-cfe0-4748-bbf5-88b00e7e3b21-collection';

// Replace with the venue id for your map. This example works for maps:
// 7348 - Zurich Airport
// 27158 - Tiefgarage Riem Arcaden APCOA Parking garage
// 22766 - Mall of Berlin
const venueId = '27158';

/**
 * Load and add indoor data on the map.
 *
 * @param  {H.Map} map A HERE Map instance
 */
function addVenueToMap(map) {
  // Get an instance of the Indoor Maps service using a valid apikey for Indoor Maps
  const venuesService = platform.getVenuesService({ apikey: yourApikey, hrn: indoorMapHrn }, 2);

  // Indoor Maps service provides a loadVenue method
  venuesService.loadVenue(venueId).then((venue) => {
    // add Indoor Maps data to the Indoor Maps provider
    venuesProvider.addVenue(venue);
    venuesProvider.setActiveVenue(venue);

    // create a tile layer for the Indoor Maps provider
    const venueLayer = new H.map.layer.TileLayer(venuesProvider);
    map.addLayer(venueLayer);

    // Set center of the map view to the center of the venue
    map.setCenter(venue.getCenter());

    // Create a level control
    const levelControl = new H.venues.ui.LevelControl(venue);
    ui.addControl('level-control', levelControl);

    // Create a drawing control:
    const drawingControl = new H.venues.ui.DrawingControl(venue);
    ui.addControl('drawing-control', drawingControl);

    // Enable to restrict map movement within indoor map bounds
    restrictMap(map, venue);

    // Rotate map
    rotateMap(map, 90);
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

// Indoor Maps provider interacts with a tile layer to visualize and control the Indoor Map
const venuesProvider = new H.venues.Provider();

// Step 5: add the Indoor Map
addVenueToMap(map);

/**
 * Rotate the map
 * 
 * @param {H.Map} map A HERE Map instance within the application
 * @param {number} angle in degrees
 */
function rotateMap(map, angle) {
  map.getViewModel().setLookAtData({ 
    tilt: 0,
    heading: angle
  });
}

/**
 * Restricts a moveable map to a given rectangle.
 *
 * @param {H.Map} map A HERE Map instance within the application
 */
 function restrictMap(map, venue) {

  var bounds = venue.getBoundingBox(); // to get BBox for the indoor map

  map.getViewModel().addEventListener('sync', function() {
    var center = map.getCenter();

    if (!bounds.containsPoint(center)) {
      if (center.lat > bounds.getTop()) {
        center.lat = bounds.getTop();
      } else if (center.lat < bounds.getBottom()) {
        center.lat = bounds.getBottom();
      }
      if (center.lng < bounds.getLeft()) {
        center.lng = bounds.getLeft();
      } else if (center.lng > bounds.getRight()) {
        center.lng = bounds.getRight();
      }
      map.setCenter(center);
    }
  });

  //Debug code to visualize where your restriction is
  map.addObject(new H.map.Rect(bounds, {
    style: {
        fillColor: 'rgba(55, 85, 170, 0.1)',
        strokeColor: 'rgba(55, 85, 170, 0.3)',
        lineWidth: 2
      }
    }
  ));
}