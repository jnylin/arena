function Smakprov(record) {
	this.record = record;
	
	//$.getJSON('/smakprov/v1/records?isbn=' + catalogueRecord.isbn, that.callback(this, catalogueRecord.view));	
	$.getJSON('http://jnylin.name/bibl/smakprov/provlasSmakprov.php?isbn=' + this.record.isbn, this.callback(this, this.record.view));		

}

Smakprov.prototype.callback = function(thisObj) {
	return function(records) {
		if ( records.length > 0 ) {

			switch (thisObj.record.view) {
				case 'detail':
					thisObj.record.methodsOnThisView.addLnkToExtRes(thisObj.getUrl(), 'Smakprov', 'Läs ett smakprov av boken', '_blank', 'btnRead');
					break;
				case 'list':
					thisObj.record.methodsOnThisView.advertise('Smakprov');
					break;
			}
		
		}
	};
};

Smakprov.prototype.getUrl = function() {
	return 'http://www.smakprov.se/smakprov.php?isbn=' + this.record.isbn + '&l=vimmerby';
};
