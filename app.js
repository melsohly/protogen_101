const weatherDetails = document.querySelector("[data-weather-details]");
const weatherIcon = document.querySelector("[data-weather-icon]");

const weatherDescriptions = {
  0: "Clear skies",
  1: "Mostly clear",
  2: "Partly cloudy",
  3: "Overcast",
  45: "Foggy",
  48: "Icy fog",
  51: "Light drizzle",
  53: "Drizzle",
  55: "Heavy drizzle",
  61: "Light rain",
  63: "Rain",
  65: "Heavy rain",
  71: "Light snow",
  73: "Snow",
  75: "Heavy snow",
  80: "Rain showers",
  81: "Rain showers",
  82: "Heavy showers",
  95: "Thunderstorms",
  96: "Storms with hail",
  99: "Storms with hail"
};

const weatherIcons = {
  clear: "☀",
  partlyCloudy: "⛅",
  cloudy: "☁",
  rain: "🌧",
  storm: "⛈"
};

function updateWeather(message, icon = weatherIcons.cloudy) {
  weatherDetails.textContent = message;
  weatherIcon.textContent = icon;
}

function getWeatherIcon(weatherCode) {
  if (weatherCode === 0) {
    return weatherIcons.clear;
  }
  if (weatherCode === 1 || weatherCode === 2) {
    return weatherIcons.partlyCloudy;
  }
  if ([3, 45, 48].includes(weatherCode)) {
    return weatherIcons.cloudy;
  }
  if (weatherCode >= 95) {
    return weatherIcons.storm;
  }
  return weatherIcons.rain;
}

function getLocalWeather(position) {
  const { latitude, longitude } = position.coords;
  const endpoint = new URL("https://api.open-meteo.com/v1/forecast");

  endpoint.search = new URLSearchParams({
    latitude,
    longitude,
    current: "temperature_2m,weather_code",
    temperature_unit: "fahrenheit",
    timezone: "auto"
  });

  fetch(endpoint)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Weather request failed");
      }
      return response.json();
    })
    .then(({ current }) => {
      const temperature = Math.round(current.temperature_2m);
      const description = weatherDescriptions[current.weather_code] || "Current conditions";
      updateWeather(
        `Local weather  /  ${temperature}°F  /  ${description}`,
        getWeatherIcon(current.weather_code)
      );
    })
    .catch(() => {
      updateWeather("Local weather unavailable  /  Check back soon");
    });
}

if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(
    getLocalWeather,
    () => updateWeather("Enable location for local weather"),
    { maximumAge: 900000, timeout: 10000 }
  );
} else {
  updateWeather("Local weather unavailable  /  Location is not supported");
}
