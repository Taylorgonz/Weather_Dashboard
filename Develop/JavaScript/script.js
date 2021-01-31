const currentWeather = `api.openweathermap.org/data/2.5/weather?q={city name},{state code}&appid={API key}`;
const fiveDay = `api.openweathermap.org/data/2.5/forecast?q={city name},{state code}&appid={API key}`;
const myKey = "9a10739234e04a70af0f9f8db26046ea";
let cityInput = $(".city-value");
let stateInput = $(".state-value");
let buttonArray =  JSON.parse(localStorage['savedCities'] || "[]");

// listening for search button slick

$(document).ready(function () {
  search();
  renderButtons();

  function search() {
    $(document).on("click", "button.search", function (event) {
      event.preventDefault();
      
      console.log(cityInput.val());
      if (cityInput.val() !== "" && stateInput.val() !== "") {
        // retrieving value from city and state inputs
        
        cityInput = cityInput.val().trim();
        stateInput = stateInput.val().trim();

        storedCityState = {
          city: cityInput,
          state: stateInput,
        };

        buttonArray.push(storedCityState);
        localStorage.setItem("savedCities", JSON.stringify(buttonArray));
        weatherCall();

        };

        // creates input buttons
        renderButtons();
        console.log(buttonArray);
        
      
    });
  }

  // function for ajax call for current weather
  function weatherCall() {

    $.get("https://api.openweathermap.org/data/2.5/weather?q=" + cityInput + "," + stateInput +"&appid=" +myKey +"").then(function (response) {
      console.log(response);


      let weatherDisplay = $('<div class="card">')
      let tempF = Math.floor((response.main.temp - 273.15) *1.80 + 32);
      const city = $('<h3>').text(response.name);
      const icon = $('<img>').attr("src", response.weather.icon);
      const temp = $('<p>').text("Temperature: " + tempF);
      const humidity= $('<p>').text("Humdity: " + response.main.humidity);
      const wind = $('<p>').text("Wind Speed : " + response.wind.speed);

      weatherDisplay.append(city, temp, humidity, wind)
      $('.todays-weather').prepend(weatherDisplay);
      
    })
    search();
  };

  function saveButtons() {}
  // render button function
  function renderButtons() {
    $(".saved-buttons").empty();
    $(".clear-buttons").empty();
    let buttonInput = JSON.parse(localStorage.getItem("savedCities"));
    console.log(buttonInput);
    if (buttonInput == null || buttonInput == '') return;
    
    else {
      let clearButton = $('<button>');
        clearButton.addClass("clear-button button is-danger").text("Clear Cities")
        $('.clear-button').prepend(clearButton);
    }

    for (let i = 0; i < buttonInput.length; i++) {
      let button = $("<button>");
      button.addClass("saved-locations button is-primary").text("" + buttonInput[i].city + ", " + buttonInput[i].state + "");
      console.log(button);
      $(".saved-buttons").append(button);
    }
  }

  $('.clear-button').on("click", function(e) {
    e.preventDefault();
    $(".saved-buttons").empty();
    $(".clear-button").empty();
    window.localStorage.clear();

  })
});
