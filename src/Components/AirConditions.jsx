// src/Components/AirConditions.jsx
import { useWeather } from "../Context/WeatherContext";


export default function AirConditions() {
  const { weather, loading, unit, error } = useWeather();

 
  const tempUnit = unit === "metric" ? "°C" : "°F";
  const windUnit = unit === "metric" ? "km/h" : "mph";
  

  
  const hasValidData = weather && !error && !loading;

  const conditions = [
    {
      label: "Feels Like",
      value: hasValidData
        ? `${Math.round(weather.main.feels_like)}${tempUnit}`
        : "-",
      icon: "🌡️",
    },
    {
      label: "Humidity",
      value: hasValidData ? `${weather.main.humidity}%` : "-",
      icon: "💧",
    },
    {
      label: "Wind",
      value: hasValidData ? `${weather.wind.speed} ${windUnit}` : "-",
      icon: "💨",
    },
    {
      label: "Chance of Rain",
      value: hasValidData ? `${weather.main?.precip_chance ?? 0}%` : "-",
      icon: "🌧️",
    },
  ];

  return (
    
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {conditions.map((item) => (
        <div
          key={item.label}
          className="bg-[#1e233d]/50 p-6 rounded-2xl border border-white/5 shadow-sm"
        >
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs">{item.icon}</span>
            <span className="text-white/40 text-[10px] uppercase font-bold tracking-widest leading-none">
              {item.label}
            </span>
          </div>
          <span className="text-2xl md:text-3xl font-bold text-white block">
            {loading ? "..." : item.value}
          </span>
        </div>
      ))}
    </div>
  );
}
