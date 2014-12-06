function Smakprov(catalogueRecord) {
	
	//$.getJSON('/smakprov/v1/records?isbn=' + catalogueRecord.isbn, that.callback(this, catalogueRecord.view));	
	$.getJSON('http://jnylin.name/bibl/smakprov/provlasSmakprov.php?isbn=' + catalogueRecord.isbn, this.callback(this, catalogueRecord.view));		

	this.getCatalogueRecord = function() {
		return catalogueRecord;
	};
	
}

Smakprov.prototype.callback = function(thisObj, view) {
	return function(records) {
		if ( records.length > 0 ) {
	
			switch (view) {
				case 'detail':
					thisObj.getCatalogueRecord().methodsOnThisView.addLnkToExtRes(thisObj.getUrl(), 'Smakprov', 'Läs ett smakprov av boken', '_blank', 'btnRead');
					break;
				case 'list':
					thisObj.getCatalogueRecord().methodsOnThisView.advertise('Smakprov');
					break;
			}
		
		}
	};
};

Smakprov.prototype.getUrl = function() {
	return 'http://www.smakprov.se/smakprov.php?isbn=' + this.getCatalogueRecord().isbn + '&l=vimmerby';
};
