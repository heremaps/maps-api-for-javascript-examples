/**
 * @param  {H.Map} map A HERE Map instance within the application
 */
function addOverlayToMap(map) {
  var imgCounter = 0;

  // create an overlay that will use a weather map as a bitmap
  var overlay = new H.map.Overlay(
    new H.geo.Rect(
      70.72849153520343, -24.085683364175395,
      29.569664922291, 44.216452317817016
    ),
    rainRadar[imgCounter],
    {
      // the bitmap is frequently updated mark the object as volatile
      volatility: true
    }
  );

  // update overlay's bitmap every 250 milliseconds
  setInterval(function() {
    imgCounter = imgCounter < 10 ? ++imgCounter : 0;
    overlay.setBitmap(rainRadar[imgCounter]);
  }, 250);

  // add overlay to the map
  map.addObject(overlay);
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

//Step 2: initialize a map - this map is centered over Europe
var map = new H.Map(document.getElementById('map'),
  defaultLayers.vector.normal.map,{
  center: {lat: 53.1, lng: 13.1},
  zoom: 3,
  pixelRatio: window.devicePixelRatio || 1
});
// add a resize listener to make sure that the map occupies the whole container
window.addEventListener('resize', () => map.getViewPort().resize());

//Step 3: make the map interactive
// MapEvents enables the event system
// Behavior implements default interactions for pan/zoom (also on mobile touch environments)
var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));

// pre-load the bitmaps
var rainRadar = [];
(function() {
  var i = 0,
      img;
  for (; i <= 10; i++) {
    img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = 'https://heremaps.github.io/maps-api-for-javascript-examples/image-overlay/data/' + i + '.png';
    rainRadar.push(img);
  }
}());

// Now use the map as required...
addOverlayToMap(map);