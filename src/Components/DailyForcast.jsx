import { useWeather } from "../Context/WeatherContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  getWeatherDetails,
  getWeatherDetailsByCondition,
} from "../Utility/weatherMapper";

const CHAMPAGNE = "white-500";

function DayCard({ day, icon, high, low, isActive, isPlaceholder, label }) {
  const highTempStyle = isActive
    ? { color: CHAMPAGNE, textShadow: `0 0 10px ${CHAMPAGNE}55` }
    : { color: "#ffffff" };
  return (
    <div
      className={`flex flex-col items-center gap-3 p-4 rounded-[12px] min-w-[110px] transition-all border
      ${
        isActive
          ? "bg-[#1e233d] shadow-2xl text-white-500 border-white/20" // Stronger border on active card
          : "bg-[#1e233d]/40 border-white/5"
      } 
      ${isPlaceholder ? "opacity-30" : "opacity-100"}`}
    >
      <span 
        className={`font-bold text-[10px] uppercase tracking-tighter transition-colors
        ${isActive ? "text-white opacity-100" : "text-gray-500"}`}
      >
        {day}
      </span>

      <div className="py-1 min-h-[32px] flex items-center justify-center">
        {icon ? (
          <FontAwesomeIcon
            icon={icon}
           
            className={`text-2xl transition-all duration-300
              ${
                label?.includes("Clear") || label?.includes("Sun") || label?.includes("Thunderstorm")
                  ? "text-yellow-400"
                  : label?.includes("Rain")
                    ? "text-blue-400"
                    : "text-gray-300"
              }`}
            
          
          />
        ) : (
          <div className="w-6 h-6 bg-white/5 rounded-full animate-pulse" />
        )}
      </div>

      <div className="flex flex-col items-center">
        
        <span 
          className="font-bold text-lg leading-none"
          style={highTempStyle}
        >
          {high !== "-" ? `${high}°` : "--"}
        </span>
        <span className="text-gray-500 text-xs mt-1">
          {low !== "-" ? `${low}°` : "--"}
        </span>
      </div>
    </div>
  );
}

export default function DailyForecast() {
  const { weather, loading, error } = useWeather();

  // SAFETY CHECK: Ensure we have the list or daily object before mapping
  const dailyData = weather?.daily || weather?.list;
  const hasValidData = dailyData && !error && !loading;

  const displayList = Array.from({ length: 7 }, (_, i) => {
    // Check if we have data for this specific day
    if (hasValidData && weather.list?.[i]) {
      const dayData = weather.list[i];
      const dateObj = new Date(dayData.dt * 1000);

      // FIX: Your service doesn't put weather_code in daily anymore.
      // It puts the condition string in dayData.weather[0].main
      const condition = dayData.weather[0].main;

      // Use the condition string directly with your theme helper
      const { icon, label } = getWeatherDetailsByCondition(condition);

      return {
        day:
          i === 0
            ? "Today"
            : dateObj.toLocaleDateString("en-US", { weekday: "short" }),
        high: Math.round(dayData.main.temp_max),
        low: Math.round(dayData.main.temp_min),
        icon: icon,
        label: label,
        isPlaceholder: false,
        id: dayData.dt,
      };
    }

    // Fallback/Loading State
    const { icon, label } = getWeatherDetails(0, false);
    return {
      day: "---",
      high: "-",
      low: "-",
      icon: icon,
      label: label,
      isPlaceholder: true,
      id: `placeholder-${i}`,
    };
  });

  return (
    <div className="w-full mt-4">
      <h3 className="text-gray-400 font-bold uppercase text-[11px] tracking-widest mb-4 ml-2">
        Daily forecast
      </h3>

      <div className="flex justify-between items-center gap-3 overflow-x-auto no-scrollbar py-2">
        {displayList.map((item, index) => (
          <DayCard
            key={item.id}
            day={item.day}
            high={item.high}
            low={item.low}
            icon={item.icon}
            label={item.label}
            isActive={hasValidData && index === 0}
            isPlaceholder={item.isPlaceholder}
          />
        ))}
      </div>
    </div>
  );
}
