/**
 * Shows how to subscribe to different event type on different map objects
 *
 * @param {H.Map} map A HERE Map instance within the application
 * @param {Function} logEvent Custom function for logging events
 */
function testObjectsEvents(map, logEvent) {
  // Let's create the same style for all objects
  var style = {
    fillColor: 'rgba(35, 51, 129, 0.3)',
    lineWidth: 5,
    strokeColor: 'rgba(114, 38, 51, 1)'
  };

  // Create a rectangle map object
  var rect = new H.map.Rect(new H.geo.Rect(
    51.5072, 0, 48.8567, 2.3508
  ), {style: style});

  // Create a circle map object
  var circle = new H.map.Circle(
    new H.geo.Point(52.3667, 4.9000), //center
    198000, // Radius in meters
    {style: style}
  );

  // Create a polyline map object
  var polyline = new H.map.Polyline(new H.geo.LineString([
    52.5167, 13.3833, 0,
    50.0833, 14.4167, 0,
    52.2333, 21.0167, 0
  ]), {style: style});

  // Create a polygon map object
  var polygon = new H.map.Polygon(new H.geo.LineString([
    45.4667, 9.1833, 0,
    48.1333, 11.566, 0,
    50.0800, 8.2400, 0,
  ]), {style: style});

  // Create a standard marker
  var standardMarker = new H.map.Marker(new H.geo.Point(48.2000, 16.3667));

  // Create image marker object
  var imageMarker = new H.map.Marker(new H.geo.Point(53.5653, 10.0014), {
    icon: new H.map.Icon('img/marker-house.png')
  });

  // Let's give names to our objects and save it as data
  rect.setData('Rect');
  circle.setData('Circle');
  polyline.setData('Polyline');
  polygon.setData('Polygon');
  standardMarker.setData('Standard Marker');
  imageMarker.setData('Image Marker');

  // Now lets add out objects to the container for the conviniece of use
  var container = new H.map.Group({
    objects: [rect, circle, polyline, polygon, standardMarker, imageMarker]
  });

  // Subscribe to different events on every object
  rect.addEventListener('pointerenter', logEvent);
  rect.addEventListener('pointerdown', logEvent);
  circle.addEventListener('pointermove', logEvent);
  circle.addEventListener('pointerup', logEvent);
  polyline.addEventListener('pointermove', logEvent);
  polygon.addEventListener('tap', logEvent);
  polygon.addEventListener('longpress', logEvent);
  standardMarker.addEventListener('tap', logEvent);
  standardMarker.addEventListener('pointerleave', logEvent);
  imageMarker.addEventListener('pointerenter', logEvent);
  imageMarker.addEventListener('pointerleave', logEvent);
  imageMarker.addEventListener('dbltap', logEvent);

  // Add all of the above created map objects to the map's object collection
  // so they will be rendered onto the map.
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
  center: new H.geo.Point(51, 7),
  zoom: 5,
  pixelRatio: pixelRatio
});
// add a resize listener to make sure that the map occupies the whole container
window.addEventListener('resize', () => map.getViewPort().resize());

// Step 3: make the map interactive
// MapEvents enables the event system
// Behavior implements default interactions for pan/zoom (also on mobile touch environments)
var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));

// Step 4: Create the default UI:
var ui = H.ui.UI.createDefault(map, defaultLayers, 'en-US');

// Step 5: create custom logging facilities
var logContainer = document.createElement('ul');
logContainer.className ='log';
logContainer.innerHTML = '<li class="log-entry">Try clicking on elements</li>';
map.getElement().appendChild(logContainer);

// Helper for logging events
function logEvent(evt) {
  var entry = document.createElement('li');
  entry.className = 'log-entry';
  entry.textContent = ['event "', evt.type, '" @ '+ evt.target.getData()].join('');
  logContainer.insertBefore(entry, logContainer.firstChild);
}

// Step 6: main logic goes here
testObjectsEvents(map, logEvent);