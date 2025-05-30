/**
 * A full list of available request parameters can be found in the Routing API documentation.
 * see: https://www.here.com/docs/bundle/routing-api-v8-api-reference/page/index.html#tag/Routing/operation/calculateRoutes
 */
var routeRequestParams = {
      routingMode: 'fast',
      transportMode: 'truck',
      origin: '40.7249546323,-74.0110042', // Manhattan
      destination: '40.7324386599,-74.0341396', // Newport
      return: 'polyline,travelSummary',
      units: 'imperial',
      spans: 'truckAttributes'
    },
    routes = new H.map.Group();

function calculateRoutes(platform) {
  var router = platform.getRoutingService(null, 8);

  // The blue route showing a simple truck route
  calculateRoute(router, routeRequestParams, {
    strokeColor: 'rgba(0, 128, 255, 0.7)',
    lineWidth: 10
  });

  // The green route showing a truck route with a trailer
  calculateRoute(router, Object.assign(routeRequestParams, {
    'truck[axleCount]': 4,
  }), {
    strokeColor: 'rgba(25, 150, 10, 0.7)',
    lineWidth: 7
  });

  // The violet route showing a truck route with a trailer
  calculateRoute(router, Object.assign(routeRequestParams, {
    'truck[axleCount]': 5,
    'truck[shippedHazardousGoods]': 'flammable'
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
    addRouteShapeToMap(style, result.routes[0]);
  }, console.error);
}

/**
 * Boilerplate map initialization code starts below:
 */

// set up containers for the map  + panel
var mapContainer = document.getElementById('map');

// Step 1: initialize communication with the platform
// In your own code, replace variable window.apikey with your own apikey
var platform = new H.service.Platform({
  apikey: window.apikey
});

// Step 2: specify engine type. In this example, we use HARP rendering engine.
// HARP engine is not the default engine, and it's not included in the mapsjs-core.js module.
// To use this engine, you need to include mapsjs-harp.js file to your HTML page
var engineType = H.Map.EngineType['HARP'];

// Step 3: create default layers using engine type HARP.
var defaultLayers = platform.createDefaultLayers({engineType});

// Step 4: initialize a map using engine type HARP.
var map = new H.Map(mapContainer,
  defaultLayers.vector.normal.logistics, {
  engineType,
  center: {lat: 40.745390, lng: -74.022917},
  zoom: 13.2,
  pixelRatio: window.devicePixelRatio || 1
});

// Step 5: Enable the vehicle restrictions feature and set active and inactive mode.
// This will show truck restiction icons on the map.
setTimeout(() => {
  map.getBaseLayer().getProvider().getStyle().setEnabledFeatures([
    {feature: "vehicle restrictions", mode: "active & inactive"}
  ]);
}, 500);

// add a resize listener to make sure that the map occupies the whole container
window.addEventListener('resize', () => map.getViewPort().resize());

// Step 6: make the map interactive
// MapEvents enables the event system
// Behavior implements default interactions for pan/zoom (also on mobile touch environments)
var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));

map.addObject(routes);

/**
 * Creates a H.map.Polyline from the shape of the route and adds it to the map.
 * @param {Object} route A route as received from the H.service.RoutingService
 */
function addRouteShapeToMap(style, route){
  route.sections.forEach((section) => {
    // decode LineString from the flexible polyline
    let linestring = H.geo.LineString.fromFlexiblePolyline(section.polyline);

    // Create a polyline to display the route:
    let polyline = new H.map.Polyline(linestring, {
      style: style
    });

    // Add the polyline to the map
    routes.addObject(polyline);
    // And zoom to its bounding rectangle
    map.getViewModel().setLookAtData({
      bounds: routes.getBoundingBox()
    });
  });
}

// Now use the map as required...
calculateRoutes (platform);
