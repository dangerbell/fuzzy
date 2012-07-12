(function($) {
	// https://twitter.com/#!/search/puppies%20OR%20kitties%20filter%3Aimages
	$.getJSON('http://search.twitter.com/search.json?q=puppy%20OR%20puppies%20OR%20kitty%20OR%20kitties%20filter%3Aimages&include_entities=true&rpp=100&callback=?', function(data, textStatus, jqXHR){
		data.results.forEach(function(value, index, array){
			if( typeof value.entities.media != "undefined" ){
				debugger;
			}
		});
		debugger;
	});
})(jQuery);