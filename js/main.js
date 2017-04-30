
var timer = document.getElementById('timer');
var toggleBtn = document.getElementById('toggle');
var resetBtn = document.getElementById('reset');

var watch = new Stopwatch(timer);


function start() {
    watch.start();
    document.getElementById('lightning').style.display = "none";
    document.getElementById('thunder').style.display = "block";
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
   document.getElementById('timer').style.display = "none"; 
    
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
  
    document.getElementById('lightningSummary').innerHTML = "The lightning struck approximately " + currentRadius.toFixed(2) + "(or) metres from your current location.";
    
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
    //title: 'Hello World!'
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

