
var timer = document.getElementById('timer');
var toggleBtn = document.getElementById('toggle');
var resetBtn = document.getElementById('reset');

var watch = new Stopwatch(timer);


function start() {
    watch.start();
    document.getElementById('lightning').style.display = "none";
    document.getElementById('thunder').style.display = "block";
}

function getPathFromUrl(URL) {
  return url.split(/[?#]/)[0];
}

function stop() {
    document.getElementById('thunder').style.display = "none";
    document.getElementById('reset').style.display = "block";
  watch.stop();
    applyPos();
    
}

//If a query string exists THEN hide the "Saw Lightning" Button
if(document.location.search.length) {
   document.getElementById('lightning').style.display = "none";
    
}

//If a query string DOES NOT exist THEN hide the "Reset" Button
if(!document.location.search.length) {
    document.getElementById('reset').style.display = "none";
    document.getElementById('lightningSummary').style.display = "none";
}

function reset() {
   window.location.href =  window.location.href.split("?")[0]; //Remove query string. 
}

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
};




$( document ).ready(function() {
  
    document.getElementById('lightningSummary').innerHTML = "The lightning struck approximately " + currentRadius.toFixed(2) + " metres from your current location.";
    
});

var currentRadius = parseFloat(getParameterByName('Radius'));
var currentLat = parseFloat(getParameterByName('lat'));
var currentLong = parseFloat(getParameterByName('long'));

console.log(currentRadius);
console.log(currentLat);
console.log(currentLong);

var citymap = {
    currentLocation: {
    center: {lat: currentLat, lng: currentLong},
    population: currentRadius
    }
    
    
};



var map, pos, currentLocation, infoWindow;
function initMap() {
    
  // Create the map.
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: -34.397, lng: 150.644},
    zoom: 14
  });
  infoWindow = new google.maps.InfoWindow;

  // Try HTML5 geolocation.
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };       
        
var markerCurrent = new google.maps.Marker({
    position: pos,
    map: map,
    title: 'Hello World!'
  });

      infoWindow.setPosition(pos);
      //infoWindow.setContent('Location found.');
      //infoWindow.open(map);
      map.setCenter(pos);
    }, function() {
      handleLocationError(true, infoWindow, map.getCenter());
    });
  } else {
    // Browser doesn't support Geolocation
    handleLocationError(false, infoWindow, map.getCenter());
  };
  // Construct the circle for each value in citymap.
  // Note: We scale the area of the circle based on the population.
  for (var city in citymap) {
    // Add the circle for this city to the map.
    var cityCircle = new google.maps.Circle({
      strokeColor: '#FF0000',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: '#FF0000',
      fillOpacity: 0.35,
      map: map,
      center: citymap[city].center,
      radius: citymap[city].population
    });
      
  }
    
// Create the search box and link it to the UI element.
  var input = document.getElementById('pac-input');
  var searchBox = new google.maps.places.SearchBox(input);
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

  // Bias the SearchBox results towards current map's viewport.
  map.addListener('bounds_changed', function() {
    searchBox.setBounds(map.getBounds());
  });

  var markers = [];
  // Listen for the event fired when the user selects a prediction and retrieve
  // more details for that place.
  searchBox.addListener('places_changed', function() {
    var places = searchBox.getPlaces();

    if (places.length == 0) {
      return;
    }

    // Clear out the old markers.
    markers.forEach(function(marker) {
      marker.setMap(null);
    });
    markers = [];

    // For each place, get the icon, name and location.
    var bounds = new google.maps.LatLngBounds();
    places.forEach(function(place) {
      if (!place.geometry) {
        console.log("Returned place contains no geometry");
        return;
      }
      var icon = {
        url: place.icon,
        size: new google.maps.Size(71, 71),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(25, 25)
      };

      // Create a marker for each place.
      markers.push(new google.maps.Marker({
        map: map,
        icon: icon,
        title: place.name,
        position: place.geometry.location
      }));

      if (place.geometry.viewport) {
        // Only geocodes have viewport.
        bounds.union(place.geometry.viewport);
      } else {
        bounds.extend(place.geometry.location);
      }
    });
    map.fitBounds(bounds);
  });
};

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(browserHasGeolocation ?
                        'Error: The Geolocation service failed.' :
                        'Error: Your browser doesn\'t support geolocation.');
  infoWindow.open(map);
};




function applyPos(){  
   document.getElementById('currentLat').value = pos.lat;
    document.getElementById('currentLong').value = pos.lng;
};

