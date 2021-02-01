const myKey = "1f8d47fa1e0ef87f64e23560949b1f1c";
const todaysWeather= $('.todays-weather')
const fiveDayForecast = $('.five-day-forecast');
let cityInput = $("#city-value");
const inputForm= $('#input-form');
const savedButtons= $(".saved-buttons")
const clearAllButton = $(".clear-button")

let buttonArray = JSON.parse(localStorage["savedCities"] || "[]");
let buttonInput = JSON.parse(localStorage.getItem("savedCities"));
let id = 0;

const fiveDayArr = [8, 16, 24, 32, 39];

// start of jquery
$(document).ready(function() {

init();

renderButtons();

  console.log(inputForm)

  // -----------------------------------------------------------------
  // initial function to display last searchs
  function init() {
    if( inputForm[0].childElementCount === 0 ){
  inputForm.append('<button id="search" type="button" class="search button is-primary"> Search </button> <div class="column"> <input id="city-value" class="city-value input is-primary" type="text" placeholder="City"/> </div>')
    }

    if (buttonInput !== null && buttonInput !== "") {
      let i = parseInt(buttonArray.length);
      i --
      cityInput = buttonInput[i].city;

      weatherCall();
      
    }
    else {
      return;
      
    }
    
  }
// -----------------------------------------------------------------

  // function search() {
  $("#search").on("click", function (e) {
    
    todaysWeather.empty()
    fiveDayForecast.empty()
    cityInput = $('#city-value')[0].value;



    console.log(cityInput);
      // retrieving value from city and state inputs

      storedCityState = {
        city: cityInput,
      };


      buttonArray.push(storedCityState);
      localStorage.setItem("savedCities", JSON.stringify(buttonArray));
      weatherCall();
      renderButtons();
      
    


  });


  // -------------------------------------------------------------

  // function for ajax call for current weather
  function weatherCall() {
    // current day weather ajax call
    $.get("https://api.openweathermap.org/data/2.5/weather?q=" + cityInput + "&units=imperial&appid=" + myKey + "" ).then(function(response) {
      console.log(response);

      let weatherDisplay = $('<div class=" current-weather card-content" style="background-color: hsl(171, 100%, 41%); border-radius: 10px;">');
      // let tempF = Math.floor((response.main.temp - 273.15) *1.80 + 32);
      const lat = response;
      const city = $("<h2>").text(response.name);
      const icon = $("<img>").attr("src","http://openweathermap.org/img/wn/" + response.weather[0].icon + "@2x.png");
      const temp = $("<p>").text(`Temperature: ${Math.floor(response.main.temp)}`);
      const humidity = $("<p>").text("Humdity: " + response.main.humidity);
      const wind = $("<p>").text("Wind Speed : " + response.wind.speed);
      // const uvIndex= $.get("http://api.openweathermap.org/data/2.5/uvi?lat={lat}&lon=&appid="+ myKey + "")
      // console.log(temp);
      weatherDisplay.append(city, icon, temp, humidity, wind);
      todaysWeather.prepend(weatherDisplay);
      // $(document).ajaxSuccess(search());
    });
    // -----------------
    // ajax call for 5 day forecast
    $.get(
      "https://api.openweathermap.org/data/2.5/forecast?q=" + cityInput + "&units=imperial&appid=" + myKey +"").then(function (response) {
      // console.log(response);
      
      // for (let i = fiveDayArr[0]; i < 5 ; i ++) {
        // console.log(response.list[i]);

        fiveDayArr.forEach(function(item,index) {
         
          let i = parseInt(item)
          console.log(i)
        
        let forecastDisplay = $('<div class="card ">').attr("id",[index] );
        const date = $("<h2>").text(dayjs(response.list[i].dt_txt).format(`MMM, D`));
        const icon = $("<img>").attr("src","http://openweathermap.org/img/wn/" + response.list[i].weather[0].icon +"@2x.png");
        const temp = $("<p>").text("Temperature: " + Math.floor(response.list[i].main.temp));
        const humidity = $("<p>").text("Humdity: " + response.list[i].main.humidity);
        console.log(date)
        console.log(icon)
        forecastDisplay.append(date, icon, temp, humidity);
        fiveDayForecast.append(forecastDisplay);

        // console.log(parseInt(item), index)
        })
  });
}

  // -------------------------------------------------------------

  // function to have savedbuttons call ajax request
  $(".saved-locations").on("click", function () {
    let buttonInput = JSON.parse(localStorage.getItem("savedCities"));
    // pulling id from saved buttons
    let i = $(this).attr("id");
    cityInput = buttonInput[i].city;
    // stateInput = $(this).buttonInput[i].state;

    // console.log(e)

    weatherCall();
    todaysWeather.empty();
    fiveDayForecast.empty();
  });

  // ---------------------------------------------------------------

  // render button function
  function renderButtons() {

    savedButtons.empty();
    clearAllButton.empty();
    console.log(buttonInput);

    if (buttonInput == null || buttonInput == "") return;
    else {
      let clearButton = $("<button>");
      clearButton.addClass("clear-button button is-danger").text("Clear Cities");
      clearAllButton.prepend(clearButton);
    }

    for (let i = 0; i < buttonInput.length; i++) {
      let button = $("<button>");
      button
        .attr("id", [i])
        .addClass("saved-locations button is-primary")
        .text(buttonInput[i].city );\
        
      savedButtons.append(button);
    }
  };

  // -------------------------------------------------------------

  // clear button function
  clearAllButton.on("click", function (e) {
    e.preventDefault();
    savedButtons.empty();
    clearAllButton.empty();
    todaysWeather.empty();
    fiveDayForecast.empty();
    window.localStorage.clear();
  });
});

