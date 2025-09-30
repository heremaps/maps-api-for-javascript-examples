/**
 * Boilerplate map initialization code starts below:
 */

// Step 1: initialize communication with the platform
// In your own code, replace apikey value with your own apikey
var platform = new H.service.Platform({
    apikey: 'wuhhFoo3HHQ8Bxw68fCZe8iA_J9v4dBnRhSbkAlMup4'
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
// Add a resize listener to make sure that the map occupies the whole container
window.addEventListener('resize', () => map.getViewPort().resize());

// Step 3: make the map interactive
// MapEvents enables the event system
// Behavior implements default interactions for pan/zoom (also on mobile touch environments)
var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));

// Step 4: create the default UI component, for displaying bubbles
var ui = H.ui.UI.createDefault(map, defaultLayers);

// Step 5: Main logic goes here
addIml(map);

function addIml(map) {
    // HERE platform stores data in catalogs. Define Here Resource Name (HRN) of the catalog
    var catalogHrn = 'hrn:here:data::olp-here:dh-showcase-dc-transit';
    // A catalog is a collection of layers that are managed as a single set. Define the layer that stores data
    var layerId = 'dc-transit';
    // Instantiate the IML service
    var service = platform.getIMLService();
    // Create a provider for the custom user defined data
    var imlProvider = new H.service.iml.Provider(service, catalogHrn, layerId);

    // Add a tile layer to the map
    map.addLayer(new H.map.layer.TileLayer(imlProvider));
}