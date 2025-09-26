
/**
 * The function add the "change" event listener to the map's style
 * and modifies colors of the map features within that listener.
 * @param  {H.Map} map      A HERE Map instance within the application
 */
function changeFeatureStyle(map) {
  // get the vector provider from the base layer
  var provider = map.getBaseLayer().getProvider();

  // get the style object for the base layer
  var defaultStyle = provider.getStyle();

  var changeListener = (evt) => {
    if (defaultStyle.getState() === H.map.render.harp.Style.State.READY) {
      defaultStyle.removeEventListener("change", changeListener);

      // query the configuration
      const config = defaultStyle.getConfig();

      // Update required items from the configuration
      config.definitions['Park.Color'] = "#2ba815";
      config.definitions['BuiltupArea.Color'] = "#676d67";

      // Create a new style with updated configuration and apply
      const newStyle = new H.map.render.harp.Style(config);
      map.getBaseLayer().getProvider().setStyle(newStyle);
    }
  };

  defaultStyle.addEventListener('change', changeListener);
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

//Step 2: initialize a map
var map = new H.Map(document.getElementById('map'),
  defaultLayers.vector.normal.map, {
  center: {lat: 52.51477270923461, lng: 13.39846691425174},
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
changeFeatureStyle(map);