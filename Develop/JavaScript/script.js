const currentWeather = `api.openweathermap.org/data/2.5/weather?q={city name},{state code}&appid={API key}`;
const fiveDay = `api.openweathermap.org/data/2.5/forecast?q={city name},{state code}&appid={API key}`;
const myKey  ="9a10739234e04a70af0f9f8db26046ea";
const cityInput = $(".city-value");
const stateInput = $(".state-value");
let savedCities = [];
console.log(cityInput)
console.log(stateInput)
$(".search").on("click", function(event) {
    event.preventDefault();
    let currentWeatherURl= "api.openweathermap.org/data/2.5/weather?q=" + cityInput +"," + stateInput + "&appid=" + myKey + "";
    let savedCityState = "" + cityInput.val() + ", " + stateInput.val() + "";
    savedCities.push(savedCityState);
    renderButtons();
})


// render button function
function renderButtons() {
    $('.saved-buttons').empty();

    for (let i = 0; i < savedCities.length; i ++){
      let button = $('<button>');
        button.addClass('saved-locations button is-primary').text(savedCities[i])

        $('.saved-buttons').append(button);
    }
  };