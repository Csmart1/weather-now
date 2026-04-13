import { useState } from "react";
import { useWeather } from "./WeatherContext";
import { motion, AnimatePresence } from "framer-motion";
import iconUnits from "../assets/icon-units.svg";
import iconDropdown from "../assets/icon-dropdown.svg";

export default function UnitsDropdown() {
  const { unit, setUnit, weather, searchCity } = useWeather();
  const [isOpen, setIsOpen] = useState(false);

  // This function handles the "flip" for both the Master Toggle and individual rows
  const handleUnitChange = (newUnit) => {
    if (newUnit !== unit) {
      setUnit(newUnit);
      setIsOpen(false);
    }
  };

  return (
    <div className="relative">
      {/* Main Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-[#1e233d] hover:bg-[#2a3052] cursor-pointer transition-all px-3 py-2 md:px-6 md:py-2.5 rounded-lg flex items-center gap-2 md:gap-4 shadow-2xl border border-white/5"
      >
        <img src={iconUnits} alt="Settings" className="w-4 h-4 opacity-70" />

        {/* Smaller font and tighter tracking for mobile */}
        <span className="text-[13px] md:text-[15px] font-medium tracking-normal text-white">
          Units
        </span>

        <img
          src={iconDropdown}
          alt=""
          className={`w-2.5 h-2.5 opacity-40 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-3 w-72 bg-[#1b1f38] border border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-50 p-5 overflow-hidden"
          >
            {/* 1. MASTER TOGGLE HEADER */}
            <button
              onClick={() =>
                handleUnitChange(unit === "metric" ? "imperial" : "metric")
              }
              className="w-full text-left group/master cursor-pointer mb-2 block"
            >
              <span className="text-[11px] text-white/30 uppercase font-bold tracking-[0.2em] group-hover/master:text-white transition-colors">
                {unit === "metric" ? "Switch to Imperial" : "Switch to Metric"}
              </span>
              <p className="text-[9px] text-white/10 group-hover/master:text-white/30 transition-colors uppercase mt-1">
                Click to convert all dashboard data
              </p>
            </button>

            <div className="h-[1px] bg-white/5 my-4" />

            <div className="space-y-6">
              {/* 2. TEMPERATURE SECTION */}
              <div className="space-y-3">
                <p className="text-[10px] text-white/20 uppercase font-black">
                  Temperature
                </p>
                <UnitRow
                  label="Celsius (°C)"
                  active={unit === "metric"}
                  onClick={() => handleUnitChange("metric")}
                />
                <UnitRow
                  label="Fahrenheit (°F)"
                  active={unit === "imperial"}
                  onClick={() => handleUnitChange("imperial")}
                />
              </div>

              {/* 3. WIND SPEED SECTION */}
              <div className="space-y-3">
                <p className="text-[10px] text-white/20 uppercase font-black">
                  Wind Speed
                </p>
                <UnitRow
                  label="km/h"
                  active={unit === "metric"}
                  onClick={() => handleUnitChange("metric")}
                />
                <UnitRow
                  label="mph"
                  active={unit === "imperial"}
                  onClick={() => handleUnitChange("imperial")}
                />
              </div>

              {/* 4. PRECIPITATION SECTION */}
              <div className="space-y-3">
                <p className="text-[10px] text-white/20 uppercase font-black">
                  Precipitation
                </p>
                <UnitRow
                  label="Millimeters (mm)"
                  active={unit === "metric"}
                  onClick={() => handleUnitChange("metric")}
                />
                <UnitRow
                  label="Inches (in)"
                  active={unit === "imperial"}
                  onClick={() => handleUnitChange("imperial")}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/**
 * Helper component for individual unit rows
 * Ensures visual consistency and cursor-pointer everywhere
 */
function UnitRow({ label, active, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`w-full flex justify-between items-center p-3 rounded-xl transition-all cursor-pointer group ${
        active
          ? "bg-white/10 text-white shadow-inner"
          : "text-white/40 hover:bg-white/5 hover:text-white/70"
      }`}
    >
      <span className="text-sm font-medium">{label}</span>
      {active && (
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="text-xs text-white"
        >
          ✓
        </motion.span>
      )}
    </div>
  );
}
