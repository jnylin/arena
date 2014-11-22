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
function CatalogueRecord(e, selector, view) {

	/*var selector,
		pattYear = new RegExp("[0-9]{4}", "i"),
		title, originalTitle, author, publisher, year, isbns, isbn, media, lang;*/
	
	var s;

	// Sätt selector utifrån view
	this.view = view;
	
	switch (view) {
		case 'detail':
			s = 'detail';
			break;
		case 'list':
			s = 'record';
			break;
	}

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
	
	/* Priviligerade funktioner */
	this.getSelector = function() {
		return selector;
	};

	console.log(this);
}


/***********/
/* Metoder */
/***********/
CatalogueRecord.prototype.addLinkToExtRes = function() {
	try {
		if ( this.view !== 'detail' ) {
			throw 'This is only possible from the detail-view';
		}
	}
	catch(err) {
		console.log(err);
	}
};

CatalogueRecord.prototype.decorate = function(view, decoration) {
	/* view: detail eller list,
             d.v.s. katalogpostsida eller träfflista 

       decoration: funktion eller mervärde att lägga till */	 
};

CatalogueRecord.prototype.hideField = function(field) {
	$('.arena-'+this.getSelector()+'-'+field).hide();
};

CatalogueRecord.prototype.removeMediumFromTitle = function() {
	// Tar bort allmän medieterm från titel-elementet
	var obj = this.subElements.title;
	obj.text(((obj.text().replace(/\[.*\] ([\/:])/,'$1'))));
};

CatalogueRecord.prototype.truncateTitle = function() {
	this.subElements.title.html( truncate(this.title.main + " " + this.title.part, 30) );
};

CatalogueRecord.prototype.getSmakprov = function(view) {
	// view: Från katalogpost-sidna eller från en träfflista?
	// detail eller list
	var smakprov = new Smakprov(this.isbn, view); 
};

