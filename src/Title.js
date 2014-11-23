function Title(str,origTi) {
	var h, b, c, n, ti, subTi, part;
	ti = str;
	origTi = origTi || ti;
	
	console.log("ti = " + ti);
	console.log(ti);
	console.log("ti.search = " + ti.search);

	// "Klipp ut" undertitel, delbeteckning och huvudtitel!!
	h = ti.search("\\[");    // Medieterm
	b = ti.search(" :");     // Undertitel
	c = ti.search("/");      // Upphov
	// Delbeteckning
	n = ti.search("\\[?(P\\.|Season|Series)"); // Behöver få fram säsongsnummer!
	
	
	// Klammer
			
	if ( b > -1 ) {
		b = b+1;
	}			
	if ( c > -1 ) {
		c = c+2;
	}

	// Undertitel
	subTi = "";
	if ( b > -1 ) {
		b = b+2;			

		if ( c > -1 ) {
			subTi = ti.substr(b, c-b-3);
		}
		else if ( n > -1 ) {
			subTi = ti.substr(b, n-b-1);		
		}
		else {
			subTi = ti.substr(b);
		}
		
		subTi = subTi.replace(/[\[\]]/g,"");
	}
			
	// Underserie/delbeteckning
	part = "";
	if ( n > -1 ) {
		str = ti.substr(n);
		console.log(str);
		part = str.substr(str.search(/[0-9]/));
		part = part.replace("]","");
		str = "";
		if ( part === -1 ) {
			part = "";
		}
	}
			
	// Titel
	if ( h === n )  {
		h = -1; /* Hantera mångtydigheten hos klammer */
	}
	if ( h > -1 && h < c ) {
		ti = ti.substr(0, h-1);
	}
	else if ( b > -1 && ( c === -1 || b < c ) ) {
		ti = ti.substr(0, b-3);
	}
	else if ( c > -1 ) {
		ti = ti.substr(0, c-3);			
	}
	else if ( n > -1 ) {
		ti = ti.substr(0, n-1);			
	}

	
	// Sätt egenskaper
	this.main = ti;
	if ( subTi !== '' ) {
		this.sub = subTi;
	}
	this.original = origTi;
	if ( part !== '' ) {
		this.part = part;
	}
}
