/**
 * This example overlays a historical map of Berlin
 * from 1789 on top of the base map.
 *
 * @param {H.Map} map A HERE Map instance within the application
 */
function overlayHistoricalBerlin(map) {
  // Create a tile provider from our images of historical Berlin
  var tileProvider = new H.map.provider.ImageTileProvider({
    // We have tiles only for zoom levels 12â€“15,
    // so on all other zoom levels only base map will be visible
    min: 12,
    max: 15,
    opacity: 0.5,
    getURL: function (column, row, zoom) {
      // If Berlin is not displayed, return a blank tile.
      if (((zoom == 12) && (row != 1343 || column != 2200)) ||
        ((zoom == 13) &&  (row < 2686 || column < 4400 || row > 2687 || column > 4401)) ||
        ((zoom == 14) && (row < 5372 || column < 8800 || row > 5375 || column > 8803)) ||
        ((zoom  == 15) && (row < 10744 || column < 17601 || row > 10750 || column > 17607))) {
        return 'tiles/blank.png';
      } else {
        // The Old Berlin Map Tiler follows the TMS URL specification.
        // By specification, tiles should be accessible in the following format:
        // http://server_address/zoom_level/x/y.png
        return 'tiles/'+ zoom+ '/'+ row + '/'+ column+ '.png';
      }
    }
  });
  // Unless you own the map tile source,
  // you need to comply with the licensing agreement of the map tile provider.
  // Often this means giving attribution or copyright acknowledgment to the owner,
  // even if the tiles are offered free of charge.
  tileProvider.getCopyrights = function (bounds, level) {
    // We should return an array of objects that implement H.map.ICopyright interface
    return [{
      label: "Overlay derived from <a href='http://commons.wikimedia.org/wiki/File%3AMap_de_berlin_1789_%28georeferenced%29.jpg' target='_blank'>WikiMedia Commons</a>",
      alt: 'Overlay Based on a WikiMedia Commons Image in the Public Domain'
    }];
  };
  // Now let's create a layer that will consume tiles from our provider
  var overlayLayer = new H.map.layer.TileLayer(tileProvider, {
    // Let's make it semi-transparent
    opacity: 0.5
  });

  // Finally add our layer containing old Berlin to a map
  map.addLayer(overlayLayer);
}
/**
 * Boilerplate map initialization code starts below:
 */

// Step 1: initialize communication with the platform
// In your own code, replace variable window.apikey with your own apikey
var platform = new H.service.Platform({
  apikey: window.apikey,
  useHTTPS: true,
  useCIT: true
});
var defaultLayers = platform.createDefaultLayers();

// Step 2: initialize a map
var map = new H.Map(document.getElementById('map'), defaultLayers.vector.normal.map, {
  center: new H.geo.Point(52.515, 13.405),
  zoom: 14
});
// add a resize listener to make sure that the map occupies the whole container
window.addEventListener('resize', () => map.getViewPort().resize());

// Step 3: make the map interactive
// mapEvents enables the event system
// behavior implements default interactions for pan/zoom (also on mobile touch environments)
var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));

// Step 4: create the default UI component, for displaying bubbles
var ui = H.ui.UI.createDefault(map, defaultLayers);

// Step 5: Main logic goes here
overlayHistoricalBerlin(map);