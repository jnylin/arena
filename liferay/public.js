// console för Internet Explorer <10
if ( ! window.console ) console = { log: function(){} };

// Plugins
(function($) {
    $.fn.changeElementType = function(newType) {
        var attrs = {};

        $.each(this[0].attributes, function(idx, attr) {
            //attrs[attr.nodeName] = attr.nodeValue;
			attr[attr.nodeName] = attr.value;
        });

        this.replaceWith(function() {
            return $("<" + newType + "/>", attrs).append($(this).contents());
        });
    };
})(jQuery);

// För att undvika timeout
(function ($) {
	function omStart() {
		location.assign('/');
	}
	
	var millisec, timer;
	millisec = 1500000; /* 	1 500 000 millisekunder = 1 500 sekunder = 25 minuter */
	timer = setTimeout(omStart,millisec);

	$("*").bind('keydown mousedown', function(omStart) {
		clearTimeout(timer);
		timer = setTimeout(omStart,millisec);
	});
	
})(jQuery);

// Putsa DOM-trädet
(function ($) {
	$.support.placeholder = ('placeholder' in document.createElement('input'));
	
	$(function() {

		/* Sökrutan */
		$('.arena-search-text .arena-input-text').attr('placeholder', 'Sök böcker, filmer, tidskrifter …');	
	
		/* Inloggning */
		$('.arena-login-username').attr('placeholder', 'Lånekort, personnr eller användarnamn').attr('title', 'Lånekortsnumret (11 siffror), ditt personnummer (10 siffror utan streck) eller användarnamn');
		$('.arena-login-password').attr('placeholder', 'PIN-kod eller lösenord').attr('title', 'PIN-kod (fyra siffror) eller lösenord');
	
		//fix for IE7 - 9
		if (!$.support.placeholder) {
			$("[placeholder]").focus(function () {
				if ($(this).val() == $(this).attr("placeholder")) $(this).val("");
			}).blur(function () {
				if ($(this).val() == "") $(this).val($(this).attr("placeholder"));
			}).blur();
	
			$("[placeholder]").parents("form").submit(function () {
				$(this).find('[placeholder]').each(function() {
					if ($(this).val() == $(this).attr("placeholder")) {
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

