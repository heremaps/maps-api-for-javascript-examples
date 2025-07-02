/**
 * Example for Indoor Map for JSMapsApi.
 */

// Replace with your HERE platform app api key
const yourApikey = 'ZKBUeAgkzH4JWhg93AA7cIE_kZotbMGhVI0_UYC0COY';

// Replace with your indoor map platform collection hrn
const indoorMapHrn = 'hrn:here:data::org651595200:indoormap-ed6d5667-cfe0-4748-bbf5-88b00e7e3b21-collection';

const venuesProvider = null
const venuesService = null
// Specify the venue ID for your map. Examples of the map ID mentioned below.
// For legacy maps, you can continue to use the numeric value. 
// Examples:
// indoormap-00000000-0000-4000-a000-000000007348 for Zurich Airport (legacy id 7348) 
// indoormap-00000000-0000-4000-a000-000000027158 for Tiefgarage Riem Arcaden APCOA Parking garage (legacy id 27158) 
// indoormap-00000000-0000-4000-a000-000000022766 for Mall of Berlin (legacy id 22766)
const venueId = 'indoormap-00000000-0000-4000-a000-000000007348';

// Set to false if base map is not needed to be displayed.
const showBaseMap = true;

// Optional, list of label text preferences to override.
const labelTextPreferenceOverride = [
  H.venues.Service2.LABEL_TEXT_PREFERENCE_OVERRIDE.OCCUPANT_NAMES,
  H.venues.Service2.LABEL_TEXT_PREFERENCE_OVERRIDE.SPACE_NAME
]

/**
 * Load and add indoor data on the map.
 *
 * @param  {H.Map} map A HERE Map instance
 * @param  {H.service.Platform} platform A HERE Platform instance
 */
function addVenueToMap(map, platform) {
  // Indoor Maps provider interacts with a tile layer to visualize and control the Indoor Map
  venuesProvider = new H.venues.Provider();

  // Get an instance of the Indoor Maps service using a valid apikey for Indoor Maps
  venuesService = platform.getVenuesService({ apikey: yourApikey, hrn: indoorMapHrn }, 2);

  // Use venuesService.getMapInfoList to retrieve the list of Indoor maps from the given HRN
  venuesService.getMapInfoList().then(mapInfoList => {
    mapInfoList.forEach(mapInfo => {
      console.log("Indoor map id: " + mapInfo.mapId + ", map name: " + mapInfo.mapName);
    });
  });

  // Indoor Maps service provides a loadVenue method. Optionally, overriding the label preferences
  venuesService.loadVenue(venueId, { labelTextPreferenceOverride }).then((venue) => {
    // add Indoor Maps data to the Indoor Maps provider
    venuesProvider.addVenue(venue);
    venuesProvider.setActiveVenue(venue);

    // create a tile layer for the Indoor Maps provider
    const venueLayer = new H.map.layer.TileLayer(venuesProvider);
    if (showBaseMap) {
      // Add venueLayer to the base layer
      map.addLayer(venueLayer);
    } else {
      // If base map is not needed, set the venueLayer as base layer
      map.setBaseLayer(venueLayer);
    }

    // Set center of the map view to the center of the venue
    map.setCenter(venue.getCenter());

    // Create a level control
    const levelControl = new H.venues.ui.LevelControl(venue);
    ui.addControl('level-control', levelControl);

    // Create a drawing control:
    const drawingControl = new H.venues.ui.DrawingControl(venue);
    ui.addControl('drawing-control', drawingControl);
  });
}

/**
 * calculate route from a to b and load it on venue
 *  @param  {H.Map} map A HERE Map instance

 * A full list of available request parameters can be found in the Indoor Routing API documentation.
 * see: https://www.here.com/docs/bundle/indoor-routing-api-v1-api-reference/page/index.html
 */
async function calculateIndoorRouteFromAtoB(map) {

  // Instantiate (and display) a map:
  const origin = { lat: 47.45146718297871, lng: 8.56116163852909, levelId: "level-9050", venueId: "indoormap-00000000-0000-4000-a000-000000007348" };
  const destination = { lat: 47.45264049318705, lng: 8.562764022046945, levelId: "level-9050", venueId: "indoormap-00000000-0000-4000-a000-000000007348" };

  // Create the parameters for the indoor routing request:
  const routingParameters = {
    routingMode: "fast",
    transportMode: "pedestrian",
    // The start point of the route:
    origin: `${origin.lat},${origin.lng},${origin.levelId},${origin.venueId}`,
    // The end point of the route:
    destination: `${destination.lat},${destination.lng},${destination.levelId},${destination.venueId}`,
  };
  try{
    const res = await venuesService.calculateRoute(routingParameters);
    if (res?.routes && res.routes.length > 0) {
      // Create route objects using route response data
      const route = new H.venues.Route2(res.routes[0]);
      // Link route map objects with venue levels for automatic visibility updates:
      const indoorObjects = route.getIndoorObjects();

      for (let venueId in indoorObjects) {
        for (let levelIndex in indoorObjects[venueId]) {
          const venue = venuesProvider.getVenue(venueId);
          const objectGroup = indoorObjects[venueId][levelIndex];
          map.addObject(objectGroup);
          venue.setMapObjects(objectGroup.getObjects(), levelIndex);
        }
      }
    }
  }catch(error){
    console.log(error.message)
  }
}

/**
 * Boilerplate map initialization code starts below:
 */

// Step 1: initialize communication with the platform
// In your own code, replace variable window.apikey with your own apikey
var platform = new H.service.Platform({
  apikey: yourApikey
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

// Step 5: add the Indoor Map
addVenueToMap(map, platform);

// Step 6: add route to indoor map 
calculateIndoorRouteFromAtoB(map)
