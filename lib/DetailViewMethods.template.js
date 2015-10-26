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
	console.log("addYoutubeMovie-id: " + id);
	var baseUrl = "//www.youtube-nocookie.com/embed/",
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
			swfPath: "//bibliotek.vimmerby.se/documents/58068/137602/Jplayer.swf/82ba0888-e101-438a-a73b-92f31bdc5f74"
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
	// Lägg in egen API-nyckel
	var apiKey = "";
	new Boktipset(apiKey, this.record);
};

