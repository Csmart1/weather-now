// src/App.jsx
import Header from "./Components/Header";
import Welcome from "./Components/Welcome";
import SearchBar from "./Components/SearchBar";
import MainWeather from "./Components/MainWeather";
import AirConditions from "./Components/AirConditions";
import DailyForecast from "./Components/DailyForcast";
import HourlyForecast from "./Components/HourlyForcast";
import { WeatherProvider } from "./Context/WeatherContext";

function App() {
  return (
    <WeatherProvider>
      <div className="min-h-screen w-full bg-[#05051e] text-white overflow-x-hidden font-sans">
        <div className="max-w-[1440px] mx-auto px-6 md:px-10 py-8 flex flex-col gap-8">
          <div className="relative z-[200]">
            <Header />
          </div>

          <div className="flex flex-col gap-6 relative z-[10]">
            <Welcome />
            <SearchBar />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start relative z-[1]">
            <div className="lg:col-span-2 flex flex-col gap-6">
              <MainWeather />
              <AirConditions />
              <DailyForecast />
            </div>

            <div className="bg-[#1e233d]/50 rounded-[1.5rem] p-8 border border-white/5 h-full min-h-[500px]">
              <HourlyForecast />
            </div>
          </div>
        </div>
      </div>
    </WeatherProvider>
  );
}

export default App;
