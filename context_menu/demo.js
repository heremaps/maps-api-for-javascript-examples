/**
 * Adds context menus for the map and the created objects.
 * Context menu items can be different depending on the target.
 * That is why in this context menu on the map shows default items as well as
 * the "Add circle", whereas context menu on the circle itself shows the "Remove circle".
 *
 * @param {H.Map} map Reference to initialized map object
 */
function addContextMenus(map) {
  // First we need to subscribe to the "contextmenu" event on the map
  map.addEventListener('contextmenu', function (e) {
    // "contextmenu" event might be triggered not only by a pointer,
    // but a keyboard button as well. That's why ContextMenuEvent
    // doesn't have a "currentPointer" property.
    // Instead it has "viewportX" and "viewportY" properties
    // for the associates position.

    // Get geo coordinates from the screen coordinates.
    var coord  = map.screenToGeo(e.viewportX, e.viewportY);

    // In order to add menu items, you have to push them to the "items"
    // property of the event object. That has to be done synchronously, otherwise
    // the ui component will not contain them. However you can change the menu entry
    // text asynchronously.
    e.items.push(
      // Create a menu item, that has only a label,
      // which displays the current coordinates.
      new H.util.ContextItem({
        label: [
          Math.abs(coord.lat.toFixed(4)) + ((coord.lat > 0) ? 'N' : 'S'),
          Math.abs(coord.lng.toFixed(4)) + ((coord.lng > 0) ? 'E' : 'W')
        ].join(' ')
      }),
      // Create an item, that will change the map center when clicking on it.
      new H.util.ContextItem({
        label: 'Center map here',
        callback: function() {
          map.setCenter(coord, true);
        }
      }),
      // It is possible to add a seperator between items in order to logically group them.
      H.util.ContextItem.SEPARATOR,
      // This menu item will add a new circle to the map
      new H.util.ContextItem({
        label: 'Add circle',
        callback: addCircle.bind(map, coord)
      })
    );
  });
}

/**
 * Adds a circle which has a context menu item to remove itself.
 *
 * @this H.Map
 * @param {H.geo.Point} coord Circle center coordinates
 */
function addCircle(coord) {
  // Create a new circle object
  var circle = new H.map.Circle(coord, 5000),
      map = this;

  // Subscribe to the "contextmenu" eventas we did for the map.
  circle.addEventListener('contextmenu', function(e) {
    // Add another menu item,
    // that will be visible only when clicking on this object.
    //
    // New item doesn't replace items, which are added by the map.
    // So we may want to add a separator to between them.
    e.items.push(
      new H.util.ContextItem({
        label: 'Remove',
        callback: function() {
          map.removeObject(circle);
        }
      }),
      H.util.ContextItem.SEPARATOR
    );
  });

  // Make the circle visible, by adding it to the map
  map.addObject(circle);
}

/**
 * Boilerplate map initialization code starts below:
 */

// Step 1: initialize communication with the platform
var platform = new H.service.Platform({
  apikey: apikey
});
var defaultLayers = platform.createDefaultLayers();

// Step 2: initialize a map
var map = new H.Map(document.getElementById('map'), defaultLayers.vector.normal.map, {
  center: {lat: 52.55006203880433, lng: 13.27548854220585},
  zoom: 9
});

// Step 3: make the map interactive
// MapEvents enables the event system. Without it "contextmenu" event will not be triggered
// Behavior implements default interactions for pan/zoom (also on mobile touch environments)
var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));

// Step 4: create default UI with layers provided by the platform.
// Without this step a default context menu ui component will not be displayed.
var ui = H.ui.UI.createDefault(map, defaultLayers);

// Step 5: main logic
addContextMenus(map);