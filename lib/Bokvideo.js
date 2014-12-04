function Bokvideo(record) {
	this.record = record;

	this.search(this.getChannel());

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
		default:
			break;
	}

	return channel;

};

Bokvideo.prototype.searchFeed = function(channel) {

	var query =  this.record.title.main + "+" + this.record.author.lastname;

	$.ajax({
		type: "GET",
		url: "https://gdata.youtube.com/feeds/api/videos?v=2&alt=jsonc&author=" + channel + "&max-results=1&q=" + query,
		dataType: "jsonp",
		success: this.searchCallback(this)
	});

};

Bokvideo.prototype.searchCallback = function() {
	return function(json) {
			if ( json.data.totalItems > 0 ) {
				var video = json.data.items[0],
					test = video.title.indexOf(this.record.title.main) > -1 || video.title.indexOf(this.record.author.lastname) > -1;

		
			// Barnens bibliotek??	
				if ( test ) {
					console.log("video.id = " + video.id);

					// Lägg till en knapp
				}
			}
	};
};
