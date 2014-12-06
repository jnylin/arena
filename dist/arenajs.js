/*! arenajs - v0.2.0 - 2014-12-06
* https://github.com/jnylin/arena
* Copyright (c) 2014 Jakob Nylin; Licensed GPL */
function Bokpuffen(record) {
	this.record = record;
	this.init();
}

Bokpuffen.prototype.init = function() {
	$.ajax({
		type: "GET",
		url: "http://pipes.yahoo.com/pipes/pipe.run?_id=a69b13c13ba656e4023b3b336c1bb1c3&_render=json&key=getpuff&title="+this.record.title.main.replace('å','a').replace('ä','a').replace('ö','o')+"&_callback=?",
		dataType: "jsonp",
		success: this.callback(this)
	});
};

Bokpuffen.prototype.callback = function(thisObj) {
	return function(json) {
			
			if ( json.count >= 1 ) {
				var items = json.value.items,
					title, author, mediaContent,
					methods = thisObj.record.methodsOnThisView;
				
				if ( items.length === 1 ) {
					// Jämför katalogposten med resultatet
					title = items[0].title;
					author = items[0].author;
					mediaContent = items[0]["media:content"];

					if ( title && author && mediaContent ) {
						/* replace vill inte fungera
						 * title = title.replace("&aring;","å").replace("&#228;","ä").replace("&#246;","ö").trim();
						author = author.replace("&aring;","å").replace("&#228;","ä").replace("&#246;","ö").trim();*/

						switch (thisObj.record.view) {
							case 'detail':
								methods.audioPlayer(mediaContent.url, "Bokpuffen", "Lyssna på bokens inledning");
								break;
							case 'list':
								methods.methodsOnThisView.advertise('Bokpuffen');
								break;
						}

					}

				}
			}		
	};
};

function Boktipset(apiKey, record) {
	this.apiKey = apiKey;
	this.record = record;
	this.init();
}

Boktipset.prototype.init = function() {
	$.ajax({
		type: "GET",
		url: "http://api.boktipset.se/book/book.cgi?accesskey=" + this.apiKey + "&isbn=" + this.record.isbn + "&format=json&jsonwrapper=?",
		/*broswer finns inte from 1.10 url: $.browser.msie ? "http://opac.vimmerby.se/local/bookit7/add/boktipset.php?isbn=" + isbn : "http://api.boktipset.se/book/book.cgi?accesskey=OHt0dnZGVhTraT0X45VnA&isbn=" + isbn + "&format=json&jsonwrapper=boktipset",*/
		dataType: "jsonp",
		scriptCharset: "iso-8859-1",
		success: this.callback(this)
	});				
};

Boktipset.prototype.callback = function(thisObj) {
	return function(json) {
		var uList = '<ul></ul>',
			openListItem = '<li><a href="',
			listOfPapers,
			_reviews, _comments,
			openBlockQuote = '<blockquote><p>',
			i;

		// Kommentarer
		if ( json.answer.comments.bookcomments ) {
			_comments=json.answer.comments.bookcomments.bookcomment;
		}
		else {
			_comments=[];
		}
		if ( _comments.length > 0 ) {
			$("#comments").append('<h3 style="margin-top: 0; text-indent: 2em;">från <a href="' + json.answer.url + '" target="_blank">Boktipset.se</a></h3>');
			if ( _comments instanceof Array ) {
				for (i=0;i<=_comments.length-1;i++) {
					// Skriv inte ut kommentaren om betyget är 1
					// Vi misstänker att 1 == galning
					if ( _comments[i].grade > 1 ) {
						document.getElementById("comments").innerHTML += openBlockQuote + _comments[i].text + '</p></blockquote>';
					}
				}
			}
			else {
				// Någon på Boktipset var full när den skrev API:t
				if ( _comments.grade > 1 ) {
					document.getElementById("comments").innerHTML += openBlockQuote + _comments.text + '</p></blockquote>';
				}
			}
			// Visa bara kommentarer om det finns några vettiga
			if ( $("#comments blockquote").length > 0 ) {
				$("#comments").show();
			}
		}
	
		// Tidningar och radio
		_reviews=json.answer.paper_reviews;
		if ( _reviews ) {
			$("#papers:hidden").show();
			$("#papers").append(uList);
			listOfPapers = document.getElementById("papers").getElementsByTagName("ul")[0];
			if ( _reviews.item instanceof Array ) {
				for (i=0;i<=_reviews.item.length-1;i++) {
					listOfPapers.innerHTML += openListItem + _reviews.item[i].link.substr(24) + '" target="_blank">' + _reviews.item[i].source + '</a></li>';
				}
			}
			else {
				listOfPapers.innerHTML += openListItem + _reviews.item.link.substr(24) + '" target="_blank">' + _reviews.item.source + '</a></p>';
			}
		}

		// Bloggar
		/* undefined, kolla varför? */
		//_blogs=json.answer.blogs;
};

};



function Bokvideo(record) {
	this.record = record;
	this.publishers = ["R&S", "BW", "Damm"];
}

Bokvideo.prototype.getChannel = function() {

	var channel;

	switch ( this.record.publisher ) {
		case "R&S":
			channel = "rabensjogren";
			break;
		case "BW":
			channel = "FormaBooks";
			break;
		case "Damm":
			channel = "FormaBooks";
			break;
	}


	return channel;

};

Bokvideo.prototype.init = function(channel) {

	var query =  this.record.title.main + "+" + this.record.author.lastname;

	$.ajax({
		type: "GET",
		url: "https://gdata.youtube.com/feeds/api/videos?v=2&alt=jsonc&author=" + channel + "&max-results=1&q=" + query,
		dataType: "jsonp",
		success: this.searchCallback(this, this.record.view)
	});

};

Bokvideo.prototype.searchCallback = function(thisObj, view) {
	return function(json) {
		var methods = thisObj.record.methodsOnThisView;

		if ( json.data.totalItems > 0 ) {
			var video = json.data.items[0],
				test = video.title.indexOf(thisObj.record.title.main) > -1 || video.title.indexOf(thisObj.record.author.lastname) > -1;

		
			// Barnens bibliotek??	
			if ( test ) {

				switch ( view) {
					case 'detail':
						methods.addYoutubeMovie(video.id);
						methods.addLnkToExtRes('#youtube', 'Bokvideo', 'Se en bokvideo', '_self', 'btnPlay');
						break;
					case 'list':
						methods.advertise('Bokvideo');
						break;
				}
					

			}
		}
	};
};

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

function DetailViewMethods(record) {
	try {
		if ( record.view !== 'detail' ) {
			throw 'Only possible from the detail-view';
		}
		this.record = record;
	}
	catch(err) {
		console.log(err);
	}

}

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

DetailViewMethods.prototype.addYoutubeMovie = function(id) {
	// id = id hos youtube
	// url = baseUrl + id + ?rel=0
	var baseUrl = "http://www.youtube-nocookie.com/embed/",
		width = "560",
		height = "315";

	// Lägg till youtube-filmen till sidan
	$('#youtube').prepend('<iframe width="' + width + '" height="' + height + '" src="' + baseUrl + id + '?rel=0" frameborder="0" allowfullscreen></iframe>');
	$('#youtube').show();
	
};

DetailViewMethods.prototype.audioPlayer = function(audioUrl,linkTxt,linkTitle) {
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
		this.addLnkToExtRes("#jp_container_1",linkTxt,linkTitle,"_self",'btnPlay');		

		// Knyt funktionen
		$(".btnPlay").click( function() {
			$("#audioplayer").jPlayer("play");
			$("#jp_container_1").show("slow");
		});
};

DetailViewMethods.prototype.boktipset = function() {
	var b = new Boktipset('OHt0dnZGVhTraT0X45VnA', this.record);
};


function Dvd(record) {
	this.record = record;

    var tmdb = new Tmdb('de9f79bfc08b502862e4d8bba5723414', this),
		query;

	query = record.title.main;

	if ( record.title.sub ) {
		query += ' ' + record.title.sub;
	}

	tmdb.search(query);

}

Dvd.prototype.cover = function(tmdb) {
	this.record.subElements.bookJacket.find('img').attr('src', tmdb.urlPoster);
	if ( this.record.view === 'detail') {
		this.record.subElements.cover.append('<a href="' + tmdb.url + '/' + tmdb.mediaType + '/' + tmdb.id + '?language=sv' + '" target="_blank" title="Information hos TMDb"><img src="http://bibliotek.vimmerby.se/' + tmdb.pathLogo + '" alt="themoviedb.org" /></a>');
	}
};

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

	$.ajax({
		type: "GET",
		url: "http://pipes.yahoo.com/pipes/pipe.run?_id=21ebd265e688111bc604d76d2bfb2841&_render=json&author=" + catalogueRecord.author.lastname + "&title=" + catalogueRecord.title.main + "&_callback=?",
		dataType: "jsonp",
		cache: true,
		success: function(json) {
			var methods = catalogueRecord.methodsOnThisView;

			// obs! röret ger "hit": "1"	
			if (json.count === 1 && json.value.items[0].hit === "1") {
				var audioUrl = "http://www.elib.se/sample_new/audio/ISBN" + convert13to10(json.value.items[0].isbn) + ".mp3";

				switch (catalogueRecord.view) {
					case 'detail':
						methods.audioPlayer(audioUrl, 'Provlyssna', 'Lyssna på inledningen av boken');
						break;
					case 'list':
						methods.advertise('Provlyssna');
						break;
				}

			}
		}
	});	

}

function SearchResult(e, options) {

	var settings = $.extend(this.settings, options);
	
	this.init(e, settings);

}

SearchResult.prototype.init = function(e, settings) {
	e.find('.arena-library-record').each(function() {
		var libraryRecord = new CatalogueRecord(this, 'list');

		if ( settings.trimTitle ) {
			libraryRecord.trimTitle();
		}

		if ( settings.truncate ) {
			libraryRecord.truncateTitle();
		}

		if ( libraryRecord.isbn && libraryRecord.fieldIsVisible('isbn') ) {
			libraryRecord.hideField('isbn');
			libraryRecord.smakprov();

			if ( libraryRecord.publisher && libraryRecord.fieldIsVisible('publisher') ) {
				libraryRecord.hideField('publisher');
				libraryRecord.bokvideo();
			}

		}
		
		if ( libraryRecord.fieldIsVisible('media') ) {
			switch ( libraryRecord.media ) {
				case 'DVD':
					libraryRecord.dvd();
					break;
				case 'Bok':
					//libraryRecord.bokpuffen();
					break;
			}
		}

		/* För många anrop till Pipes
		if ( libraryRecord.media.toLowerCase().indexOf("ljudbok") > -1 ) {
			libraryRecord.ljudprov();
		}*/

		// Optional hiding of fields
		$.each( settings.hideFields, function(i, field) {
			libraryRecord.hideField(field);
		});

	});
};

SearchResult.prototype.settings = {
	trimTitle: true,
	truncate: false,
	hideFields: []
};

function Smakprov(catalogueRecord) {
	
	//$.getJSON('/smakprov/v1/records?isbn=' + catalogueRecord.isbn, that.callback(this, catalogueRecord.view));	
	$.getJSON('http://jnylin.name/bibl/smakprov/provlasSmakprov.php?isbn=' + catalogueRecord.isbn, this.callback(this, catalogueRecord.view));		

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

function Title(ti,origTi) {
	var h, b, c, n, subTi, part,
		str;

	if ( typeof origTi === "undefined" ) {
		origTi = ti;
	}
	
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
	this.main = ti.replace(":","").trim();
	if ( subTi !== '' ) {
		this.sub = subTi;
	}
	this.original = origTi;
	if ( part !== '' ) {
		this.part = part;
	}
}

function Tmdb(apiKey, dvd) {
	this.apiKey = apiKey;
	this.dvd = dvd;
}

Tmdb.prototype.url = 'http://www.themoviedb.org';
// Egenskaper för API:t
Tmdb.prototype.api = 'http://api.themoviedb.org/3/';
Tmdb.prototype.pathLogo = "/documents/58068/140667/tmdb.png/fa3903c1-b170-4ab2-970a-baf9264001d9?t=1387215209438";
Tmdb.prototype.baseUrlImg = 'http://image.tmdb.org/t/p/w';
Tmdb.prototype.posterSizes = [92, 154, 185, 342, 500, 780];

// API-funktioner
Tmdb.prototype.search = function(query) {

	$.ajax({
		type: 'GET',
		url: this.api + 'search/multi?api_key=' + this.apiKey + '&query=' + encodeURIComponent(query) + '&language=sv&page=1&include_adult=false',
		datatype: 'jsonp',
		success: this.searchCallback(this),
		complete: function(jqXHR, textStatus) {
		}
	});

};

Tmdb.prototype.searchCallback = function(thisObj) {
	return function(json) {
		var arrResults = json.results,
			arrCandidates = [],
			movie, tv,
			diffYear;

		/* HANTERA TRÄFFLISTAN */
		// Jämför svensk/tillgänglig titel
		for (var i=0;i<arrResults.length;i++) {
			if ( arrResults[i].media_type === "movie" && thisObj.movieIsInListOfHits(arrResults[i], "ti") === true ) {
				movie = arrResults[i];
				diffYear = thisObj.dvd.record.year - REG_EXP_YEAR.exec(movie.release_date);	
				arrCandidates.push([diffYear,i]);					
			}
			else if ( arrResults[i].media_type === "tv" && thisObj.tvIsInListOfHits(arrResults[i]) ) {
				tv = arrResults[i];
			}
		}

		// I värsta fall liknande titel
		if ( arrCandidates.length < 1 ) {
			for (i=0;i<arrResults.length;i++) {
				if ( arrResults[i].media_type === "movie" && thisObj.movieIsProbablyInListOfHits(arrResults[i]) === true ) {
					movie = arrResults[i];
					diffYear = thisObj.dvd.record.year - REG_EXP_YEAR.exec(movie.release_date);
					arrCandidates.push([diffYear,i]);						
				}
			}
		}

		// Välj bästa kandidaten
		if ( arrCandidates.length < 1 ) {
			movie = "";
		}
		else {
			// Sortera på skillnad i utgivningsår (diffYear)
			arrCandidates.sort(function(a, b) { return ( (a[0] < b[0]) ? -1 : ( (a[0] > b[0]) ? 1 : 0 ) ); });
			movie = arrResults[arrCandidates[0][1]];
		}

		// Sätt egenskaper
		if ( movie !== '' ) {
			thisObj.id = movie.id;
			thisObj.mediaType = 'movie';
			thisObj.setUrlPoster(movie.poster_path);

			thisObj.trailer();
		}
		else if ( tv ) {
			thisObj.id = tv.id;
			thisObj.mediaType = 'tv';
			thisObj.setUrlPoster(tv.poster_path);

			thisObj.tv(tv.id);
		}
		
		// Töm resultatarrayen för att kunna göra en ny sökning
		arrResults.length = 0;
		
		// Sätt omslag med mera
		thisObj.dvd.cover(thisObj);

	};

};

Tmdb.prototype.trailer = function(lang) {
	if ( typeof lang === 'undefined' ) {
		lang = 'sv';
	}

    $.ajax({
		type: "GET",
		url: this.api + 'movie/' + this.id + '/trailers?api_key=' + this.apiKey + '&language=' + lang,
		dataType: "jsonp",
		success: this.trailerCallback(this, lang)
	});
};

Tmdb.prototype.trailerCallback = function(thisObj, lang) {
	return function(json) {
		var id; 

		if ( json.youtube.length > 0 ) {
			id = json.youtube[0].source;
		}

		if ( typeof id === 'undefined' && lang === 'sv' ) {
			thisObj.trailer('en');
		}
		else if ( id ) {
			switch ( thisObj.dvd.record.view ) {
				case 'detail':
					thisObj.dvd.record.methodsOnThisView.addYoutubeMovie(id);
					thisObj.dvd.record.methodsOnThisView.addLnkToExtRes("#youtube", "Trailer", "Se filmens trailer", "_self", "btnPlay");
					break;
				case 'list':
					thisObj.dvd.record.methodsOnThisView.advertise('Trailer');
					break;
			}
		}
	};
};

Tmdb.prototype.tv = function(id) {
	$.ajax({
		type: 'GET',
		url: this.api + 'tv/' + id + '?api_key=' + this.apiKey + '&language=sv',
		datatype: 'jsonp',
		success: this.tvCallback(this, this.dvd.record.title.part)
	});
};

Tmdb.prototype.tvCallback = function(thisObj, seasonNr) {
	return function(json) {
		var tvSeason;
			
		/* Exemplet Downton Abbey har en "special"-DVD */
		if ( json.seasons.length === json.number_of_seasons ) {
			seasonNr = seasonNr - 1;
		}		
		tvSeason = json.seasons[seasonNr];
		
		// Uppdatera omslaget	
		thisObj.setUrlPoster(tvSeason.poster_path);
		thisObj.dvd.cover(thisObj);
	};
};

// Avgör om en titel finns i träfflistan
Tmdb.prototype.movieIsInListOfHits = function(movie) {
		var hit = false,
			sameTitle = ( ( this.titleToCompare(this.dvd.record.title.main) === this.titleToCompare(movie.title) ) || ( this.titleToCompare(this.dvd.record.title.main) === this.titleToCompare(movie.original_title) ) );
	
		if ( sameTitle ) {
			hit = true;
		}
	
		return hit;				
};

Tmdb.prototype.movieIsProbablyInListOfHits = function(movie) {
		var hit = false,
			titleFromTmdb = this.titleToCompare(movie.title);
		
		if ( ( titleFromTmdb.search( this.titleToCompare(this.dvd.record.title.main) ) > -1 && titleFromTmdb.search( this.dvd.record.title.part ) > -1 ) || ( this.titleToCompare(this.dvd.record.title.main).search(titleFromTmdb) > - 1 ) ) {
			hit = true;
		}
	
		return hit;				
};

Tmdb.prototype.tvIsInListOfHits = function(tv) {
		var hit = false,
			sameTitle = ( this.titleToCompare(this.dvd.record.title.main) === this.titleToCompare(tv.name) );
		
		if ( sameTitle) {
			hit = true;
		}
		
		return hit;
};

Tmdb.prototype.titleToCompare = function(str) {
	var pattResChar, title;
	pattResChar = new RegExp(/[&+,\/:;=?@"-]/g);
	title = str.toLowerCase();
	title = title.replace(pattResChar,"");
	title = title.replace(/ /g,"");
	
	return title;
};

// GET/SET-metoder
Tmdb.prototype.getYoutubeId = function(json, id, lang) {

	var youtubeId = '';

	if ( json.youtube.length >= 1 ) {
		youtubeId = json.youtube[0].source;
	}

	return youtubeId;
};

Tmdb.prototype.setUrlPoster = function(poster_path) {
	if ( poster_path ) {
		this.urlPoster = this.baseUrlImg + this.posterSizes[0] + poster_path;
	}
};

// Globala
window.REG_EXP_YEAR = new RegExp("[0-9]{4}", "i");

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

