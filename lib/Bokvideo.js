function Bokvideo(record) {
	this.record = record;
	this.publishers = ["R&S", "BW", "Damm"];
}

Bokvideo.prototype.getChannel = function() {

	var channel;

	switch ( this.record.publisher ) {
		case "R&S":
			channel = "rabensjogren";
			break;
		case "BW":
			channel = "FormaBooks";
			break;
		case "Damm":
			channel = "FormaBooks";
			break;
	}


	return channel;

};

Bokvideo.prototype.init = function(channel) {

	var query =  this.record.title.main + "+" + this.record.author.lastname;

	$.ajax({
		type: "GET",
		url: "https://gdata.youtube.com/feeds/api/videos?v=2&alt=jsonc&author=" + channel + "&max-results=1&q=" + query,
		dataType: "jsonp",
		success: this.searchCallback(this, this.record.view)
	});

};

Bokvideo.prototype.searchCallback = function(thisObj, view) {
	return function(json) {
		var methods = thisObj.record.methodsOnThisView;

		if ( json.data.totalItems > 0 ) {
			var video = json.data.items[0],
				test = video.title.indexOf(thisObj.record.title.main) > -1 || video.title.indexOf(thisObj.record.author.lastname) > -1;

		
			// Barnens bibliotek??	
			if ( test ) {

				switch ( view) {
					case 'detail':
						methods.addYoutubeMovie(video.id);
						methods.addLnkToExtRes('#youtube', 'Bokvideo', 'Se en bokvideo', '_self', 'btnPlay');
						break;
					case 'list':
						methods.advertise('Bokvideo');
						break;
				}
					

			}
		}
	};
};
