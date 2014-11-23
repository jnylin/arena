// TESTA på dynamiska listor!
 
function SearchResult(e) {
	
	this.init(e);
	Wicket.Ajax.registerPostCallHandler(function () { 
		this.init(e);
	});

}

SearchResult.prototype.init = function(e) {
	/* Borde den här funktionen kunna ta inställningar?
	 * Fält att gömma? Funktioner att lägga till? */
	e.find('.arena-library-record').each(function() {
		var libraryRecord = new CatalogueRecord(this, 'list');
		libraryRecord.truncateTitle();
		if ( libraryRecord.isbn ) {
			libraryRecord.hideField('isbn');
			if ( libraryRecord.media === 'Bok' ) {
				libraryRecord.addSmakprov();
			}
		}
	});
};
