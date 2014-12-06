function Bokpuffen(record) {
	this.record = record;
	
	this.getPuff();
}

Bokpuffen.prototype.getPuff = function() {
	$.ajax({
		type: "GET",
		url: "http://pipes.yahoo.com/pipes/pipe.run?_id=a69b13c13ba656e4023b3b336c1bb1c3&_render=json&key=getpuff&title="+this.record.title.main.replace('å','a').replace('ä','a').replace('ö','o')+"&_callback=?",
		dataType: "jsonp",
		success: function(json) {
			console.log(json);
			
			if ( json.count >= 1 ) {
				var items = json.value.items,
					title, author,
					audioUrl;
				

				if ( items.length === 1 ) {
					// Vad används de här variablerna till??
					if ( items[0].title ) {
						title = items[0].title;
						title = title.replace("&aring;","å").replace("&#246;","ö");
					}
					if ( items[0].author ) {
						author = items[0].author.replace("&aring;","å").replace("&#246;","ö");
					}
					if ( items[0]["media:content"] ) {
						audioUrl = items[0]["media:content"].url;
					}
					
					if ( typeof audioUrl 

					console.log('Bokpuff finns på ' + audioUrl);	
					//audioPlayer(audioUrl,"Bokpuffen","Lyssna på bokens inledning");
				}
			}		
		}
	});
};