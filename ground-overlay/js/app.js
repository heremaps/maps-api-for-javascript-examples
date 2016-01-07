
/**
 * Displays an image showing the allied occupation sectors in Berlin
 * after the Second World War,
 *
 * @param {H.Map} map   A HERE Map instance within the application
 *
 */
function addGroundOverlay(map){

  // This is the location of the ground overlay - i.e. the city of Berlin.
  var berlinBounds = new H.geo.Rect(52.687, 13.06, 52.328, 13.78),
  // Create an image node in the DOM to be used
    image = document.createElement('img');

  image.style.position = "absolute";
  image.style.opacity = "0.8";
  image.src = './img/berlin-sector.png'; // This is the image itself

  // this function updates the image whenever something changes
   updateOverlay = function() {
    // project the rectangle's geo-coords to screen space
    var topLeft = map.geoToScreen(berlinBounds.getTopLeft()),
      bottomRight = map.geoToScreen(berlinBounds.getBottomRight()),
      offsetX = topLeft.x,
      offsetY = topLeft.y,
      width = bottomRight.x - topLeft.x,
      height = bottomRight.y - topLeft.y;

    // set image position and size
    image.style.top = offsetY + "px";
    image.style.left = offsetX + "px";
    image.style.width = width + "px";
    image.style.height = height + "px";
  };

  // append the DOM element to the map
  map.getViewPort().element.appendChild(image);

  // update whenever viewport or viewmodel changes
  map.getViewPort().addEventListener('sync', updateOverlay);
  map.getViewModel().addEventListener('sync', updateOverlay);

  // zoom to rectangle (just to get the overlay nicely into view)
  map.setViewBounds(berlinBounds);
}

/**
 * Boilerplate map initialization code starts below:
 */

//Step 1: initialize communication with the platform
var platform = new H.service.Platform({
  app_id: '{YOUR_APP_ID}',
  app_code: '{YOUR_APP_CODE}',
  useCIT: true,
  useHTTPS: true
});
var defaultLayers = platform.createDefaultLayers();

//Step 2: initialize a map - this map is centered over Berlin
var map = new H.Map(document.getElementById('map'),
  defaultLayers.normal.map,{
  center: {lat:52.5159, lng:13.3777},
  zoom: 12
});



//Step 3: make the map interactive
// MapEvents enables the event system
// Behavior implements default interactions for pan/zoom (also on mobile touch environments)
var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));

// Step 4: Create the default UI:
var ui = H.ui.UI.createDefault(map, defaultLayers, 'en-US');

addGroundOverlay(map);