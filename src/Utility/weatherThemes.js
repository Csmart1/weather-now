import {
  faSun,
  faCloud,
  faCloudSun,
  faCloudShowersHeavy,
  faSnowflake,
  faSmog,
  faCloudRain,
  faMoon,
  faCloudMoon,
  faCloudMoonRain,
  faBolt,
} from "@fortawesome/free-solid-svg-icons";

export const getWeatherTheme = (condition, isNight = false) => {
  const LOGO_ORANGE = "#ff8c00";
  const CHAMPAGNE = "#fef3c7";
  const SILVER_GLASS = "#f8fafc";

  const themes = {
   
    Clear: {
      icon: isNight ? faMoon : faSun,
      message: isNight
        ? "The stars are out! A perfect night for a quiet stroll."
        : "The sun is out and so should you be! Don't forget your shades.",
      color: isNight
        ? "from-[#05051e] to-[#1e233d]"
        : "from-[#4b62e1] to-[#2e3ea1]",
      iconStyle: {
        color: isNight ? SILVER_GLASS : CHAMPAGNE,
        filter: isNight
          ? "drop-shadow(0 0 20px rgba(248, 250, 252, 0.4))"
          : `drop-shadow(0 0 25px ${LOGO_ORANGE}44)`,
        opacity: 1, 
      },
    },
    
    MainlyClear: {
      icon: isNight ? faCloudMoon : faCloudSun,
      message: "Mostly sunny with a hint of cloud. A great day for a drive!",
      color: "from-[#4b62e1] to-[#60a5fa]",
      iconStyle: { color: SILVER_GLASS, opacity: 0.9 },
    },
   
    PartlyCloudy: {
      icon: isNight ? faCloudMoon : faCloudSun,
      message:
        "A bit of a 'cloudy sandwich' today, but the silver lining is coming!",
      color: isNight
        ? "from-[#1e233d] to-[#2a2f4d]"
        : "from-[#373b44] to-[#4286f4]",
      iconStyle: {
        color: SILVER_GLASS,
        opacity: 0.75,
        filter: "drop-shadow(0 0 15px rgba(255, 255, 255, 0.2))",
      },
    },
    
    Overcast: {
      icon: faCloud,
      message:
        "The sky is a gray blanket today. Perfect weather for chilling indoors.",
      color: "from-[#374151] to-[#1f2937]",
      iconStyle: { color: "#94a3b8", opacity: 0.8 },
    },
    Rain: {
      icon: isNight ? faCloudMoonRain : faCloudShowersHeavy,
      message:
        "It’s a rhythmic rain today. You definitely need to get your umbrella!",
      color: "from-[#1e233d] to-[#05051e]",
      iconStyle: {
        color: "#94a3b8",
        opacity: 0.8,
        filter: "drop-shadow(0 0 10px rgba(148, 163, 184, 0.3))",
      },
    },
    Thunderstorm: {
      icon: faBolt,
      message:
        "The sky is angry! Stay indoors and keep cozy while the storm passes.",
      color: "from-[#0f172a] to-[#334155]",
      iconStyle: {
        color: CHAMPAGNE,
        filter: `drop-shadow(0 0 30px ${LOGO_ORANGE}66)`,
      },
    },
    Clouds: {
      
      icon: isNight ? faCloudMoon : faCloudSun,
      message:
        "A bit of a 'cloudy sandwich' today, but the silver lining is coming!",
      color: isNight
        ? "from-[#1e233d] to-[#2a2f4d]"
        : "from-[#373b44] to-[#4286f4]",
      iconStyle: {
        color: SILVER_GLASS,
        opacity: 0.75, 
        filter: "drop-shadow(0 0 15px rgba(255, 255, 255, 0.2))",
      },
    },
    Drizzle: {
      icon: isNight ? faCloudMoonRain : faCloudRain,
      message:
        "Just a light sprinkle. A hoodie should be enough for this vibe.",
      color: "from-[#4ca1af] to-[#2c3e50]",
      iconStyle: { color: SILVER_GLASS, opacity: 0.8 },
    },
    Snow: {
      icon: faSnowflake,
      message: "It's a winter wonderland! Bundle up, it's freezing out there.",
      color: "from-[#83a4d4] to-[#b6fbff]",
      iconStyle: {
        color: "#ffffff",
        filter: "drop-shadow(0 0 15px #ffffff66)",
      },
    },
    Mist: {
      icon: faSmog,
      message:
        "Drive slow! The fog is giving the city a mysterious look today.",
      color: "from-[#606c88] to-[#3f4c6b]",
      iconStyle: { color: "#94a3b8", opacity: 0.7 },
    },
    Fog: {
      icon: faSmog,
      message: "Visibility is low, but your style is still clear. Stay safe!",
      color: "from-[#606c88] to-[#3f4c6b]",
      iconStyle: { color: "#94a3b8", opacity: 0.7 },
    },
    Haze: {
      icon: faSmog,
      message:
        "The air is a bit thick today. Maybe stay in and work on that backend?",
      color: "from-[#757f9a] to-[#d7dde8]",
      iconStyle: { color: "#d1d5db", opacity: 0.8 },
    },
  };

  return themes[condition] || themes.Clear;
};
