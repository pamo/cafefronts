var $ = window.jQuery;
var map, aboutAttribution, sideBar, currentId = '';

function createFeature(image){
    return {
        "type": "Feature",
        "geometry": {
            "type": "Point",
            "coordinates": image.coordinates,
        },
        "properties": {
            "title": image.title,
            "id": image.id,
            "url": image.url,
            "image": image.imageSrc,
            "description": image.description,
            "marker-color": "#548cba",
            "marker-symbol": "cafe"
        }
    }
}

function bindCustomPopup(e){
    var photoDimension = '306';
    var marker = e.layer,
    feature = marker.feature;

    var popupContent = '<a target="_blank" class="popup" href="' + feature.properties.url + '">' +
        '<h3>' + feature.properties.title + '</h3>' +
        '<img src="' + feature.properties.image.url + '" width="' + photoDimension + '" height="' + photoDimension + '" /></a>' +
        feature.properties.description;

    marker.bindPopup(popupContent, {
        minWidth: photoDimension
    });
}

function fetchAndAddMarkers() {
  $.get('http://insta-pamo.herokuapp.com/tag/cafefront', function(data){
    var featureLayer = L.mapbox.featureLayer().addTo(map);
    var geoJson = [];

    sideBarList  = $('.navigation-list');
    data.forEach(function(photo){
      sideBarList.append('<li class="navigation-list-item">' + photo.title + '</li>');
      geoJson.push(createFeature(photo));
    });
    featureLayer.on('layeradd', bindCustomPopup);
    featureLayer.setGeoJSON({type: 'FeatureCollection', features: geoJson});
  });
}

$(function(){
  L.mapbox.accessToken = 'pk.eyJ1IjoicGFtbyIsImEiOiJxV2RMRDJzIn0.qLQR4fGJEXfiHeY2eZ5R-g';
  map = L.mapbox.map('map', 'pamo.hlc07n47', {attributionControl: false}).setView([37.7577,-122.4376], 10);
  map.zoomControl.setPosition('topright');

  sideBar  = $('.navigation');
  aboutAttribution = L.control.attribution({prefix: ''})
  .addAttribution('<a href="http://pamo.github.io/words/2014/10/12/cafe-fronts.html"' +
  ' target="_blank"><strong>Cafe Fronts</strong>, a pet photo project</a>')
  .addTo(map);
  sideBar.click(function(e){
    clickedItem = e.target.innerText;
    map.eachLayer(function(marker){
      if(marker.feature && marker.feature.properties.title == clickedItem){
        map.panTo(marker.getLatLng());
        marker.openPopup();
      }
    });
  });
  fetchAndAddMarkers();
});
