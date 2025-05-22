/**
 * Adds hoverable polygons to a HERE map using geoJSON data.
 *
 * @param {H.Map} map - A HERE Map instance.
 */
function PolygonHovering(map) {
  const selectedStyle = new H.map.SpatialStyle({
    lineWidth: 2,
    strokeColor: 'red',
    fillColor: 'green'
  });

  const defaultStyle = new H.map.SpatialStyle({
    lineWidth: 1,
    strokeColor: 'rgba(0,85,170,.6)',
    fillColor: 'rgba(0,85,170,.4)'
  });

  // Load and parse the GeoJSON data
  const reader = new H.data.geojson.Reader('data/germany-states.geojson', {
    style: (feature) => {
      // Setting Volatile to true, to enable style changes at runtime
      feature.setVolatility(true);
      feature.setStyle(defaultStyle);
    },
    disableLegacyMode: true
  });

  reader.parse();
  const layer = reader.getLayer();
  map.addLayer(layer);

  let activeObject = null;

  // Pointer move listener for hover styling
  layer.getProvider().addEventListener('pointermove', (e) => {
    const target = e.target;
    if (target instanceof H.map.Object && target !== activeObject) {
      if (activeObject) {
        activeObject.setStyle(defaultStyle);
      }
      target.setStyle(selectedStyle);
      activeObject = target;
    }
  });

  // Optional: Reset style on pointerleave
  layer.getProvider().addEventListener('pointerleave', () => {
    if (activeObject) {
      activeObject.setStyle(defaultStyle);
      activeObject = null;
    }
  });
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
var map = new H.Map(document.getElementById('map'), defaultLayers.vector.normal.map, {
  zoom: 5,
  center: {lat: 50.89317884049538, lng: 9.163701875411466},
  pixelRatio: window.devicePixelRatio || 1
});
// add a resize listener to make sure that the map occupies the whole container
window.addEventListener('resize', () => map.getViewPort().resize());


// Step 3: make the map interactive
// MapEvents enables the event system
// Behavior implements default interactions for pan/zoom (also on mobile touch environments)
var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));

// Create the default UI components
var ui = H.ui.UI.createDefault(map, defaultLayers);

// Step 4: Add geo polygon with hovering styles
PolygonHovering(map);
