function Ljudprov(catalogueRecord) {
	var that = this;

	//url: "http://pipes.yahoo.com/pipes/pipe.run?_id=21ebd265e688111bc604d76d2bfb2841&_render=json&author=" + au.lastname + "&title=" + title.main + "&_callback=ljudprov",
	$.ajax({
		type: "GET",
		url: "http://pipes.yahoo.com/pipes/pipe.run?_id=21ebd265e688111bc604d76d2bfb2841&_render=json&author=" + catalogueRecord.author.lastname + "&title=" + catalogueRecord.title.main,
		dataType: "jsonp",
		success: function(json) {
			console.log(json);
			
			/*if (json.count == 1 && json.value.items[0].hit == 1) {
			var audioUrl = "http://www.elib.se/sample_new/audio/ISBN" + convert13to10(json.value.items[0].isbn) + ".mp3";
		
			audioPlayer(audioUrl,"Provlyssna","Ett kort provlyssningsavsnitt");*/
		}
	});	

}