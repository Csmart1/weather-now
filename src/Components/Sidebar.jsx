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
</div>;
