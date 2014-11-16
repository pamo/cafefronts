var feed = new Instafeed({
  get: 'user',
  userId: 30792403,
  accessToken: '30792403.467ede5.f5d03294259546698b7d513af731a00b',
  useHttp: true,
  template: '<h3>{{location}}</h3><a href="{{link}}"><img src="{{image}}" /></a><p>{{caption}}</p>',
  filter: function(image) {
    return image.tags.indexOf('cafefront') >= 0;
  },
  after: function(){
    if (this.hasNext()) {
      feed.next();
    }
  }
});
feed.run();

