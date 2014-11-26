/* Deklarera variabler */

var pattYear = new RegExp("[0-9]{4}", "i");
var pattResChar = new RegExp(/[&+,\/:;=?@"]/g);

/*function bokpuffen(json) {
	if ( json.count >= 1 ) {
		items = json.value.items;
		if ( items.length === 1 ) {
			title = items[0].title;
			title = title.replace("&aring;","å").replace("&#246;","ö");
			author = items[0].author.replace("&aring;","å").replace("&#246;","ö");
			audioUrl = items[0]["media:content"].url;

			
			audioPlayer(audioUrl,"Bokpuffen","Lyssna på bokens inledning");

		}
	}
}*/

function boktipset(json) {
	//HTML-tags
	var uList = '<ul></ul>',
		openListItem = '<li><a href="',
		openBlockQuote = '<blockquote><p>';
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
	// Lägg till Goodreads???
	/* He finns i en TD utan class. Bibliografisk data finns i TD med class="FormatText" */
	// Matcha, hur??
	//alert( $("td:contains('/VC')").length );
	
	
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
	/*_blogs=json.answer.blogs;
	if ( _blogs ) {
        $("#blogs:hidden").show();
        $("#blogs").append(uList);
		listOfBlogs = document.getElementById("blogs").getElementsByTagName("ul")[document.getElementById("blogs").getElementsByTagName("ul").length-1]; // Länkar
		if ( _blogs.source instanceof Array ) {
			for (i=0;i<=_blogs.source.length-1;i++) {
				listOfBlogs.innerHTML += openListItem + _blogs.link[i].PLACEHOLDER + '" target="_blank">' + _blogs.source[i].PLACEHOLDER + '</a></li>';
			}
		}
		else {
			listOfBlogs.innerHTML += openListItem + _blogs.link + '" target="_blank">' + _blogs.source + '</a></li>';
		}
	}*/
}

function bokvideo(youtubeChannel,ti,au,query) {
	var channel, video, test;
	channel = youtubeChannel;
	query = query || ti + "+" + au.lastname;
		
	$.ajax({
		type: "GET",
		url: "https://gdata.youtube.com/feeds/api/videos?v=2&alt=jsonc&author=" + channel + "&max-results=1&q=" + query,
		dataType: "jsonp",
		success: function(json) {
			if ( json.data.totalItems > 0 ) {
				video = json.data.items[0];
				
				// Bestäm testvillkor
				if ( channel === "BarnensBibliotek" ) {
					test = video.title.indexOf(au.firstname + " " + au.lastname) > -1;
				}
				else {
					test = video.title.indexOf(ti) > -1 || video.title.indexOf(au.lastname) > -1;
				}
				
				// Lägg till filmen
				if ( test ) {
					addYoutubeMovie(video.id);

					// Lägg till en knapp
					appendExternalRes('#youtube','Bokvideo','Se en bokvideo','_self','btnPlay');
					
				}
				
			}
		}
	});
}

function youtubeTrailer(movie,callback,lang) {
	/*	Hämtar en youtubeTrailer från TMDb:s API 
		Argument: film som finns hos TMDb,
				  funktion som hanterar api-svaret,
				  språk att söka på */
	var id;
    movie = movie;
    lang = lang || "sv";
    id = "";
    
    $.ajax({
		type: "GET",
		url: "http://api.themoviedb.org/3/movie/"+movie.id+"/trailers?api_key="+movie.apiKey+"&language="+lang,
		dataType: "jsonp",
		context: movie.id,
		success: function(json) {

			id = movie.getYoutubeId(json,this,lang);

			if ( id === "" && lang === "sv" ) {
				youtubeTrailer(movie,addYoutubeMovie,"en");
			}
	    
			if ( id !== "" ) {
				addYoutubeMovie(id);
				// Lägg till en knapp
				appendExternalRes('#youtube','Trailer','Se filmens trailer','_self','btnPlay');
			}

		}
    });
    
}

/*****************/
// Main
/*****************/
$(".arena-detail-right").after('<div id="extRes"></div>');

//console.log( "You are running jQuery version: " + $.fn.jquery );


$(function() {
	console.log("Startat main");
	$.ajax({
		type: "GET",
		url: "http://bibliotek.vimmerby.se/documents/58068/138011/shared.min.js/5260bb35-e801-4a93-a290-0013d8d948bf",
		datatype: "script",
		cache: true,
		success: function() {
			console.log("Laddat shared");

			$.ajax({
				type: "GET",
				url: "http://bibliotek.vimmerby.se/documents/58068/138011/arenajs.min.js/ce0740d4-a718-4217-aa67-55035d95f6eb",
				datatype: "script",
				cache: true,
				success: function() {
					console.log("Laddat arenajs");				

					$(function() {
						$.ajax({
						type: "GET",
						url: "http://bibliotek.vimmerby.se/documents/58068/138011/tmdb.js/968832e5-5cd6-4ffb-a912-275fe4a8c9ec",
						datatype: "script",
						cache: true,
							success: function() {
								var record = new CatalogueRecord($('.portlet-catalogueDetail'), 'detail');
								var movie, hasTrailer;
								hasTrailer = false;
						
								// Göm/snygga till en del fält
								// Bort med allmän medieterm
								record.removeMediumFromTitle();
						
								// Dölj originaltiteln på filmer
								if ( record.title.original === record.title.main || record.media === "DVD" ) {
									$(".arena-detail-original").hide(); 
									// Originaltitel kan väl vara bra att visa när den skiljer sig från svensk titel?
								}
						
								// Bort med ISBN
								$(".arena-detail-isbn").hide();
								
								// Snyggare länk till Elib
		    

								/************************************/
								/* Funktioner oberoende av medietyp */
								/************************************/

								// Det är inte bara böcker som har ISBN
								// Funktionerna här använder ISBN
								if ( record.isbn ) {
									/*console.log("IBSN: " + isbn);*/
				
									// Boktipset
									$.ajax({
										type: "GET",
										url: "http://api.boktipset.se/book/book.cgi?accesskey=OHt0dnZGVhTraT0X45VnA&isbn=" + record.isbn + "&format=json&jsonwrapper=boktipset",
										/*broswer finns inte from 1.10 url: $.browser.msie ? "http://opac.vimmerby.se/local/bookit7/add/boktipset.php?isbn=" + isbn : "http://api.boktipset.se/book/book.cgi?accesskey=OHt0dnZGVhTraT0X45VnA&isbn=" + isbn + "&format=json&jsonwrapper=boktipset",*/
										dataType: "jsonp",
										scriptCharset: "iso-8859-1"
									});				
			
									// Smakprov/Provläs
									record.getSmakprov('detail');
							
								}
			
								// Specifika grejer för olika medietyper
								// Bok, Ljudböcker, DVD
								if ( record.media === "Bok" || record.media === "E-bok" ) {

									// Bokpuffen
									$.ajax({
										type: "GET",
										url: "http://pipes.yahoo.com/pipes/pipe.run?_id=a69b13c13ba656e4023b3b336c1bb1c3&_render=json&key=getpuff&title="+record.title.main.replace('å','a').replace('ä','a').replace('ö','o')+"&_callback=bokpuffen",
										dataType: "jsonp"
									});

									// Bokvideor
									switch (record.publisher) {
										case "R&S":
											bokvideo("rabensjogren",record.title.main,record.author);
											break;
										case "BW":
											bokvideo("FormaBooks",record.title.main,record.author);
											break;
										case "Damm":
											bokvideo("FormaBooks",record.title.main,record.author);
											break;
									}				
				

									// Fritt tillgänglig (via Libris)
							
								}
								else if ( record.media.toLowerCase().indexOf("ljudbok") > -1 ) {
									// Ljudbok, MP3; Ljudbok, CD; E-ljudbok
									//console.log("Ljudbok");
				
									// Provlyssning
									// Sök med titel ti och författare au
									record.ljudprov();
		
				
								}
								/*else if ( media == "DVD" ) {
			*/
									// Omslag och trailer från TMDb
				/*					movie = new Tmdb(title.main,year,title.part);
			
									$.ajax({
										type: "GET",
										url: "http://api.themoviedb.org/3/search/multi?api_key="+movie.apiKey+"&query="+encodeURIComponent(title.main+" "+title.sub)+"&language=sv&page=1&include_adult=false",
										dataType: "jsonp",
										success: function(json) {
											movie.init(json);
				
											if ( movie.urlPoster != "" ) {
												$(".arena-book-jacket img").attr("src",movie.urlPoster);
												$(".arena-detail-cover").append('<a href="http://www.themoviedb.org/'+movie.mediaType+'/'+ movie.id + '" target="_blank" title="Information om filmen hos TMDb"><img src="'+movie.pathLogo+'" alt="themoviedb.org" style="width: ' + $('.arena-book-jacket img').width() + 'px" /></a>');														
											}
											if ( movie.mediaType == "movie" && movie.id != "" ) {
												youtubeTrailer(movie,addYoutubeMovie);
											}
											else if ( movie.mediaType == "tv" ) {
												if ( title.part != "" ) {
													console.log("Hämtar säsongs-info ..");										
													var tvSeason = new TvSeason();
										
													$.ajax({
														type: "GET",
														url: "http://api.themoviedb.org/3/tv/"+movie.id+"?api_key="+movie.apiKey+"&language=sv",
														dataType: "jsonp",
														success: function(json) {
															tvSeason.init(json, title.part);
												
															$(".arena-book-jacket img").attr("src",movie.baseUrlImg+movie.posterSize+tvSeason.posterPath);
														}		
													});
												}
											}

					
										}
									});*/
							
									// Recension från Moviezine
			
									// Språkanmärkning
									//var spanLangNote = $('.arena-detail-notes-list-entry span:contains("Tal på"),.arena-detail-notes-list-entry span:contains("Tal och syntolkning på")');
									//$('.arena-detail-language .arena-value').html( spanLangNote.text() );
									//spanLangNote.parents('.arena-detail-notes-list-entry').remove();
			
								//}
						
								/*if ( media === "E-bok" || media === "E-ljudbok" ) {
									$('.arena-availability').hide();
								}*/
			
		    
							}
						});
					});
				}
			});
		}
	});
});