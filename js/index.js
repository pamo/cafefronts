var geoJson = [];
var feed = new Instafeed({
    get: 'user',
    userId: 30792403,
    accessToken: '30792403.467ede5.f5d03294259546698b7d513af731a00b',
    useHttp: true,
    template: '<a href="{{link}}" target="_blank"><img src="{{image}}"></a><p>{{image.caption.text.toString()}}</p>',
    filter: function(image) {
        if(image.tags.indexOf('cafefront') >= 0){
            var short_description = image.caption.text.split(' ').slice(2).join(' ');

            geoJson.push({
                "type": "Feature",
                "geometry": {
                    "type": "Point",
                    "coordinates": [image.location.longitude, image.location.latitude]
                },
                "properties": {
                    "title": image.location.name,
                    "image": image.images.low_resolution.url,
                    "url": image.link,
                    "description": short_description,
                    "marker-color": "#548cba",
                    "marker-size": "large",
                    "marker-symbol": "cafe"
                }
            });
        }
    },
    after: function(){
        if (this.hasNext()) {
            var paginatedLayer = L.mapbox.featureLayer();
            paginatedLayer.on('layeradd', function(e) {
                var marker = e.layer,
                feature = marker.feature;

                var popupContent =  '<h3>' + feature.properties.title + '</h3>' +
                    '<a target="_blank" class="popup" href="' + feature.properties.url + '">' +
                    '<img src="' + feature.properties.image + '" />' +
                    feature.properties.description + '</a>';

                marker.bindPopup(popupContent, {
                    minWidth: 320
                });
            });
            paginatedLayer.setGeoJSON(geoJson);
            geoJson = [];
            paginatedLayer.addTo(map);
            feed.next();
        }
    }
});
feed.run();
