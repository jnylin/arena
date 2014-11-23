function Smakprov(catalogueRecord) {
	// Använd CatalogueRecord som argument
	// objektet har isbn och view
	var that = this;
	
	$.getJSON('/smakprov/v1/records?isbn=' + catalogueRecord.isbn, that.callback(this, catalogueRecord.view));	

	this.getCatalogueRecord = function() {
		return catalogueRecord;
	};
	
}

Smakprov.prototype.callback = function(thisObj, view) {
	return function(records) {
		if ( records.length > 0 ) {
			console.log("type = " + view);
			console.log("smakprov på " + thisObj.getUrl() );
	
			switch (view) {
				case 'detail':
					// Använd CatalogueRecord.addLnkToExtRes
					//appendExternalRes(obj.getUrl(),"Smakprov","Läs ett smakprov av boken","_blank","btnRead");				
					break;
				case 'list':
					thisObj.getCatalogueRecord().advertise('Smakprov');
					break;
			}
		
		}
	};
};

Smakprov.prototype.getUrl = function() {
	return 'http://www.smakprov.se/smakprov.php?isbn=' + this.getCatalogueRecord().isbn + '&l=vimmerby';
};
