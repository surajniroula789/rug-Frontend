import React from "react";
import { Link, NavLink } from "react-router-dom";

const Header = () => {
  return (
    <header className="shadow sticky z-50 top-0 bg-white">
      <nav className="border-gray-200 px-4 lg:px-6 py-2.5">
        <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
          <Link to="/" className="flex items-center">
            <h1 className="pr-3 text-lg uppercase text-gray-800 font-semibold">
              Galaincha-Design
            </h1>
          </Link>
          <div
            className="hidden justify-between items-center w-full lg:flex lg:w-auto lg:order-1"
            id="mobile-menu-2"
          >
            <ul className="flex flex-col mt-4 font-medium lg:flex-row lg:space-x-8 lg:mt-0">
              {[
                { to: "/home", label: "Home" },
                { to: "/rosette", label: "Rosette" },
                { to: "/wallpaper", label: "Wallpaper" },
                { to: "/fireze", label: "Fireze" },
                { to: "/c-fireze", label: "C_Fireze" },
                { to: "/combined", label: "Rose&Wallpaper" },
                { to: "/finale", label: "Generate" },
              ].map(({ to, label }) => (
                <li key={to}>
                  <NavLink
                    to={to}
                    className="block py-2 pr-4 pl-3 duration-200 border-b border-transparent hover:border-orange-500 lg:border-0 lg:p-0 lg:hover:bg-orange-50 lg:hover:text-orange-700"
                    activeClassName="lg:bg-orange-50 lg:text-orange-700"
                  >
                    {label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
