function Ljudprov(catalogueRecord) {

	$.ajax({
		type: "GET",
		url: "http://pipes.yahoo.com/pipes/pipe.run?_id=21ebd265e688111bc604d76d2bfb2841&_render=json&author=" + catalogueRecord.author.lastname + "&title=" + catalogueRecord.title.main + "&_callback=?",
		dataType: "jsonp",
		cache: true,
		success: function(json) {
			var methods = catalogueRecord.methodsOnThisView;

			// obs! röret ger "hit": "1"	
			if (json.count === 1 && json.value.items[0].hit === "1") {
				var audioUrl = "http://www.elib.se/sample_new/audio/ISBN" + convert13to10(json.value.items[0].isbn) + ".mp3";

				switch (catalogueRecord.view) {
					case 'detail':
						methods.audioPlayer(audioUrl, 'Provlyssna', 'Lyssna på inledningen av boken');
						break;
					case 'list':
						methods.advertise('Provlyssna');
						break;
				}

			}
		}
	});	

}
