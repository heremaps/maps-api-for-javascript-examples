/**
 * Example for Indoor Map for JSMapsApi.
 */

// Replace with your HERE platform app api key
var yourApikey = "ZKBUeAgkzH4JWhg93AA7cIE_kZotbMGhVI0_UYC0COY";

// Replace with your indoor map platform collection hrn
var indoorMapHrn =
  "hrn:here:data::org651595200:indoormap-ed6d5667-cfe0-4748-bbf5-88b00e7e3b21-collection";

// Replace with the venue id for your map. This example works for maps:
// 7348 - Zurich Airport
// 27158 - Tiefgarage Riem Arcaden APCOA Parking garage
// 22766 - Mall of Berlin
var venueId = "22766";

var infoBubble;

/**
 * Load and add indoor data on the map.
 *
 * @param  {H.Map} map A HERE Map instance
 */
function addVenueToMap(map) {
  // Get an instance of the Indoor Maps service using a valid apikey for Indoor Maps
  var venuesService = platform.getVenuesService({ apikey: yourApikey, hrn: indoorMapHrn });

  // Indoor Maps service provides a loadVenue method
  venuesService.loadVenue(venueId).then((venue) => {
    // add Indoor Maps data to the Indoor Maps provider
    venuesProvider.addVenue(venue);
    venuesProvider.setActiveVenue(venue);

    // create a tile layer for the Indoor Maps provider
    var venueLayer = new H.map.layer.TileLayer(venuesProvider);
    map.addLayer(venueLayer);

    // Set center of the map view to the center of the venue
    map.setCenter(venue.getCenter());

    // Create a level control
    var levelControl = new H.venues.ui.LevelControl(venue);
    ui.addControl("level-control", levelControl);

    // Create a drawing control:
    var drawingControl = new H.venues.ui.DrawingControl(venue);
    ui.addControl("drawing-control", drawingControl);

    // Enable highlighting geometries based on geometry name
    highlightGeometries(venue, "H&M");

    // Enable info bubble on tap of geometry
    enableBubbleOnTap();
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
var map = new H.Map(
  document.getElementById("map"),
  defaultLayers.vector.normal.map,
  {
    zoom: 18,
    center: { lat: 47.452353, lng: 8.562455 },
    pixelRatio: window.devicePixelRatio || 1,
  }
);

// add a resize listener to make sure that the map occupies the whole container
window.addEventListener("resize", () => map.getViewPort().resize());

// Step 3: make the map interactive
// MapEvents enables the event system
// Behavior implements default interactions for pan/zoom (also on mobile touch environments)
var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));

// Step 4: create the default UI component, for displaying bubbles
var ui = H.ui.UI.createDefault(map, defaultLayers);

// Indoor Maps provider interacts with a tile layer to visualize and control the Indoor Map
var venuesProvider = new H.venues.Provider();

// Step 5: add the Indoor Map
addVenueToMap(map);

/**
 * Function to search and highlight geometries
 *
 * @param {H.venues.Venue} venue
 * @param {H.venues.Provider} venuesProvider
 * @param {string} geometryForSearch The identifier of the geometry to be searched
 */
function highlightGeometries(venue, geometryForSearch) {
  var searchGeometries = venue.search(geometryForSearch);
  var highlightStyle = {
    fillColor: "#FFBF00",
    outlineColor: "#99cc00",
    outlineWidth: 0.2,
  };

  if (searchGeometries.length > 0) {
    venuesProvider.activeVenue.setHighlightedGeometries(
      true,
      searchGeometries,
      highlightStyle
    );
  }
}

/**
 * For a given location open an information popup and highlight the geometry
 * @param {H.geo.Point} position The position where to show the InfoBubble
 * @param {H.venues.Geometry} geometry The instance of Geometry to be highlighted
 */
var onGeometryTap = (position, geometry) => {
  var popUpContent = (geometry) =>
    `${geometry.getIdentifier()}: ${geometry.getName()} <br>`;

  if (!infoBubble) {
    infoBubble = new H.ui.InfoBubble(position, {
      onStateChange: (evt) => {
        if (evt.target.getState() === "closed") {
          // On closing the popup, remove highlight from the geometry
          venuesProvider
            .getActiveVenue()
            .setHighlightedGeometries(false, [evt.target.getData()]);
        }
      },
    });

    // Prepare the content of the InfoBubble
    var domElement = document.createElement("div");
    domElement.innerHTML = popUpContent(geometry);
    domElement.setAttribute("style", "width: max-content;");

    ui.addBubble(infoBubble);
  }

  // Set the new position of the InfoBubble
  infoBubble.setPosition(position);

  // Update its content
  infoBubble.getContentElement().innerHTML = popUpContent(geometry);

  // Set a new geometry in the data payload of the InfoBubble
  infoBubble.setData(geometry);

  // Highlight the geometry
  venuesProvider
    .getActiveVenue()
    .setHighlightedGeometries(true, [geometry], undefined, true);

  // Open the InfoBubble if geometry is not undefined
  return geometry ? infoBubble.open() : infoBubble.close();
};

/**
 * This function demonstrates how to add an event listener to the venue
 */
var enableBubbleOnTap = () => {
  venuesProvider.addEventListener("tap", (e) => {
    var geometry = e.target;
    if (geometry) {
      var position = map.screenToGeo(
        e.currentPointer.viewportX,
        e.currentPointer.viewportY
      );
      setTimeout(() => onGeometryTap(position, geometry), 0);
    }
  });
};
