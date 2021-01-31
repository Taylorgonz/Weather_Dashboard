const currentWeather = `api.openweathermap.org/data/2.5/weather?q={city name},{state code}&appid={API key}`;
const fiveDay = `api.openweathermap.org/data/2.5/forecast?q={city name},{state code}&appid={API key}`;
const myKey = "9a10739234e04a70af0f9f8db26046ea";
let cityInput = $("#city-value");
let stateInput = $("#state-value");
let buttonArray =  JSON.parse(localStorage['savedCities'] || "[]");
let id = 0;

// listening for search button slick


$(document).ready(function () {
  renderButtons();
search();
  function search() {
    $(document).on("click", "#search", function(event) {
      event.preventDefault();

      console.log(cityInput);
      if (cityInput.val() !== "" && stateInput.val() !== "") {
        // retrieving value from city and state inputs
        
        cityInput = cityInput.val();
        stateInput = stateInput.val();

        storedCityState = {
          city: cityInput,
          state: stateInput,
        };

        buttonArray.push(storedCityState);
        localStorage.setItem("savedCities", JSON.stringify(buttonArray));

        weatherCall();
        renderButtons();
        };

        // creates input buttons
        
        $(".search-input").empty();
        $(".search-input").append('<button type="button" class="search button is-primary">Search</button><input class="city-value input is-primary is-one-fifth column" type="text" placeholder="City"/><input class="state-value input is-primary is-one-fifth column" type="text" placeholder="State"/>');
        
      
    });
  }
 

  // function for ajax call for current weather
  function weatherCall() {


    
    $.get("https://api.openweathermap.org/data/2.5/weather?q=" + cityInput + "&" + stateInput +"&appid=" +myKey +"").then(function (response) {
      console.log(response);


      let weatherDisplay = $('<div class="card-content">')
      let tempF = Math.floor((response.main.temp - 273.15) *1.80 + 32);
     
      const city = $('<h2>').text(response.name);
      const icon = $('<img>').attr("src", "http://openweathermap.org/img/wn/" + response.weather[0].icon + "@2x.png");
      const temp = $('<p>').text("Temperature: " + tempF);
      const humidity= $('<p>').text("Humdity: " + response.main.humidity);
      const wind = $('<p>').text("Wind Speed : " + response.wind.speed);
      weatherDisplay.append(city, icon, temp, humidity, wind)
      $('.todays-weather').append(weatherDisplay);
      $(document).ajaxSuccess(search());
    });

  
  };

  // function to have savedbuttons call ajax request
  $('.saved-locations').on("click",  function (e) {
    e.preventDefault();
    let buttonInput = JSON.parse(localStorage.getItem("savedCities"))
    // for (let i = 0 ; i < buttonInput.length; i ++) {

    //   cityInput= buttonInput[i].city;
    //   stateInput = buttonInput[i].state;
    // }

    let i = $(this).attr("id");
    cityInput= buttonInput[i].city;
    stateInput = buttonInput[i].state;
    // stateInput = $(this).buttonInput[i].state;
    
    console.log(e)
    
    weatherCall();
    $('.todays-weather').empty();
  });


  // render button function
  function renderButtons() {
    $(".saved-buttons").empty();
    $(".clear-button").empty();
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
      button.attr("id",[i]).addClass("saved-locations button is-primary").text("" + buttonInput[i].city + ", " + buttonInput[i].state + "");
      console.log(button);
      $(".saved-buttons").append(button);
    }
  }

  $('.clear-button').on("click", function(e) {
    e.preventDefault();
    $(".saved-buttons").empty();
    $(".clear-button").empty();
    $(".todays-weather").empty();
    window.localStorage.clear();

  })
});
