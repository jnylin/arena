function Ljudprov(catalogueRecord) {
	var that = this;

	$.ajax({
		type: "GET",
		url: "http://pipes.yahoo.com/pipes/pipe.run?_id=21ebd265e688111bc604d76d2bfb2841&_render=json&author=" + au.lastname + "&title=" + title.main + "&_callback=ljudprov",
		dataType: "jsonp"
	});	
	
	this.getCatalogueRecord = function() {
		return catalogueRecord;
	}:
}

Ljudprov.prototype.callback = function(thisObj, view) {
}

function ljudprov(json) {
	if (json.count == 1 && json.value.items[0].hit == 1) {
		// mp3-filen hos Elib
		var audioUrl = "http://www.elib.se/sample_new/audio/ISBN" + convert13to10(json.value.items[0].isbn) + ".mp3";
		
		audioPlayer(audioUrl,"Provlyssna","Ett kort provlyssningsavsnitt");
	}
}

