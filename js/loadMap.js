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

$.get('http://insta-pamo.herokuapp.com/tagged/cafefront', function(data){
    var featureLayer = L.mapbox.featureLayer().addTo(map);
    var geoJson = [];

    data.photos.forEach(function(photo){
        console.log(photo);
        geoJson.push(createFeature(photo));
    });

    featureLayer.setGeoJSON({type: 'FeatureCollection', features: geoJson});
});

$(function(){
    sideBar  = document.getElementById('nav');
    L.mapbox.accessToken = 'pk.eyJ1IjoicGFtbyIsImEiOiJxV2RMRDJzIn0.qLQR4fGJEXfiHeY2eZ5R-g';
    map = L.mapbox.map('map', 'pamo.hlc07n47', {attributionControl: false}).setView([37.7577,-122.4376], 13);
    map.zoomControl.setPosition('topright');

    aboutAttribution = L.control.attribution({prefix: ''})
                .addAttribution('<a href="http://pamo.github.io/words/2014/10/12/cafe-fronts.html"' +
                        ' target="_blank"><strong>Cafe Fronts</strong>, a pet photo project</a>')
                .addTo(map);
                sideBar.onclick = function(e){
                    currentId = e.target.id;
                    map.eachLayer(function(marker){
                        if(marker.feature && marker.feature.properties.id == currentId){
                            map.panTo(marker.getLatLng());
                            marker.openPopup();
                        }
                    });
                };


    console.log('ready to go!');
});