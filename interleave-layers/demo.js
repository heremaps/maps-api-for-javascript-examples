
/**
 * The function add the "change" event listener to the map's style
 * and modifies colors of the map features within that listener.
 * @param  {H.Map} map      A HERE Map instance within the application
 */
function interleave(map){
  var provider = map.getBaseLayer().getProvider();

  // get the style object for the base layer
  var style = provider.getStyle();

  var changeListener = () => {
    if (style.getState() === H.map.Style.State.READY) {
      style.removeEventListener('change', changeListener);

      // create a provider and a layer that are placed under the buildings layer
      objectProvider = new H.map.provider.LocalObjectProvider();
      objectLayer = new H.map.layer.ObjectLayer(objectProvider);
      // add a circle to this provider the circle will appear under the buildings
      objectProvider.getRootGroup().addObject(new H.map.Circle(map.getCenter(), 500));
      // add the layer to the map
      map.addLayer(objectLayer);

      // extract buildings from the base layer config 
      // in order to inspect the config calling style.getConfig()
      buildings = new H.map.Style(style.extractConfig('buildings'));
      // create the new layer for the buildings
      buildingsLayer = platform.getOMVService().createLayer(buildings);
      // add the layer to the map
      map.addLayer(buildingsLayer);

      // the default object layer and its objects will remain on top of the buildings layer
      map.addObject(new H.map.Marker(map.getCenter()));
    }
  }

  style.addEventListener('change', changeListener);
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
  zoom: 16,
  pixelRatio: window.devicePixelRatio || 1
});
map.getViewModel().setLookAtData({tilt: 45});

// add a resize listener to make sure that the map occupies the whole container
window.addEventListener('resize', () => map.getViewPort().resize());

//Step 3: make the map interactive
// MapEvents enables the event system
// Behavior implements default interactions for pan/zoom (also on mobile touch environments)
var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));

// Now use the map as required...
interleave(map);