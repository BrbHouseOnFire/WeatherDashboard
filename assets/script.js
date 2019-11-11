// API key
const APIKey = "166a433c57516f51dfab1f7edaed8413";
let lat = "";
let lon = "";
let history = [];
let initKey = 0;

// URLS for API calls
let queryCurrentURL = "https://api.openweathermap.org/data/2.5/weather?" +
    "q=Chicago,us&units=imperial&appid=" + APIKey;
let queryForecastURL = "https://api.openweathermap.org/data/2.5/forecast?" +
    "q=Chicago,us&units=imperial&appid=" + APIKey;
let queryUVURL = "http://api.openweathermap.org/data/2.5/uvi/forecast?appid=" +
    APIKey + "&lat=" + lat + "&lon=" + lon;
    
// set current date
$("#cdate").text(moment().format("MMM Do YYYY"));

let init = () => {
    makeCall("Chicago")
}

let makeCall = (city) => {
    storeSearch(city);
    callCurrent(city);
    callForecast(city);
    displayHistory();
    initKey++;
}

let callCurrent = (cityInput) => {
    // update the API URL
    queryCurrentURL = `https://api.openweathermap.org/data/2.5/weather?q=${cityInput},us&units=imperial&appid=${APIKey}`;
    // make the API call
    $.ajax({
        url: queryCurrentURL,
        method: "GET"
        }).then(function(response) {
            // Log the resulting object
            // console.log("Current:");
            // console.log(response);
    
            // Transfer content to HTML
            $("#currentCity").html(response.name);
            $("#cwind").text("Wind Speed: " + response.wind.speed + " MPH");
            $("#chumidity").text("Humidity: " + response.main.humidity + "%");
            $("#ctemp").html("Temperature: " + response.main.temp + "&deg F");
            let img = response.weather[0].icon;
            $("#cimg").attr("src",`http://openweathermap.org/img/wn/${img}.png`)
            // store latitude and longitude of the search city
            lat = response.coord.lat;
            lon = response.coord.lon;
            // make new API call for UV index
            callUV(lat, lon);



    });
}
let callForecast = (cityInput) => {
    
    queryForecastURL = `https://api.openweathermap.org/data/2.5/forecast?q=${cityInput},us&units=imperial&appid=${APIKey}`;
    $.ajax({
        url: queryForecastURL,
        method: "GET"
        }).then(function(response) {
            // Log the resulting object
            // console.log("Forecast:");
            // console.log(response);
            // loop through the API results to pull values from each day
            for (var i = 0; i < 40; i+=8) {
                let j = parseInt((i+9)/8);
                // calculate future dates
                let date = moment().add(j, 'days').format("MMM Do");
                let tag = `day${j}`
                // display date
                $(`#${tag}date`).text(date);
                // find and generate image icon
                let img = response.list[i].weather[0].icon;
                $(`#${tag}img`).attr("src",`http://openweathermap.org/img/wn/${img}.png`);
                // find and generate temperature
                $(`#${tag}temp`).html(`${response.list[i].main.temp}&deg F`);

            }
    });
}
let callUV = (latty, lonny) => {
    // update API url with key, longitude, and latitude
    queryUVURL = "http://api.openweathermap.org/data/2.5/uvi/forecast?appid=" +
    APIKey + "&lat=" + latty + "&lon=" + lonny;
    // make the API call
    $.ajax({
        url: queryUVURL,
        method: "GET"
        }).then(function(response) {
            // Log the resulting object
            // console.log("UV:");
            // console.log(response);
            // display the result
            $("#cuv").text("UV Index: " + response[0].value);
    });
}


let storeSearch = (cityInput) => {
    // check if this is the initial page run before storing historical searches
    if (initKey !== 0) {
        // pull history from local storage
        let string = localStorage.getItem("searchHistory");
        // check if history exists
        if (string === null) {
            // add new search to history array
            history.push(cityInput);
            // store updated array into local storage
            localStorage.setItem("searchHistory", JSON.stringify(history));
        }
        else {
            // parse the string stored in local storage
            let object = JSON.parse(string);
            // add the new search to the front of the array
            object.unshift(cityInput);
            // save the updated info to the global array
            history = object;
            // store the history array back in local storage
            localStorage.setItem("searchHistory", JSON.stringify(history));
        }
    }
}

let displayHistory = () => {
    // pull local storage for history
    let string = localStorage.getItem("searchHistory");
    // if local storage is empty:
    if (string === null) {
        // do nothing
    }
    else {
        // parse and store the array held in storage
        history = JSON.parse(string);
        // for up to a max of 5 visible buttons
        for(var i = 1; i < 6; i++) {
            // index marker
            j=i-1;
            // check for empty or blank values in the array
            if(history[j] !== "" && history[j] !== null && history[j] !== undefined) {
                // add the search text to a history button
                $(`#city${i}`).text(history[j]);
                // display the history button
                $(`#city${i}`).removeClass("d-n");
            }
        }
    }

}

$('#searchBox').keypress(function(e) {
    if (e.which == 13) {
        // search on Enter-key
        $('#searchSubmit').click(); 
    }
});

// make a call when the user searches
$('#searchSubmit').on('click', function() {
    // save user's search value
    let userSearch = $('#searchBox').val();
    // clear the searchbox
    $('#searchBox').val("");
    // console.log("User Search: " + userSearch);
    // call the API to find out the weather
    makeCall(userSearch);
});

$('.cityhistory').on('click', function() {
    // save user's search value
    let userSearch = $(this).text();
    // clear the searchbox
    $('#searchBox').val("");
    // console.log("User Search: " + userSearch);
    // don't create a new history button when clicking a history item
    initKey = 0;
    // call the API to find out the weather
    makeCall(userSearch);
});

// Run intial page setup
init();
