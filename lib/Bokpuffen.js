function Bokpuffen(record) {
	this.record = record;
}

Bokpuffen.prototype.searchPuff = function() {
	$.ajax({
		type: "GET",
		url: "http://pipes.yahoo.com/pipes/pipe.run?_id=a69b13c13ba656e4023b3b336c1bb1c3&_render=json&key=getpuff&title="+this.record.title.main.replace('å','a').replace('ä','a').replace('ö','o')+"&_callback=?",
		dataType: "jsonp",
		cache: true,
		jsonpCallback: this.callback
	});
};


Bokpuffen.prototype.callback = function(json) {
	if ( json.count >= 1 ) {
		var items = json.value.items,
			title, author,
			audioUrl;

		if ( items.length === 1 ) {
			title = items[0].title;
			title = title.replace("&aring;","å").replace("&#246;","ö");
			author = items[0].author.replace("&aring;","å").replace("&#246;","ö");
			audioUrl = items[0]["media:content"].url;

			console.log('Bokpuff finns på ' + audioUrl);	
			//audioPlayer(audioUrl,"Bokpuffen","Lyssna på bokens inledning");

		}
	}
};
