/**********************/
/* Diverse funktioner */
/**********************/

/* Konverterar 10-siffrigt ISBN till 13-siffrigt */
function convert10to13(isbn) {
	var isbn13_prefix = "978",
		str = isbn13_prefix.concat(isbn.substr(0,9)),
		arr = str.split("");
 
	var i = 0,
		sum = 0,
		cdigit;

	for (i=0;i<arr.length;i++) {
		var x = 3;
		if(i%2 === 0) {
			x = 1;
			sum += arr[i] * x;
		}
	}

	cdigit = 10 - sum%10;
		
	return str + cdigit;
}

/* Konverterar 13-siffrigt ISBN till 10-siffrigt */
function convert13to10(isbn) {
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
}

/* Trunkera bokbeskrivningar och annat */
function truncate(text, length, ellipsis) {    

    // Set length and ellipsis to defaults if not defined
    if (typeof length === 'undefined') { 
		var length = 100;
	}
    if (typeof ellipsis === 'undefined') { 
		var ellipsis = '[...]';
	}

    // Return if the text is already lower than the cutoff
    if (text.length < length) {
		return text;
	}

    // Otherwise, check if the last character is a space.
    // If not, keep counting down from the last character
    // until we find a character that is a space
    for (var i = length-1; text.charAt(i) !== ' '; i--) {
        length--;
    }

    // The for() loop ends when it finds a space, and the length var
    // has been updated so it doesn't cut in the middle of a word.
    return text.substr(0, length) + ellipsis;
}

