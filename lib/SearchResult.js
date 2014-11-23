/* 
	Enbart dynamiska listor eller både dynamiska listor och den riktiga träfflistan??
	
	Göm språkfältet // Inte
	Hämta filmomslag // Gemensamt
	Snygga till titelfältet // Gemensamt
	Trunkera titlarna // Inte
	Visa om smakprov finns // Gemensamt
 */
 
 /* Relationen träfflista - post; i träfflistan finns poster */
 
function SearchResult(e) {
	/*portlet-listRecordSearchResult*/
	/*portlet-queryRecordSearchResult*/

	console.log(e.find('.arena-library-record'));
	
	this.init();
	Wicket.Ajax.registerPostCallHandler(function () { 
		this.init();
	});

}

SearchResult.prototype.init = function() {
	/* Den här funktionen borde kunna ta inställningar */
	/* selector?? element?? */
	/* element.find('.arena-library-record').each */
	$('.arena-library-record').each(function() {
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
