/*--Copyright © AXIELL Sweden 2014 All Rights Reserved. No part of this material may be reproduced or republished without AXIELL Sweden's express consent unless otherwise indicated.--*/
(function ($) {
 var url = "/smakprov/html/js/smakprov.js";
 $.getScript(url).done(function (script, textStatus) {
  $.smakprov.decorateRecords({hideIsbn: true,btnPos:"last"});
 }).fail(function (jqxhr, settings, exception) {
  console.log("Failed loading script: " + url);
 });
})(jQuery);
/*---------------------------------------------------------------------------------------------------------------*/
$(function() {
	$.ajax({
		type: "GET",
		url: "http://bibliotek.vimmerby.se/documents/58068/138011/shared.min.js/5260bb35-e801-4a93-a290-0013d8d948bf",
		datatype: "script",
		cache: true,
		success: function() {

			$(function() {
				$.ajax({
					type: "GET",
                    url: "http://bibliotek.vimmerby.se/documents/58068/138011/tmdb.js/968832e5-5cd6-4ffb-a912-275fe4a8c9ec",
					/*url: "http://bibliotek.vimmerby.se/documents/58068/138011/tmdb.min.js/8e8efc01-b8f7-4424-97fa-c5fc3da4dd98",*/
					datatype: "script",
					cache: true,
					success: function() {
						$(".arena-library-record").each(function(index) {
							var media,
							elTitle, title;
								/*hrefToRecord;*/
							media = $(".arena-record-media .arena-value", this).text();
							elTitle = $(".arena-record-title span",this);
							title = new Title( elTitle.text() );
							
							
							/*hrefToRecord = $('.arena-record-title a', this).attr('href');
							console.log(hrefToRecord);

							$('.arena-record-button', this).eq(0).append('<a href="' + hrefToRecord + '" class="arena-link-button"><span>Se var boken står</span></a>');*/
							
	
							if ( media == "DVD" ) {
								var elBookJacket, elRecordCover,
									year, movie;
								
								year = $(".arena-record-year .arena-value",this).text();
								movie = new Tmdb(title.main,year,title.part);
						
								elBookJacket = $(".arena-book-jacket",this);
								//var elBookJacketImg = $(".arena-book-jacket img",this);
								elRecordCover = $(".arena-record-cover",this);
			
								// Hämta omslag
								console.log("Söker på " + title.main+" "+title.sub);
								$.ajax({
									type: "GET",
									url: "http://api.themoviedb.org/3/search/multi?api_key="+movie.apiKey+"&query="+encodeURIComponent(title.main+" "+title.sub)+"&language=sv",
									dataType: "jsonp",
									success: function(json) {
										movie.init(json);
										
										if ( movie.urlPoster != "" ) {
											elBookJacket.find('img').attr("src",movie.urlPoster);
											elRecordCover.append('<a href="http://www.themoviedb.org/'+movie.mediaType+'/' + movie.id + '" target="_blank" title="Information om filmen hos TMDb"><img src="'+movie.pathLogo+'" alt="themoviedb.org" style="width: ' + elBookJacket.width() + 'px" /></a>');								
										}
										
										if ( movie.mediaType == "tv" ) {
											if ( title.part != "" ) {
												console.log("Hämtar säsongs-info ..");										
												var tvSeason = new TvSeason();
										
												$.ajax({
													type: "GET",
													url: "http://api.themoviedb.org/3/tv/"+movie.id+"?api_key="+movie.apiKey+"&language=sv",
													dataType: "jsonp",
													success: function(json) {
														tvSeason.init(json, title.part);
												
														elBookJacket.find('img').attr("src",movie.baseUrlImg+movie.posterSize+tvSeason.posterPath);
													}		
												});
											}
										}
										
										
										
										
										
										
		
									}
								});
					
								// Göm språkfältet .. varför visar jag språkfältet???
								$(".arena-record-language").hide();
								
							}
							
							// Snygga till titelfältet
							elTitle.html(title.main + " " + title.part);
							
						});
					}
				});
			});

		}
	})
});