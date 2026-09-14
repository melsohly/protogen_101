const weatherItems = document.querySelectorAll("[data-weather-item]");

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

function updateWeatherItems(message) {
  weatherItems.forEach((item) => {
    item.textContent = message;
  });
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
      updateWeatherItems(`Local weather  /  ${temperature}°F  /  ${description}`);
    })
    .catch(() => {
      updateWeatherItems("Local weather unavailable  /  Check back soon");
    });
}

if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(
    getLocalWeather,
    () => updateWeatherItems("Enable location for local weather"),
    { maximumAge: 900000, timeout: 10000 }
  );
} else {
  updateWeatherItems("Local weather unavailable  /  Location is not supported");
}