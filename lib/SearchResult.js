function SearchResult(e, options) {

	var settings = $.extend(this.settings, options);
	
	this.init(e, settings);

}

SearchResult.prototype.init = function(e, settings) {
	e.find('.arena-library-record').each(function() {
		var libraryRecord = new CatalogueRecord(this, 'list');

		if ( settings.trimTitle ) {
			libraryRecord.trimTitle();
		}

		if ( settings.truncate ) {
			libraryRecord.truncateTitle();
		}

		if ( libraryRecord.isbn ) {
			libraryRecord.hideField('isbn');
			libraryRecord.smakprov();
		}
		
		if ( libraryRecord.media === 'DVD' ) {
			libraryRecord.dvd();
		}

	});
};

SearchResult.prototype.settings = {
	trimTitle: true,
	truncate: false
};
