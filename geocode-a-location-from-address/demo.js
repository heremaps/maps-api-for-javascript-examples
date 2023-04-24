/**
 * Geocode the address in the input text field and center the map on success.
 */
 function geocode() {
  const address = document.getElementById('geocodeAddress').value;
  /*
  * A full list of available request parameters can be found in the Geocoder API documentation.
  * See: http://developer.here.com/rest-apis/documentation/geocoder/topics/resource-geocode.html
  */
  const geocodingParameters = {
      q: address
  };

  if (!address) {
    return;
  }

  geocodingService.geocode(
    geocodingParameters,
    onSuccess,
    onError
  );
}

/**
 * This function will be called once the Geocoder REST API provides a response
 * @param {Object} result A JSON object representing the location(s) found.
 *
 * See: http://developer.here.com/rest-apis/documentation/geocoder/topics/resource-type-response-geocode.html
 */
 function onSuccess(result) {
  const locations = result.items;
  addLocationsToMap(locations);
  addLocationsToPanel(locations);
}

/**
 * This function will be called if a communication error occurs during the JSON-P request
 * @param  {Object} error  The error message received.
 */
function onError(error) {
  alert('Can\'t reach the remote server');
}

/**
 * Boilerplate map initialization code starts below
*/

// Step 1: initialize communication with the platform
// In your own code, replace variable window.apikey with your own apikey
const platform = new H.service.Platform({
  apikey: window.apikey
});
const defaultLayers = platform.createDefaultLayers();

// Step 2: initialize a map - this map is initially centered over California
const map = new H.Map(document.getElementById('map'),
  defaultLayers.vector.normal.map,{
  center: {lat: 37.376, lng: -122.034},
  zoom: 15,
  pixelRatio: window.devicePixelRatio || 1
});
// add a resize listener to make sure that the map occupies the whole container
window.addEventListener('resize', () => map.getViewPort().resize());

const locationsContainer = document.getElementById('panel');

// Step 3: make the map interactive
//  MapEvents enables the event system
//  Behavior implements default interactions for pan/zoom (also on mobile touch environments)
const behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));

// Create the default UI components
const ui = H.ui.UI.createDefault(map, defaultLayers);

// Create an instance of the Geocoding and Search service
const geocodingService = platform.getSearchService();

/**
 * Creates a series of list items for each location found, and adds it to the panel.
 * @param {Object[]} locations An array of locations as received from the
 *                             H.service.GeocodingService
 */
function addLocationsToPanel(locations){
  const nodeOL = document.createElement('ul');

  nodeOL.style.fontSize = 'small';
  nodeOL.style.marginLeft ='5%';
  nodeOL.style.marginRight ='5%';


   for (let i = 0; i < locations.length; i++) {
     const location = locations[i],
      li = document.createElement('li'),
      divLabel = document.createElement('div'),
      address = location.address,
      position = location.position;

     let content =  '<strong style="font-size: large;">' + address.label  + '</strong></br>';

      content += '<strong>houseNumber:</strong> ' + address.houseNumber + '<br/>';
      content += '<strong>street:</strong> '  + address.street + '<br/>';
      content += '<strong>district:</strong> '  + address.district + '<br/>';
      content += '<strong>city:</strong> ' + address.city + '<br/>';
      content += '<strong>postalCode:</strong> ' + address.postalCode + '<br/>';
      content += '<strong>county:</strong> ' + address.county + '<br/>';
      content += '<strong>country:</strong> ' + address.countryName + '<br/>';
      content += '<strong>position:</strong> ' +
        Math.abs(position.lat.toFixed(4)) + ((position.lat > 0) ? 'N' : 'S') +
        ' ' + Math.abs(position.lng.toFixed(4)) + ((position.lng > 0) ? 'E' : 'W') + '<br/>';

      divLabel.innerHTML = content;
      li.appendChild(divLabel);

      nodeOL.appendChild(li);
  }

  locationsContainer.replaceChildren(nodeOL);
}


/**
 * Creates an instance of H.map.Marker for each location found and adds them to the map.
 * @param {Object[]} locations An array of locations as received from the
 *                             H.service.GeocodingService
 */
 function addLocationsToMap(locations) {
  const group = new H.map.Group();

  if (!locations || locations.length === 0) {
    alert('Address not found');
    return;
  }

  // Remove all the pre-existent objects from the map
  map.removeObjects(map.getObjects());

  // Add a marker for each location found
  for (let i = 0; i < locations.length; i += 1) {
    const location = locations[i];
    marker = new H.map.Marker(location.position);
    marker.label = location.address.label;
    group.addObject(marker);
  }

  // Add the locations group to the map
  map.addObject(group);

  // Position the map according to the number of locations
  if (group.getObjects().length > 1) {
    map.getViewModel().setLookAtData({bounds: group.getBoundingBox()});
  } else {
    map.getViewModel().setLookAtData({bounds: group.getBoundingBox(), zoom: 13});
  }
}

// Send the initial geocoding request
geocode();
