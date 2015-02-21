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
	originalTitle = this.subElements.originalTitle.text().trim();
	author = this.subElements.author.text();	
	publisher = this.subElements.publisher.text();
	year = this.subElements.year.text();
	media = this.subElements.media.text().trim();
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
		this.author = {};
		
		if ( this.subElements.author.text().indexOf(",") > - 1 ) {
			this.author.inverted = this.subElements.author.text();
			this.author.lastname = this.subElements.author.text().split(',')[0].trim();
			this.author.firstname = this.subElements.author.text().split(',')[1].substring(1).trim();
		}
		else {
			// Snorre Sturlasson, Heliga Birgitta, Leonardo da Vinci etc.
			this.author.name = this.subElements.author.text();
		}
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
	this.decorations = [];
	
	/* Priviligerade funktioner */
	this.getSelector = function() {
		return selector;
	};

}


/***********/
/* Metoder */
/***********/

CatalogueRecord.prototype.fieldIsVisible = function(field) {
	return $(this.element).find('.arena-'+this.getSelector()+'-'+field).is(':visible');
};

// Modifiera visningen av katalogposten
CatalogueRecord.prototype.hideField = function(field) {
	$(this.element).find('.arena-'+this.getSelector()+'-'+field).hide();
};

CatalogueRecord.prototype.removeMediumFromTitle = function() {
	// Tar bort allmän medieterm från titel-elementet
	if ( this.media !== "Bok" ) {
		var obj = this.subElements.title;
		obj.text(((obj.text().replace(/\[.*\] ([\/:])/,'$1'))));
	}
};

CatalogueRecord.prototype.trimTitle = function() {
	this.subElements.title.html( this.title.main );
};

CatalogueRecord.prototype.truncateTitle = function() {
	var title = this.title.main;

	if ( this.title.part ) {
		title += ' ' + this.title.part;
	}

	this.subElements.title.html( truncate(title, 30) );
};

// Mervärden
CatalogueRecord.prototype.bokpuffen = function() {
	new Bokpuffen(this);
};

CatalogueRecord.prototype.bokvideo = function() {
	var b = new Bokvideo(this);

	try {
		if ( b.publishers.indexOf(this.publisher) > -1 ) {
			b.init(b.getChannel());
		}
		else {
			throw "Publisher not on Youtube";
		}
	}
	catch (err) {
		console.log(err);
	}

};

CatalogueRecord.prototype.dvd = function() {
	new Dvd(this);
};

CatalogueRecord.prototype.ljudprov = function() {
	new Ljudprov(this);
};

CatalogueRecord.prototype.smakprov = function() {
	new Smakprov(this);
};
