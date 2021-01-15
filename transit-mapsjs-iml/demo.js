// Define a valid apikey for Interactive Map Layer
const apikey = "wuhhFoo3HHQ8Bxw68fCZe8iA_J9v4dBnRhSbkAlMup4";
// HERE platform stores data in catalogs, define Here Resource Name (HRN) of the catalog
const catalogHrn = "hrn:here:data::olp-here:dh-showcase-dc-transit";
// A catalog is a collection of layers that managed as a single set, define the layer that stores data
const layerId = "dc-transit";

function overlay(map) {
    // Get access to Interactive Map Layer
    const service = platform.getXYZService({
        // authenticate with apiKey instead of token
        toBypassToken: true,
        // host of Interactive Map Layer
        host: 'interactive.data.api.platform.here.com',
        // path to endpoint of getting features in tile
        path: 'interactive/v1/catalogs/' + catalogHrn + '/layers'
    });

    // create a provider for the custom user defined data
    const imlProvider = new H.service.xyz.Provider(service, layerId);
    
    // get the style object for interactive map layer
    var style = imlProvider.getStyle();
    // query the sub-section of the style configuration
    var styleConfig = style.extractConfig(['xyz']);
    
    // set layer with Here Resource Name (HRN)
    styleConfig.layers.xyz.data.layer = catalogHrn + ':' + layerId;
    // change the color, for the description of the style section
    // see the Developer's guide
    styleConfig.layers.xyz.lines.draw.lines.color = '#0258AE';
    styleConfig.layers.xyz.lines.draw.lines.dash = [1, 1];
    styleConfig.layers.xyz.lines.draw.lines.width = [[5, 5000], [8, 800], [10, 200], [12, 160],[14, 60], [18, 20]]
    
    // merge the configuration back to the base layer configuration
    style.mergeConfig(styleConfig);

    const imlLayer = new H.map.layer.TileLayer(imlProvider);
    // add a layer to the map
    map.addLayer(imlLayer);
}

/**
 * Boilerplate map initialization code starts below:
 */

// Step 1: initialize communication with the platform
// In your own code, replace variable apikey with your own apikey
var platform = new H.service.Platform({
    "apikey": apikey
});
var defaultLayers = platform.createDefaultLayers();

// Step 2: initialize a map
var map = new H.Map(
    document.getElementById('map'), 
    defaultLayers.vector.normal.map, 
    {
        center: new H.geo.Point(38.90192, -76.97605),
        zoom: 12
    }
);
// add a resize listener to make sure that the map occupies the whole container
window.addEventListener('resize', () => map.getViewPort().resize());

// Step 3: make the map interactive
// MapEvents enables the event system
// Behavior implements default interactions for pan/zoom (also on mobile touch environments)
var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));

// Step 4: create the default UI component, for displaying bubbles
var ui = H.ui.UI.createDefault(map, defaultLayers);

// Step 5: Main logic goes here
overlay(map);