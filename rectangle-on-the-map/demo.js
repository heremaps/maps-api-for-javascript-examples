/**
 * Adds a rectangle to the map
 *
 * @param  {H.Map} map      A HERE Map instance within the application
 */
function addRectangleToMap(map) {
  var boundingBox = new H.geo.Rect(53.1, 13.1, 43.1, 40.1);
  map.addObject(
    new H.map.Rect(boundingBox, {
      style: {
        fillColor: '#FFFFCC',
        strokeColor: '#E8FA75',
        lineWidth: 8
      },
    })
  );
}



/**
 * Boilerplate map initialization code starts below:
 */

//Step 1: initialize communication with the platform
var platform = new H.service.Platform({
  app_id: window.app_id,
  app_code: window.app_code,
  useHTTPS: true
});
var pixelRatio = window.devicePixelRatio || 1;
var defaultLayers = platform.createDefaultLayers({
  tileSize: pixelRatio === 1 ? 256 : 512,
  ppi: pixelRatio === 1 ? undefined : 320
});

//Step 2: initialize a map - this map is centered over Europe
var map = new H.Map(document.getElementById('map'),
  defaultLayers.normal.map,{
  center: {lat: 53.1, lng: 13.1},
  zoom: 3,
  pixelRatio: pixelRatio
});
// add a resize listener to make sure that the map occupies the whole container
window.addEventListener('resize', () => map.getViewPort().resize());

//Step 3: make the map interactive
// MapEvents enables the event system
// Behavior implements default interactions for pan/zoom (also on mobile touch environments)
var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));

// Now use the map as required...
addRectangleToMap(map);