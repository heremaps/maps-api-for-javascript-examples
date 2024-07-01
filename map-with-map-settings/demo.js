function getGeoJSONData () {
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
var platform = new H.service.Platform({
  apikey: window.apikey
});
var defaultLayers = platform.createDefaultLayers();

// Step 2: initialize a map
var map = new H.Map(document.getElementById('map'), defaultLayers.vector.normal.map, {
  zoom: 10,
  center: {lat: 52.522763341087874, lng: 13.492702024100026},
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
var myMapSettingsControl = new H.ui.MapSettingsControl({
  'baseLayers': [
    {
      'label': 'Map',
      'layer': defaultLayers.vector.normal.map
    }
    // {
    //   'label': 'Satellite',
    //   'layer': [defaultLayers.hybrid.day.raster, defaultLayers.hybrid.day.vector]
    // }
  ],
  'layers': [
    {
    'label': 'Countries',
    'layer': getGeoJSONData()
    },
  ],
  'alignment': H.ui.LayoutAlignment.BOTTOM_RIGHT
});

ui.removeControl('mapsettings');
const scalebarControl = ui.removeControl('scalebar'); 
ui.addControl('mapsettings', myMapSettingsControl);
ui.addControl('scalebar', scalebarControl);
