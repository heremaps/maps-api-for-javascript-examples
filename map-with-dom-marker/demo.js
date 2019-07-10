    
/**
 * Create a marker that is capable of receiving DOM events and add it
 * to the map.
 *
 * @param  {H.Map} map      A HERE Map instance within the application
 */
function addDomMarker(map) {
  var outerElement = document.createElement('div'),
      innerElement = document.createElement('div');

  outerElement.style.userSelect = 'none';
  outerElement.style.webkitUserSelect = 'none';
  outerElement.style.msUserSelect = 'none';
  outerElement.style.mozUserSelect = 'none';
  outerElement.style.cursor = 'default';

  innerElement.style.color = 'red';
  innerElement.style.backgroundColor = 'blue';
  innerElement.style.border = '2px solid black';
  innerElement.style.font = 'normal 12px arial';
  innerElement.style.lineHeight = '12px'

  innerElement.style.paddingTop = '2px';
  innerElement.style.paddingLeft = '4px';
  innerElement.style.width = '20px';
  innerElement.style.height = '20px';

  // add negative margin to inner element
  // to move the anchor to center of the div
  innerElement.style.marginTop = '-10px';
  innerElement.style.marginLeft = '-10px';

  outerElement.appendChild(innerElement);

  // Add text to the DOM element
  innerElement.innerHTML = 'C';

  function changeOpacity(evt) {
    evt.target.style.opacity = 0.6;
  };

  function changeOpacityToOne(evt) {
    evt.target.style.opacity = 1;
  };

  //create dom icon and add/remove opacity listeners
  var domIcon = new H.map.DomIcon(outerElement, {
    // the function is called every time marker enters the viewport
    onAttach: function(clonedElement, domIcon, domMarker) {
      clonedElement.addEventListener('mouseover', changeOpacity);
      clonedElement.addEventListener('mouseout', changeOpacityToOne);
    },
    // the function is called every time marker leaves the viewport
    onDetach: function(clonedElement, domIcon, domMarker) {
      clonedElement.removeEventListener('mouseover', changeOpacity);
      clonedElement.removeEventListener('mouseout', changeOpacityToOne);
    }
  });

  // Marker for Chicago Bears home
  var bearsMarker = new H.map.DomMarker({lat: 41.8625, lng: -87.6166}, {
    icon: domIcon
  });
  map.addObject(bearsMarker);
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

//Step 2: initialize a map - this map is centered over Chicago.
var map = new H.Map(document.getElementById('map'),
  defaultLayers.vector.normal.map,{
  center: {lat:41.881944, lng:-87.627778},
  zoom: 11,
  pixelRatio: pixelRatio
});
// add a resize listener to make sure that the map occupies the whole container
window.addEventListener('resize', () => map.getViewPort().resize());

//Step 3: make the map interactive
// MapEvents enables the event system
// Behavior implements default interactions for pan/zoom (also on mobile touch environments)
var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));


// Now use the map as required...
addDomMarker(map);