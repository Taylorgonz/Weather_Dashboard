const currentWeather = `api.openweathermap.org/data/2.5/weather?q={city name},{state code}&appid={API key}`;
const fiveDay = `api.openweathermap.org/data/2.5/forecast?q={city name},{state code}&appid={API key}`;
const myKey = "1f8d47fa1e0ef87f64e23560949b1f1c";
let cityInput = $("#city-value");
let stateInput = $("#state-value");
let buttonArray =  JSON.parse(localStorage['savedCities'] || "[]");
let id = 0;

// listening for search button slick


// $(document).ready(function () {
  
  renderButtons();

  search();
  function search() {
    $(".search").on( "click", function() {
      
      cityInput = cityInput.val();
      stateInput = stateInput.val();

      console.log(cityInput);
      if (cityInput !== "" && stateInput !== "") {
        // retrieving value from city and state inputs
        
        // cityInput = cityInput.val();
        // stateInput = stateInput.val();

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
        
        $('form')[0].reset();
      
    });
  }
 

  // function for ajax call for current weather
  function weatherCall() {


    
    $.get("https://api.openweathermap.org/data/2.5/weather?q=" + cityInput + "&" + stateInput +"&units=imperial&appid=" +myKey +"").then(function (response) {
      // console.log(response);


      let weatherDisplay = $('<div class="card-content">')
      // let tempF = Math.floor((response.main.temp - 273.15) *1.80 + 32);
     
      const city = $('<h2>').text(response.name);
      const icon = $('<img>').attr("src", "http://openweathermap.org/img/wn/" + response.weather[0].icon + "@2x.png");
      const temp = $('<p>').text("Temperature: " + Math.floor(response.main.temp));
      const humidity= $('<p>').text("Humdity: " + response.main.humidity);
      const wind = $('<p>').text("Wind Speed : " + response.wind.speed);
      console.log(temp);
      weatherDisplay.append(city, icon, temp, humidity, wind)
      $('.todays-weather').append(weatherDisplay);
      $(document).ajaxSuccess(search());
    });

    // ajax call for 5 day forecast
    $.get("https://api.openweathermap.org/data/2.5/forecast?q=" + cityInput + "&" + stateInput +"&cnt=40&units=imperial&appid=" +myKey +"").then(function (response) {
      // console.log(response);




      for ( let i = 0; i < 40; i + 8) {
        console.log(response.list[i]);

        let forecastDisplay = $('<div class="card column is-2">').attr('id', [i]);
        const date = $('<h2>').text(response.list[i].dt_txt);
        const icon = $('<img>').attr("src", "http://openweathermap.org/img/wn/" + response.list[i].weather[0].icon + "@2x.png")
        const temp = $('<p>').text("Temperature: " + Math.floor(response.list[i].main.temp));
        const humidity= $('<p>').text("Humdity: " + response.list[i].main.humidity);
        console.log(date)
        console.log(icon)
        forecastDisplay.append(date, icon, temp, humidity);
        $('.five-day-forecast').append(forecastDisplay);

      }
      // let weatherDisplay = $('<div class="card-content">')
      // let tempF = Math.floor((response.main.temp - 273.15) *1.80 + 32);
     
      // const city = $('<h2>').text(response.name);
      // const icon = $('<img>').attr("src", "http://openweathermap.org/img/wn/" + response.weather[0].icon + "@2x.png");
      // const temp = $('<p>').text("Temperature: " + tempF);
      // const humidity= $('<p>').text("Humdity: " + response.main.humidity);
      // const wind = $('<p>').text("Wind Speed : " + response.wind.speed);
      // weatherDisplay.append(city, icon, temp, humidity, wind)
      // $('.todays-weather').append(weatherDisplay);
      // $(document).ajaxSuccess(search());
    });
  
  };

  // function to have savedbuttons call ajax request
  $('.saved-locations').on("click",  function () {
    let buttonInput = JSON.parse(localStorage.getItem("savedCities"))
    // pulling id from saved buttons
    let i = $(this).attr("id");
    cityInput= buttonInput[i].city;
    stateInput = buttonInput[i].state;
    // stateInput = $(this).buttonInput[i].state;
    
    // console.log(e)
    
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
      // console.log(button);
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
// });
