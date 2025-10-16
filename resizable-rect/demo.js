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

// Step 5: Add resizable geo rect
createResizableRect(map, behavior);

/**
 * Adds resizable geo rect to map
 *
 * @param {H.Map} map                      A HERE Map instance within the application
 * @param {H.mapevents.Behavior} behavior  Behavior implements default interactions with map
 */
function createResizableRect(map, behavior) {
  var rect = new H.map.Rect(new H.geo.Rect(51.2, 20.5, 49.5, 24.5), {
      style: { fillColor: "rgba(100, 100, 100, 0.5)", lineWidth: 0 },
    }),
    rectOutline = new H.map.Polyline(rect.getGeometry().getExterior(), {
      style: {
        lineWidth: 8,
        strokeColor: "rgba(255, 0, 0, 0)",
        fillColor: "rgba(0, 0, 0, 0)",
        lineCap: "square",
      },
    }),
    rectGroup = new H.map.Group({
      volatility: true, // mark the group as volatile for smooth dragging of all it's objects
      objects: [rect, rectOutline],
    }),
    rectTimeout;

  // ensure that the objects can receive drag events
  rect.draggable = true;
  rectOutline.draggable = true;

  // extract first point of the rect's outline polyline's LineString and
  // push it to the end, so the outline has a closed geometry
  rectOutline
    .getGeometry()
    .pushPoint(rectOutline.getGeometry().extractPoint(0));

  // add group with rect and it's outline (polyline)
  map.addObject(rectGroup);

  // event listener for rectangle group to show outline (polyline) if moved in with mouse (or touched on touch devices)
  rectGroup.addEventListener(
    "pointerenter",
    function (evt) {
      var currentStyle = rectOutline.getStyle(),
        newStyle = currentStyle.getCopy({
          strokeColor: "rgb(255, 0, 0)",
        });

      if (rectTimeout) {
        clearTimeout(rectTimeout);
        rectTimeout = null;
      }
      // show outline
      rectOutline.setStyle(newStyle);
    },
    true
  );

  // event listener for rectangle group to hide outline if moved out with mouse (or released finger on touch devices)
  // the outline is hidden on touch devices after specific timeout
  rectGroup.addEventListener(
    "pointerleave",
    function (evt) {
      var currentStyle = rectOutline.getStyle(),
        newStyle = currentStyle.getCopy({
          strokeColor: "rgba(255, 0, 0, 0)",
        }),
        timeout = evt.currentPointer.type == "touch" ? 1000 : 0;

      rectTimeout = setTimeout(function () {
        rectOutline.setStyle(newStyle);
      }, timeout);

      document.body.style.cursor = "default";
    },
    true
  );

  // event listener for rectangle group to change the cursor if mouse position is over the outline polyline (resizing is allowed)
  rectGroup.addEventListener(
    "pointermove",
    function (evt) {
      var pointer = evt.currentPointer,
        objectTopLeftScreen = map.geoToScreen(
          evt.target.getGeometry().getBoundingBox().getTopLeft()
        ),
        objectBottomRightScreen = map.geoToScreen(
          evt.target.getGeometry().getBoundingBox().getBottomRight()
        ),
        draggingType = "";

      // only set cursor and draggingType if target is outline polyline
      if (evt.target != rectOutline) {
        return;
      }

      // change document cursor depending on the mouse position
      if (pointer.viewportX < objectTopLeftScreen.x + 4) {
        document.body.style.cursor = "ew-resize"; // mouse position is at left side
        draggingType = "left";
      } else if (pointer.viewportX > objectBottomRightScreen.x - 4) {
        document.body.style.cursor = "ew-resize"; // mouse position is at right side
        draggingType = "right";
      } else if (pointer.viewportY < objectTopLeftScreen.y + 4) {
        document.body.style.cursor = "ns-resize"; // mouse position is at top side
        draggingType = "top";
      } else if (pointer.viewportY > objectBottomRightScreen.y - 4) {
        document.body.style.cursor = "ns-resize"; // mouse position is at the bottom side
        draggingType = "bottom";
      } else {
        document.body.style.cursor = "default";
      }

      if (draggingType == "left") {
        if (pointer.viewportY < objectTopLeftScreen.y + 4) {
          document.body.style.cursor = "nwse-resize"; // mouse position is at the top-left corner
          draggingType = "left-top";
        } else if (pointer.viewportY > objectBottomRightScreen.y - 4) {
          document.body.style.cursor = "nesw-resize"; // mouse position is at the bottom-left corner
          draggingType = "left-bottom";
        }
      } else if (draggingType == "right") {
        if (pointer.viewportY < objectTopLeftScreen.y + 4) {
          document.body.style.cursor = "nesw-resize"; // mouse position is at the top-right corner
          draggingType = "right-top";
        } else if (pointer.viewportY > objectBottomRightScreen.y - 4) {
          document.body.style.cursor = "nwse-resize"; // mouse position is at the bottom-right corner
          draggingType = "right-bottom";
        }
      }

      rectGroup.setData({ draggingType: draggingType });
    },
    true
  );

  // disable the map's behavior if resizing started so map doesn't pan in the situation
  // when we try to set rect size to 0 or negative and mouse cursor leaves the map object
  rectGroup.addEventListener(
    "dragstart",
    function (evt) {
      if (evt.target === rectOutline) {
        behavior.disable();
      }
    },
    true
  );

  // event listener for rect group to resize the geo rect object if dragging over outline polyline
  rectGroup.addEventListener(
    "drag",
    function (evt) {
      var pointer = evt.currentPointer,
        pointerGeoPoint = map.screenToGeo(pointer.viewportX, pointer.viewportY);
      (currentGeoRect = rect.getGeometry().getBoundingBox()),
        (objectTopLeftScreen = map.geoToScreen(currentGeoRect.getTopLeft())),
        (objectBottomRightScreen = map.geoToScreen(
          currentGeoRect.getBottomRight()
        ));

      // if pointer is over outline, resize the geo rect object
      if (evt.target instanceof H.map.Polyline) {
        var currentTopLeft = currentGeoRect.getTopLeft(),
          currentBottomRight = currentGeoRect.getBottomRight(),
          newGeoRect,
          outlineLinestring;

        // update rect's size depending on dragging type:
        switch (rectGroup.getData()["draggingType"]) {
          case "left-top":
            // we don't allow resizing to 0 or to negative values
            if (
              pointerGeoPoint.lng >= currentBottomRight.lng ||
              pointerGeoPoint.lat <= currentBottomRight.lat
            ) {
              return;
            }
            newGeoRect = H.geo.Rect.fromPoints(
              pointerGeoPoint,
              currentGeoRect.getBottomRight()
            );
            break;
          case "left-bottom":
            // we don't allow resizing to 0 or to negative values
            if (
              pointerGeoPoint.lng >= currentBottomRight.lng ||
              pointerGeoPoint.lat >= currentTopLeft.lat
            ) {
              return;
            }
            currentTopLeft.lng = pointerGeoPoint.lng;
            currentBottomRight.lat = pointerGeoPoint.lat;
            newGeoRect = H.geo.Rect.fromPoints(
              currentTopLeft,
              currentBottomRight
            );
            break;
          case "right-top":
            // we don't allow resizing to 0 or to negative values
            if (
              pointerGeoPoint.lng <= currentTopLeft.lng ||
              pointerGeoPoint.lat <= currentBottomRight.lat
            ) {
              return;
            }
            currentTopLeft.lat = pointerGeoPoint.lat;
            currentBottomRight.lng = pointerGeoPoint.lng;
            newGeoRect = H.geo.Rect.fromPoints(
              currentTopLeft,
              currentBottomRight
            );
            break;
          case "right-bottom":
            // we don't allow resizing to 0 or to negative values
            if (
              pointerGeoPoint.lng <= currentTopLeft.lng ||
              pointerGeoPoint.lat >= currentTopLeft.lat
            ) {
              return;
            }
            newGeoRect = H.geo.Rect.fromPoints(
              currentGeoRect.getTopLeft(),
              pointerGeoPoint
            );
            break;
          case "left":
            // we don't allow resizing to 0 or to negative values
            if (pointerGeoPoint.lng >= currentBottomRight.lng) {
              return;
            }
            currentTopLeft.lng = pointerGeoPoint.lng;
            newGeoRect = H.geo.Rect.fromPoints(
              currentTopLeft,
              currentGeoRect.getBottomRight()
            );
            break;
          case "right":
            // we don't allow resizing to 0 or to negative values
            if (pointerGeoPoint.lng <= currentTopLeft.lng) {
              return;
            }
            currentBottomRight.lng = pointerGeoPoint.lng;
            newGeoRect = H.geo.Rect.fromPoints(
              currentGeoRect.getTopLeft(),
              currentBottomRight
            );
            break;
          case "top":
            // we don't allow resizing to 0 or to negative values
            if (pointerGeoPoint.lat <= currentBottomRight.lat) {
              return;
            }
            currentTopLeft.lat = pointerGeoPoint.lat;
            newGeoRect = H.geo.Rect.fromPoints(
              currentTopLeft,
              currentGeoRect.getBottomRight()
            );
            break;
          case "bottom":
            // we don't allow resizing to 0 or to negative values
            if (pointerGeoPoint.lat >= currentTopLeft.lat) {
              return;
            }
            currentBottomRight.lat = pointerGeoPoint.lat;
            newGeoRect = H.geo.Rect.fromPoints(
              currentGeoRect.getTopLeft(),
              currentBottomRight
            );
            break;
        }

        // set the new bounding box for rect object
        rect.setBoundingBox(newGeoRect);

        // extract first point of the outline LineString and push it to the end, so the outline has a closed geometry
        outlineLinestring = rect.getGeometry().getExterior();
        outlineLinestring.pushPoint(outlineLinestring.extractPoint(0));
        rectOutline.setGeometry(outlineLinestring);

        // prevent event from bubbling, so map doesn't receive this event and doesn't pan
        evt.stopPropagation();
      }
    },
    true
  );

  // event listener for rect group to enable map's behavior
  rectGroup.addEventListener(
    "dragend",
    function (evt) {
      // enable behavior
      behavior.enable();
    },
    true
  );
}
