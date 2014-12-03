(function($) {
	$.cachedScript("http://bibliotek.vimmerby.se/documents/58068/138011/arenajs.min.js/ce0740d4-a718-4217-aa67-55035d95f6eb").done(function() {
		var cssClass = 'portlet-listRecordSearchResult';

		new SearchResult($('.'+cssClass));
		Wicket.Ajax.registerPostCallHandler(function() {
			new SearchResult($('.'+cssClass));
		});
	});
}(jQuery));
