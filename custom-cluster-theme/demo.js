    /**
 * Make clustering of markers with a custom theme
 *
 * Note that the maps clustering module https://js.api.here.com/v3/3.1/mapsjs-clustering.js
 * must be loaded to use the Clustering
 *
 * @param {H.Map} map A HERE Map instance within the application
 * @param {H.ui.UI} ui Default ui component
 * @param {Function} getBubbleContent Function returning detailed information about photo
 * @param {Object[]} data Raw data containing information about each photo
 */
function startClustering(map, ui, getBubbleContent, data) {
  // First we need to create an array of DataPoint objects for the ClusterProvider
  var dataPoints = data.map(function(item) {
    // Note that we pass "null" as value for the "altitude"
    // Last argument is a reference to the original data to associate with our DataPoint
    // We will need it later on when handling events on the clusters/noise points for showing
    // details of that point
    return new H.clustering.DataPoint(item.latitude, item.longitude, null, item);
  });

  // Create a clustering provider with a custom theme
  var clusteredDataProvider = new H.clustering.Provider(dataPoints, {
    clusteringOptions: {
      // Maximum radius of the neighborhood
      eps: 64,
      // minimum weight of points required to form a cluster
      minWeight: 3
    },
    theme: CUSTOM_THEME
  });
  // Note that we attach the event listener to the cluster provider, and not to
  // the individual markers
  clusteredDataProvider.addEventListener('tap', onMarkerClick);

  // Create a layer that will consume objects from our clustering provider
  var layer = new H.map.layer.ObjectLayer(clusteredDataProvider);

  // To make objects from clustering provider visible,
  // we need to add our layer to the map
  map.addLayer(layer);
}

// Custom clustering theme description object.
// Object should implement H.clustering.ITheme interface
var CUSTOM_THEME = {
  getClusterPresentation: function(cluster) {
    // Get random DataPoint from our cluster
    var randomDataPoint = getRandomDataPoint(cluster),
      // Get a reference to data object that DataPoint holds
      data = randomDataPoint.getData();

    // Create a marker from a random point in the cluster
    var clusterMarker = new H.map.Marker(cluster.getPosition(), {
      icon: new H.map.Icon(data.thumbnail, {
        size: {w: 50, h: 50},
        anchor: {x: 25, y: 25}
      }),

      // Set min/max zoom with values from the cluster,
      // otherwise clusters will be shown at all zoom levels:
      min: cluster.getMinZoom(),
      max: cluster.getMaxZoom()
    });

    // Link data from the random point from the cluster to the marker,
    // to make it accessible inside onMarkerClick
    clusterMarker.setData(data);

    return clusterMarker;
  },
  getNoisePresentation: function (noisePoint) {
    // Get a reference to data object our noise points
    var data = noisePoint.getData(),
      // Create a marker for the noisePoint
      noiseMarker = new H.map.Marker(noisePoint.getPosition(), {
        // Use min zoom from a noise point
        // to show it correctly at certain zoom levels:
        min: noisePoint.getMinZoom(),
        icon: new H.map.Icon(data.thumbnail, {
          size: {w: 20, h: 20},
          anchor: {x: 10, y: 10}
        })
      });

    // Link a data from the point to the marker
    // to make it accessible inside onMarkerClick
    noiseMarker.setData(data);

    return noiseMarker;
  }
};


/**
 * Boilerplate map initialization code starts below:
 */
// Helper function for getting a random point from a cluster object
function getRandomDataPoint(cluster) {
  var dataPoints = [];

  // Iterate through all points which fall into the cluster and store references to them
  cluster.forEachDataPoint(dataPoints.push.bind(dataPoints));

  // Randomly pick an index from [0, dataPoints.length) range
  // Note how we use bitwise OR ("|") operator for that instead of Math.floor
  return dataPoints[Math.random() * dataPoints.length | 0];
}

/**
 * CLICK/TAP event handler for our markers. That marker can represent either a single photo or
 * a cluster (group of photos)
 * @param {H.mapevents.Event} e The event object
 */
function onMarkerClick(e) {
  // Get position of the "clicked" marker
  var position = e.target.getPosition(),
    // Get the data associated with that marker
    data = e.target.getData(),
    // Merge default template with the data and get HTML
    bubbleContent = getBubbleContent(data),
    bubble = onMarkerClick.bubble;

  // For all markers create only one bubble, if not created yet
  if (!bubble) {
    bubble = new H.ui.InfoBubble(position, {
      content: bubbleContent
    });
    ui.addBubble(bubble);
    // Cache the bubble object
    onMarkerClick.bubble = bubble;
  } else {
    // Reuse existing bubble object
    bubble.setPosition(position);
    bubble.setContent(bubbleContent);
    bubble.open();
  }

  // Move map's center to a clicked marker
  map.setCenter(position, true);
}

// Step 1: initialize communication with the platform
// In your own code, replace variable window.apikey with your own apikey
var platform = new H.service.Platform({
  apikey: window.apikey,
  useHTTPS: true
});
var pixelRatio = window.devicePixelRatio || 1;
var defaultLayers = platform.createDefaultLayers({
  tileSize: pixelRatio === 1 ? 256 : 512,
  ppi: pixelRatio === 1 ? undefined : 320
});

// Step 2: initialize a map
var map = new H.Map(document.getElementById('map'), defaultLayers.vector.normal.map, {
  center: new H.geo.Point(50.426467222414374, 6.3054632497803595),
  zoom: 6,
  pixelRatio: pixelRatio
});
// add a resize listener to make sure that the map occupies the whole container
window.addEventListener('resize', () => map.getViewPort().resize());

// Step 3: make the map interactive
// MapEvents enables the event system
// Behavior implements default interactions for pan/zoom (also on mobile touch environments)
var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));

// Step 4: create the default UI component, for displaying bubbles
var ui = H.ui.UI.createDefault(map, defaultLayers);

/**
 * Merges given data with default bubble template and returns resulting HTML string
 * @param {Object} data Data holding single picture information
 */
function getBubbleContent(data) {
  return [
    '<div class="bubble">',
      '<a class="bubble-image" ',
        'style="background-image: url(', data.fullurl, ')" ',
        'href="', data.url, '" target="_blank">',
      '</a>',
      '<span>',
        // Author info may be missing
        data.author ? ['Photo by: ', '<a href="//commons.wikimedia.org/wiki/User:',
          encodeURIComponent(data.author), '" target="_blank">',
          data.author, '</a>'].join(''):'',
        '<hr/>',
        '<a class="bubble-footer" href="//commons.wikimedia.org/" target="_blank">',
          '<img class="bubble-logo" src="img/wikimedia-logo.png" />',
          '<span class="bubble-desc">',
          'Photos provided by Wikimedia Commons are <br/>under the copyright of their owners.',
          '</span>',
        '</a>',
      '</span>',
    '</div>'
  ].join('');
}

// Step 5: request data that will be visualized on a map
startClustering(map, ui, getBubbleContent, photos);
