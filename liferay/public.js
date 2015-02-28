/*global console: true */

function loadCss( url ) {
	var link = document.createElement('link');
	link.type = 'text/css';
	link.rel = 'stylesheet';
	link.href = url;
	document.getElementsByTagName('head')[0].appendChild( link );
}

(function ($) {
	$.cachedScript = function( url, options ) {
		// Allow user to set any option except for dataType, cache, and url
		options = $.extend( options || {}, {
			dataType: "script",
			cache: true,
			url: url
		});

		// Use $.ajax() since it is more flexible than $.getScript

		// Return the jqXHR object so we can chain callbacks
		return jQuery.ajax( options );
	};
	
    $.fn.changeElementType = function( newType ) {
        var attrs = {};

        $.each(this[0].attributes, function(idx, attr) {
            //attrs[attr.nodeName] = attr.nodeValue;
			attr[attr.nodeName] = attr.value;
        });

        this.replaceWith(function() {
            return $("<" + newType + "/>", attrs).append($(this).contents());
        });
    };
	
	
}(jQuery));

(function ($) {
	$('.portlet-simpleSearch form').submit(function() {
		var q = $('input[name="textSearchQuery"]').val();
		q = q.replace(/e-?b(ok|öcker)/,"mediaClass:ebook")
		.replace(/e-?ljudb(ok|öcker)/,"mediaClass:eAudio")
		.replace(/(^|\s)dvd/," mediaClass:dvd")
		.replace(/(^|\s)mp3/," mediaClass:digitalAudioFile")
		.replace(/(^|\s)ljudb(ok|öcker)/," (mediaClass:digitalAudioFile OR mediaClass:cdBook OR mediaClass:eaudio OR mediaClass:cd)");
		$('input[name="textSearchQuery"]').val(q);
	});
}(jQuery));

//--------------------------------------

// Varna föråldrade webbläsare
(function() {
	if ( document.getElementsByTagName('html')[0].getAttribute('class').match(/\b(ie8|ie7|ie6)\b/) ) {
		var itsam = document.createElement('script'),
			body = document.getElementsByTagName('body')[0],
			div = document.createElement('div'),
			s = document.getElementsByTagName('script')[0];
	
		itsam.type = "text/javascript";
		itsam.src = "http://jnylin.name/bibl/ip/your_ip.php";

		div.innerHTML = '<ul class="feedbackPanel"><li class="feedbackPanelINFO"><span class="fa fa-info"></span> Du använder en föråldrad version av Internet Explorer.</li><li class="feedbackPanelERROR"><span class="fa fa-warning"></span> Din webbläsare äventyrar säkerheten, är långsam och klarar inte nyare funktioner.</li><li class="feedbackPanelINFO" id="browsehappy"><span class="fa fa-info"></span> Uppgradera din webbläsare eller installera en annan: <a href="http://www.browserchoice.eu">Information om webbläsare</a></li></ul>';

		body.insertBefore(div, body.childNodes[0]);
		s.parentNode.insertBefore(itsam, s);
		
	}
}());

// console för Internet Explorer <10
if ( ! window.console ) {
	console = { log: function(){} };
}

// Undvik timeout
(function($) {
	function omStart() {
		location.assign('/');
	}
	
	var millisec, timer;
	millisec = 1500000; /* 1 500 000 millisekunder = 1 500 sekunder = 25 minuter */
	timer = setTimeout(omStart,millisec);

	$("*").bind('keydown mousedown', function(omStart) {
		clearTimeout(timer);
		timer = setTimeout(omStart,millisec);
	});
	
}(jQuery));

// Putsa DOM-trädet
(function ($) {
	$.support.placeholder = ('placeholder' in document.createElement('input'));
	
	$(function() {

		/* Sökrutan */
		$('.arena-search-text .arena-input-text').attr('placeholder', 'Sök böcker, e-böcker, filmer, tidskrifter …');	
	
		/* Inloggning */
		$('.arena-login-username').attr('placeholder', 'Lånekort, personnr eller användarnamn').attr('title', 'Lånekortsnumret (11 siffror), ditt personnummer (10 siffror utan streck) eller användarnamn');
		$('.arena-login-password').attr('placeholder', 'PIN-kod eller lösenord').attr('title', 'PIN-kod (fyra siffror) eller lösenord');
	
		//fix for IE7 - 9
		if (!$.support.placeholder) {
			$("[placeholder]").focus(function () {
				if ($(this).val() === $(this).attr("placeholder")) {
					$(this).val("");
				}
			}).blur(function () {
				if ($(this).val() === "") {
					$(this).val($(this).attr("placeholder"));
				}
			}).blur();
	
			$("[placeholder]").parents("form").submit(function () {
				$(this).find('[placeholder]').each(function() {
					if ($(this).val() === $(this).attr("placeholder")) {
						$(this).val("");
					}
				});
			});
		}

		/* Överblivna portlets */
		$(".portlet-listArticleView, .portlet-listRecordSearchResult, .portlet-articlesFacets").each(function( index ) {
			if ( $(this).find(".arena-record-container").length < 1 && $(this).find(".arena-portletConfigurationPanel").length < 1 && $(this).find(".arena-field-container").length < 1  ) {
				$(this).css('display', 'none');
			}
		});
	
		/* Problem med dubbla rubriktaggar */
		// Ändra h1 till div
		$('#heading h1').changeElementType('div'); // Men på startsidan??
		$('#heading h2').remove();
		
	});	
	
})(jQuery);

// Läs in CSS
loadCss("http://maxcdn.bootstrapcdn.com/font-awesome/4.2.0/css/font-awesome.min.css");

