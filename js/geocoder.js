var geocoder;
function initialize() {
  geocoder = new google.maps.Geocoder();
}

initialize();

function getLatLng(address, callback) {
  geocoder.geocode( {'address': address}, 
  function(results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
      callback(results[0].geometry.location);
    } else {
      console.log("Geocode was not successful for the following reason: " + status);
      callback(null);
    }
  });
}