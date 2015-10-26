function Isbn(isbn) {
	var str_isbn = isbn.toString();
	this.init(str_isbn);
}

Isbn.prototype.init = function(isbn) {
	try {
		if ( isbn.length === 13 ) {
			console.log("isbn13");
			this.isbn13 = isbn;
			this.isbn10 = this.convert13to10(isbn);
		}
		else if ( isbn.length === 10 ) {
			console.log("isbn10");
			this.isbn10 = isbn;
			this.isbn13 = this.convert10to13(isbn);
		}
		else {
			throw 'Not a valid isbn';
		}
	}
	catch (err) {
		console.log(err);
	}
};

Isbn.prototype.convert10to13 = function(isbn) {
/* Konverterar 10-siffrigt ISBN till 13-siffrigt */
	var isbn13_prefix = "978",
		str = isbn13_prefix.concat(isbn.substr(0,9)),
		arr = str.split("");
 
	var i = 0,
		sum = 0,
		cdigit;

	for (i=0;i<arr.length;i++) {
		var x;
		if(i%2 === 0) {
			x = 1;
		}
		else {
			x = 3;
		}
		sum += arr[i] * x;
	}

	cdigit = 10 - sum%10;
	if ( cdigit === 10 ) { cdigit = 0; }
		
	return str + cdigit;
};

Isbn.prototype.convert13to10 = function(isbn) {
/* Konverterar 13-siffrigt ISBN till 10-siffrigt */
	var str = isbn.substr(3,9),
		arr = str.split("");
 
	var i = 0,
		x = 10,
		sum = 0,
		cdigit;
	for (i=0;i<arr.length;i++,x--) {
		sum += arr[i] * x;
	}
	cdigit = 11 - sum%11;
	if ( cdigit === 11 ) { cdigit = 0; }
	if ( cdigit === 10 ) { cdigit = "X"; }
		
	return str + cdigit;
};
