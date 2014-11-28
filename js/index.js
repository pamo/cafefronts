var geoJson = [];
var feed = new Instafeed({
    get: 'user',
    userId: 30792403,
    accessToken: '30792403.467ede5.f5d03294259546698b7d513af731a00b',
    useHttp: true,
    template: '<a href="{{link}}" target="_blank"><img src="{{image}}"></a><p>{{image.caption.text.toString()}}</p>',
    filter: function(image) {
        if(image.tags.indexOf('cafefront') >= 0){
            geoJson.push({
                "type": "Feature",
                "geometry": {
                    "type": "Point",
                    "coordinates": [image.location.latitude,image.location.longitude]
                },
                "properties": {
                    "title": image.location.name,
                    "description": this.template,
                    "marker-color": "#548cba",
                        "marker-size": "large",
                        "marker-symbol": "monument"
                }
            });
        }
    },
    after: function(){
        if (this.hasNext()) {
            var paginatedLayer = L.mapbox.featureLayer();
            paginatedLayer.setGeoJSON(geoJson);
            geoJson = [];
            paginatedLayer.addTo(map);
            feed.next();
        }
    }
});
feed.run();
