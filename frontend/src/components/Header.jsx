import React from "react";
import { Link, useLocation } from "react-router-dom";

const Header = () => {
  const location = useLocation();

  const navLinkClass = (path) =>
    `px-4 py-2 rounded hover:bg-gray-700 ${
      location.pathname === path ? "bg-gray-700 text-white" : "text-gray-300"
    }`;

  return (
    <header className="bg-gray-900 text-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <h1 className="text-xl font-bold text-white">Odzież robocza</h1>
        <nav className="flex space-x-4">
          <Link to="/employees" className={navLinkClass("/employees")}>
            Lista pracowników
          </Link>
          <Link to="/positions" className={navLinkClass("/positions")}>
            Stanowiska
          </Link>
          <Link
            to="/clothing-types"
            className={navLinkClass("/clothing-types")}
          >
            Rodzaje ubrań
          </Link>
          <Link
            to="/clothing-assignments"
            className={navLinkClass("/clothing-assignments")}
          >
            Przydziały ubrań
          </Link>
          <Link to="/demand" className={navLinkClass("/demand")}>
            Zapotrzebowanie
          </Link>
          <Link to="/warehouse" className={navLinkClass("/warehouse")}>
            Magazyn ubrań
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
