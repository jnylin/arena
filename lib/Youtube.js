function Youtube(id) {
	this.id = id;
	this.init();
}

Youtube.prototype.init = function() {
	var div = document.getElementById(this.id);
	
	// Based on the YouTube ID, we can easily find the thumbnail image
	var img = document.createElement("img");
	img.setAttribute("src", "//i.ytimg.com/vi/" + this.id + "/hqdefault.jpg");
	img.setAttribute("class", "thumb");

	// Overlay the Play icon to make it look like a video player
	var playButton = document.createElement("i");
	//playButton.setAttribute("href","")
	if ( $('html').attr('class').match(/\b(mobile)\b/) ) {
		playButton.setAttribute("class","fa fa-youtube-square");
	}
	else {
		playButton.setAttribute("class","fa fa-youtube-play");
	}

	div.appendChild(img);
	div.appendChild(playButton);
	
	div.onclick = function() {
	
		// iframe med autoplay
		var iframe = document.createElement("iframe");
		iframe.setAttribute("src", "https://www.youtube.com/embed/" + this.id + "?autoplay=1&autohide=1&border=0&wmode=opaque&enablejsapi=1&rel=0");

		iframe.style.width  = this.style.width;
		iframe.style.height = this.style.height;

		this.parentNode.replaceChild(iframe, this);
 
	};
	
};