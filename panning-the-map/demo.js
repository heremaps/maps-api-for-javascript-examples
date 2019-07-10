/**
 * Pan the map so that it is continually in motion
 *
 * @param  {H.Map} map      A HERE Map instance within the application
 */
function panTheMap(map) {
  var viewPort,
      incX = 1,
      incY = 2,
      x = 100,
      y = 100;

  // Obtain the view port object of the map to manipulate its screen coordinates
  var viewPort = map.getViewPort(),
      // function calculates new screen coordinates and calls
      // viewport's interaction method with them
      pan = function() {
        x = x + incX;
        if (Math.abs(x) > 100) {
          incX = -incX;
        }

        y = y + incY;
        if (Math.abs(y) > 100) {
          incY = -incY;
        }

        viewPort.interaction(x, y);
      };

  // set interaction modifier that provides information which map properties
  // change with each "interact" call
  viewPort.startInteraction(H.map.render.RenderEngine.InteractionModifiers.COORD, 0, 0);
  // set up simple animation loop
  setInterval(pan, 15);
}

/**
 * Boilerplate map initialization code starts below:
 */

//Step 1: initialize communication with the platform
// In your own code, replace variable window.apikey with your own apikey
var platform = new H.service.Platform({
  apikey: window.apikey
});
var pixelRatio = window.devicePixelRatio || 1;
var defaultLayers = platform.createDefaultLayers({
  tileSize: pixelRatio === 1 ? 256 : 512,
  ppi: pixelRatio === 1 ? undefined : 320
});

// Step 2: initialize a map
var map = new H.Map(document.getElementById('map'),
  defaultLayers.vector.normal.map,{
  center: {lat: 19.11, lng: 72.89},
  zoom: 4,
  pixelRatio: pixelRatio
});
// add a resize listener to make sure that the map occupies the whole container
window.addEventListener('resize', () => map.getViewPort().resize());

panTheMap(map);