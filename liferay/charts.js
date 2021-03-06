(function($) {
	function init() {
		$.cachedScript("http://bibliotek.vimmerby.se/documents/58068/138011/arenajs.min.js/ce0740d4-a718-4217-aa67-55035d95f6eb").done(function() {
			var cssClass = 'portlet-listRecordSearchResult',
				settings = {
					hideFields: ['media']
				};

			var list = new SearchResult($('.'+cssClass), settings);
			Wicket.Ajax.registerPostCallHandler(function() {
				list = new SearchResult($('.'+cssClass), settings);
				$('.charts').css('counter-reset', 'record ' + ( (list.pageNr-1)*10 ));
			});
		});
	}

	// Cross-domain AJAX för IE 8 och 9
	if ( $('html').attr('class').match(/\b(ie9|ie8)\b/) ) {
		$.cachedScript('http://cdnjs.cloudflare.com/ajax/libs/jquery-ajaxtransport-xdomainrequest/1.0.3/jquery.xdomainrequest.min.js').done( function() {
			init();
		});
	}
	else {
		init();
	}

}(jQuery));
