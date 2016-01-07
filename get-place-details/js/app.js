/**
 * This example searches for places to eat in the Chinatown district of San Francisco
 * (37.7942N, 122.4070W). The response contains places links and those links are rendered
 * on the map as markers.
 *
 * When a marker is clicked, the user triggers the follow function and full place details
 * are displayed in the panel on the right.
 *
 * Note that the places module https://js.api.here.com/v3/3.0/mapsjs-places.js
 * must be loaded to use the Places API endpoints
 *
 * A full list of available request parameters can be found in the Places API documentation.
 * see:  http://developer.here.com/rest-apis/documentation/places/topics_api/resource-explore.html
 *
 * @param   {H.service.Platform} platform    A stub class to access HERE services
 */
function exploreRequest(platform) {
  var explore = new H.places.Explore(platform.getPlacesService());
  var params = {
    'cat': 'eat-drink',
    'in': '37.7942,-122.4070;r=500'
  };

  explore.request(params, {}, onResult, onError);
}


/**
 * This function will be called once the Explore request provides a response
 * @param  {Object} result    A JSONP object representing result of Explore request
 *
 * see: http://developer.here.com/rest-apis/documentation/places/topics_api/media-type-search.html
 */
function onResult(result) {
  addPlaceLinksToMap(result.results.items);
  addPlacesToPanel(result.results.items);
}


/**
 * This function will be called once user clicks on the marker
 * @param  {Object} placeLink    A JSONP object representing place link
 *
 * see: http://developer.here.com/rest-apis/documentation/places/topics_api/object-link.html#place-link
 */
function onPlaceDetailLinkClick(placeLink) {
  /*
   * Follow method on place link is used to create new request that will fetch
   * additional place details.
   */
  placeLink.follow(onPlaceDetailResult, onError);
}


/**
 * This function will be called once the follow method provides a place details response
 * @param  {Object} placeDetails    A JSONP object representing the place details
 *
 * see: http://developer.here.com/rest-apis/documentation/places/topics_api/media-type-place.html
 *
 */
function onPlaceDetailResult(placeDetails) {

  /*
   * The styling of the place response on the map is entirely under the developer's control.
   * A representitive styling can be found the full JS + HTML code of this example
   * in the functions below:
   */
  showPlaceDetailsInPanel(placeDetails);
  // ... etc.
}


/**
 * Boilerplate map initialization code starts below:
 */

/**
 * This function will be called in case some of the request towards Places API return
 * something other then HTTP status 200
 * @param  {Object} data    A JSONP object representing the place details
 *
 * see: http://developer.here.com/rest-apis/documentation/places/topics_api/object-error.html
 */
function onError(data) {
  error = data;
}


//initialize communication with the platform
var platform = new H.service.Platform({
  app_id: '{YOUR_APP_ID}',
  app_code: '{YOUR_APP_CODE}',
  useHTTPS: true,
  useCIT: true
});


//creating map layers
var defaultLayers = platform.createDefaultLayers();


// set up containers for the map  + panel
var mapContainer = document.getElementById('map'),
  placeDetailsContainer = document.getElementById('panel');

//initialize a map - this map is centered over San Francisco
var map = new H.Map(mapContainer,
  defaultLayers.normal.map, {
    center: {lat: 37.7942, lng: -122.4070},
    zoom: 15
  });

//add map behavior
var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));


//create the default UI components
var ui = H.ui.UI.createDefault(map, defaultLayers);


//creates a group that contains all places shown
var group = new H.map.Group();


//add 'tap' event listener, that opens info bubble, to the group
group.addEventListener('tap', function (evt) {
  updateMarkerSelection(evt.target);
  onPlaceDetailLinkClick(evt.target.getData());
}, false);

//holder for the error
var error;

// Hold a reference to any infobubble opened
var bubble;

// holder of current resultItems
var resultItems;

/**
 * Renders place details inside a panel
 * @param  {Object} placeDetail JSONP containing place details
 */
function showPlaceDetailsInPanel(placeDetail) {
  var content = '<div style="font-size: 10px; margin: 5%"" ><h2>' + placeDetail.name +
    '</h2>' + placeDetail.location.address.text + '<br/>';

  if (placeDetail.media) {
    content += addEditorials(placeDetail.media.editorials);
    content += addImages(placeDetail.media.images);
  }

  if (placeDetail.contacts) {
    content += '<strong>Contacts</strong><br/>';
    content += addContact(placeDetail.contacts.fax);
    content += addContact(placeDetail.contacts.phone);
    content += addContact(placeDetail.contacts.website);
  }
  content += '</div>';

  placeDetailsContainer.innerHTML = content;

}


/**
 * Obtains the contact information about a place.
 * @param {Contact} contact  Contact information for a place
 *
 * see: http://developer.here.com/rest-apis/documentation/places/topics_api/object-contacts.html
 */
function addContact(contact) {
  return (contact && contact.length ) ?
    contact[0].label + ': ' + contact[0].value + '<br/>' : '';
}


/**
 * Obtains the first editorial of a place if it exists.
 * @param {Editorial[]} editorials Editorial descriptions about the place
 *
 * see: http://developer.here.com/rest-apis/documentation/places/topics_api/object-media.html#place-editorial
 */
function addEditorials(editorials) {
  return (editorials && editorials.items.length ) ?
    '<hr/>' + editorials.items[0].description + '<br/> ' + editorials.items[0].attribution + '<br/>' : '';
}


/**
 * Obtains the first image of a place if it exists.
 * @param {[Image[]} images Images of a place.
 *
 * see: http://developer.here.com/rest-apis/documentation/places/topics_api/media-type-image.html
 */
function addImages(images) {
  return (images && images.items.length ) ?
    '<hr/><img style="width:70%" src="' + images.items[0].src + '" /><br/> ' + images.items[0].attribution + '<br/>' : '';
}


/**
 * Adds place links to the map using their location position
 * @param  {Array} placeLinks    A JSONP object representing the list of place Links
 *
 */
function addPlaceLinksToMap(placeLinks) {
  resultItems = placeLinks;
  map.addObject(group);
  var markers = placeLinks.map(function (place) {
    return createMarker(place, blueIcon);
  });
  markers.forEach(function (marker) {
    group.addObject(marker);
  });
}

/**
 * Creates a series of list items for each location found, and adds it to the panel.
 * @param {Object[]} locations An array of locations as received from the
 *                             H.service.GeocodingService
 */
function addPlacesToPanel(places){

  var divInstruction = document.createElement('div'),
    nodeOL = document.createElement('ul'),
    i;

  nodeOL.style.fontSize = 'small';
  nodeOL.style.marginLeft ='5%';
  nodeOL.style.marginRight ='5%';

  divInstruction.innerHTML = 'Click on a marker for more details.';

  for (i = 0;  i < places.length; i += 1) {
     var li = document.createElement('li'),
        divLabel = document.createElement('div'),
        content =  '<strong>' + places[i].title  + '</strong>';
        content += '&nbsp;<span style="font-size:smaller">(' +  places[i].category.title + ')</span></br>';

      divLabel.innerHTML = content;
      li.appendChild(divLabel);
      nodeOL.appendChild(li);
  }

  placeDetailsContainer.appendChild(divInstruction);
  placeDetailsContainer.appendChild(nodeOL);
}




/*Creating a svg icon used for displaying marker*/
var svgIcon = '<svg width="30" height="30" xmlns="http://www.w3.org/2000/svg" xmlns:svg="http://www.w3.org/2000/svg"> ' +
  ' <g> ' +
  '<circle stroke="null" r="11.78549" cy="14.9432" cx="15.00365"  stroke-width="5" fill="#ffffff" id="svg_3"/>' +
  '<circle stroke="null" id="svg_2" r="10.23529" cy="15.00339" cx="14.99506"  stroke-width="5" fill="${FILL}"/>' +
  '</g>' +
  '</svg>';

var redIcon = new H.map.Icon(svgIcon.replace('${FILL}', 'red'));

var blueIcon = new H.map.Icon(svgIcon.replace('${FILL}', '#007fff'));

var activeMarker;


/**
 * This function will be called for crating marker with based on passed place position.
 *
 * @param  {Object} placeLink    A JSONP object representing the place link
 * @param  {H.map.Icon} icon     svg representation of marker
 */
function createMarker(placeLink, icon) {
  var marker = new H.map.Marker({lat: placeLink.position[0], lng: placeLink.position[1]}, {icon: icon});
  //data is valude that marker can hold. we save whole place so we can latter get
  //follow function when we click on it
  return marker.setData(placeLink);
}


/**
 * This function update marker selection
 *
 * @param  {Object} marker
 */
function updateMarkerSelection(marker) {
  if (activeMarker) {
    // return to unselected marker
    group.addObject(createMarker(activeMarker.getData(), blueIcon));
    group.removeObject(activeMarker);
  }
  activeMarker = createMarker(marker.getData(), redIcon);
  group.addObject(activeMarker);
  group.removeObject(marker);
}

exploreRequest(platform);