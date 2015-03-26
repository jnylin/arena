function Youtube(id) {
	this.id = id;
	this.init();
}

Youtube.prototype.init = function() {
	var youtube = document.getElementById(this.id);
	
	// Based on the YouTube ID, we can easily find the thumbnail image
	var img = document.createElement("img");
	img.setAttribute("src", "http://i.ytimg.com/vi/" + this.id + "/hqdefault.jpg");
	img.setAttribute("class", "thumb");

	// Overlay the Play icon to make it look like a video player
	var playButton = document.createElement("i");
	//playButton.setAttribute("href","")
	playButton.setAttribute("class","fa fa-youtube-play"); // Font Awesome

	youtube.appendChild(img);
	youtube.appendChild(playButton);

	// Attach an onclick event to the YouTube Thumbnail
	youtube.onclick = function() {

		// Create an iFrame with autoplay set to true
		var iframe = document.createElement("iframe");
		iframe.setAttribute("src", "https://www.youtube.com/embed/" + this.id + "?autoplay=1&autohide=1&border=0&wmode=opaque&enablejsapi=1");

		// The height and width of the iFrame should be the same as parent
		iframe.style.width  = this.style.width;
		iframe.style.height = this.style.height;

		// Replace the YouTube thumbnail with YouTube HTML5 Player
		this.parentNode.replaceChild(iframe, this);
 
	};
};