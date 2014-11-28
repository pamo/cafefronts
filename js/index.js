var geoJson = [];
var formatDescription = function(caption){
    caption = caption.split(' ').slice(2).join(' ');
    return caption.split('.').join('.<br \>\n');
};

var feed = new Instafeed({
    get: 'user',
    userId: 30792403,
    accessToken: '30792403.467ede5.f5d03294259546698b7d513af731a00b',
    useHttp: true,
    template: "<li id={{model.location.id}}>{{model.location.name}}</li>",
    filter: function(image) {
        if(image.tags.indexOf('cafefront') >= 0){
            geoJson.push({
                "type": "Feature",
                "geometry": {
                    "type": "Point",
                    "coordinates": [image.location.longitude, image.location.latitude]
                },
                "properties": {
                    "title": image.location.name,
                    "id": image.location.id,
                    "image": image.images.standard_resolution.url,
                    "url": image.link,
                    "description": formatDescription(image.caption.text),
                        "marker-color": "#548cba",
                        "marker-size": "large",
                            "marker-symbol": "cafe"
                }
            });
            return image;
        }
    },
    after: function(){
        var paginatedLayer = L.mapbox.featureLayer().addTo(map);
        if (this.hasNext()) {
            paginatedLayer.on('layeradd', function(e) {
                var marker = e.layer,
                feature = marker.feature;

                var popupContent = '<a target="_blank" class="popup" href="' + feature.properties.url + '">' +
                    '<h3>' + feature.properties.title + '</h3>' +
                    '<img src="' + feature.properties.image + '" width="306" height="306" /></a>' +
                    feature.properties.description;

                marker.bindPopup(popupContent, {
                    minWidth: 320
                });
            });
            paginatedLayer.setGeoJSON({type:'FeatureCollection', features: geoJson});
            geoJson = [];
            feed.next();
        }
    }
});

feed.run();
