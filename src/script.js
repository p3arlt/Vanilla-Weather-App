function formatDate(date) {
  let minutes = date.getMinutes();
  let hours = date.getHours();
  let weekDays = [
    `Sunday`,
    `Monday`,
    `Tuesday`,
    `Wednesday`,
    `Thursday`,
    `Friday`,
    `Saturday`,
  ];
  let day = weekDays[date.getDay()];
  if (hours < 10) {
    hours = `0${hours}`;
  }
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  return `${day} ${hours}:${minutes} `;
}

function updateWeatherData(response) {
  let tempValueElement = document.querySelector("#temp-value");
  let cityElement = document.querySelector("#search-city");
  let decriptionElement = document.querySelector("#description");
  let humidityElement = document.querySelector("#humidity");
  let windSpeedElement = document.querySelector("#wind-speed");
  let windSpeedApiRound = Math.round(response.data.wind.speed * 10) / 10;
  let timeElement = document.querySelector("#time");
  let date = new Date(response.data.time * 1000);
  let iconElement = document.querySelector("#icon");

  iconElement.innerHTML = `<img src=${response.data.condition.icon_url} alt="weather-icon" class="weather-temp-icon"/>`;
  timeElement.innerHTML = formatDate(date);
  tempValueElement.innerHTML = Math.round(response.data.temperature.current);
  cityElement.innerHTML = response.data.city;
  decriptionElement.innerHTML = response.data.condition.description;
  humidityElement.innerHTML = `${response.data.temperature.humidity}%`;
  windSpeedElement.innerHTML = `${windSpeedApiRound}km/h`;

  getForecast(response.data.city);
}

function searchCity(city) {
  let apiKey = "cf3f459c053ba9f14ot07b73bd3f8a00";
  let apiUrl = `https://api.shecodes.io/weather/v1/current?query=${city}&key=${apiKey}&units=metric`;
  axios.get(apiUrl).then(updateWeatherData);
}

function formatForcastDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[date.getDay()];
}

function displayForecast(response) {
  forecastHtml = ``;
  response.data.daily.forEach(function (day, index) {
    if (index < 5)
      forecastHtml =
        forecastHtml +
        `
<div class="forecast-day">
  <div class="forecast-day">${formatForcastDay(day.time)}</div>
  <img class="forecast-icon" src="${day.condition.icon_url}" alt="weather-icon">
  <div>
    <strong class="forecast-temp-max">${Math.round(
      day.temperature.maximum
    )}º</strong>
    <span class="forecast-temp-min">| ${Math.round(
      day.temperature.minimum
    )}º </span>
  </div>
</div>
`;
  });
  let forecastElement = document.querySelector("#forecast");
  forecastElement.innerHTML = forecastHtml;
}

function getForecast(city) {
  let apiKey = "cf3f459c053ba9f14ot07b73bd3f8a00";
  let apiUrl = `https://api.shecodes.io/weather/v1/forecast?query=${city}&key=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayForecast);
}

function applySearch(event) {
  event.preventDefault();
  let searchInputElement = document.querySelector("#search-input");
  searchCity(searchInputElement.value);
}
let searchForm = document.querySelector("#search-form");
searchForm.addEventListener("submit", applySearch);

searchCity("Seoul");
