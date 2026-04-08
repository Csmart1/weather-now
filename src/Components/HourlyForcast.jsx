import { useState, useRef, useEffect } from "react";
import { useWeather } from "../Context/WeatherContext";
import iconArrowDown from "../assets/icon-dropdown.svg";
import { getWeatherDetails } from "../Utility/weatherMapper";
// 1. ADD THIS IMPORT
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function HourlyForecast() {
  const { weather, loading, error } = useWeather();
  const [selectedDay, setSelectedDay] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const hasValidData = weather && !error && !loading && weather.hourly;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const dropdownDays = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return {
      label:
        i === 0
          ? "Today"
          : date.toLocaleDateString("en-US", { weekday: "long" }),
      value: i,
    };
  });

  const getVerticalHours = () => {
    if (!hasValidData)
      return Array(24).fill({ time: "--", temp: null, weather_code: 0 });

    const now = new Date();

    if (selectedDay === 0) {
      return weather.hourly
        .filter((item) => new Date(item.time) >= now)
        .slice(0, 24);
    }

    // NEW ROBUST LOGIC FOR NEXT DAYS
    const targetDate = new Date();
    targetDate.setDate(now.getDate() + selectedDay);

    return weather.hourly.filter((item) => {
      const itemDate = new Date(item.time);
      // We check if the Year, Month, and Date match exactly in local time
      return (
        itemDate.getFullYear() === targetDate.getFullYear() &&
        itemDate.getMonth() === targetDate.getMonth() &&
        itemDate.getDate() === targetDate.getDate()
      );
    });
  };
  const hourlyRows = getVerticalHours();

  return (
    <div className="w-full flex flex-col h-[550px]">
      <div className="flex justify-between items-center mb-6 px-2">
        <h3 className="text-gray-400 font-bold uppercase text-[11px] tracking-[0.2em]">
          Hourly Forecast
        </h3>
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-3 bg-[#2a2f4d]/60 text-white text-[12px] font-bold py-2 px-4 rounded-xl border border-white/10 backdrop-blur-md"
          >
            {dropdownDays[selectedDay].label.toUpperCase()}
            <img
              src={iconArrowDown}
              alt=""
              className={`w-3 h-3 transition-transform ${isOpen ? "rotate-180" : ""}`}
            />
          </button>
          {isOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-[#1e233d] border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden">
              {dropdownDays.map((d) => (
                <div
                  key={d.value}
                  onClick={() => {
                    setSelectedDay(d.value);
                    setIsOpen(false);
                  }}
                  className={`px-4 py-3 text-[11px] font-bold uppercase cursor-pointer first:rounded-t-2xl last:rounded-b-2xl ${selectedDay === d.value ? "bg-white/10 text-white" : "text-gray-400 hover:bg-white/5 hover:text-white"}`}
                >
                  {d.label}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar space-y-1 custom-mask pr-2">
        {hourlyRows.map((row, idx) => {
          // --- NIGHT LOGIC START ---
          const dateObj = new Date(row.time);
          const hour = dateObj.getHours();
          // Define night as before 6 AM or after 7 PM (19:00)
          const isNight = hour < 6 || hour >= 19;

          const { icon, label } = getWeatherDetails(row.weather_code, isNight);
          // --- NIGHT LOGIC END ---

          const timeLabel =
            row.temp !== null
              ? dateObj.toLocaleTimeString("en-US", {
                  hour: "numeric",
                  hour12: true,
                })
              : row.time;

          return (
            <div
              key={idx}
              className="flex items-center justify-between py-5 border-b border-white/5 last:border-0 px-4 rounded-2xl group hover:bg-white/[0.03]"
            >
              <span className="text-gray-400 font-bold text-sm w-20 uppercase">
                {timeLabel}
              </span>
              <div className="w-8 flex justify-center">
                <FontAwesomeIcon
                  icon={icon}
                  className={`text-xl transition-all duration-300 group-hover:scale-125 ${
                    isNight
                      ? "text-blue-200 drop-shadow-[0_0_8px_rgba(191,219,254,0.6)]"
                      : "text-yellow-400"
                  } ${row.temp === null ? "opacity-20" : ""}`}
                  title={label}
                />
              </div>
              <span className="font-bold text-xl text-white w-20 text-right">
                {row.temp !== null ? `${Math.round(row.temp)}°` : "--°"}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
