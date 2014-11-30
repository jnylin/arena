function Tmdb(apiKey, dvd) {
	this.apiKey = apiKey;
	this.dvd = dvd;
}

Tmdb.prototype.url = 'http://www.themoviedb.org';
// Egenskaper för API:t
Tmdb.prototype.api = 'http://api.themoviedb.org/3/';
Tmdb.prototype.pathLogo = "/documents/58068/140667/tmdb.png/fa3903c1-b170-4ab2-970a-baf9264001d9?t=1387215209438";
Tmdb.prototype.baseUrlImg = 'http://image.tmdb.org/t/p/w';
Tmdb.prototype.posterSizes = [92, 154, 185, 342, 500, 780];

// API-funktioner
Tmdb.prototype.search = function(query) {
	console.log(this);
	console.log("query = " + query);

	$.ajax({
		type: 'GET',
		url: this.api + 'search/multi?api_key=' + this.apiKey + '&query=' + encodeURIComponent(query) + '&language=sv',
		datatype: 'jsonp',
		success: this.searchCallback(this)
	});

};

Tmdb.prototype.searchCallback = function(thisObj) {
	return function(json) {
		var arrResults = json.results,
			arrCandidates = [],
			movie, tv,
			diffYear;

		/* HANTERA TRÄFFLISTAN */
		// Jämför svensk/tillgänglig titel
		for (var i=0;i<arrResults.length;i++) {
			if ( arrResults[i].media_type === "movie" && thisObj.movieIsInListOfHits(arrResults[i], "ti") === true ) {
				movie = arrResults[i];
				diffYear = thisObj.dvd.record.year - REG_EXP_YEAR.exec(movie.release_date);	
				arrCandidates.push([diffYear,i]);					
			}
			else if ( arrResults[i].media_type === "tv" && thisObj.tvIsInListOfHits(arrResults[i]) ) {
				tv = arrResults[i];
			}
		}

		// I värsta fall liknande titel
		if ( arrCandidates.length < 1 ) {
			for (i=0;i<arrResults.length;i++) {
				if ( arrResults[i].media_type === "movie" && thisObj.movieIsProbablyInListOfHits(arrResults[i]) === true ) {
					movie = arrResults[i];
					diffYear = thisObj.dvd.record.year - REG_EXP_YEAR.exec(movie.release_date);
					arrCandidates.push([diffYear,i]);						
				}
			}
		}

		// Välj bästa kandidaten
		if ( arrCandidates.length < 1 ) {
			movie = "";
		}
		else {
			// Sortera på skillnad i utgivningsår (diffYear)
			arrCandidates.sort(function(a, b) { return ( (a[0] < b[0]) ? -1 : ( (a[0] > b[0]) ? 1 : 0 ) ); });
			movie = arrResults[arrCandidates[0][1]];
		}

		// Sätt egenskaper
		if ( movie !== '' ) {
			thisObj.id = movie.id;
			thisObj.mediaType = 'movie';
			thisObj.setUrlPoster(movie.poster_path);
		}
		else if ( tv ) {
			thisObj.id = tv.id;
			thisObj.mediaType = 'tv';
			thisObj.setUrlPoster(tv.poster_path);
		}

		// Töm resultatarrayen för att kunna göra en ny sökning
		arrResults.length = 0;
		
		// Sätt omslag med mera
		thisObj.dvd.cover(thisObj);
	};

};

Tmdb.prototype.tv = function(id) {
	$.ajax({
		type: 'GET',
		url: this.api + 'tv/' + id + '?api_key=' + this.apiKey + '&language=sv',
		datatype: 'jsonp',
		success: this.tvCallback(this, this.dvd.record.title.part)
	});
};

Tmdb.prototype.tvCallback = function(thisObj, seasonNr) {
	return function(json) {
		var tvSeason;
			
		/* Exemplet Downton Abbey har en "special"-DVD */
		if ( json.seasons.length === json.number_of_seasons ) {
			seasonNr = seasonNr - 1;
		}		
		tvSeason = json.seasons[seasonNr];
			
		thisObj.posterPath = tvSeason.poster_path;
	};
};

// Avgör om en titel finns i träfflistan
Tmdb.prototype.movieIsInListOfHits = function(movie) {
		var hit = false,
			sameTitle = ( ( this.titleToCompare(this.dvd.record.title.main) === this.titleToCompare(movie.title) ) || ( this.titleToCompare(this.dvd.record.title.main) === this.titleToCompare(movie.original_title) ) );
	
		if ( sameTitle ) {
			hit = true;
		}
	
		return hit;				
};

Tmdb.prototype.movieIsProbablyInListOfHits = function(movie) {
		var hit = false,
			titleFromTmdb = this.titleToCompare(movie.title);
		
		if ( ( titleFromTmdb.search( this.titleToCompare(this.dvd.record.title.main) ) > -1 && titleFromTmdb.search( this.dvd.record.title.part ) > -1 ) || ( this.titleToCompare(this.dvd.record.title.main).search(titleFromTmdb) > - 1 ) ) {
			hit = true;
		}
	
		return hit;				
};

Tmdb.prototype.tvIsInListOfHits = function(tv) {
		var hit = false,
			sameTitle = ( this.titleToCompare(this.dvd.record.title.main) === this.titleToCompare(tv.name) );
		
		if ( sameTitle) {
			hit = true;
		}
		
		return hit;
};

Tmdb.prototype.titleToCompare = function(str) {
	var pattResChar, title;
	pattResChar = new RegExp(/[&+,\/:;=?@"-]/g);
	title = str.toLowerCase();
	title = title.replace(pattResChar,"");
	title = title.replace(/ /g,"");
	
	return title;
};

// GET/SET-metoder
Tmdb.prototype.getYoutubeId = function(json, id, lang) {

	var youtubeId = '';

	if ( json.youtube.length >= 1 ) {
		youtubeId = json.youtube[0].source;
	}

	return youtubeId;
};

Tmdb.prototype.setUrlPoster = function(poster_path) {
	if ( poster_path ) {
		this.urlPoster = this.baseUrlImg + this.posterSizes[0] + poster_path;
	}
};
