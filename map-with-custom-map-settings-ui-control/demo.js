/**
 * Create a layer showing GeoJSON data on the map.
 */
function getGeoJSONLayer () {
  // Create GeoJSON reader which will download the specified file.
  // Shape of the file was obtained by using HERE Geocoding and Search API.
  // It is possible to customize look and feel of the objects.
  var reader = new H.data.geojson.Reader('data/berlin.json', {
    // This function is called each time parser detects a new map object
    style: function (mapObject) {
      // Parsed geo objects could be styled using setStyle method
      if (mapObject instanceof H.map.Polygon) {
        mapObject.setStyle({
          fillColor: 'rgba(255, 0, 0, 0.5)',
          strokeColor: 'rgba(0, 0, 255, 0.2)',
          lineWidth: 3
        });
      }
    }
  });

  // Start parsing the file
  reader.parse();

  // return layer which shows GeoJSON data on the map
  return reader.getLayer();
}

/**
 * Boilerplate map initialization code starts below:
 */

// Step 1: initialize communication with the platform
// In your own code, replace variable window.apikey with your own apikey

var platform = new H.service.Platform({
  apikey: window.apikey
});

// Step 2: create default layers using the created platform
var defaultLayers = platform.createDefaultLayers();

// Step 3: initialize a map
var map = new H.Map(document.getElementById('map'),
  defaultLayers.vector.normal.map, {
  center: {lat: 52.51477270923461, lng: 13.39846691425174},
  zoom: 13,
  pixelRatio: window.devicePixelRatio || 1
});
// add a resize listener to make sure that the map occupies the whole container
window.addEventListener('resize', () => map.getViewPort().resize());

//Step 4: make the map interactive
// MapEvents enables the event system
// Behavior implements default interactions for pan/zoom (also on mobile touch environments)
var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));

//Step 5: Setup Map Settings and other UI controls
var mapSettingsControl = new H.ui.MapSettingsControl({
  'baseLayers': [
    {
      'label': 'Map',
      'layer': defaultLayers.vector.normal.map
    },
    {
      'label': 'Satellite',
      'layer': [defaultLayers.hybrid.day.raster, defaultLayers.hybrid.day.vector]
    }
  ],
  'layers': [
    {
      'label': 'Berlin',
      'layer': getGeoJSONLayer()
    },
  ],
  'alignment': H.ui.LayoutAlignment.BOTTOM_RIGHT
});
var scalebarControl = new H.ui.ScaleBar({
  'alignment': H.ui.LayoutAlignment.BOTTOM_RIGHT
});
var zoomControl = new H.ui.ZoomControl({
  'alignment': H.ui.LayoutAlignment.RIGHT_BOTTOM
});

// Create the custom UI and add the controls
const ui = new H.ui.UI(map);
ui.addControl('zoom', zoomControl);
ui.addControl('mapsettings', mapSettingsControl);
ui.addControl('scalebar', scalebarControl);