import { getWeatherTheme } from "./weatherThemes";

export const getWeatherDetails = (code, isNight = false) => {
  let condition = "Clear";

  
  if (code === 0) {
    condition = "Clear";         
  } else if (code === 1) {
    condition = "MainlyClear";   
  } else if (code === 2) {
    condition = "PartlyCloudy";  
  } else if (code === 3) {
    condition = "Overcast";      
  } else if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) {
    condition = "Rain";
  } else if (code >= 95) {
    condition = "Thunderstorm";
  } else if (code >= 71 && code <= 77) {
    condition = "Snow";
  } else if (code === 45 || code === 48) {
    condition = "Fog";
  }

  const theme = getWeatherTheme(condition, isNight);

  return {
    condition: condition,
    icon: theme.icon, 
    label: condition, 
    theme: theme.color,
    message: theme.message,
    iconStyle: theme.iconStyle,
  };
};

export const getWeatherDetailsByCondition = (condition, isNight = false) => {
  const theme = getWeatherTheme(condition, isNight);
  return {
    condition: condition,
    icon: theme.icon,
    label: condition,
  };
};