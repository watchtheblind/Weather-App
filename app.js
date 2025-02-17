const forecastTitle = document.querySelector(".w-title");
const forecastCondition = document.querySelector(".w-forecast-condition");
const forecastTemp = document.querySelector(".w-forecast-temp");
const forecastTempF = document.querySelector(".w-forecast-temp-F");
const forecastIcon = document.querySelector(".w-forecast-icon");
const forecastHumidity = document.querySelector(".w-forecast-humidity");
const forecastWind = document.querySelector(".w-forecast-wind");
const forecastDatetime = document.querySelector(".w-forecast-datetime");
const forecastFeelsLike = document.querySelector(".w-forecast-fl");
const citySearch = document.querySelector("cityplaceholder");
const days = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

//execute the functions when the search button is clicked
const cityInput = document.getElementById("cityplaceholder");
const citySend = document.getElementById("submitter");
citySend.addEventListener("click", (e) => {
  e.preventDefault();
  const cityValue = cityInput.value;
  console.log(cityValue);
  showWholeUI(cityValue);
});

const dayCards = days.map((day) => document.querySelector(`.${day}`));
//here, we take all the headers of our forecast days card. This is for the purpose of adding the actual day name and the following 6 later on the code
const dayForecastCardHeaders = dayCards.map((dayCard) =>
  dayCard.querySelectorAll(".w-day-header")
);
//same, but with the days card bodies
const dayForecastCardBodies = dayCards.map((dayCard) =>
  dayCard.querySelectorAll(".w-day-body")
);
//and for the footers
const dayForecastCardFooters = dayCards.map((dayCard) =>
  dayCard.querySelectorAll(".w-day-footer")
);
let weather = {};
let weatherData;

async function getWeather(city = "london") {
  const weatherResponse = await fetch(
    `https://api.weatherapi.com/v1/forecast.json?key=cd81d5e587ec478f95f194224242706&q=${city}&days=7`
  );
  return (weatherData = await weatherResponse.json());
}
async function CatchWeatherData(city) {
  await getWeather(city);
  return (weather = {
    location: { ...weatherData.location },
    current: { ...weatherData.current },
    forecast: { ...weatherData.forecast },
  });
}
function formatDateTime(dateString, lenght) {
  const datetime = new Date(Date.parse(dateString.replace(" ", "T")));
  return {
    dayOfWeek: datetime.toLocaleString("en-US", { weekday: `${lenght}` }),
    hour: datetime.toLocaleTimeString(),
  };
}
//filling the main card with their appropriated data
async function showWeatherData(city) {
  await CatchWeatherData(city);
  const datetime = formatDateTime(weather.location.localtime, "short");
  forecastCondition.textContent = weather.current.condition.text;
  forecastIcon.src = "https:" + weather.current.condition.icon;
  forecastTemp.textContent = weather.current.temp_c + "°";
  forecastTempF.textContent = weather.current.temp_f + " F°";
  forecastTitle.textContent =
    "Weather in " + weather.location.name + ", " + weather.location.country;
  forecastHumidity.textContent = "Humidity: " + weather.current.humidity + "%";
  forecastDatetime.textContent = `${datetime.dayOfWeek} ${datetime.hour}`;
  forecastWind.textContent = "Wind: " + weather.current.wind_kph + "kph";
  forecastFeelsLike.textContent =
    "Feels like " + weather.current.feelslike_c + "°C";
}
//filling the seven tiny cards with their proper data
function showForecastDaysData() {
  dayForecastCardHeaders.forEach((headers, index) => {
    headers.forEach((header) => {
      const datetime = formatDateTime(
        weather.forecast.forecastday[index].date,
        "long"
      );
      header.textContent = `${datetime.dayOfWeek}`;
    });
  });
  //adding images to the bodies of the tiny cards
  dayForecastCardBodies.forEach((bodies, index) => {
    bodies.forEach((body) => {
      const images = body.querySelectorAll(".w-card-img");
      images.forEach((img) => {
        img.src =
          "https:" + weather.forecast.forecastday[index].day.condition.icon;
      });
    });
  });
  dayForecastCardFooters.forEach((footers, index) => {
    footers.forEach((footer) => {
      footer.textContent =
        String(weather.forecast.forecastday[index].day.maxtemp_c) +
        "°. " +
        "   " +
        String(weather.forecast.forecastday[index].day.mintemp_c) +
        "°.";
    });
  });
}
async function showWholeUI(city) {
  await showWeatherData(city);
  showForecastDaysData();
}
showWholeUI();
