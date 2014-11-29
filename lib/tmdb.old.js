function Tmdb(title,year,part) {
    // Metoder
    // Hanterar svaret från TMDb:s API
    this.init=init;
    function init(json) {
	
		var arrMovie, arrCandidates, movie, tv, diffYear;
		arrMovie = json.results;
		arrCandidates = new Array(); // Lägger in diffYear och i från arrMovie
		
		// HANTERA TRÄFFLISTAN		
		// Jämför svensk/tillgänglig titel
		// För tv-serier görs bara den här jämförelsen
		for (i=0;i<arrMovie.length;i++) {
			if ( arrMovie[i].media_type == "movie" && movieIsInListOfHits(arrMovie[i], "ti") === true ) {
				movie = arrMovie[i];
				diffYear = year - pattYear.exec(movie.release_date);	
				arrCandidates.push([diffYear,i]);					
			}
			else if ( arrMovie[i].media_type == "tv" && tvIsInListOfHits(arrMovie[i]) ) {
				tv = arrMovie[i];
			}
		}
		// Och annars originaltitel om vi har tillgång till den
		/*if ( original_title ) {
			if ( arrCandidates.length < 1 ) {
				for (i=0;i<arrMovie.length;i++) {
					if ( arrMovie[i].media_type == "movie" && movieIsInListOfHits(arrMovie[i]) === true ) {
						movie = arrMovie[i];
						diffYear = year - pattYear.exec(movie.release_date);
						arrCandidates.push([diffYear,i]);
					}
				}	
			}
		}*/
		// I värsta fall liknande titel
		if ( arrCandidates.length < 1 ) {
			for (i=0;i<arrMovie.length;i++) {
				if ( arrMovie[i].media_type == "movie" && movieIsProbablyInListOfHits(arrMovie[i]) === true ) {
					movie = arrMovie[i];
					diffYear = year - pattYear.exec(movie.release_date);
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
			movie = arrMovie[arrCandidates[0][1]];
		}
		
		// Sätt egenskaper
		if ( movie != "" ) {
			this.setId(movie.id);
			this.setMediaType("movie");
			this.setUrlPoster(movie.poster_path);
		}
		else if ( tv ) {
			this.setId(tv.id);
			this.setMediaType("tv");
			this.setUrlPoster(tv.poster_path);
		}

		arrMovie = "";
    }

    // Ta fram youtube-id:t från trailerapi-svaret
    this.getYoutubeId=getYoutubeId
    function getYoutubeId(json,id,lang) {
	
		var youtubeId = "";
	
		if ( json.youtube.length >= 1 ) {
			youtubeId = json.youtube[0].source;
		}
	
		return youtubeId;
    }
	
    this.setId=setId;
    function setId(id) {
		this.id = id;
    }
	
	this.setMediaType=setMediaType;
	function setMediaType(mediaType) {
		this.mediaType = mediaType;
	}
	
    this.setUrlPoster=setUrlPoster;
    function setUrlPoster(poster_path) {
		if(poster_path) {
			this.urlPoster = this.baseUrlImg + this.posterSize + poster_path;
		}
    }
    
    // Egenskaper
    this.id = "";
	this.mediaType = "";
	this.baseUrlImg = "http://image.tmdb.org/t/p/w"
	this.posterSize = 92; /* Tillgängliga: 92, 154, 185, 342, 500, 780 */
    this.urlPoster = "";	
    this.pathLogo = "/documents/58068/140667/tmdb.png/fa3903c1-b170-4ab2-970a-baf9264001d9?t=1387215209438";
    this.apiKey = "de9f79bfc08b502862e4d8bba5723414";	// Ta bort om jag ska dela med mig av koden!
    
	//*******************
    // Privata funktioner

	function movieIsInListOfHits(movie/*, compareBy*/) {
	// Returnerar true om titeln finns i listan, annars false
	// Jämför titel exakt
	
		var /*compareBy, */hit, sameTitle;
		/*compareBy = compareBy || "origTi";*/
		hit = false;
	
		/*switch (compareBy) {
			case "origTi":
				sameTitle = ( titleToCompare(origTi) == titleToCompare(movie.original_title) );
				break;
			case "ti":
				sameTitle = ( titleToCompare(ti) == titleToCompare(movie.title) );
				break;
		}*/

		// Ex. Den store Gatsby har en premiärtitel och en DVD-titel
		sameTitle = ( ( titleToCompare(ti) == titleToCompare(movie.title) ) || ( titleToCompare(ti) == titleToCompare(movie.original_title) ) );
	
		if ( sameTitle ) {
			hit = true;
		}
	
		return hit;				
    }
	
	function tvIsInListOfHits(tv) {
	
		var hit, sameTitle;
		hit = false;
		
		sameTitle = ( titleToCompare(ti) == titleToCompare(tv.name) );
		
		if ( sameTitle) {
			hit = true;
		}
		
		return hit;
	}
	
    function movieIsProbablyInListOfHits(movie) {
	// Returnerar true om katalogpostens titel finns i API-svarets titel
	// eller API-svarets titel finns i katalogpostens titel
	
		var hit, titleFromTmdb;
		hit = false;
		titleFromTmdb = titleToCompare(movie.title);
		
		if ( ( titleFromTmdb.search( titleToCompare(ti) ) > -1 && titleFromTmdb.search( part ) > -1 ) || ( titleToCompare(ti).search(titleFromTmdb) > - 1 ) ) {
			hit = true;
		}
	
		return hit;				
	    
    }
    
    function titleToCompare(str) {
		var pattResChar, title;
		pattResChar = new RegExp(/[&+,\/:;=?@"-]/g);
		title = str.toLowerCase();
		title = title.replace(pattResChar,"");
		title = title.replace(/ /g,"");
	
		return title;
    }
    
    // Privata variabler
	var ti, subTi, part, year, splitTi,
		pattYear, regExpTi;
	ti = title; // infå från katalogposten/träfflistan/dynamisk lista
	part = part;
    //var origTi = original_title;
    year = year;
    splitTi = ti.split(" ");	
    
    pattYear = new RegExp("[0-9]{4}","i");
    regExpTi = new RegExp(splitTi[splitTi.length-1],'i');
}

function TvSeason() {
	/* Separat klass för att få säsongsspecifik information */
	this.init=init;
	function init(json, seasonNr) {
		var tvSeason;
		
		/* Exemplet Downton Abbey har en "special"-DVD */
		if ( json.seasons.length == json.number_of_seasons ) {
			seasonNr = seasonNr - 1;
		}		
		tvSeason = json.seasons[seasonNr];
	
		this.posterPath = tvSeason.poster_path;
	}
	
}