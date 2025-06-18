/**
 * A full list of available request parameters can be found in the Routing API documentation.
 * see: https://www.here.com/docs/bundle/routing-api-v8-api-reference/page/index.html#tag/Routing/operation/calculateRoutes
 */
const routeRequestParams = {
    routingMode: "fast",
    transportMode: "truck",
    origin: "40.7249546323,-74.0110042", // Manhattan
    destination: "40.7324386599,-74.0341396", // Newport
    return: "polyline",
    units: "imperial",
    spans: "truckAttributes",
  },
  routes = new H.map.Group();

function calculateRoutes(platform) {
  const router = platform.getRoutingService(null, 8);

  // The blue route showing a simple truck route
  calculateRoute(router, routeRequestParams, {
    strokeColor: "rgba(0, 128, 255, 0.7)",
    lineWidth: 10
  });

  // The fuchsia route showing a truck route to transport flammable hazardous goods
  // with 4 axles and a trailer.
  calculateRoute(
    router,
    Object.assign({}, routeRequestParams, {
      "vehicle[axleCount]": 4,
      "vehicle[trailerCount]": 1,
      "vehicle[hazardousGoods]": "flammable"
    }),
    {
      strokeColor: "rgba(255, 0, 255, 0.7)",
      lineWidth: 10
    }
  );
}

// Event handler used to enable vehicle restrictions on style load.
function enableVehicleRestrictions(event) {
  // Check the style state.
  if (event.target.getState() === H.map.render.Style.State.READY) {
    // Remove the attached event listener.
    event.target.removeEventListener(
      "change",
      enableVehicleRestrictions,
      false
    );
    const features = event.target.getEnabledFeatures();
    // Enable vehicle restrictions feature in "active & inactive" mode.
    event.target.setEnabledFeatures([
      ...features,
      { feature: "vehicle restrictions", mode: "active & inactive" },
    ]);
  }
}

/**
 * Calculates and displays a route.
 * @param {Object} params The Routing API request parameters
 * @param {H.service.RoutingService} router The service stub for requesting the Routing API
 * @param {mapsjs.map.SpatialStyle.Options} style The style of the route to display on the map
 */
function calculateRoute(router, params, style) {
  router.calculateRoute(
    params,
    function (result) {
      addRouteShapeToMap(style, result.routes[0]);
    },
    console.error
  );
}

/**
 * Boilerplate map initialization code starts below:
 */

// set up containers for the map  + panel
const mapContainer = document.getElementById("map");

// Step 1: initialize communication with the platform
// In your own code, replace variable window.apikey with your own apikey
const platform = new H.service.Platform({
  apikey: window.apikey
});

// Step 2: Specify the rendering engine.
// In this example, we use the HARP rendering engine.
// Note: HARP is not the default engine and is not included in mapsjs-core.js.
// To use HARP, ensure you include the mapsjs-harp.js script in your HTML.
const engineType = H.Map.EngineType["HARP"];

// Step 3: Create default map layers using the HARP engine.
const defaultLayers = platform.createDefaultLayers({ engineType });

// Step 4: Initialize the map using the HARP engine.
const map = new H.Map(mapContainer, defaultLayers.vector.normal.logistics, {
  engineType,
  center: { lat: 40.74539, lng: -74.022917 },
  zoom: 13.2,
  pixelRatio: window.devicePixelRatio || 1
});
const style = map.getBaseLayer().getProvider().getStyle();

// Step 5: Enable vehicle restrictions display on the map.
style.addEventListener("change", enableVehicleRestrictions);


// add a resize listener to make sure that the map occupies the whole container
window.addEventListener("resize", () => map.getViewPort().resize());

// Step 6: Enable map interactivity.
// MapEvents enables the map's event system.
// Behavior enables default user interactions such as pan and zoom,
// including support for touch gestures on mobile devices.
const behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));

map.addObject(routes);

/**
 * Creates a H.map.Polyline from the shape of the route and adds it to the map.
 * @param {Object} route A route as received from the H.service.RoutingService
 */
function addRouteShapeToMap(style, route) {
  route.sections.forEach((section) => {
    // decode LineString from the flexible polyline
    const linestring = H.geo.LineString.fromFlexiblePolyline(section.polyline);

    // Create a polyline to display the route:
    const polyline = new H.map.Polyline(linestring, {
      style
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
calculateRoutes(platform);
