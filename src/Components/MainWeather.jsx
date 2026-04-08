import { useWeather } from "../Context/WeatherContext";
import { motion, AnimatePresence } from "framer-motion";
import { getWeatherTheme } from "../Utility/weatherThemes";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import bgMobile from "../assets/bg-today-small.svg";
import bgDesktop from "../assets/bg-today-large.svg";
import { getWeatherDetails } from "../Utility/weatherMapper";

const getFullCountryName = (code) => {
  try {
    return new Intl.DisplayNames(["en"], { type: "region" }).of(code);
  } catch (e) {
    return code;
  }
};

export default function MainWeather() {
  const { weather, loading, error, unit } = useWeather();

  if (error && error !== "City not found") {
    return (
      <div className="w-full min-h-[320px] bg-[#05051e] rounded-[2rem] flex flex-col items-center justify-center text-center p-6">
        <div className="w-16 h-16 rounded-full border border-white/20 flex items-center justify-center mb-6 opacity-40">
          <span className="text-3xl text-white italic">!</span>
        </div>
        <h2 className="text-4xl font-bold mb-3 text-white">
          Something went wrong
        </h2>
        <p className="text-white/40 max-w-xs">
          We couldn't connect to the server.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="w-full min-h-[320px] bg-[#1e233d]/30 rounded-[2rem] flex flex-col items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="flex gap-2">
            <div className="w-3 h-3 bg-white/40 rounded-full animate-bounce" />
            <div className="w-3 h-3 bg-white/40 rounded-full animate-bounce [animation-delay:0.3s]" />
            <div className="w-3 h-3 bg-white/40 rounded-full animate-bounce [animation-delay:0.6s]" />
          </div>
          <p className="text-white/40 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  if (!weather || error === "City not found") {
    return (
      <div className="w-full min-h-[320px] bg-[#1e233d]/10 rounded-[2rem] flex items-center justify-center border border-white/5">
        <p className="text-white/20 text-2xl font-semibold">
          No search result found!
        </p>
      </div>
    );
  }
  const now = new Date();
  const hour = now.getHours();

  let darkness = 0;

  if (hour >= 7 && hour < 17) {
    darkness = 0;
  } else if (hour >= 17 && hour < 19) {
    darkness = (hour - 17) / 2;
  } else if (hour >= 19 || hour < 6) {
    darkness = 1;
  } else if (hour >= 6 && hour < 7) {
    darkness = 1 - (hour - 6);
  }
  const isNight = weather.current.is_day === 0;

  const { condition } = getWeatherDetails(
    weather.current.weather_code, 
    isNight
  );
  const theme = getWeatherTheme(condition, isNight);

  const unitSymbol = unit === "metric" ? "C" : "F";
  const countryName = getFullCountryName(weather.sys.country);
  const locationDisplay =
    weather.name.toLowerCase() === countryName.toLowerCase()
      ? countryName
      : `${weather.name}, ${countryName}`;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={weather.id + isNight}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className={`relative w-full min-h-[320px] rounded-[2.5rem] overflow-hidden shadow-2xl bg-gradient-to-br ${theme.color}`}
      >
        <img
          src={bgMobile}
          className="absolute inset-0 w-full h-full object-cover block md:hidden opacity-70"
          alt=""
        />
        <img
          src={bgDesktop}
          className="absolute inset-0 w-full h-full object-cover hidden md:block opacity-70"
          alt=""
        />

        <div className="relative z-10 p-8 md:p-12 h-full flex flex-col justify-center">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center w-full gap-6">
            <div className="flex-1 max-w-full md:max-w-[60%] lg:max-w-[70%] space-y-2">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.1] break-words">
                {locationDisplay}
              </h1>

              <p className="text-white/50 text-lg font-medium">
                Today,{" "}
                {new Date().toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>

              <p className="text-white/80 text-xl font-medium mt-4 italic line-clamp-2">
                {theme.message}
              </p>
            </div>

            <div className="flex items-center gap-6 md:gap-10 self-end md:self-auto">
              
              <div className="relative flex items-center justify-center">
                <FontAwesomeIcon
                  icon={theme.icon}
                  style={theme.iconStyle}
                  className="text-[4rem] md:text-[5.5rem] lg:text-[6.5rem] transition-all duration-700"
                />
              </div>

              <div className="flex items-start">
                <span className="text-[75px] md:text-[100px] lg:text-[120px] font-bold leading-none tracking-tighter text-white">
                  {Math.round(weather.main.temp)} 
                </span> 
                <span className="text-2xl md:text-4xl lg:text-5xl font-light mt-2 md:mt-4 text-white/60">
                   °{unitSymbol}
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
