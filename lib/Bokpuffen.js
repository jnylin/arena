function Bokpuffen(record) {
	this.record = record;
	this.init();
}

Bokpuffen.prototype.init = function() {
	$.ajax({
		type: "GET",
		url: "http://pipes.yahoo.com/pipes/pipe.run?_id=a69b13c13ba656e4023b3b336c1bb1c3&_render=json&key=getpuff&title="+this.record.title.main.replace('å','a').replace('ä','a').replace('ö','o')+"&_callback=?",
		dataType: "jsonp",
		success: this.callback(this)
	});
};

Bokpuffen.prototype.callback = function(thisObj) {
	return function(json) {
			
			if ( json.count >= 1 ) {
				var items = json.value.items,
					title, author, mediaContent,
					methods = thisObj.record.methodsOnThisView;
				
				if ( items.length === 1 ) {
					// Jämför katalogposten med resultatet
					title = items[0].title;
					author = items[0].author;
					mediaContent = items[0]["media:content"];

					if ( title && author && mediaContent ) {
						/* replace vill inte fungera
						 * title = title.replace("&aring;","å").replace("&#228;","ä").replace("&#246;","ö").trim();
						author = author.replace("&aring;","å").replace("&#228;","ä").replace("&#246;","ö").trim();*/

						switch (thisObj.record.view) {
							case 'detail':
								methods.audioPlayer(mediaContent.url, "Bokpuffen", "Lyssna på bokens inledning");
								break;
							case 'list':
								methods.methodsOnThisView.advertise('Bokpuffen');
								break;
						}

					}

				}
			}		
	};
};
