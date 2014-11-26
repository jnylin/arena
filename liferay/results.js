/* Deklarera variabler */

var pattYear = new RegExp("[0-9]{4}", "i");
var pattResChar = new RegExp(/[&+,\/:;=?@"]/g);

function boktipset(json) {
	//HTML-tags
	var uList = '<ul></ul>',
		openListItem = '<li><a href="',
		openBlockQuote = '<blockquote><p>',
		_comments, _reviews, listOfPapers, i;
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
			for (i=0; i < _reviews.item.length - 1; i++) {
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
				url: "http://bibliotek.vimmerby.se/documents/58068/138011/arenajs.js/9bfc30c9-c4fb-4b11-adee-7238838f4e9d",
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
									record.smakprov();
							
								}
			
								// Specifika grejer för olika medietyper
								// Bok, Ljudböcker, DVD
								if ( record.media === "Bok" || record.media === "E-bok" ) {

									// Bokpuffen

									// Bokvideor
									switch (record.publisher) {
										case "R&S":
											//bokvideo("rabensjogren",record.title.main,record.author);
											break;
										case "BW":
											//bokvideo("FormaBooks",record.title.main,record.author);
											break;
										case "Damm":
											//bokvideo("FormaBooks",record.title.main,record.author);
											break;
									}				
				

									// Fritt tillgänglig (via Libris)
							
								}
								else if ( record.media.toLowerCase().indexOf("ljudbok") > -1 ) {
									// Ljudbok, MP3; Ljudbok, CD; E-ljudbok
									console.log("Ljudbok");
				
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
