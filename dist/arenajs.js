/*! arenajs - v0.1.0 - 2014-11-26
* https://github.com/jnylin/arena
* Copyright (c) 2014 Jakob Nylin; Licensed GPL */
function CatalogueRecord(e, view) {

	var	selector, 
		pattYear = new RegExp("[0-9]{4}", "i"),
		methodsOnThisView,
		title, originalTitle, author, publisher, year, isbns, isbn, media, lang;
	
	// Sätt selector utifrån view och hämta specifika metoder
	this.view = view;
	
	switch (view) {
		case 'detail':
			selector = 'detail';
			methodsOnThisView = new DetailViewMethods(this);
			break;
		case 'list':
			selector = 'record';
			methodsOnThisView = new ListViewMethods(this);
			break;
	}
	
	console.log("methodOnThisView = ");
	console.log(methodsOnThisView);
	
	/* HTML-element */
	this.element = e;
	this.subElements = {
		title: $('.arena-'+selector+'-title span:not(.arena-result-item-number)', this.element),
		originalTitle: $('.arena-detail-original .arena-value', this.element),
		author: $('.arena-'+selector+'-author .arena-value', this.element),
		publisher: $('.arena-record-publisher .arena-value', this.element),		
		year: $('.arena-'+selector+'-year .arena-value', this.element),
		isbns: $('.arena-'+selector+'-isbn .arena-value', this.element),
		media: $('.arena-'+selector+'-media .arena-value', this.element),
		lang: $('.arena-'+selector+'-language .arena-value', this.element),
		cover: $('.arena-'+selector+'-cover', this.element),
		bookJacket: $('.arena-book-jacket', this.element) // länken och bilden ligger i .arena-book-jacket
	};

	/* Hämta rätt värden från elementen */
	title = this.subElements.title.text().trim();
	author = this.subElements.author.text();	
	publisher = this.subElements.publisher.text();
	year = this.subElements.year.text();
	media = this.subElements.media.text();
	lang = this.subElements.lang.text().trim();
	
    /*	ISBN är olika uppmärkt i träfflistan och katalogpostsidan
		.arena-value för record, .arena-value span för detail	*/
	switch (selector) {
		case "record":
			isbns = this.subElements.isbns.text().split(", ");
			break;
		case "detail":
			isbns = [];
			$(this.subElements.isbns).each(function() {
				isbns.push($(this).text().trim());
			});
			break;
	}
	
	if ( isbns ) {
		for ( var i = 0; i < isbns.length; i++ ) {
			var thisIsbn = isbns[i].replace(/-/g,"");
			if ( thisIsbn.length === 13 ) {
				isbn = thisIsbn;
				break;
			}
		}
	}

	/* Egenskaper för katalogposten */
	this.title = new Title(title, originalTitle);
	if ( author ) {
		this.author = {
			inverted: this.subElements.author.text(),
			lastname: this.subElements.author.text().split(',')[0].trim(),
			firstname: this.subElements.author.text().split(',')[1].substring(1).trim()
		};
	}
	if ( publisher ) {
		this.publisher = publisher;
	}
	if ( year ) {
		this.year = pattYear.exec(year);
	}
	if ( media ) {
		this.media = media;
	}	
	if ( lang ) {
		this.lang = lang;
	}	
	if ( isbn ) {
		this.isbn = isbn;
	}
	
	/* Egenskaper för mervärden */
	this.methodsOnThisView = methodsOnThisView;
	
	/* Priviligerade funktioner */
	this.getSelector = function() {
		return selector;
	};

	console.log(this);
}


/***********/
/* Metoder */
/***********/

// Modifiera visningen av katalogposten
CatalogueRecord.prototype.hideField = function(field) {
	$('.arena-'+this.getSelector()+'-'+field).hide();
};

CatalogueRecord.prototype.removeMediumFromTitle = function() {
	// Tar bort allmän medieterm från titel-elementet
	var obj = this.subElements.title;
	obj.text(((obj.text().replace(/\[.*\] ([\/:])/,'$1'))));
};

CatalogueRecord.prototype.truncateTitle = function() {
	var title = this.title.main;

	if ( this.title.part ) {
		title += ' ' + this.title.part;
	}

	this.subElements.title.html( truncate(title, 30) );
};

// Mervärden
CatalogueRecord.prototype.ljudprov = function() {
	new Ljudprov(this);
};

CatalogueRecord.prototype.smakprov = function() {
	new Smakprov(this);
};

function DetailViewMethods(record) {
	try {
		if ( record.view !== 'detail' ) {
			throw 'Only possible from the detail-view';
		}
	}
	catch(err) {
		console.log(err);
	}
}

DetailViewMethods.prototype.addAudioPlayer = function (audioUrl,linkTxt,linkTitle) {
};
/*CatalogueRecord.prototype.addAudioPlayer = function (audioUrl,linkTxt,linkTitle) {
	try {
		if ( this.view !== 'detail' ) {
			throw 'Only possible from the detail-view';
		}
	}
	catch(err) {
		console.log(err);
	}

		//console.log("audioUrl = " + audioUrl);

		// initiera spelare
		$("#audioplayer").jPlayer({
			ready: function () {
				$(this).jPlayer("setMedia", { 
					mp3: audioUrl
				});

			},
			swfPath: "http://bibliotek.vimmerby.se/documents/58068/137602/Jplayer.swf/82ba0888-e101-438a-a73b-92f31bdc5f74"
		});
		
		// Lägg till länk
		appendExternalRes("#jp_container_1",linkTxt,linkTitle,"_self",'btnPlay');		


		// OBS!! id
		$(".btnPlay").click( function() {
			$("#audioplayer").jPlayer("play");
			$("#jp_container_1").show("slow");
		});
}*/

DetailViewMethods.prototype.addLnkToExtRes = function(url, lnkTxt, lnkTitle, target, cssClass) {
	var a = document.createElement('a');

	a.setAttribute('href', url);
	if ( lnkTitle ) {
		a.setAttribute('title', lnkTitle);
	}
	else {
		lnkTitle = '';
	}
	if ( target ) {
		a.setAttribute('target', target);
	} 
	else {
		a.setAttribute('target', '_blank');
		a.setAttribute('title', lnkTitle + ' (Öppnas i nytt fönster)');
	}
	if ( cssClass ) {
		a.setAttribute('class', cssClass);
	}
	a.innerHTML = lnkTxt;

	$('#extRes').append(a);
};

/*DetailViewMethods.prototype.addYoutubeMovie(id) {
}*/
/*CatalogueRecord.prototype.addYoutubeMovie(id) {
	// 	Lägger till en youtube-film till sidan
	//	Argument: youtube-id
	try {
		if ( this.view !== 'detail' ) {
			throw 'Only possible from the detail-view';
		}
	}
	catch(err) {
		console.log(err);
	}

	// url = baseUrl + id + ?rel=0
	var baseUrl, width, height;
	baseUrl = "http://www.youtube-nocookie.com/embed/";
	width = "560";
	height = "315";
	
	// Lägg till youtube-filmen till sidan
	$('#youtube').prepend('<iframe width="' + width + '" height="' + height + '" src="' + baseUrl + id + '?rel=0" frameborder="0" allowfullscreen></iframe>');
	$('#youtube').show();
}*/
function ListViewMethods(record) {
	try {
		if ( record.view !== 'list' ) {
			throw 'Only possible from the list-view';
		}
	}
	catch(err) {
		console.log(err);
	}
	
	this.record = record;
}

ListViewMethods.prototype.advertise = function(value) {
	// value (str): Mervärde att locka med
	
	var a = this.record.subElements.cover.find('a');
	
	if ( a.find('ul.values').length === 0 ) {
		a.append('<ul class="values"></ul>');
	}
	
	a.find('ul.values').append('<li>' + value + '</li>');	
};
function Ljudprov(catalogueRecord) {
	var that = this;

	//url: "http://pipes.yahoo.com/pipes/pipe.run?_id=21ebd265e688111bc604d76d2bfb2841&_render=json&author=" + au.lastname + "&title=" + title.main + "&_callback=ljudprov",
	$.ajax({
		type: "GET",
		url: "http://pipes.yahoo.com/pipes/pipe.run?_id=21ebd265e688111bc604d76d2bfb2841&_render=json&author=" + catalogueRecord.author.lastname + "&title=" + catalogueRecord.title.main,
		dataType: "jsonp",
		success: function(json) {
			console.log(json);
			
			/*if (json.count == 1 && json.value.items[0].hit == 1) {
			var audioUrl = "http://www.elib.se/sample_new/audio/ISBN" + convert13to10(json.value.items[0].isbn) + ".mp3";
		
			audioPlayer(audioUrl,"Provlyssna","Ett kort provlyssningsavsnitt");*/
		}
	});	

}
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
				libraryRecord.smakprov();
			}
		}
	});
};

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

function Title(str,origTi) {
	var h, b, c, n, ti, subTi, part;
	ti = str;
	origTi = origTi || ti;
	
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
		length = 100;
	}
    if (typeof ellipsis === 'undefined') { 
		ellipsis = '[...]';
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

