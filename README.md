# Maps API for JavaScript

This repository holds a series of JavaScript based examples using the **HERE Maps API for JavaScript**. More information about the API can be found on [developer.here.com](https://developer.here.com/develop/javascript-api) under the JavaScript APIs section.
To run the examples, clone this repo to a folder on your Desktop. Replace the credentials in the **test-credentials.js** file with your own credentials.

> **Note:** In order to get the sample code to work, you **must** replace all instances of `window.apikey` within the code and use your own **HERE** credentials.

> You can obtain a set of credentials from the [Plans Page](https://developer.here.com/plans) on developer.here.com.

See the [LICENSE](LICENSE) file in the root of this project for license details.

## Maps API for JavaScript

All of the following examples use **version 3.1** of the API

* [Adding an Overlay to the Map](https://heremaps.github.io/maps-api-for-javascript-examples/custom-tile-overlay/demo.html) - Display custom map tiles as an overlay
* [Animated Markers](https://heremaps.github.io/maps-api-for-javascript-examples/markers-update-position-with-animation/demo.html) - Update marker position with animation
* [Calculating a Location from a Mouse Click](https://heremaps.github.io/maps-api-for-javascript-examples/position-on-mouse-click/demo.html) - Obtain the latitude and longitude of a location within the map
* [Changing from the Metric System](https://heremaps.github.io/maps-api-for-javascript-examples/map-scale-bar-changing-from-the-metric-system/demo.html) - Display a map including a scale bar in miles or yards
* [Circle on the Map](https://heremaps.github.io/maps-api-for-javascript-examples/circle-on-the-map/demo.html) - Display a map highlighting a circular region
* [DOM Marker](https://heremaps.github.io/maps-api-for-javascript-examples/map-with-dom-marker/demo.html) - Display a marker that is capable of receiving DOM events
* [DOM Marker rotation](https://heremaps.github.io/maps-api-for-javascript-examples/dom-marker-rotation/demo.html) - Rotate DOM Marker's content using CSS
* [Display KML Data](https://heremaps.github.io/maps-api-for-javascript-examples/display-kml-on-map/demo.html) - Parse a KML file and display the data on a map
* [Display GeoJSON Data](https://heremaps.github.io/maps-api-for-javascript-examples/display-geojson-on-map/demo.html) - Parse a GeoJSON file and display the data on a map
* [Display an Indoor Map](https://heremaps.github.io/maps-api-for-javascript-examples/indoor-map/demo.html) - Use the HERE Indoor Maps API to load and visualize an indoor map
* [UI interactions on Indoor Map](https://heremaps.github.io/maps-api-for-javascript-examples/indoor-map-ui-interaction/demo.html) - HERE Indoor Maps API with UI interactions on the map
* [Restrict map movement with Indoor Map](https://heremaps.github.io/maps-api-for-javascript-examples/indoor-map-movement/demo.html) - Restrict the map movement within the indoor map bounds
* [Draggable Marker](https://heremaps.github.io/maps-api-for-javascript-examples/draggable-marker/demo.html) - Display a moveable marker on a map
* [Draggable geo shapes](https://heremaps.github.io/maps-api-for-javascript-examples/draggable-shapes/demo.html) - Display moveable geometric shapes on a map
* [Extruded geo shapes](https://heremaps.github.io/maps-api-for-javascript-examples/extruded-objects/demo.html) - 3D extrusion of the geometric shapes
* [Finding the Nearest Marker](https://heremaps.github.io/maps-api-for-javascript-examples/finding-the-nearest-marker/demo.html) - Find a marker nearest to the click location
* [Image overlay](https://heremaps.github.io/maps-api-for-javascript-examples/image-overlay/demo.html) - Display an animated weather radar
* [Interactive Map Layer](https://heremaps.github.io/maps-api-for-javascript-examples/transit-iml/demo.html) - Visualize Data from Interactive Map Layer on Map
* [Interleave vector and object layers](https://heremaps.github.io/maps-api-for-javascript-examples/interleave-layers/demo.html) - Display an object under the buildings
* [Map Objects Event Delegation](https://heremaps.github.io/maps-api-for-javascript-examples/map-objects-event-delegation/demo.html) - Use event delegation on map objects
* [Map Objects Events](https://heremaps.github.io/maps-api-for-javascript-examples/map-object-events-displayed/demo.html) - Handle events on various map objects
* [Map at a specified location](https://heremaps.github.io/maps-api-for-javascript-examples/map-at-specified-location/demo.html) - Display a map at a specified location and zoom level
* [Map using View Bounds](https://heremaps.github.io/maps-api-for-javascript-examples/map-using-view-bounds/demo.html) - Display a map of a given area
* [Map with Driving Route from A to B](https://heremaps.github.io/maps-api-for-javascript-examples/map-with-route-from-a-to-b/demo.html) - Request a driving route from A to B and display it on the map.
* [Map with Pedestrian Route from A to B](https://heremaps.github.io/maps-api-for-javascript-examples/map-with-pedestrian-route-from-a-to-b/demo.html) - Request a walking route from A to B and display it on the map.
* [Map with Route from A to B using Public Transport](https://heremaps.github.io/maps-api-for-javascript-examples/map-with-route-from-a-to-b-using-public-transport/demo.html) - Request a route from A to B using public transport and display it on the map.
* [Map with isoline route](https://heremaps.github.io/maps-api-for-javascript-examples/map-with-isoline-route/demo.html) - Request a range for the EV vehicle.
* [Marker Clustering](https://heremaps.github.io/maps-api-for-javascript-examples/marker-clustering/demo.html) - Cluster multiple markers together to better visualize the data
* [Marker Clustering with Custom Theme](https://heremaps.github.io/maps-api-for-javascript-examples/custom-cluster-theme/demo.html) - Cluster multiple markers and customize the theme
* [Marker on the Map](https://heremaps.github.io/maps-api-for-javascript-examples/markers-on-the-map/demo.html) - Display a map highlighting points of interest
* [Markers with Altitude](https://heremaps.github.io/maps-api-for-javascript-examples/markers-with-altitude/demo.html) - Display markers at different altitudes
* [Multi-language support](https://heremaps.github.io/maps-api-for-javascript-examples/map-multi-language-support/demo.html) - Display a map with labels in a foreign language
* [Opening an Infobubble on a Mouse Click](https://heremaps.github.io/maps-api-for-javascript-examples/open-infobubble/demo.html) - Open an infobubble when a marker is clicked
* [Ordering Overlapping Markers](https://heremaps.github.io/maps-api-for-javascript-examples/ordering-overlapping-markers/demo.html) - Arrange the order in which a series of map objects are displayed
* [Panning the Map](https://heremaps.github.io/maps-api-for-javascript-examples/panning-the-map/demo.html) - Programmatically pan the map so that it is continually in motion
* [Polygon on the Map](https://heremaps.github.io/maps-api-for-javascript-examples/polygon-on-the-map/demo.html) - Display a map highlighting a region or area
* [Polyline on the Map](https://heremaps.github.io/maps-api-for-javascript-examples/polyline-on-the-map/demo.html) - Display a map with a line showing a known route
* [Rectangle on the map](https://heremaps.github.io/maps-api-for-javascript-examples/rectangle-on-the-map/demo.html) - Display a map highlighting a retangular region or area
* [Resizable geo Polygon](https://heremaps.github.io/maps-api-for-javascript-examples/resizable-polygon/demo.html) - Display resizable polygon on a map
* [Resizable geo Polyline](https://heremaps.github.io/maps-api-for-javascript-examples/resizable-polyline/demo.html) - Display resizable polyline on a map
* [Resizable geo Circle](https://heremaps.github.io/maps-api-for-javascript-examples/resizable-circle/demo.html) - Display resizable circle on a map
* [Resizable geo Rect](https://heremaps.github.io/maps-api-for-javascript-examples/resizable-rect/demo.html) - Display resizable rectangle on a map
* [Restrict Map Movement](https://heremaps.github.io/maps-api-for-javascript-examples/restrict-map/demo.html) - Restrict a moveable map to a given rectangular area
* [SVG Graphic Markers](https://heremaps.github.io/maps-api-for-javascript-examples/map-with-svg-graphic-markers/demo.html) - Display a map with custom SVG markers
* [Search for a Landmark](https://heremaps.github.io/maps-api-for-javascript-examples/search-for-landmark/demo.html) - Request the location of a landmark and display it on the map.
* [Search for a Location based on an Address](https://heremaps.github.io/maps-api-for-javascript-examples/geocode-a-location-from-address/demo.html) - Request a location using a free-form text input and display it on the map.
* [Search for a Location given a Structured Address](https://heremaps.github.io/maps-api-for-javascript-examples/geocode-a-location-from-structured-address/demo.html) - Request a location from a structured address and display it on the map.
* [Search for the Address of a Known Location](https://heremaps.github.io/maps-api-for-javascript-examples/reverse-geocode-an-address-from-location/demo.html) - Request address details for a given location and display it on the map.
* [Set a map style at the load time](https://heremaps.github.io/maps-api-for-javascript-examples/change-style-at-load/demo.html) - Set a style of the whole map during the map instantiation
* [Set a map style exported from the HERE Style Editor](https://heremaps.github.io/maps-api-for-javascript-examples/change-harp-style-at-load/demo.html) - Set a style exported from the [HERE Style Editor](https://platform.here.com/style-editor) during the map instantiation
* [Synchronising Two Maps](https://heremaps.github.io/maps-api-for-javascript-examples/synchronising-two-maps/demo.html) - Synchronise a static map with an interactive map
* [Take a Snapshot of the Map](https://heremaps.github.io/maps-api-for-javascript-examples/capture-map-area/demo.html) - Capture an area on the map
* [Truck routing road restrictions](https://heremaps.github.io/maps-api-for-javascript-examples/truck-routing-road-restrictions/demo.html) Show a various truck routes with the truck related road restrictions highlighted on the map
* [Zoom into Bounds](https://heremaps.github.io/maps-api-for-javascript-examples/custom-zooming-into-bounds/demo.html) - Zoom into bounds limiting maximum level
* [Zooming to a Set of Markers](https://heremaps.github.io/maps-api-for-javascript-examples/zoom-to-set-of-markers/demo.html) - Alter the viewport  to ensure a group of objects are visible
