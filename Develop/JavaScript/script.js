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
const fiveDayArr = [5, 13, 21, 29, 37];
// start of jquery
$(document).ready(function() {

init();

renderButtons();

  // console.log(inputForm)

  // const {city} = buttonArray.city;
  //   console.log(city);
  // -----------------------------------------------------------------
  // initial function to display last search
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
    
  }
// -----------------------------------------------------------------

  // function search() {
  $("#search").on("click", function (e) {
    e.preventDefault();
    // todaysWeather.empty()
    // fiveDayForecast.empty()
    cityInput = $('#city-value')[0].value;

      storedCityState = {
        city: cityInput,
      };

      if (cityInput !== ''){

        
      todaysWeather.empty()
      fiveDayForecast.empty()
      // if(buttonArray.filter((elem) => elem.city !== cityInput)) {
        buttonArray.push(storedCityState);
      localStorage.setItem("savedCities", JSON.stringify(buttonArray));
      location.reload();
      // };
      // buttonArray.push(storedCityState);
      // localStorage.setItem("savedCities", JSON.stringify(buttonArray));
      // location.reload();

      }
      else {
        return;
      }
      renderButtons();
      console.log(buttonArray.city);
  });


  // -------------------------------------------------------------

  // function for ajax call for current weather
  function weatherCall() {
    // current day weather ajax call
    $.get("https://api.openweathermap.org/data/2.5/weather?q=" + cityInput + "&units=imperial&appid=" + myKey + "" ).then(function(response) {
      // console.log(response);

      let weatherDisplay = $('<div class=" current-weather card-content" >');
      // let tempF = Math.floor((response.main.temp - 273.15) *1.80 + 32);
      const lat = response.coord.lat;
      const lon = response.coord.lon;
      const city = $("<h2 class='is-size-2 has-text-weight-bold'>").text(response.name);
      const date = $("<h2 class='is-size-4'>").text(dayjs(response.dt_txt).format(`MMM, D`));
      const icon = $("<img>").attr("src","http://openweathermap.org/img/wn/" + response.weather[0].icon + "@2x.png");
      const temp = $("<p>").text(`Temperature: ${Math.floor(response.main.temp)} degrees`);
      const humidity = $("<p>").text("Humdity: " + response.main.humidity + "%");
      const wind = $("<p>").text("Wind Speed : " + response.wind.speed + " mph");
      // ---------
      $.get("https://api.openweathermap.org/data/2.5/uvi?lat=" + lat +"&lon="+ lon + "&appid="+ myKey + "").then(function(response) { 
      const uvIndex = $('<p class="has-text-weight-semibold">').text("UV Index: " + response.value);
      if (response.value <= 2) {
        uvIndex.attr('style', 'color: green')
      } else if (response.value <= 5 && response.value >= 2 ) {
        uvIndex.attr('style', 'color: yellow')
      }else if (response.value <= 7 && response.value>=5 ) {
          uvIndex.attr('style', 'color: orange')
      }else if (response.value <= 10 && response.value>=7 ) {
        uvIndex.attr('style', 'color: red')
      }else {
      uvIndex.attr('style', 'color: violet')
      }
      weatherDisplay.append(date, city, icon, temp, humidity, wind, uvIndex);
      todaysWeather.prepend(weatherDisplay);
    })
    });
    // -----------------
    // ajax call for 5 day forecast
    $.get(
      "https://api.openweathermap.org/data/2.5/forecast?q=" + cityInput + "&units=imperial&appid=" + myKey +"").then(function (response) {
      // console.log(response);
      
      

        fiveDayArr.forEach(function(item,index) {
         
          let i = parseInt(item)
          // console.log(i)
        
        let forecastDisplay = $('<div class="card five-day-card  ">').attr("id",[index] );
        const date = $("<h2 class='has-text-weight-semibold'>").text(dayjs(response.list[i].dt_txt).format(`MMM, D`));
        const icon = $("<img>").attr("src","http://openweathermap.org/img/wn/" + response.list[i].weather[0].icon +"@2x.png");
        const temp = $("<p>").text("Temperature: " + Math.floor(response.list[i].main.temp));
        const humidity = $("<p>").text("Humidity: " + response.list[i].main.humidity + "%");
        // console.log(date)
        // console.log(icon)
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
    // console.log(buttonInput);

    if (buttonInput == null || buttonInput == "") return;

    else {
      let clearButton = $("<button>");
      clearButton.addClass("clear-button button is-danger").text("Clear Cities");
      clearAllButton.prepend(clearButton);
    }

    for (let i = 0; i < buttonInput.length; i++) {
      let button = $("<button>");
      let buttonValue = button[0].outerText;
      // console.log(button);
      // console.log(buttonValue)
      // if(buttonValue)
      button
        .attr("id", [i])
        .addClass("saved-locations button is-primary")
        .text(buttonInput[i].city );
        
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

