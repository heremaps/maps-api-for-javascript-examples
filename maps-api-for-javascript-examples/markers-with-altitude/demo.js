
/**
 * Calculate the bicycle route.
 * @param   {H.service.Platform} platform    A stub class to access HERE services
 */
function calculateRouteFromAtoB (platform) {
  var router = platform.getRoutingService(null, 8),
      routeRequestParams = {
        routingMode: 'fast',
        transportMode: 'bicycle',
        origin: '-16.1647142,-67.7229166',
        destination: '-16.3705847,-68.0452683',
        return: 'polyline,elevation' // explicitly request altitude data
      };

  router.calculateRoute(
    routeRequestParams,
    onSuccess,
    onError
  );
}

/**
 * Process the routing response and visualise the descent with the help of the
 * H.map.Marker
 */
function onSuccess(result) {
  var route = result.routes[0];
  route.sections.forEach((section) => {
    let lineString = H.geo.LineString.fromFlexiblePolyline(section.polyline),
        group = new H.map.Group(),
        dict = {},
        polyline;

    let coords = lineString.getLatLngAltArray();

    for (let i = 2, len = coords.length; i < len; i += 3) {
      let elevation = coords[i];

      // normalize the altitude values for the color range
      var p = (elevation - 1000) / (4700 - 1000);
      var r = Math.round(255 * p);
      var b = Math.round(255 - 255 * p);

      // create or re-use icon
      var icon;
      if (dict[r + '_' + b]) {
        icon = dict[r + '_' + b];
      } else {
        var canvas = document.createElement('canvas');
        canvas.width = 4;
        canvas.height = 4;

        var ctx = canvas.getContext('2d'); 
        ctx.fillStyle = 'rgb(' + r + ', 0, ' + b + ')';
        ctx.fillRect(0, 0, 4, 4);
        icon = new H.map.Icon(canvas);
        // cache the icon for the future reuse
        dict[r + '_' + b] = icon;
      }

      // the marker is placed at the provided altitude
      var marker = new H.map.Marker({
        lat: coords[i - 2], lng: coords[i - 1], alt: elevation
      }, {icon: icon});
      group.addObject(marker);
    }

    polyline = new H.map.Polyline(lineString, {
      style: {
        lineWidth: 2,
        strokeColor: '#555555'
      }
    });
    // Add the polyline to the map
    map.addObject(polyline);
    // Add markers to the map
    map.addObject(group);
    // Zoom to its bounding rectangle
    map.getViewModel().setLookAtData({
      bounds: polyline.getBoundingBox(),
      tilt: 60
    });
  });
}

/**
 * This function will be called if a communication error occurs during the JSON-P request
 * @param  {Object} error  The error message received.
 */
function onError(error) {
  alert('Can\'t reach the remote server');
}

/**
 * Boilerplate map initialization code starts below:
 */

// set up containers for the map  + panel
var mapContainer = document.getElementById('map'),
  routeInstructionsContainer = document.getElementById('panel');

//Step 1: initialize communication with the platform
// In your own code, replace variable window.apikey with your own apikey
var platform = new H.service.Platform({
  apikey: window.apikey
});

var defaultLayers = platform.createDefaultLayers();

//Step 2: initialize a map - this map is centered over Berlin
var map = new H.Map(mapContainer,
  defaultLayers.vector.normal.map,{
  center: {lat:52.5160, lng:13.3779},
  zoom: 13,
  pixelRatio: window.devicePixelRatio || 1
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
calculateRouteFromAtoB (platform);
