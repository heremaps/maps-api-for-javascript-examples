/**
 * Shows how to create a custom zooming strategy,
 * using getCameraDataForBounds method for precomputing best zoom level and position.
 *
 * @param {H.Map} map A HERE Map instance within the application
 */
function setUpCustomZooming(map) {
  // create several circles to denote cities' population
  var clevelandCircle = new H.map.Circle(
    new H.geo.Point(41.4822, -81.6697), //center
    11703, // Radius proportional to 390,113 population
    {style: {fillColor: 'rgba(0, 255, 221, 0.66)'}}
  );
  var torontoCircle = new H.map.Circle(
    new H.geo.Point(43.7000, -79.4000), //center
    75090, // Radius proportional to 2.503 million population
    {style: {fillColor: 'rgba(0, 255, 221, 0.66)'}}
  );
  var chicagoCircle = new H.map.Circle(
    new H.geo.Point(41.8369, -87.6847), //center
    81570, // Radius proportional to 2.719 million population
    {style: {fillColor: 'rgba(0, 221, 255, 0.66)'}}
  );
  var newYorkCircle = new H.map.Circle(
    new H.geo.Point(40.7127, -74.0059), //center
    252180, // Radius proportional to 8.406 million population
    {style: {fillColor: 'rgba(221, 0, 255, 0.66)'}}
  );
  // define maximum zoom level for each circle
  clevelandCircle.setData({maxZoom: 7});
  torontoCircle.setData({maxZoom: 5});
  chicagoCircle.setData({maxZoom: 5});
  newYorkCircle.setData({maxZoom: 4});

  // create container for objects
  var container = new H.map.Group({
    objects: [clevelandCircle, torontoCircle, chicagoCircle, newYorkCircle]
  });

  // use the event delegation to handle 'tap' events on objects
  container.addEventListener('tap', function (evt) {
    var target = evt.target;
    // retrieve maximum zoom level
    var maxZoom = target.getData().maxZoom;
    // get the shape's bounding box and adjust the camera position
    map.getViewModel().setLookAtData({
      bounds: target.getBoundingBox()
    });
  });

  // add objects to the map
  map.addObject(container);
}


/**
 * Boilerplate map initialization code starts below:
 */

// Step 1: initialize communication with the platform
// In your own code, replace variable window.apikey with your own apikey
var platform = new H.service.Platform({
  apikey: window.apikey
});
var pixelRatio = window.devicePixelRatio || 1;
var defaultLayers = platform.createDefaultLayers({
  tileSize: pixelRatio === 1 ? 256 : 512,
  ppi: pixelRatio === 1 ? undefined : 320
});

// Step 2: initialize a map
var map = new H.Map(document.getElementById('map'), defaultLayers.vector.normal.map, {
  // initial center and zoom level of the map
  center: new H.geo.Point(41.4822, -81.6697),
  zoom: 4,
  pixelRatio: pixelRatio
});
// add a resize listener to make sure that the map occupies the whole container
window.addEventListener('resize', () => map.getViewPort().resize());

// Step 3: make the map interactive
// MapEvents enables the event system
// Behavior implements default interactions for pan/zoom (also on mobile touch environments)
var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));

// Step 4: main logic goes here
setUpCustomZooming(map);