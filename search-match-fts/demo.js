    
/**
 * Shows the search results from the electric vehicle charging stations layer
 * provided by Platform Data Extension REST API
 * https://developer.here.com/platform-extensions/documentation/platform-data/topics/introduction.html
 *
 * @param {Array.<string>} linkids Array of the LINK_IDs received from the routing service
 * @param {H.map.Polyline} polyline route polyline
 */
function findStations(linkids, polyline) {
  var service = platform.getPlatformDataService();

  // Create a search request object fir the EVCHARGING_POI layer with the bounding box of the polyline
  var req = new mapsjs.service.extension.platformData.SearchRequest(service, polyline.getBounds(), [{
    layerId: 'EVCHARGING_POI',
    level: 13
  }]);

  // event listener that matches Platform Data Extension data and routing results
  req.addEventListener('data', function(ev) {
    var table = ev.data,
        row,
        geometry,
        i = table.getRowCount();

    while(i--) {
      row = table.getRow(i);
      geometry = row.getCell('geometry');
      if (linkids.indexOf(row.getCell('LINK_ID')) !== -1) {
        map.addObject(new mapsjs.map.Marker({lat: geometry[0][0], lng: geometry[0][1]}, {icon: icon}));
      } else {
        map.addObject(new mapsjs.map.Marker({lat: geometry[0][0], lng: geometry[0][1]}));
      }
    }
  });

  req.send();
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

//Step 2: initialize a map  - not specificing a location will give a whole world view.
var map = new H.Map(document.getElementById('map'),
  defaultLayers.normal.map, {pixelRatio: pixelRatio});
// add a resize listener to make sure that the map occupies the whole container
window.addEventListener('resize', () => map.getViewPort().resize());

//Step 3: make the map interactive
// MapEvents enables the event system
// Behavior implements default interactions for pan/zoom (also on mobile touch environments)
var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));

// Create the default UI components
var ui = H.ui.UI.createDefault(map, defaultLayers);

// create the icon that's reused for the on the route charging stations
var svg =
      '<svg xmlns="http://www.w3.org/2000/svg" width="28px" height="36px">' +
      '<path d="M 19 31 C 19 32.7 16.3 34 13 34 C 9.7 34 7 32.7 7 31 C 7 29.3 9.7 28 13 28 C 16.3 28 19' +
      ' 29.3 19 31 Z" fill="#000" fill-opacity=".2"/>' +
      '<path d="M 13 0 C 9.5 0 6.3 1.3 3.8 3.8 C 1.4 7.8 0 9.4 0 12.8 C 0 16.3 1.4 19.5 3.8 21.9 L 13 31 L 22.2' +
      ' 21.9 C 24.6 19.5 25.9 16.3 25.9 12.8 C 25.9 9.4 24.6 6.1 22.1 3.8 C 19.7 1.3 16.5 0 13 0 Z" fill="#fff"/>' +
      '<path d="M 13 2.2 C 6 2.2 2.3 7.2 2.1 12.8 C 2.1 16.1 3.1 18.4 5.2 20.5 L 13 28.2 L 20.8 20.5 C' +
      ' 22.9 18.4 23.8 16.2 23.8 12.8 C 23.6 7.07 20 2.2 13 2.2 Z" fill="#090"/>' +
      '</svg>';
var options = {
  'size': new mapsjs.math.Size(28, 36),
  'anchor': new mapsjs.math.Point(14, 32),
  'hitArea': new mapsjs.map.HitArea(
      mapsjs.map.HitArea.ShapeType.POLYGON, [0, 16, 0, 7, 8, 0, 18, 0, 26, 7, 26, 16, 18, 34, 8, 34])
};
icon = new mapsjs.map.Icon(svg, options);

// Obtain routing service and create routing request parameters
var router = platform.getRoutingService(),
    routeRequestParams = {
      mode: 'fastest;car',
      representation: 'display',
      legattributes:'li',
      waypoint0: '52.50052646372371,13.313066285329796',
      waypoint1: '52.50386005040791,13.331453146169224',
      waypoint2: '52.51007033505061,13.375173108360826'
    };

// calculate route
router.calculateRoute(
  routeRequestParams,
  function(response) {
    var lineString = new H.geo.LineString(),
        route = response.response.route[0],
        routeShape = route.shape,
        polyline,
        linkids = [];

    // collect link ids for the later matching with the PDE data
    route.leg.forEach(function(leg) {
      leg.link.forEach(function(link) {
        linkids.push(link.linkId.substring(1));
      });
    })

	// create route poly;line
    routeShape.forEach(function(point) {
      var parts = point.split(',');
      lineString.pushLatLngAlt(parts[0], parts[1]);
    });
    polyline = new H.map.Polyline(lineString, {
      style: {
        lineWidth: 8,
        strokeColor: 'rgba(0, 128, 255, 0.7)'
      },
      arrows: new mapsjs.map.ArrowStyle()
    });

    map.addObject(polyline);
    map.setViewBounds(polyline.getBounds(), true);

    findStations(linkids, polyline)
  },
  function() {
    alert('Routing request error');
  }
);
