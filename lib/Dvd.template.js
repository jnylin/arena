function Dvd(record) {
	this.record = record;

	// API-nyckel som första argument till Tmdb
    var tmdb = new Tmdb('', this),
		query;

	query = record.title.main;

	if ( record.title.sub ) {
		query += ' ' + record.title.sub;
	}

	console.log(tmdb);	
	tmdb.search(query);

}

Dvd.prototype.cover = function(tmdb) {
	this.record.subElements.bookJacket.find('img').attr('src', tmdb.urlPoster);
	if ( this.record.view === 'detail') {
		this.record.subElements.cover.append('<a href="' + tmdb.url + '/' + tmdb.mediaType + '/' + tmdb.id + '?language=sv' + '" target="_blank" title="Information hos TMDb"><img src="http://bibliotek.vimmerby.se/' + tmdb.pathLogo + '" alt="themoviedb.org" /></a>');
	}
};
