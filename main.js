$(function(){

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
  function first_half (list) {
    return list.splice(0, Math.floor(list.length/2))
  }
  function second_half (list) {
    var half = Math.floor(list.length/2);
    return list.splice(half, list.length - half);
  }
  function parse_post(post, tags) {
    var this_tags = [];
    switch (post.type) {
      case 'regular': // reblog was coming through in this format
        if (post['regular-body'].length > 0) {
          this_tags.push( post['regular-body'] );
        }
        break;
      case 'photo':
        if (post['photo-caption'].length > 60 && tags) {
          if (post['photo-url-1280'].length > 0)
            this_tags.push( image_tag(post['photo-url-1280']) );
          this_tags.push( post['photo-caption'] );
        }
        else if (post['photo-caption'].length > 0) {
          this_tags.push( post['photo-caption'] );
          if (post['photo-url-1280'].length > 0)
            this_tags.push( image_tag(post['photo-url-1280']) );
        } else {
          if (post['photo-url-1280'].length > 0)
            this_tags.push( image_tag(post['photo-url-1280']) );
        }
        break;
      case 'text':
      default:
        this_tags.push( image_tag(post['photo-url-1280']) );
        break;
    };
    if (this_tags.length)
      this_tags = "<div>" + this_tags.join("") + "</div>";
    if (tags)
      tags.push(this_tags);
    else
      return this_tags;
  }
  function fix_heights (){
    $("columns").height(Math.max($("story").height(), $("headlines").height()));
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
    $("feature").html(parse_post(feature));

    $("story").html(first_half(headlines).join(""));

    var two = second_half(headlines);
    $("headlines").append(two.join(""));
    $("p").each(function(){
      this.innerHTML.length === 0 && $(this).remove();
    });
    $("img").load(fix_heights);
  });

  // ads
  Tumblr({"tagged": "ad"}, function(data){
    $("headlines").prepend(parse(data.posts).join(""));
    fix_heights();
  });
});

