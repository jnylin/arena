function Smakprov(isbn, callback) {
	var that = this;
	this.isbn = isbn;
	
	$.getJSON('/smakprov/v1/records?isbn=' + this.isbn, that.callback(this, callback));	
	
}

Smakprov.prototype.callback = function(obj, type) {
	return function(records) {
		if ( records.length > 0 ) {
			console.log("type = " + type);
			console.log("smakprov på " + obj.getUrl() );
	
			switch (type) {
				case 'detail':
					//appendExternalRes(obj.getUrl(),"Smakprov","Läs ett smakprov av boken","_blank","btnRead");				
					break;
				case 'list':
					// Utveckla det här, sätt sedan den här delen i produktion
					break;
			}
		
		}
	};
};

Smakprov.prototype.getUrl = function() {
	return 'http://www.smakprov.se/smakprov.php?isbn=' + this.isbn + '&l=vimmerby';
};
