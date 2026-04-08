// src/api/weatherService.js
const GEO_URL = "https://geocoding-api.open-meteo.com/v1/search";
const WEATHER_URL = "https://api.open-meteo.com/v1/forecast";
// Reverse Geocoding API to get the city name from coordinates
const REVERSE_GEO_URL =
  "https://api.bigdatacloud.net/data/reverse-geocode-client";

export const fetchCitySuggestions = async (query) => {
  if (!query || query.length < 2) return [];
  try {
    const response = await fetch(
      `${GEO_URL}?name=${encodeURIComponent(query)}&count=5&language=en&format=json`,
    );
    const data = await response.json();
    // This returns the ARRAY of cities that your SearchBar needs
    return data.results || [];
  } catch (error) {
    console.error("Error fetching suggestions:", error);
    return [];
  }
};

// --- 2. THE WEATHER DATA FUNCTION (Rename this one correctly) ---
export const fetchWeatherData = async (query, unit) => {
  let latitude, longitude, name, country;

  if (typeof query === "object" && query.lat && query.lon) {
    latitude = query.lat;
    longitude = query.lon;

    try {
      const revGeoRes = await fetch(
        `${REVERSE_GEO_URL}?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`,
      );
      const revGeoData = await revGeoRes.json();
      name = revGeoData.city || revGeoData.locality || "Unknown";
      country = revGeoData.countryName || "";
    } catch (e) {
      name = "My Location";
    }
  } else {
    const geoRes = await fetch(
      `${GEO_URL}?name=${encodeURIComponent(query)}&count=1&language=en&format=json`,
    );
    const geoData = await geoRes.json();
    if (!geoData.results?.length) throw new Error("City not found");
    ({ latitude, longitude, name, country } = geoData.results[0]);
  }
  // 2. FETCH WEATHER
  const unitParam = unit === "metric" ? "celsius" : "fahrenheit";
  const windParam = unit === "metric" ? "kmh" : "mph";

  const weatherRes = await fetch(
    `${WEATHER_URL}?latitude=${latitude}&longitude=${longitude}` +
      `&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,precipitation_probability,weather_code,wind_speed_10m,is_day` +
      `&hourly=temperature_2m,weather_code,precipitation_probability` +
      `&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max` +
      `&temperature_unit=${unitParam}` +
      `&wind_speed_unit=${windParam}` +
      `&forecast_days=14` +
      `&timezone=auto`,
  );

  const data = await weatherRes.json();

  // 1. Get the current hour index to find the REAL "next" hour
  const currentHour = new Date().getHours();

  const getDominantWeather = (current, hourlyCodes) => {
    // Look at the current hour and the next 2 hours
    const immediateWindow = hourlyCodes.slice(currentHour, currentHour + 3);

    // Check for Thunderstorm (95+) first
    if (current >= 95 || immediateWindow.some((code) => code >= 95)) return 95;

    // Check for Heavy Rain (65, 67, 81, 82)
    const heavyRainCodes = [65, 67, 81, 82];
    if (
      heavyRainCodes.includes(current) ||
      immediateWindow.some((code) => heavyRainCodes.includes(code))
    ) {
      return 65;
    }

    // Regular Rain
    if (
      (current >= 51 && current <= 63) ||
      immediateWindow.some((code) => code >= 51 && code <= 63)
    ) {
      return 61;
    }

    return current;
  };

  // Pass the whole hourly array to the checker
  const realTimeCode = data.current.weather_code;
  const dominantCode = getDominantWeather(
    realTimeCode,
    data.hourly.weather_code,
  );
  return {
    name: name,
    sys: { country: country },
    current: {
      is_day: data.current.is_day,
      weather_code: realTimeCode, //ACTUAL 
      dominant_code: dominantCode,
    },
    coords: { lat: latitude, lon: longitude },
    main: {
      temp: data.current.temperature_2m,
      humidity: data.current.relative_humidity_2m,
      feels_like: data.current.apparent_temperature,

      precip_chance: data.daily.precipitation_probability_max[0] ?? 0,
    },
    wind: { speed: data.current.wind_speed_10m },
    weather: [{ main: getWeatherStatus(data.current.weather_code) }],
    weatherCode: realTimeCode,
    // Fixed version
    hourly: data.hourly.time.map((time, i) => ({
      time: time,
      temp: data.hourly.temperature_2m[i],
      condition: getWeatherStatus(data.hourly.weather_code[i]),
      weather_code: data.hourly.weather_code[i],
    })),
    list: data.daily.time.map((date, i) => ({
      dt: Math.floor(new Date(date).getTime() / 1000),
      dt_txt: date,
      main: {
        temp_max: data.daily.temperature_2m_max[i],
        temp_min: data.daily.temperature_2m_min[i],
      },
      weather: [{ main: getWeatherStatus(data.daily.weather_code[i]) }],
    })),
  };
};

function getWeatherStatus(code) {
  if (code === 0) return "Clear"; // WMO 0: Clear sky
  if (code === 1) return "MainlyClear"; // WMO 1: Mainly clear
  if (code === 2) return "PartlyCloudy"; // WMO 2: Partly cloudy
  if (code === 3) return "Overcast"; // WMO 3: Overcast

  if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) return "Rain";
  if (code >= 95) return "Thunderstorm";
  if (code === 45 || code === 48) return "Fog";

  return "Clear";
}
