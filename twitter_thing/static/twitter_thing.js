(function($) {
	// https://twitter.com/#!/search/puppies%20OR%20kitties%20filter%3Aimages
	$.getJSON('http://search.twitter.com/search.json?q=puppy%20OR%20puppies%20OR%20kitty%20OR%20kitties%20filter%3Aimages&include_entities=true&rpp=25&callback=?', function(data, textStatus, jqXHR){
		data.results.forEach(function(value, index, array){
			if( typeof value.entities.urls != "undefined" ){
				if (value.entities.urls[0].display_url.search(/instagr/) != -1) {
					var src = value.entities.urls[0].expanded_url + "/media/?size=l"
					jQuery("#images").append('<img src="' + src + '" />')
				}
			}
		});
		debugger;
	});
})(jQuery);