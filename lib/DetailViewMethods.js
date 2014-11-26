function DetailViewMethods(record) {
	try {
		if ( record.view !== 'detail' ) {
			throw 'Only possible from the detail-view';
		}
	}
	catch(err) {
		console.log(err);
	}
}

DetailViewMethods.prototype.addAudioPlayer = function (audioUrl,linkTxt,linkTitle) {
};
/*CatalogueRecord.prototype.addAudioPlayer = function (audioUrl,linkTxt,linkTitle) {
	try {
		if ( this.view !== 'detail' ) {
			throw 'Only possible from the detail-view';
		}
	}
	catch(err) {
		console.log(err);
	}

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
		appendExternalRes("#jp_container_1",linkTxt,linkTitle,"_self",'btnPlay');		


		// OBS!! id
		$(".btnPlay").click( function() {
			$("#audioplayer").jPlayer("play");
			$("#jp_container_1").show("slow");
		});
}*/

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

/*DetailViewMethods.prototype.addYoutubeMovie(id) {
}*/
/*CatalogueRecord.prototype.addYoutubeMovie(id) {
	// 	Lägger till en youtube-film till sidan
	//	Argument: youtube-id
	try {
		if ( this.view !== 'detail' ) {
			throw 'Only possible from the detail-view';
		}
	}
	catch(err) {
		console.log(err);
	}

	// url = baseUrl + id + ?rel=0
	var baseUrl, width, height;
	baseUrl = "http://www.youtube-nocookie.com/embed/";
	width = "560";
	height = "315";
	
	// Lägg till youtube-filmen till sidan
	$('#youtube').prepend('<iframe width="' + width + '" height="' + height + '" src="' + baseUrl + id + '?rel=0" frameborder="0" allowfullscreen></iframe>');
	$('#youtube').show();
}*/