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

		if ( libraryRecord.isbn && libraryRecord.fieldIsVisible('isbn') ) {
			libraryRecord.hideField('isbn');
			libraryRecord.smakprov();

			if ( libraryRecord.publisher && libraryRecord.fieldIsVisible('publisher') ) {
				libraryRecord.hideField('publisher');
				libraryRecord.bokvideo();
			}

		}
		
		if ( libraryRecord.fieldIsVisible('media') ) {
			switch ( libraryRecord.media ) {
				case 'DVD':
					libraryRecord.dvd();
					break;
				case 'Bok':
					//libraryRecord.bokpuffen();
					break;
			}
		}

		/* För många anrop till Pipes
		if ( libraryRecord.media.toLowerCase().indexOf("ljudbok") > -1 ) {
			libraryRecord.ljudprov();
		}*/

		// Optional hiding of fields
		$.each( settings.hideFields, function(i, field) {
			libraryRecord.hideField(field);
		});

	});
};

SearchResult.prototype.settings = {
	trimTitle: true,
	truncate: false,
	hideFields: []
};
