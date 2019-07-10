/**
 * Adds a polygon to the map
 *
 * @param  {H.Map} map      A HERE Map instance within the application
 */
function addPolygonToMap(map) {
  var geoPolygon = new H.geo.Polygon(
    // define exterior shape
    new H.geo.LineString([52, 13, 100, 48, 2, 100, 48, 16, 100, 52, 13, 100]),
    [ // define interior geometries - holes
      new H.geo.LineString([48.5, 4.5, 0, 49.5, 8, 0, 48.5, 9, 0]),
      new H.geo.LineString([48.5, 15, 0, 50, 11, 0, 51, 13, 0])
    ]
  );
  map.addObject(
    new H.map.Polygon(geoPolygon, {
      style: {
        fillColor: '#FFFFCC',
        strokeColor: '#829',
        lineWidth: 8
      }
    })
  );
}

/**
 * Boilerplate map initialization code starts below:
 */

//Step 1: initialize communication with the platform
// In your own code, replace variable window.apikey with your own apikey
var platform = new H.service.Platform({
  apikey: window.apikey
});
var pixelRatio = window.devicePixelRatio || 1;
var defaultLayers = platform.createDefaultLayers({
  tileSize: pixelRatio === 1 ? 256 : 512,
  ppi: pixelRatio === 1 ? undefined : 320
});

//Step 2: initialize a map - this map is centered over Europe
var map = new H.Map(document.getElementById('map'),
  defaultLayers.vector.normal.map,{
  center: {lat:52, lng:5},
  zoom: 5,
  pixelRatio: pixelRatio
});
// add a resize listener to make sure that the map occupies the whole container
window.addEventListener('resize', () => map.getViewPort().resize());

//Step 3: make the map interactive
// MapEvents enables the event system
// Behavior implements default interactions for pan/zoom (also on mobile touch environments)
var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));

// Create the default UI components
var ui = H.ui.UI.createDefault(map, defaultLayers);


// Now use the map as required...
addPolygonToMap(map);