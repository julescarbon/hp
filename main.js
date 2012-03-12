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
  function parse (posts) {
    var tag = null, tags = [];
    for (var i in posts) {
      parse_post(posts[i], tags);
    };
    return tags;
  }
  function parse_post(post, tags) {
    var tags = tags || [];
    switch (post.type) {
      case 'photo':
        if (post['photo-caption'].length > 60 && tags.length === 0) {
          if (post['photo-url-1280'].length > 0)
            tags.push( image_tag(post['photo-url-1280']) );
          tags.push( post['photo-caption'] );
        }
        else if (post['photo-caption'].length > 0) {
          tags.push( post['photo-caption'] );
          if (post['photo-url-1280'].length > 0)
            tags.push( image_tag(post['photo-url-1280']) );
        } else {
          if (post['photo-url-1280'].length > 0)
            tags.push( image_tag(post['photo-url-1280']) );
        }
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
  Tumblr({}, function(data){
    var real_posts = [];
    for (var i in data.posts) {
      if (data.posts[i].tags) continue;
      real_posts.push(data.posts[i])
    }
    var feature = real_posts.shift();
    var headlines = parse(real_posts);
    $("feature").html(parse_post(feature).join(""));
    $("headlines").html(headlines.join("<br>"));
  });

  // ads
  Tumblr({"tagged": "ad"}, function(data){
    $("ads").html(parse(data.posts).join("<br>"));
  });
});

