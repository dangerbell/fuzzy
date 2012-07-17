(function($) {
  var SEARCH_URL = 'http://search.twitter.com/search.json';
  
  // puppy OR puppies OR kitty OR kitties filter:images
  // apparently 'filter:images' is undocumented Twitter functionality. 'filter:urls' is the standard.
  var QUERY = '?q=puppy%20OR%20puppies%20OR%20kitty%20OR%20kitties%20filter%3Aimages';

  // include_entities lets twitter do the parsing of hashtags and urls for you and puts it in a convenient container.
  // rpp is 'results per page' max is 100.
  var OPTIONS = '&include_entities=true&rpp=5';

  // callback=? is to enable JSONP.
  var JSONP_SUFFIX = '&callback=?'

  var refreshUrl = "";
  var nextPage = "";

  var imageQueue = [];

  var placeImage = function() {
    var src = imageQueue.shift();
    if( typeof src != "undefined" ) {

      // Delay showing the image until it's fully loaded.
      // The onLoad event will fire for the image when it's completely downloaded.
      var $placeHolder = $('<img />');
      $placeHolder.css('display', 'none');
      $placeHolder.bind('load', function(){

        // When our image is loaded remove it from the hidden staging area and attach it to the feed.
        var img = jQuery("#images .image.new");
        img.find('img').slideDown('slow');
        img.removeClass('new');
      });

      // apparently you need to attach the load event before you set the 'src' property.
      $placeHolder.prop('src', src);

      var $imageWrapper = $('<div class="image new"></div>');
      var $newImage = $imageWrapper.append($placeHolder);

      // Attach the new image to the hidden staging area.
      // Hidden means off the screen in this case.
      $("#images").prepend($newImage);  
      
    }

    // if we're low on images go get more images.
    if( imageQueue.length < 5 ) {
  
      // you can run out of pages so nextPage might become undefined.
      if( typeof nextPage != "undefined") {
        // TODO: turn off the timer when we're out of pages.
        $.getJSON(SEARCH_URL + nextPage + JSONP_SUFFIX, parseEntities);
      } else {
        $.getJSON(SEARCH_URL + refreshUrl + JSONP_SUFFIX, parseEntities);
      }
    }

    window.setTimeout(placeImage, 5000);

  };

  // Take search results and pull out the images.
  var parseEntities = function(data, textStatus, jqXHR){
    // Twitter conveniently gives you what the query for your next page should be and
    // query for fresh results. Both include the query and your original options.
    nextPage = data.next_page;
    refreshUrl = data.refresh_url;

    // Note that 'forEach' is newer JS and won't work in older browsers.
    // TODO: Add polyfill.
    data.results.forEach( function(value, index, array) {
      var urls = value.entities.urls;

      // make sure this tweet actually has a url in it.
      if( typeof urls != "undefined" ) {

        // Figure out what image service we're dealing with
        // TODO: Support more image services.
        var src = "";
        if( urls[0].display_url.search(/instagr/) != -1 ) {
          var INSTAGRAM_IMAGE_SUFFIX = "media/?size=l";
          src = urls[0].expanded_url + INSTAGRAM_IMAGE_SUFFIX;
        }

        if( urls[0].display_url.search(/yfrog/) != -1 ) {
          var YFROG_IMAGE_SUFFIX = ":iphone"; // alternately ":medium", it's 640px
          src = urls[0].expanded_url + YFROG_IMAGE_SUFFIX;
        }

        if( urls[0].display_url.search(/twitpic/) != -1) {
          var TWITPIC_IMAGE_INFIX = '/show/large/';
          // image format is twitpic.com/show/large/<unique_id>
        }

        // add our image to the display queue.
        if( src !== "" ) {
          imageQueue.push(src);
        }
      }

    });
  };

  var init = function(data, textStatus, jqXHR) {
    parseEntities(data, textStatus, jqXHR);
    placeImage();
  }

  // Pull tweets about puppies and kitties from Twitter.
  $.getJSON(SEARCH_URL + QUERY + OPTIONS + JSONP_SUFFIX, init);

})(jQuery);