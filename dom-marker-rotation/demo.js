/**
 * Boilerplate map initialization code starts below:
 */

// set up containers for the map  + panel
var mapContainer = document.getElementById("map"),
  routeInstructionsContainer = document.getElementById("panel");

//Step 1: initialize communication with the platform
// In your own code, replace variable window.apikey with your own apikey
var platform = new H.service.Platform({
  apikey: window.apikey
});

var defaultLayers = platform.createDefaultLayers();

//Step 2: initialize a map - this map is centered over Berlin
var map = new H.Map(mapContainer, defaultLayers.vector.normal.map, {
  center: { lat: 50.90978, lng: 10.87203 },
  zoom: 6,
  pixelRatio: window.devicePixelRatio || 1,
});
// add a resize listener to make sure that the map occupies the whole container
window.addEventListener("resize", function () {
  map.getViewPort().resize();
});

//Step 3: make the map interactive
// MapEvents enables the event system
// Behavior implements default interactions for pan/zoom (also on mobile touch environments)
var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));

// Create the default UI components
var ui = H.ui.UI.createDefault(map, defaultLayers);

/**
 * Create DOM Marker and rotate
 */
function rotateDomMarker() {
  var domIconElement = document.createElement("div"),
    interval,
    counter = 0;

  // set the anchor using margin css property depending on the content's (svg element below) size
  // to make sure that the icon's center represents the marker's geo position
  domIconElement.style.margin = "-20px 0 0 -20px";
  domIconElement.id = "domMarker";

  // add content to the element
  domIconElement.innerHTML = `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="40" height="40">
      <path d="m0.812665,23.806608l37.937001,-22.931615l-21.749812,38.749665l1.374988,-17.749847l-17.562177,1.931797z"
        fill-opacity="null" stroke-opacity="null" stroke-width="1.5" stroke="#000" fill="#fff"/>
    </svg>`;

  // create dom marker and add it to the map
  marker = map.addObject(
    new H.map.DomMarker(
      { lat: 50.90978, lng: 10.87203 },
      {
        icon: new H.map.DomIcon(domIconElement, {
          onAttach: function (clonedElement, domIcon, domMarker) {
            var clonedContent = clonedElement.getElementsByTagName("svg")[0];

            // set last used value for rotation when dom icon is attached (back in map's viewport)
            clonedContent.style.transform = "rotate(" + counter + "deg)";

            // set interval to rotate icon's content by 45 degrees every second.
            interval = setInterval(function () {
              clonedContent.style.transform =
                "rotate(" + (counter += 45) + "deg)";
            }, 1000);
          },
          onDetach: function (clonedElement, domIcon, domMarker) {
            // stop the rotation if dom icon is not in map's viewport
            clearInterval(interval);
          },
        }),
      }
    )
  );
}

// Now create DOM Marker and rotate it's content
rotateDomMarker();
