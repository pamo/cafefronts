var geoJson = [];
var feed = new Instafeed({
  get: 'user',
  userId: 30792403,
  accessToken: '30792403.467ede5.f5d03294259546698b7d513af731a00b',
  useHttp: true,
  template: '<h3>{{location}}</h3><a href="{{link}}"><img src="{{image}}" /></a><p>{{caption}}</p>',
  filter: function(image) {
      if(image.tags.indexOf('cafefront') >= 0){
          geoJson.push({
              type: 'Feature',
              geometry: {
                  type: 'Point',
                  coordinates: [image.location.latitude, image.location.longitude]
              },
              properties: {
                  description: image.caption.text,
                  title: image.location.name,
                  'marker-color': '#548cba'
              }
          });
      }
  },
  after: function(){
    if (this.hasNext()) {
      feed.next();
    }
  },
  success: function(){
      photoLayer.setGeoJSON(geoJson);
   }
});
