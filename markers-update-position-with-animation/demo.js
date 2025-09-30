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
  pixelRatio: window.devicePixelRatio && window.devicePixelRatio > 1 ? 2 : 1,
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

// Now create markers and set interval to update their positions with animation.
createMarkers();

/**
 * Create markers
 */
function createMarkers() {
  // create SVG Dom Icon
  var svg = `<svg xmlns="http://www.w3.org/2000/svg" class="svg-icon" width="10px" height="10px">
        <circle cx="5" cy="5" r="4" fill="rgb(250, 127, 0)" stroke-width="1" stroke="black" opacity="1"/>
        </svg>`,
    domIcon = new H.map.DomIcon(svg),
    markers = [],
    // array of initial positions of 40 markers
    initialPositions = [
      [49.606945, 8.368333],
      [50.98194, 12.50638],
      [51.83169, 12.19096],
      [52.19585, 14.58753],
      [51.30805, 13.55555],
      [51.36305, 11.94083],
      [51.55222, 12.05388],
      [51.2936, 13.35611],
      [53.30638, 12.75222],
      [52.58055, 13.91666],
      [52.2036, 13.15638],
      [54.03825, 12.71051],
      [50.91527, 11.71444],
      [52.91888, 12.42527],
      [52.07361, 11.62638],
      [51.36333, 14.94999],
      [53.83277, 13.66861],
      [51.88944, 14.53194],
      [51.29694, 14.12749],
      [52.38, 13.5225],
      [51.1328, 13.7672],
      [50.9798, 10.9581],
      [50.02233, 8.57055],
      [52.1346, 7.68482],
      [53.6304, 9.98822],
      [52.47259, 13.4039],
      [50.86589, 7.14273],
      [51.22701, 6.76677],
      [48.3538, 11.7861],
      [49.49869, 11.07805],
      [51.42388, 12.23308],
      [49.21459, 7.1095],
      [48.68989, 9.22196],
      [52.3597, 13.28769],
      [52.4611, 9.68479],
      [53.0475, 8.78665],
      [49.69999, 8.64583],
      [49.94869, 7.26388],
      [49.47305, 8.51416],
      [51.03499, 8.68083],
    ];

  // create markers
  initialPositions.forEach(function (pos) {
    markers.push(
      new H.map.DomMarker(
        { lat: pos[0], lng: pos[1] },
        {
          icon: domIcon,
        }
      )
    );
  });

  // add markers to map
  map.addObjects(markers);

  // randomly update all markers positions in intervals
  setTimeout(updateMarkerPositions, 500);
  setInterval(updateMarkerPositions, 5000);

  /**
   * update all markers' positions with animation using the ease function
   */
  function updateMarkerPositions() {
    markers.forEach(function (marker) {
      // get random position 0 - 450km from map's center in random direction
      let randomPoint = map
        .getCenter()
        .walk(Math.random() * 360, Math.random() * 450000);

      // update marker's position within ease function callback
      ease(marker.getGeometry(), randomPoint, 4000, function (coord) {
        marker.setGeometry(coord);
      });
    });
  }
}

/**
 * Ease function
 * @param   {H.geo.IPoint} startCoord   start geo coordinate
 * @param   {H.geo.IPoint} endCoord     end geo coordinate
 * @param   number durationMs           duration of animation between start & end coordinates
 * @param   function onStep             callback executed each step
 * @param   function onStep             callback executed at the end
 */
function ease(
  startCoord = { lat: 0, lng: 0 },
  endCoord = { lat: 1, lng: 1 },
  durationMs = 200,
  onStep = console.log,
  onComplete = function () {}
) {
  var raf =
      window.requestAnimationFrame ||
      function (f) {
        window.setTimeout(f, 16);
      },
    stepCount = durationMs / 16,
    valueIncrementLat = (endCoord.lat - startCoord.lat) / stepCount,
    valueIncrementLng = (endCoord.lng - startCoord.lng) / stepCount,
    sinValueIncrement = Math.PI / stepCount,
    currentValueLat = startCoord.lat,
    currentValueLng = startCoord.lng,
    currentSinValue = 0;

  function step() {
    currentSinValue += sinValueIncrement;
    currentValueLat += valueIncrementLat * Math.sin(currentSinValue) ** 2 * 2;
    currentValueLng += valueIncrementLng * Math.sin(currentSinValue) ** 2 * 2;

    if (currentSinValue < Math.PI) {
      onStep({ lat: currentValueLat, lng: currentValueLng });
      raf(step);
    } else {
      onStep(endCoord);
      onComplete();
    }
  }

  raf(step);
}
