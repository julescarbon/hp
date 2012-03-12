$(function(){
  // set the date
  
  var URL = "http://thehuffingtownpost.com/api/read";
  function image_tag (img, link) {
    if (! img || img === undefined) return "";
    var tag = "<img src=\"" + img + "\">";
    if (link && link.length)
      return link_to(link, tag);
    return tag;
  }
  function link_to (link, tag) {
    return "<a href=\"" + link + "\">" + tag + "</a>";
  }
  function parse (data) {
    var tag = null, tags = [];
    for (var i in data.posts) {
      parse_post(data.posts[i], tags);
    };
    return tags;
  }
  function parse_post(post, tags) {
    var tags = tags || [];
    switch (post.type) {
      case 'photo':
        if (post['photo-caption'].length > 0)
          tags.push( post['photo-caption'] );
        if (post['photo-url-1280'].length > 0)
          tags.push( image_tag(post['photo-url-1280']) );
        break;
      case 'text':
      default:
        tags.push( image_tag(post['photo-url-1280']) );
        break;
    };
    return tags.length ? tags : null;
  }
  function Header () {
    var dd = new Date();
    var months = "January February March April May June July August September October November December".split(" ");
    $("date").html(months[dd.getMonth()]+ " " + dd.getDate() + ", " + dd.getFullYear());
  }
  function Tumblr (params, callback) {
    this.params = params || {};
    this.params['format'] = 'json';
    $.ajax({
      "url": URL,
      "data": params,
      "dataType": "jsonp",
      "success": callback
    });
  }
  
  Header();

  // feature
  Tumblr({"tagged": ""}, function(data){
console.log(data);
    var feature = data.posts.shift();
    $("feature").html(parse_post(feature).join(""));
    $("headlines").html(parse(data).join("<br>"));
  });

  // ads
  Tumblr({"tagged": "ad"}, function(data){
    $("ads").html(parse(data).join("<br>"));
  });
});

