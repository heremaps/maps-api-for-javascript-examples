    
/**
 * The function add the "change" event listener to the map's style
 * and modifies colors of the map features within that listener.
 * @param  {H.Map} map      A HERE Map instance within the application
 */
function changeFeatureStyle(map){
  // get the vector provider from the base layer
  var provider = map.getBaseLayer().getProvider();

  // get the style object for the base layer
  var parkStyle = provider.getStyle();

  var changeListener = (evt) => {
    if (parkStyle.getState() === H.map.Style.State.READY) {
      parkStyle.removeEventListener('change', changeListener);

      // query the sub-section of the style configuration
      // the call removes the subsection from the original configuration
      var parkConfig = parkStyle.extractConfig(['landuse.park', 'landuse.builtup']);
      // change the color, for the description of the style section
      // see the Developer's guide
      parkConfig.layers.landuse.park.draw.polygons.color = '#2ba815'
      parkConfig.layers.landuse.builtup.draw.polygons.color = '#676d67'
    
      // merge the configuration back to the base layer configuration
      parkStyle.mergeConfig(parkConfig);
    }
  };

  parkStyle.addEventListener('change', changeListener);
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

//Step 2: initialize a map
var map = new H.Map(document.getElementById('map'),
  defaultLayers.vector.normal.map, {
  center: {lat: 52.51477270923461, lng: 13.39846691425174},
  zoom: 13,
  pixelRatio: pixelRatio
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
changeFeatureStyle(map);