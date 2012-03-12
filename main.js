$(function(){
  // set the date
  
  var URL = "http://thehuffingtownpost.com/api/read";
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
    console.log(data);
  });

  // ads
  Tumblr({"tagged": "ad"}, function(data){
    console.log(data);
  });
});

