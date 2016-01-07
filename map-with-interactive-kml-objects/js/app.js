/**
 * Display interactive map with objects loaded from a KML file
 *
 * Note that the maps data module http://js.api.here.com/v3/3.0/mapsjs-data.js
 * must be loaded for KML parsing to occcur
 *
 * @param {H.Map} map A HERE Map instance within the application
 * @param {H.ui.UI} ui Default ui component
 * @param {Function} renderControls Custom non-api function for rendering control buttons
 */
function renderSchoenefeldAirport(map, ui, renderControls) {
  // Create a reader object, that will load data from a KML file
  var reader = new H.data.kml.Reader('data/sxf.kml');

  // Request document parsing. Parsing is an asynchronous operation.
  reader.parse();

  reader.addEventListener('statechange', function () {
    // Wait till the KML document is fully loaded and parsed
    if (this.getState() === H.data.AbstractReader.State.READY) {
      var parsedObjects = reader.getParsedObjects();
      // Create a group from our objects to easily zoom to them
      var container = new H.map.Group({objects: parsedObjects});

      // First loaded object is a group of objects describing terminals.
      // So let's zoom to them by default
      map.setViewBounds(parsedObjects[0].getBounds());

      // Render buttons for zooming into parts of the airport.
      // Function is not a part of API. Scroll to the bottom to see the source.
      renderControls({
        // Key is a button label and value is an click/tap callback
        'Zoom to the terminals': function () {
          // First loaded object is a group of objects describing terminals
          map.setViewBounds(parsedObjects[0].getBounds(), true);
        },
        'Zoom to runway': function () {
          // Second loaded object is a group of objects describing the runway
          map.setViewBounds(parsedObjects[1].getBounds(), true);
        },
        'View All': function () {
          map.setViewBounds(container.getBounds(), true);
        }
      });

      // Let's make kml ballon visible by tap on its owner
      // Notice how we are using event delegation for it
      container.addEventListener('tap', function (evt) {
        var target = evt.target, position;

        // We need to calculated a position for our baloon
        if (target instanceof H.map.Polygon || target instanceof H.map.Polyline) {
          position = target.getBounds().getCenter();
        } else if (target instanceof H.map.Marker) {
          position = target.getPosition();
        }
        if (position) {
          // Let's use out custom (non-api) function for displaying a baloon
          showKMLBallon(position, target.getData());
        }
      });

      // Make objects visible by adding them to the map
      map.addObject(container);
    }
  });
}


/**
 * Boilerplate map initialization code starts below:
 */

// Step 1: initialize communication with the platform
var platform = new H.service.Platform({
  app_id: '{YOUR_APP_ID}',
  app_code: '{YOUR_APP_CODE}',
  useHTTPS: true,
  useCIT: true
});
var defaultLayers = platform.createDefaultLayers();

// Step 2: initialize a map
// Please note, that default layer is set to satellite mode
var map = new H.Map(document.getElementById('map'), defaultLayers.satellite.map, {
  zoom: 1
});

// Step 3: make the map interactive
// MapEvents enables the event system
// Behavior implements default interactions for pan/zoom (also on mobile touch environments)
var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));

// Template function for our controls
function renderControls(buttons) {
  var containerNode = document.createElement('div');
  containerNode.setAttribute('style', 'position:absolute;top:0;left:0;background-color:#fff; padding:10px;');
  containerNode.className = "btn-group";

  Object.keys(buttons).forEach(function (label) {
    var input = document.createElement('input');
    input.value = label;
    input.type = 'button';
    input.onclick = buttons[label];
    input.className="btn btn-sm btn-default"
    containerNode.appendChild(input);
  });

  map.getElement().appendChild(containerNode);
}

function showKMLBallon(position, data) {
  var content = data.balloonStyle.text;
  if (content) {
    // Styling of the balloon text.
    // The only supported wilde cards are $[text] and $[description].
    content = content
      .replace('$[name]', data.name || '')
      .replace('$[description]', data.description || '');

    // Note how we are caching our infoBubble instance
    // We create InfoBubble object only once and then reuse it
    var bubble = showKMLBallon.infoBubble;
    if (!bubble) {
      bubble = new H.ui.InfoBubble(position, {content: content});
      ui.addBubble(bubble);
      bubble.getContentElement().style.marginRight = "-24px";
      // Cache our instance for future use
      showKMLBallon.infoBubble = bubble;
    } else {
      bubble.setPosition(position);
      bubble.setContent(content);
      bubble.open();
    }
  }
}

// Step 4: create the default UI component, for displaying bubbles
var ui = H.ui.UI.createDefault(map, defaultLayers);

// Step 5: main logic goes here
renderSchoenefeldAirport(map, ui, renderControls);