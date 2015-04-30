/*****************/
// Main
/*****************/
$(function() {
	function main() {
		$.cachedScript("http://bibliotek.vimmerby.se/documents/58068/138011/arenajs.min.js/ce0740d4-a718-4217-aa67-55035d95f6eb").done( function() {
		
			var record = new CatalogueRecord($('.portlet-catalogueDetail'), 'detail'),
				publisherssWithVideo;

			// Sätt mediaClass som CSS-klass
			record.element.addClass( ""+$('.arena-external-link a').attr('href') );

			$(".arena-detail-right").after('<div id="extRes"></div>');

			// Göm/snygga till en del fält
						
			// Dölj originaltiteln på filmer
			if ( record.title.original === record.title.main || record.media === "DVD" ) {
				$(".arena-detail-original").hide(); 
				// Originaltitel kan väl vara bra att visa när den skiljer sig från svensk titel?
			}
	
			// Ta bort allmän medieterm, men INTE undertitel inom klammer!	
			record.removeMediumFromTitle();
			record.removeParenthesesFromTitle();
						
			if ( record.isbn ) {
				record.methodsOnThisView.boktipset();

				if ( record.media === "Bok" || record.media === "E-bok" ) {
					record.smakprov();
				}
		
				$(".arena-detail-isbn").hide();
			}

			// Specifika grejer för olika medietyper
			// Bok, Ljudböcker, DVD
			if ( record.media === "DVD" ) {
				record.dvd();
				
				// $('.arena-detail-notes-list').append('<input type="checkbox" role="button" id="read_more" /><label for="read_more"><span>Mer information...</span><span>Mindre information...</span></label>');

			}
			else if ( record.media === "Bok" || record.media === "E-bok" ) {

				// Bokvideor
				record.bokvideo();

				// Bara om inte Smakprov
				if ( record.decorations.indexOf("Smakprov") === -1 ) {
					// Bokpuffen
					record.bokpuffen();
				}
			}
			else if ( record.media.toLowerCase().indexOf("ljudbok") > -1 ) {
				// Ljudbok, MP3; Ljudbok, CD; E-ljudbok
				console.log("Ljudbok");
				
				// Provlyssning
				// Sök med titel ti och författare au
				record.ljudprov();
		
			}
			
			// Sätt igång Youtube direkt via play-knabben
			(function() {
				console.log($("a[href='#youtube-container']"));
				$("a[href='#youtube-container']").click(function() {
					console.log($(this).find('.youtube'));
					$(this).find('.youtube').click();
				});
			}());				

			// Snygga till "Fler av författaren"
			(function() {
				var cssClass = 'portlet-listRecordSearchResult',
					settings = {
						truncate: true
					};

				var s = new SearchResult($('.'+cssClass), settings);
				Wicket.Ajax.registerPostCallHandler(function() {
					s = new SearchResult($('.'+cssClass), settings);
				});
			}());

		});
	}

	// Om IE tidigare än 10 läs in jquery-ajaxtransport-domainrequest
	if ( $('html').attr('class').match(/\b(ie9|ie8)\b/) ) {
		$.cachedScript('http://cdnjs.cloudflare.com/ajax/libs/jquery-ajaxtransport-xdomainrequest/1.0.3/jquery.xdomainrequest.min.js').done( function() {
			main();
		});
	}
	else {
		main();
	}

});
