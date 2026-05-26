function showGPXData(map) {

  // Simple inline SVG icons keyed by waypoint <sym> values.
  const symbolIcons = {
    'Start': new H.map.Icon(
      '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28">' +
      '<circle cx="14" cy="14" r="10" fill="#1f78b4" stroke="#fff" stroke-width="2"/>' +
      '</svg>',
      {
        anchor: { 'x': 14, 'y': 14 }
      }
    ),
    'Delivery': new H.map.Icon(
      '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28">' +
      '<circle cx="14" cy="14" r="10" fill="#fdaf61" stroke="#fff" stroke-width="2"/>' +
      '</svg>',
      {
        anchor: { 'x': 14, 'y': 14 }
      }
    ),
    'Stop': new H.map.Icon(
      '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28">' +
      '<circle cx="14" cy="14" r="10" fill="#b41f1f" stroke="#fff" stroke-width="2"/>' +
      '</svg>',
      {
        anchor: { 'x': 14, 'y': 14 }
      }
    )
  };

  const getColorForAverageSpeed = (avg) => {
    if (avg === undefined) {
      return '#999999';
    }
    if (avg < 25) {
      return '#1fb444b8';
    }
    if (avg < 35) {
      return '#007fefb8';
    }
    return '#d7191cb8';
  }

  /**
   * The demo highlights following customization techniques:
   *   - waypoints are rendered with SVG icons chosen from each `<wpt>`'s `sym` value;
   *   - track segments are styled individually based on the average `<speed>` of their points (`enableIndividualTrackSegmentStyling: true`).
   */

  // Create GPX reader which will download the specified file.
  // The file was created by using HERE WaypointSequence and Routing API.
  // It is possible to customize look and feel of the objects.

  var reader = new H.data.gpx.Reader(
    "https://heremaps.github.io/maps-api-for-javascript-examples/display-gpx-on-map/data/truck.gpx",
    {
      // Enable this flag so that we can style tracks with different color
      enableIndividualTrackSegmentStyling: true,

      // This function is called each time parser detects a new map object
      style: function (mapObject) {
        const data = mapObject.getData();
        switch (data.featureType) {
          // Set icon based on symbol type
          case 'waypoint':
            const icon = symbolIcons[data.sym];
            if (icon) {
              mapObject.setIcon(icon);
            }
            break;
          case 'track_segment':
            // Color based on speeds
            const speeds = data.pointsMetaInfo.map((p) => p.speed);
            const avg = speeds.reduce((a, b) => a + b, 0) / speeds.length || undefined;
            const color = getColorForAverageSpeed(avg);
            mapObject.setStyle({
              lineWidth: 6,
              strokeColor: color
            });
            break;
        }
      },
    }
  );

  // Start parsing the file
  reader.parse();

  // Add layer which shows GPX data on the map
  map.addLayer(reader.getLayer());
}

/**
 * Boilerplate map initialization code starts below:
 */
// Step 1: initialize communication with the platform
var platform = new H.service.Platform({
  apikey: window.apikey
});
var defaultLayers = platform.createDefaultLayers();

// Step 2: initialize a map
var map = new H.Map(
  document.getElementById("map"),
  defaultLayers.vector.normal.map,
  {
    zoom: 12,
    center: { lat: 52.507400461217564, lng: 13.423222081779844 },
    pixelRatio: window.devicePixelRatio || 1,
  }
);
// add a resize listener to make sure that the map occupies the whole container
window.addEventListener("resize", () => map.getViewPort().resize());

// Step 3: make the map interactive
// MapEvents enables the event system
// Behavior implements default interactions for pan/zoom (also on mobile touch environments)
var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));

// Create the default UI components
var ui = H.ui.UI.createDefault(map, defaultLayers);

showGPXData(map);
