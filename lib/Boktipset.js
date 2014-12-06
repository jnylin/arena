function Boktipset(apiKey, record) {
	this.apiKey = apiKey;
	this.record = record;
	this.init();
}

Boktipset.prototype.init = function() {
	$.ajax({
		type: "GET",
		url: "http://api.boktipset.se/book/book.cgi?accesskey=" + this.apiKey + "&isbn=" + this.record.isbn + "&format=json&jsonwrapper=?",
		/*broswer finns inte from 1.10 url: $.browser.msie ? "http://opac.vimmerby.se/local/bookit7/add/boktipset.php?isbn=" + isbn : "http://api.boktipset.se/book/book.cgi?accesskey=OHt0dnZGVhTraT0X45VnA&isbn=" + isbn + "&format=json&jsonwrapper=boktipset",*/
		dataType: "jsonp",
		scriptCharset: "iso-8859-1",
		success: this.callback(this)
	});				
};

Boktipset.prototype.callback = function(thisObj) {
	return function(json) {
		var uList = '<ul></ul>',
			openListItem = '<li><a href="',
			listOfPapers,
			_reviews, _comments,
			openBlockQuote = '<blockquote><p>',
			i;

		// Kommentarer
		if ( json.answer.comments.bookcomments ) {
			_comments=json.answer.comments.bookcomments.bookcomment;
		}
		else {
			_comments=[];
		}
		if ( _comments.length > 0 ) {
			$("#comments").append('<h3 style="margin-top: 0; text-indent: 2em;">från <a href="' + json.answer.url + '" target="_blank">Boktipset.se</a></h3>');
			if ( _comments instanceof Array ) {
				for (i=0;i<=_comments.length-1;i++) {
					// Skriv inte ut kommentaren om betyget är 1
					// Vi misstänker att 1 == galning
					if ( _comments[i].grade > 1 ) {
						document.getElementById("comments").innerHTML += openBlockQuote + _comments[i].text + '</p></blockquote>';
					}
				}
			}
			else {
				// Någon på Boktipset var full när den skrev API:t
				if ( _comments.grade > 1 ) {
					document.getElementById("comments").innerHTML += openBlockQuote + _comments.text + '</p></blockquote>';
				}
			}
			// Visa bara kommentarer om det finns några vettiga
			if ( $("#comments blockquote").length > 0 ) {
				$("#comments").show();
			}
		}
	
		// Tidningar och radio
		_reviews=json.answer.paper_reviews;
		if ( _reviews ) {
			$("#papers:hidden").show();
			$("#papers").append(uList);
			listOfPapers = document.getElementById("papers").getElementsByTagName("ul")[0];
			if ( _reviews.item instanceof Array ) {
				for (i=0;i<=_reviews.item.length-1;i++) {
					listOfPapers.innerHTML += openListItem + _reviews.item[i].link.substr(24) + '" target="_blank">' + _reviews.item[i].source + '</a></li>';
				}
			}
			else {
				listOfPapers.innerHTML += openListItem + _reviews.item.link.substr(24) + '" target="_blank">' + _reviews.item.source + '</a></p>';
			}
		}

		// Bloggar
		/* undefined, kolla varför? */
		//_blogs=json.answer.blogs;
};

};


