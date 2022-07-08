/**
 * Adds resizable geo polygon to map
 *
 * @param {H.Map} map                      A HERE Map instance within the application
 */
function createResizablePolygon(map) {
  var svgCircle = '<svg width="20" height="20" version="1.1" xmlns="http://www.w3.org/2000/svg">' +
      '<circle cx="10" cy="10" r="7" fill="transparent" stroke="red" stroke-width="4"/>' +
      '</svg>',
      polygon = new H.map.Polygon(
        new H.geo.Polygon(new H.geo.LineString([51.2, 21.51, 0, 51.2, 25.6, 0, 49.2, 25.9, 0, 48.7, 22.5, 0, 49.9, 24, 0, 50.5, 24, 0])),
        {
          style: {fillColor: 'rgba(150, 100, 0, .8)', lineWidth: 0}
        }
      ),
      verticeGroup = new H.map.Group({
        visibility: false
      }),
      mainGroup = new H.map.Group({
        volatility: true, // mark the group as volatile for smooth dragging of all it's objects
        objects: [polygon, verticeGroup]
      }),
      polygonTimeout;

  // ensure that the polygon can receive drag events
  polygon.draggable = true;

  // create markers for each polygon's vertice which will be used for dragging
  polygon.getGeometry().getExterior().eachLatLngAlt(function(lat, lng, alt, index) {
    var vertice = new H.map.Marker(
      {lat, lng},
      {
        icon: new H.map.Icon(svgCircle, {anchor: {x: 10, y: 10}})
      }
    );
    vertice.draggable = true;
    vertice.setData({'verticeIndex': index})
    verticeGroup.addObject(vertice);
  });

  // add group with polygon and it's vertices (markers) on the map
  map.addObject(mainGroup);

  // event listener for main group to show markers if moved in with mouse (or touched on touch devices)
  mainGroup.addEventListener('pointerenter', function(evt) {
    if (polygonTimeout) {
      clearTimeout(polygonTimeout);
      polygonTimeout = null;
    }

    // show vertice markers
    verticeGroup.setVisibility(true);
  }, true);

  // event listener for main group to hide vertice markers if moved out with mouse (or released finger on touch devices)
  // the vertice markers are hidden on touch devices after specific timeout
  mainGroup.addEventListener('pointerleave', function(evt) {
    var timeout = (evt.currentPointer.type == 'touch') ? 1000 : 0;

    // hide vertice markers
    polygonTimeout = setTimeout(function() {
      verticeGroup.setVisibility(false);
    }, timeout);
  }, true);

  // event listener for vertice markers group to change the cursor to pointer
  verticeGroup.addEventListener('pointerenter', function(evt) {
    document.body.style.cursor = 'pointer';
  }, true);

  // event listener for vertice markers group to change the cursor to default
  verticeGroup.addEventListener('pointerleave', function(evt) {
    document.body.style.cursor = 'default';
  }, true);

  // event listener for vertice markers group to resize the geo polygon object if dragging over markers
  verticeGroup.addEventListener('drag', function(evt) {
    var pointer = evt.currentPointer,
        geoLineString = polygon.getGeometry().getExterior(),
        geoPoint = map.screenToGeo(pointer.viewportX, pointer.viewportY);

    // set new position for vertice marker
    evt.target.setGeometry(geoPoint);

    // set new position for polygon's vertice
    geoLineString.removePoint(evt.target.getData()['verticeIndex']);
    geoLineString.insertPoint(evt.target.getData()['verticeIndex'], geoPoint);
    polygon.setGeometry(new H.geo.Polygon(geoLineString));

    // stop propagating the drag event, so the map doesn't move
    evt.stopPropagation();
  }, true);
}

/**
 * Boilerplate map initialization code starts below:
 */

//Step 1: initialize communication with the platform
// In your own code, replace variable window.apikey with your own apikey
var platform = new H.service.Platform({
  apikey: window.apikey
});
var defaultLayers = platform.createDefaultLayers();

//Step 2: initialize a map - this map is centered over Boston
var map = new H.Map(document.getElementById('map'),
  defaultLayers.vector.normal.map, {
  center: {lat: 50, lng: 24},
  zoom: 6,
  pixelRatio: window.devicePixelRatio || 1
});
// add a resize listener to make sure that the map occupies the whole container
window.addEventListener('resize', () => map.getViewPort().resize());

//Step 3: make the map interactive
// MapEvents enables the event system
// Behavior implements default interactions for pan/zoom (also on mobile touch environments)
var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));

// Step 4: Create the default UI:
var ui = H.ui.UI.createDefault(map, defaultLayers, 'en-US');

// Step 5: Add resizable geo polygon
createResizablePolygon(map);
