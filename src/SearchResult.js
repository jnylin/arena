/* 
	Enbart dynamiska listor eller både dynamiska listor och den riktiga träfflistan??
	
	Göm språkfältet // Inte
	Hämta filmomslag // Gemensamt
	Snygga till titelfältet // Gemensamt
	Trunkera titlarna // Inte
	Visa om smakprov finns // Gemensamt
 */
 
 /* Relationen träfflista - post; i träfflistan finns poster */
 
function SearchResult() {
	/*portlet-listRecordSearchResult*/
	/*portlet-queryRecordSerachResult*/
	
	this.init();
	/*Wicket.Ajax.registerPostCallHandler(function () { 
		this.init();
	});	*/

}

SearchResult.prototype.init = function() {
	/* Den här funktionen borde kunna ta inställningar */
	$('.arena-library-record').each(function() {
		var libraryRecord = new CatalogueRecord(this,'record');
		libraryRecord.truncateTitle();
		//libraryRecord.getSmakprov('list');
	});
}

SearchResult.prototype.smakprov = function() {
	/* .arena-library-record.each återkommer */
}

SearchResult.prototype.dvdCovers = function() {
}




