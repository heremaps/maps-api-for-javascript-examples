/**
 * Calculates and displays an area reachable for the given parameters of the EV vehicle
 *
 * A full list of available request parameters can be found in the Routing API documentation.
 * see: https://www.here.com/docs/bundle/isoline-routing-api-v8-api-reference/page/index.html#tag/Isoline
 *
 * @param {H.service.Platform} platform A stub class to access HERE services
 */
function calculateIsolineRoute(platform) {
  var router = platform.getRoutingService(null, 8),
      routeRequestParams = {
        'origin': '52.51605,13.37787',
        'range[type]': 'consumption',
        'range[values]': 20000,
        'transportMode': 'car',
        'ev[freeFlowSpeedTable]': '0,0.239,27,0.239,45,0.259,60,0.196,75,0.207,90,0.238,100,0.26,110,0.296,120,0.337,130,0.351,250,0.351',
        'ev[trafficSpeedTable]': '0,0.349,27,0.319,45,0.329,60,0.266,75,0.287,90,0.318,100,0.33,110,0.335,120,0.35,130,0.36,250,0.36',
        'ev[ascent]': 9,
        'ev[descent]': 4.3,
        'ev[auxiliaryConsumption]': 1.8
      };

  // add a marker to display a starting point of the vehicle
  map.addObject(new H.map.Marker({
    lat: 52.51605,
    lng: 13.37787
  }));

  router.calculateIsoline(
    routeRequestParams,
    onSuccess,
    onError
  );
}

/**
 * This function will be called once the Routing REST API provides a response
 * @param {Object} result A JSON object representing the calculated range.
 */
function onSuccess(result) {
  var route = result.isolines[0];

  /*
   * The styling of the route response on the map is entirely under the developer's control.
   * A representative styling can be found the full JS + HTML code of this example
   * in the functions below:
   */
  addRouteShapeToMap(route);
}

/**
 * This function will be called if a communication error occurs during the JSON-P request
 * @param {Object} error The error message received.
 */
function onError(error) {
  alert('Can\'t reach the remote server');
}

/**
 * Boilerplate map initialization code starts below:
 */

// set up containers for the map + panel
var mapContainer = document.getElementById('map'),
  routeInstructionsContainer = document.getElementById('panel');

// Step 1: initialize communication with the platform
// In your own code, replace variable window.apikey with your own apikey
var platform = new H.service.Platform({
  apikey: window.apikey
});

var defaultLayers = platform.createDefaultLayers();

// Step 2: initialize a map - this map is centered over Berlin
var map = new H.Map(mapContainer,
  defaultLayers.vector.normal.map, {
  center: {lat: 52.5160, lng: 13.3779},
  zoom: 13,
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

/**
 * Creates a H.map.Polyline from the shape of the route and adds it to the map.
 * @param {Object} route A route as received from the H.service.RoutingService
 */
function addRouteShapeToMap(route) {
  route.polygons.forEach((section) => {
    // decode LineString from the flexible polyline
    let linestring = H.geo.LineString.fromFlexiblePolyline(section.outer);

    // Create a polygon to display the area
    let polygon = new H.map.Polygon(new H.geo.Polygon(linestring), {
      style: {
        lineWidth: 4,
        strokeColor: 'rgba(0, 128, 0, 0.7)'
      }
    });

    // Add the polygon to the map
    map.addObject(polygon);
    // And zoom to its bounding rectangle
    map.getViewModel().setLookAtData({
      bounds: polygon.getBoundingBox()
    });
  });
}

// Now use the map as required...
calculateIsolineRoute(platform);
