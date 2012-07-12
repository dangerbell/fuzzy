(function($) {
	var SEARCH_URL = 'http://search.twitter.com/search.json?q=';
	
	// puppy OR puppies OR kitty OR kitties filter:images
	// apparently 'filter:images' is undocumented Twitter functionality. 'filter:urls' is the standard.
	var QUERY = 'puppy%20OR%20puppies%20OR%20kitty%20OR%20kitties%20filter%3Aimages';

	// include_entities lets twitter do the parsing of hashtags and urls for you and puts it in a convenient container.
	// rpp is 'results per page' max is 100.
	// callback=? is to enable JSONP.
	var OPTIONS = '&include_entities=true&rpp=25&callback=?';

	var imageQueue = [];

	var placeImage = function() {
		var src = imageQueue.shift();
		if( typeof src != "undefined" ) {

			// TODO: make a nice transition
			// TODO: preload image then add to 
			jQuery("#images").prepend('<img src="' + src + '" />');
		}
	};

	// Take search results and pull out the images.
	var parseEntities = function(data, textStatus, jqXHR){

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
					var src = urls[0].expanded_url + INSTAGRAM_IMAGE_SUFFIX
				}

				// add our image to the display queue.
				if( src !== "" ) {
					imageQueue.push(src);
				}
			}

		});
	};

	// Pull tweets about puppies and kitties from Twitter.
	$.getJSON(SEARCH_URL + QUERY + OPTIONS, parseEntities);

	var intervalID  = window.setInterval(placeImage, 5000)

})(jQuery);