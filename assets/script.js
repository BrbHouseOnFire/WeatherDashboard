// const util = require('util');

// This is our API key
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
    
// 
$("#cdate").text(moment().format("MMM Do YYYY"));




let init = () => {
    makeCall("Chicago")
}

let makeCall = (city) => {
    console.log("initKey: " + initKey);
    storeSearch(city);
    callCurrent(city);
    callForecast(city);
    displayHistory();
    initKey++;
}

let callCurrent = (cityInput) => {
    
    queryCurrentURL = `https://api.openweathermap.org/data/2.5/weather?q=${cityInput},us&units=imperial&appid=${APIKey}`;

    $.ajax({
        url: queryCurrentURL,
        method: "GET"
        }).then(function(response) {
            // Log the resulting object
            console.log("Current:");
            console.log(response);
    
            // Transfer content to HTML
            $("#currentCity").html(response.name);
            $("#cwind").text("Wind Speed: " + response.wind.speed + " MPH");
            $("#chumidity").text("Humidity: " + response.main.humidity + "%");
            $("#ctemp").html("Temperature: " + response.main.temp + "&deg F");
            let img = response.weather[0].icon;
            $("#cimg").attr("src",`http://openweathermap.org/img/wn/${img}.png`)

            lat = response.coord.lat;
            lon = response.coord.lon;
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
            console.log("Forecast:");
            console.log(response);

            for (var i = 0; i < 40; i+=8) {
                let j = parseInt((i+9)/8);
                // calculate future dates
                let date = moment().add(j, 'days').format("MMM Do");
                
                let tag = `day${j}`
                $(`#${tag}date`).text(date);
    
                // find and generate image icon
                // console.log(response.list[i].weather[0].icon);
                let img = response.list[i].weather[0].icon;
                $(`#${tag}img`).attr("src",`http://openweathermap.org/img/wn/${img}.png`);
    
                // find and generate temperature
                $(`#${tag}temp`).html(`${response.list[i].main.temp}&deg F`);

            }
    });
}
let callUV = (latty, lonny) => {
    queryUVURL = "http://api.openweathermap.org/data/2.5/uvi/forecast?appid=" +
    APIKey + "&lat=" + latty + "&lon=" + lonny;
    $.ajax({
        url: queryUVURL,
        method: "GET"
        }).then(function(response) {
            // Log the resulting object
            console.log("UV:");
            console.log(response);
            // UV INDEX 
            $("#cuv").text("UV Index: " + response[0].value);
    });
}

let storeCallData = () => {

}

let displayCurrentWeather = () => {
    
}

let displayFiveDayForecast = () => {

}

let storeSearch = (cityInput) => {
    if (initKey !== 0) {
        let string = localStorage.getItem("searchHistory");
        if (string === null) {
            history.push(cityInput);
            console.log("History: " + history);
            localStorage.setItem("searchHistory", JSON.stringify(history));
        }
        else {
            let object = JSON.parse(string);
            console.log("city: " + cityInput);
            console.log("un: " + object.unshift(cityInput));
            history = object.unshift(cityInput);
            console.log("History2: " + history);
            localStorage.setItem("searchHistory", JSON.stringify(history));
        }
    }
}

let displayHistory = () => {
    
    let string = localStorage.getItem("searchHistory");
    if (string === null) {
        // $("#history").addClass("searchhistory");
    }
    else {
        history = JSON.parse(string);
        for(var i = 1; i < 6; i++) {
            // console.log("History: " + history[i]);
            // console.log("History: " + history);
            if(history[i] !== "") {
                $(`#city${i}`).text(history[i]);
                $(`#city${i}`).removeClass("d-n");
            }
        }
    }

}

let clearPage = () => {

}












// 

$('#searchBox').keypress(function(e) {
    if (e.which == 13) {
        $('#searchSubmit').click(); 
    }
});

// make a call when the user searches
$('#searchSubmit').on('click', function() {
    // save user's search value
    let userSearch = $('#searchBox').val();
    $('#searchBox').val("");
    console.log("User Search: " + userSearch);
    makeCall(userSearch);
});

init();
