var fs = require('fs'); 
var request = require('request');
var dotenv = require("dotenv").config();
var keys = require("./keys.js");

var Spotify = require('node-spotify-api');


var command = process.argv[2];
var searchValue = '';

for (var i = 3; i< process.argv.length; i++){
    searchValue =+ process.argv[i] + ' ';
};

function errorFunction(respError){
    if(respError) {
        return console.log("Error:", respError);
    }
};

function errorFunctionStart(respError){
    errorFunction();
    console.log("Log Started");
};

function errorFunctionEnd(respError){
    errorFunction();
    console.log("Ended");
};

//===Spotify===

function searchSong(searchValue){
    if(searchValue == ''){
        searchValue = 'The Sign Ace of Base';
    }

    var spotify = new Spotify(keys.spotify);
    var searchLimit = '';

    if(isNaN(parseInt(process.argv[3])) == false){
        searchLimit = process.argv[3];
        console.log('\nYou requested to return: ' + searchLimit + ' songs');

        //resetting the searchValue
        searchValue = '';
        for(var i = 4; i <process.argv.length; i++){
            searchValue += process,argv[i] + '';
        }
    } else {
        console.log('\nFor more than 1 result, add the number of results you would like to be returned after spotify-this-song.');
        searchLimit =1;
}

spotify.search({ type: 'track', query: searchValue, limit: searchLimit }, function(respError, response) {

    fs.appendFile("log.txt", "-----Spotify Log Entry Start-----\nProcessed on:\n" + Date() + "\n\n" + "terminal commands:\n" + process.argv + "\n\n" + "Data Output: \n", errorFunctionStart());

    errorFunction();

    var songResp = response.tracks.items;

    for (var i = 0; i < songResp.length; i++) {
        console.log("\n=============== Spotify Search Result "+ (i+1) +" ===============\n");
        console.log(("Artist: " + songResp[i].artists[0].name));
        console.log(("Song title: " + songResp[i].name));
        console.log(("Album name: " + songResp[i].album.name));
        console.log(("URL Preview: " + songResp[i].preview_url));
        console.log("\n=========================================================\n");

        fs.appendFile("log.txt", "\n========= Result "+ (i+1) +" =========\nArtist: " + songResp[i].artists[0].name + "\nSong title: " + songResp[i].name + "\nAlbum name: " + songResp[i].album.name + "\nURL Preview: " + songResp[i].preview_url + "\n=============================\n", errorFunction());
    }

    fs.appendFile("log.txt","-----Spotify Log Entry End-----\n\n", errorFunctionEnd());
})
};

//=======OMDB====

function searchMovie(searchValue) {
    if(searchValue == ''){
        searchValue = 'Mr.Nobody';
    }
    var queryUrl = "http://www.omdbapi.com/?t=" + searchValue.trim() + "&y=&plot=short&apikey=trilogy";
    request(queryUrl, function(respError, response, body){
        fs.appendFile("log.txt", "-----OMDB Log Entry Start-----\n\nProcessed on:\n" + Date() + "\n\n" + "terminal commands:\n" + process.argv + "\n\n" + "Data Output: \n\n", errorFunctionStart());
        errorFunction();

        if (JSON.parse(body).Error == 'Movie not found!' ) {

            console.log("\nI'm sorry, I could not find any movies that matched the title " + searchValue + ". Please check your spelling and try again.\n")

            fs.appendFile("log.txt", "I'm sorry, I could not find any movies that matched the title " + searchValue + ". Please check your spelling and try again.\n\n-----OMDB Log Entry End-----\n\n", errorFunctionEnd());
        
        } else {

            movieBody = JSON.parse(body);

            console.log("\n++++++++++++++++ OMDB Search Results ++++++++++++++++\n");
            console.log("Movie Title: " + movieBody.Title);
            console.log("Year: " + movieBody.Year);
            console.log("IMDB rating: " + movieBody.imdbRating);

            // If there is no Rotten Tomatoes Rating
            if (movieBody.Ratings.length < 2) {

                console.log("There is no Rotten Tomatoes Rating for this movie.")

                fs.appendFile("log.txt", "Movie Title: " + movieBody.Title + "\nYear: " + movieBody.Year + "\nIMDB rating: " + movieBody.imdbRating + "\nRotten Tomatoes Rating: There is no Rotten Tomatoes Rating for this movie \nCountry: " + movieBody.Country + "\nLanguage: " + movieBody.Language + "\nPlot: " + movieBody.Plot + "\nActors: " + movieBody.Actors + "\n\n-----OMDB Log Entry End-----\n\n", errorFunction());
                
            } else {

                console.log("Rotten Tomatoes Rating: " + movieBody.Ratings[[1]].Value);

                fs.appendFile("log.txt", "Movie Title: " + movieBody.Title + "\nYear: " + movieBody.Year + "\nIMDB rating: " + movieBody.imdbRating + "\nRotten Tomatoes Rating: " + movieBody.Ratings[[1]].Value + "\nCountry: " + movieBody.Country + "\nLanguage: " + movieBody.Language + "\nPlot: " + movieBody.Plot + "\nActors: " + movieBody.Actors + "\n\n-----OMDB Log Entry End-----\n\n", errorFunction());
            }
            
            console.log("Country: " + movieBody.Country);
            console.log("Language: " + movieBody.Language);
            console.log("Plot: " + movieBody.Plot);
            console.log("Actors: " + movieBody.Actors);
            console.log("\n+++++++++++++++++++++++++++++++++++++++++++++++++\n");
            console.log(" Log Ended ");
        };      
    });
};
    //==do what it says

    function randomSearch() {

        fs.readFile("random.txt", "utf8", function(respError, data) {
    
            var randomArray = data.split(", ");
    
            errorFunction();
    
            if (randomArray[0] == "spotify-this-song") {
                searchSong(randomArray[1]);
            } else if (randomArray[0] == "movie-this") {
                searchMovie(randomArray[1]);
            }
        });
    };
    


