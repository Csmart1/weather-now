import { useState, useEffect } from "react";
import { useWeather } from "../Context/WeatherContext";
import { fetchCitySuggestions } from "../Api/weatherService";
import iconSearch from "../assets/icon-search.svg";
import { AnimatePresence, motion } from "framer-motion";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const { searchCity } = useWeather();
  const [isOpen, setIsOpen] = useState(false);

  //  CLICK OUTSIDE TO CLOSE
  useEffect(() => {
    const closeDropdown = () => setIsOpen(false);
    window.addEventListener("click", closeDropdown);
    return () => window.removeEventListener("click", closeDropdown);
  }, []);

  // SUGGESTION LOGIC
  useEffect(() => {
    if (query.trim().length <= 2) {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }

    const getSuggestions = async () => {
      try {
        const results = await fetchCitySuggestions(query);

        if (query.trim().length > 2) {
          setSuggestions(Array.isArray(results) ? results : []);
          setIsOpen(true);
        }
      } catch (e) {
        setSuggestions([]);
        setIsOpen(false);
      }
    };

    const timeoutId = setTimeout(getSuggestions, 150);
    return () => clearTimeout(timeoutId);
  }, [query]);

  // SEARCH BUTTON / ENTER
  const handleSearch = (e) => {
    if (e) e.preventDefault();

    const finalQuery = query.trim();
    if (finalQuery) {
      setIsOpen(false);
      setSuggestions([]);

      searchCity(finalQuery);
      setQuery("");
    }
  };

  // HANDLE CLICKING A CITY
  const handleSelectSuggestion = (city) => {
    // set dropdown false
    setIsOpen(false);
    setSuggestions([]);

    searchCity({ lat: city.latitude, lon: city.longitude });
    setQuery("");
  };

  return (
    <div
      className="w-full flex justify-center relative z-[100]"
      onClick={(e) => e.stopPropagation()}
    >
      <form
        onSubmit={handleSearch}
        className="flex flex-col md:flex-row items-stretch md:items-center gap-3 md:gap-4 w-full max-w-[700px] relative"
      >
        <div className="relative flex-1">
          <img
            src={iconSearch}
            className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 opacity-40"
            alt=""
          />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for a place..."
            className="w-full bg-[#1e233d]/50 border border-white/5 rounded-2xl py-4 pl-16 pr-6 text-white placeholder-gray-500 outline-none focus:border-white/20 transition-all"
          />

          <AnimatePresence>
            {isOpen && suggestions.length > 0 && (
              <motion.div
                key="suggestions-dropdown"
                initial={{ opacity: 0, y: -10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.98 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="absolute top-full left-0 right-0 mt-2 bg-[#111322]/95 border border-white/10 rounded-2xl shadow-2xl z-[110] backdrop-blur-xl overflow-hidden origin-top"
              >
                {suggestions.map((city, index) => (
                  <motion.div
                    key={city.id || index}
                    onClick={() => handleSelectSuggestion(city)}
                    whileHover={{
                      backgroundColor: "rgba(255, 255, 255, 0.05)",
                    }}
                    className="px-6 py-4 text-white/70 cursor-pointer transition-colors border-b border-white/5 last:border-0 flex justify-between items-center group"
                  >
                    <div className="flex flex-col">
                      <span className="text-sm font-medium group-hover:text-white transition-colors">
                        {city.name}
                      </span>
                      <span className="text-[10px] opacity-40 uppercase tracking-wider">
                        {city.country} {city.admin1 ? `• ${city.admin1}` : ""}
                      </span>
                    </div>
                    <span className="text-[10px] bg-white/5 px-2 py-1 rounded text-white/40 group-hover:text-white/60">
                      {city.country_code || city.country}
                    </span>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <button
          type="submit"
          className="bg-[#4b62e1] hover:bg-[#3f52c9] px-10 py-4 rounded-2xl font-bold text-white shadow-lg shadow-blue-500/20 transition-all cursor-pointer whitespace-nowrap active:scale-95"
        >
          Search
        </button>
      </form>
    </div>
  );
}
