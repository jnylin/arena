/* 
	Katalogposten 
	
	youtube
	externalRes
	audioPlayer
	bokpuffen
	boktipset
	bokvideo
	ljudprov
	youtubeTrailer
	
*/
function CatalogueRecord(e,selector) {
	/* HTML-element */
	this.element = e;
	this.subElements = {
		title: $('.arena-'+selector+'-title span:not(.arena-result-item-number)',this.element),
		originalTitle: $('.arena-detail-original .arena-value',this.element),
		author: $('.arena-'+selector+'-author .arena-value',this.element),
		publisher: $('.arena-record-publisher .arena-value',this.element),		
		year: $('.arena-'+selector+'-year .arena-value',this.element),
		isbns: $('.arena-'+selector+'-isbn .arena-value',this.element),
		media: $('.arena-'+selector+'-media .arena-value',this.element),
		lang: $('.arena-'+selector+'-language .arena-value',this.element)
	};

	var pattYear = new RegExp("[0-9]{4}", "i");
	
	/* Hämta rätt värden från elementen */
	var title, originalTitle, author, publisher, year, isbns, isbn, media, lang;
	title = this.subElements.title.text().trim();
	author = this.subElements.author.text();	
	publisher = this.subElements.publisher.text();
	year = this.subElements.year.text();
	media = this.subElements.media.text();
	lang = this.subElements.lang.text().trim();
	
	/* 	ISBN är olika uppmärkt i träfflistan och katalogpostsidan
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
			if ( thisIsbn.length == 13 ) {
				isbn = thisIsbn;
				break;
			}
		}
	}

	/* Egenskaper för objektet */
	this.title = title;
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

	console.log(this);
	console.log(this.author);	
}

// Metoder
CatalogueRecord.prototype.decorate = function() {
};
CatalogueRecord.prototype.removeMediumFromTitle = function() {
	var obj = this.subElements.title;
	obj.text(((obj.text().replace(/\[.*\] ([\/:])/,'$1'))));
}
CatalogueRecord.prototype.truncateTitle = function() {
	var title = new Title( this.title );
	this.subElements.title.html( truncate(title.main + " " + title.part, 30) );
}
CatalogueRecord.prototype.getSmakprov = function(view) {
	// view: Från katalogpost-sidna eller från en träfflista?
	// detail eller list
	var smakprov = new Smakprov(this.isbn, view); 
};
Smakprov = function(isbn, callback) {
	var that = this;
	this.isbn = isbn;
	
	$.getJSON('/smakprov/v1/records?isbn=' + this.isbn, that.callback(this, callback));	
	
};

Smakprov.prototype.callback = function(obj, type) {
	return function(records) {
		if ( records.length > 0 ) {
			console.log("type = " + type);
			console.log("smakprov på " + obj.getUrl() );
	
			switch (type) {
				case 'detail':
					appendExternalRes(obj.getUrl(),"Smakprov","Läs ett smakprov av boken","_blank","btnRead");				
					break;
				case 'list':
					// Utveckla det här, sätt sedan den här delen i produktion
					break;
			}
		
		}
	}
}

Smakprov.prototype.getUrl = function() {
	return 'http://www.smakprov.se/smakprov.php?isbn=' + this.isbn + '&l=vimmerby';
}

