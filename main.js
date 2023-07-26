// Get reference of input box search
const searchbox = document.querySelector('.search-box');
searchbox.addEventListener('keypress', setQuery);

const apikey = "5503bd0b0bf94dfdfa972c8ef1a9f052";

function setQuery(evt) {
  if (evt.keyCode == 13) {
    getResults(searchbox.value);
  }
}

function getResults(query) {
  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${query}&appid=${apikey}&units=metric`)
    .then(weather => weather.json())
    .then(response => {
      console.log(response);
      displayResults(response);
    });
}

function displayResults(weather) {
  let city = document.querySelector('.location .city');
  let date = document.querySelector('.location .date');
  let temp = document.querySelector('.current .temp');
  let weather_el = document.querySelector('.current .weather');
  let hilow = document.querySelector('.hi-low');

  // Check if the API response contains an error indicating city not found
  if (weather.cod === '404') {
    city.innerText = "City not found";
    date.innerText = "";
    temp.innerText = "";
    weather_el.innerText = "";
    hilow.innerText = "";
  } else {
    city.innerText = `${weather.name}, ${weather.sys.country}`;

    let now = new Date();
    date.innerText = dateBuilder(now);

    temp.innerHTML = `${Math.round(weather.main.temp)}<span>°C</span>`;
    weather_el.innerText = weather.weather[0].main;
    hilow.innerText = `${Math.round(weather.main.temp_min)}°C / ${Math.round(weather.main.temp_max)}°C`;

    // Fetch the full country name based on the country code
    fetch(`https://restcountries.com/v3/alpha/${weather.sys.country}`)
      .then(response => response.json())
      .then(data => {
        const countryName = data[0].name.common;
        city.innerText = `${weather.name}, ${countryName}`;
      })
      .catch(error => {
        console.log("Error fetching country details:", error);
      });
  }
}

function dateBuilder(d) {
  let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  let day = days[d.getDay()];
  let date = d.getDate();
  let month = months[d.getMonth()];
  let year = d.getFullYear();

  return `${day} ${date} ${month} ${year}`;
}
