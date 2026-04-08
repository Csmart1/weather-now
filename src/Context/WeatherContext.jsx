import { createContext, useState, useContext, useEffect } from "react";
import { fetchWeatherData } from "../Api/weatherService";

const WeatherContext = createContext();

export const WeatherProvider = ({ children }) => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [unit, setUnit] = useState("metric");

  const searchCity = async (query) => {
    setLoading(true);
    setError(null);

    try {
      const data = await fetchWeatherData(query, unit);
      setWeather(data);
    } catch (err) {
      setWeather(null);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // AUTO LOCATION ON LOAD
  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation not supported");
      setLoading(false);
      return;
    }

    setLoading(true);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        console.log("REAL COORDS:", pos.coords); // 🔍 DEBUG

        searchCity({
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
        });
      },
      (err) => {
        console.warn("Location error:", err);

        setError("Location access denied");
        setWeather(null);
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      },
    );
  }, []);

  
  useEffect(() => {
    if (weather?.coords) {
      searchCity(weather.coords);
    }
  }, [unit]);

  //  AUTO REFRESH EVERY 10 MINUTES
  useEffect(() => {
    if (!weather?.coords) return;

    const interval = setInterval(() => {
      searchCity(weather.coords);
    }, 600000); 

    return () => clearInterval(interval);
  }, [weather]);

  return (
    <WeatherContext.Provider
      value={{ weather, loading, error, unit, setUnit, searchCity }}
    >
      {children}
    </WeatherContext.Provider>
  );
};

export const useWeather = () => {
  const context = useContext(WeatherContext);
  if (!context)
    throw new Error("useWeather must be used within a WeatherProvider");
  return context;
};
