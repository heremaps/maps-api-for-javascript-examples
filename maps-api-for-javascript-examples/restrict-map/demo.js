/**
 * Restricts a moveable map to a given rectangle.
 *
 * @param {H.Map} map   A HERE Map instance within the application
 *
 */
function restrictMap(map){

  var bounds = new H.geo.Rect(37.829, -122.426, 37.824, -122.42);

  map.getViewModel().addEventListener('sync', function() {
    var center = map.getCenter();

    if (!bounds.containsPoint(center)) {
      if (center.lat > bounds.getTop()) {
        center.lat = bounds.getTop();
      } else if (center.lat < bounds.getBottom()) {
        center.lat = bounds.getBottom();
      }
      if (center.lng < bounds.getLeft()) {
        center.lng = bounds.getLeft();
      } else if (center.lng > bounds.getRight()) {
        center.lng = bounds.getRight();
      }
      map.setCenter(center);
    }
  });

  //Debug code to visualize where your restriction is
  map.addObject(new H.map.Rect(bounds, {
    style: {
        fillColor: 'rgba(55, 85, 170, 0.1)',
        strokeColor: 'rgba(55, 85, 170, 0.6)',
        lineWidth: 8
      }
    }
  ));
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

//Step 2: initialize a map - this map is centered over Alcatraz Island
var map = new H.Map(document.getElementById('map'),
  defaultLayers.vector.normal.map,{
  center: {lat:37.82667, lng:-122.423333},
  zoom: 16,
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

restrictMap(map);