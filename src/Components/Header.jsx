import logoImg from "../assets/logo.svg";
import UnitsDropdown from "../Context/UnitsDropdown";

export default function Header() {
  return (
    <header className="flex justify-between items-center w-full">
      {/* 1. Logo Section */}
      <div className="h-6 md:h-8 flex items-center">
        <img
          src={logoImg}
          alt="Weather Now"
          className="h-full w-auto object-contain"
        />
      </div>

      <div className="flex items-center gap-4">
        <UnitsDropdown />
      </div>
    </header>
  );
}
