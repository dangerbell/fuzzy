(function($) {
	// https://twitter.com/#!/search/puppies%20OR%20kitties%20filter%3Aimages
	$.getJSON('http://search.twitter.com/search.json?q=puppies&callback=?', function(data, textStatus, jqXHR){
		debugger;
	});
})(jQuery);