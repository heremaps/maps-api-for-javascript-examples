/**
 * A full list of available request parameters can be found in the Routing API documentation.
 * see:  http://developer.here.com/rest-apis/documentation/routing/topics/resource-calculate-route.html
 */
var routeRequestParams = {
  mode: 'fastest;truck',
  waypoint0: 'geo!40.7249546323,-74.0110042', // Manhattan
  waypoint1: 'geo!40.7324386599,-74.0341396', // Newport
  representation: 'display',
  routeattributes : 'waypoints,summary,shape,legs',
  'metricSystem': 'imperial'
};

function calculateRoutes(platform) {
  var router = platform.getRoutingService();

  // The blue route showing a simple truck route
  calculateRoute(router, routeRequestParams, {
    strokeColor: 'rgba(0, 128, 255, 0.7)',
    lineWidth: 10
  });

  // The green route showing a truck route with a trailer
  calculateRoute(router, Object.assign(routeRequestParams, {
    trailersCount: 1
  }), {
    strokeColor: 'rgba(25, 150, 10, 0.7)',
    lineWidth: 7
  });

  // The violet route showing a truck route with a trailer
  calculateRoute(router, Object.assign(routeRequestParams, {
    trailersCount: 1,
    shippedHazardousGoods: 'flammable'
  }), {
    strokeColor: 'rgba(255, 0, 255, 0.7)',
    lineWidth: 5
  });
}

/**
 * Calculates and displays a route.
 * @param {Object} params The Routing API request parameters
 * @param {H.service.RoutingService} router The service stub for requesting the Routing API
 * @param {mapsjs.map.SpatialStyle.Options} style The style of the route to display on the map
 */
function calculateRoute (router, params, style) {
  router.calculateRoute(params, function(result) {
    addRouteShapeToMap(style, result.response.route[0]);
  }, console.error);
}

/**
 * Boilerplate map initialization code starts below:
 */

// set up containers for the map  + panel
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
  // Set truck restriction layer as a base map
  defaultLayers.vector.normal.truck,{
  center: {lat: 40.745390, lng: -74.022917},
  zoom: 13.2,
  pixelRatio: window.devicePixelRatio || 1
});
// add a resize listener to make sure that the map occupies the whole container
window.addEventListener('resize', () => map.getViewPort().resize());

// Step 3: make the map interactive
// MapEvents enables the event system
// Behavior implements default interactions for pan/zoom (also on mobile touch environments)
var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));


/**
 * Creates a H.map.Polyline from the shape of the route and adds it to the map.
 * @param {Object} route A route as received from the H.service.RoutingService
 */
function addRouteShapeToMap(style, route){
  var lineString = new H.geo.LineString(),
      routeShape = route.shape,
      polyline,
      div = document.createElement('div');

  div.innerHTML = route.summary.text;
  div.style.color = style.strokeColor;
  document.getElementById('panel').appendChild(div);

  routeShape.forEach(function(point) {
    var parts = point.split(',');
    lineString.pushLatLngAlt(parts[0], parts[1]);
  });

  polyline = new H.map.Polyline(lineString, {style});

  // Add the polyline to the map
  map.addObject(polyline);
}

// Now use the map as required...
calculateRoutes (platform);
