/**
 * @param  {H.Map} firstMap  A HERE Map instance within the application
 * @param  {H.Map} secondMap  A HERE Map instance within the application
 */

function displayBounds(firstMap, secondMap) {
  // get view model objects for both maps, view model contains all data and
  // utility functions that're related to map's geo state
  var viewModel1 = firstMap.getViewModel(),
      viewModel2 = secondMap.getViewModel(),
      polygon,
      marker;

  // create a polygon that will represent the visible area of the main map
  polygon = new H.map.Polygon(viewModel1.getLookAtData().bounds, {
    volatility: true
  });
  // create a marker that will represent the center of the visible area
  marker = new H.map.Marker(viewModel1.getLookAtData().position, {
    volatility: true
  });
  // add both objects to the map
  staticMap.addObject(polygon);
  staticMap.addObject(marker)

  // set up view change listener on the interactive map
  firstMap.addEventListener('mapviewchange', function() {
    // on every view change take a "snapshot" of a current geo data for
    // interactive map and set the zoom and position on the non-interactive map
    var data = viewModel1.getLookAtData();
    viewModel2.setLookAtData({
      position: data.position,
      zoom: data.zoom - 2
    });
    
    // update the polygon that represents the visisble area of the interactive map
    polygon.setGeometry(data.bounds);
    // update the marker that represent the center of the interactive map
    marker.setGeometry(data.position);
  });
}

/**
 * Boilerplate map initialization code starts below:
 */

// initialize communication with the platform
// In your own code, replace variable window.apikey with your own apikey
var platform = new H.service.Platform({
  apikey: window.apikey
});
// create two sets of the default layers for each map instance
var defaultLayers = platform.createDefaultLayers();
var defaultLayersSync = platform.createDefaultLayers();

// set up containers for the map

var mapContainer = document.createElement('div');
var staticMapContainer = document.createElement('div');

mapContainer.style.height = '300px';

staticMapContainer.style.position = 'absolute';
staticMapContainer.style.width = '600px';
staticMapContainer.style.height = '300px';

document.getElementById('map').appendChild(mapContainer);
document.getElementById('panel').appendChild(staticMapContainer);

// initialize a map, this map is interactive
var map = new H.Map(mapContainer,
  defaultLayers.vector.normal.map,{
  center: {lat: 52.5206970, lng: 13.40927320},
  zoom: 16
});
// add a resize listener to make sure that the map occupies the whole container
window.addEventListener('resize', () => map.getViewPort().resize());

// adjust tilt and rotation of the map
map.getViewModel().setLookAtData({
  tilt: 45,
  heading: 60
});

// initialize a map that will be synchronised
var staticMap = new H.Map(staticMapContainer,
  defaultLayersSync.vector.normal.map,{
  center: {lat: 53.430, lng: -2.961},
  zoom: 7
});

// MapEvents enables the event system
// Behavior implements default interactions for pan/zoom (also on mobile touch environments)
// create beahvior only for the first map
var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));

// Now use the map as required...
displayBounds(map, staticMap);
