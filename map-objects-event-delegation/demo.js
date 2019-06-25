/**
 * Shows how to use events delegation in your projects
 *
 * @param {H.Map} map A HERE Map instance within the application
 * @param {Function} customLog Custom function for logging events
 */
function testDelegation(map) {
  // We create several markers and other map objects

  // Brandenburger tor in Berlin, Germany
  var brandenburgerTorMarker = new H.map.Marker(new H.geo.Point(52.516237, 13.377686));

  // Fernsehturm in Berlin, Germany
  var fernsehturmMarker = new H.map.Marker(new H.geo.Point(52.520816, 13.409417));
  // Circle with Altes Museum in Berlin as its center
  var circle = new H.map.Circle(
    new H.geo.Point(52.5194, 13.3986), //center
    250, // Radius in meters
    {
      style: {
        fillColor: 'rgba(0, 221, 255, 0.66)',
      }
    }
  );

  // Polygon containing Alexanderplatz and Fernsehturm in Berlin
  var polygon = new H.map.Polygon(new H.geo.LineString([
      52.51998, 13.40529, 0,
      52.52395, 13.41250, 0,
      52.52197, 13.41590, 0,
      52.51860, 13.40718, 0
    ]), {
      style: {
        lineWidth: 1,
        strokeColor: 'rgba(204, 34, 34, 0.66)',
        fillColor: 'rgba(204, 34, 34, 0.66)',
      }
    });

  // Purple polyline
  var polyline = new H.map.Polyline(new H.geo.LineString([
      52.521490, 13.387983, 0,
      52.517156, 13.388820, 0,
      52.516960, 13.385730, 0,
      52.515510, 13.386009, 0,
      52.515132, 13.381481, 0,
      52.516333, 13.380806, 0
    ]), {
      style: {
        strokeColor: 'rgba(34, 34, 204, 0.66)',
        lineWidth: 7
      }
    });

  // Let's give names to our objects and save it as data
  brandenburgerTorMarker.setData('I am Brandenburger Tor!');
  fernsehturmMarker.setData('I am Fernsehturm');
  circle.setData('I am Circle!');
  polygon.setData('I am Polygon!');
  polyline.setData('I am Polyline!');

  // We add our newly created makers and objects to the object container
  var container = new H.map.Group({
    objects: [brandenburgerTorMarker, fernsehturmMarker, circle, polygon, polyline]
  });

  // Instead of adding an event listener to every marker we are going
  // to use event delegation. We install one event handler on the
  // container that contains all of the objects.
  container.addEventListener('tap', function (evt) {
    // Now lets log the event
    customLog(evt.target.getData());
  });
  // Let's zoom to our objects by default
  map.setViewBounds(container.getBounds());
  // Make objects visible by adding them to the map
  map.addObject(container);
}


/**
 * Boilerplate map initialization code starts below:
 */

// Step 1: initialize communication with the platform
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

// Step 2: initialize a map
var map = new H.Map(document.getElementById('map'), defaultLayers.normal.map, {
  // initial center and zoom level of the map
  center: new H.geo.Point(52.51, 13.4),
  zoom: 10,
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
function customLog(log) {
  var entry = document.createElement('li');
  entry.className = 'log-entry';
  entry.textContent = log;
  logContainer.insertBefore(entry, logContainer.firstChild);
}

// Step 6: main logic goes here
testDelegation(map, customLog);