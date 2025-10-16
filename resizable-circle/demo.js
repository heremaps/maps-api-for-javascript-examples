/**
 * Boilerplate map initialization code starts below:
 */

//Step 1: initialize communication with the platform
// In your own code, replace variable window.apikey with your own apikey
var platform = new H.service.Platform({
  apikey: window.apikey
});
var defaultLayers = platform.createDefaultLayers();

//Step 2: initialize a map - this map is centered over Boston
var map = new H.Map(
  document.getElementById("map"),
  defaultLayers.vector.normal.map,
  {
    center: { lat: 50, lng: 22.8 },
    zoom: 6,
    pixelRatio: window.devicePixelRatio || 1,
  }
);
// add a resize listener to make sure that the map occupies the whole container
window.addEventListener("resize", () => map.getViewPort().resize());

//Step 3: make the map interactive
// MapEvents enables the event system
// Behavior implements default interactions for pan/zoom (also on mobile touch environments)
var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));

// Step 4: Create the default UI:
var ui = H.ui.UI.createDefault(map, defaultLayers, "en-US");

// Step 5: Add resizable geo shapes
createResizableCircle(map);

/**
 * Adds resizable geo shapes to map
 *
 * @param {H.Map} map                      A HERE Map instance within the application
 */
function createResizableCircle(map) {
  var circle = new H.map.Circle({ lat: 50, lng: 22.8 }, 85000, {
      style: { fillColor: "rgba(250, 250, 0, 0.7)", lineWidth: 0 },
    }),
    circleOutline = new H.map.Polyline(circle.getGeometry().getExterior(), {
      style: { lineWidth: 8, strokeColor: "rgba(255, 0, 0, 0)" },
    }),
    circleGroup = new H.map.Group({
      volatility: true, // mark the group as volatile for smooth dragging of all it's objects
      objects: [circle, circleOutline],
    }),
    circleTimeout;

  // ensure that the objects can receive drag events
  circle.draggable = true;
  circleOutline.draggable = true;

  // extract first point of the circle outline polyline's LineString and
  // push it to the end, so the outline has a closed geometry
  circleOutline
    .getGeometry()
    .pushPoint(circleOutline.getGeometry().extractPoint(0));

  // add group with circle and it's outline (polyline)
  map.addObject(circleGroup);

  // event listener for circle group to show outline (polyline) if moved in with mouse (or touched on touch devices)
  circleGroup.addEventListener(
    "pointerenter",
    function (evt) {
      var currentStyle = circleOutline.getStyle(),
        newStyle = currentStyle.getCopy({
          strokeColor: "rgb(255, 0, 0)",
        });

      if (circleTimeout) {
        clearTimeout(circleTimeout);
        circleTimeout = null;
      }
      // show outline
      circleOutline.setStyle(newStyle);
    },
    true
  );

  // event listener for circle group to hide outline if moved out with mouse (or released finger on touch devices)
  // the outline is hidden on touch devices after specific timeout
  circleGroup.addEventListener(
    "pointerleave",
    function (evt) {
      var currentStyle = circleOutline.getStyle(),
        newStyle = currentStyle.getCopy({
          strokeColor: "rgba(255, 0, 0, 0)",
        }),
        timeout = evt.currentPointer.type == "touch" ? 1000 : 0;

      circleTimeout = setTimeout(function () {
        circleOutline.setStyle(newStyle);
      }, timeout);
      document.body.style.cursor = "default";
    },
    true
  );

  // event listener for circle group to change the cursor if mouse position is over the outline polyline (resizing is allowed)
  circleGroup.addEventListener(
    "pointermove",
    function (evt) {
      if (evt.target instanceof H.map.Polyline) {
        document.body.style.cursor = "pointer";
      } else {
        document.body.style.cursor = "default";
      }
    },
    true
  );

  // event listener for circle group to resize the geo circle object if dragging over outline polyline
  circleGroup.addEventListener(
    "drag",
    function (evt) {
      var pointer = evt.currentPointer,
        distanceFromCenterInMeters = circle
          .getCenter()
          .distance(map.screenToGeo(pointer.viewportX, pointer.viewportY));

      // if resizing is allowed, set the circle's radius
      if (evt.target instanceof H.map.Polyline) {
        circle.setRadius(distanceFromCenterInMeters);

        // use circle's updated geometry for outline polyline
        var outlineLinestring = circle.getGeometry().getExterior();

        // extract first point of the outline LineString and push it to the end, so the outline has a closed geometry
        outlineLinestring.pushPoint(outlineLinestring.extractPoint(0));
        circleOutline.setGeometry(outlineLinestring);

        // prevent event from bubbling, so map doesn't receive this event and doesn't pan
        evt.stopPropagation();
      }
    },
    true
  );
}
