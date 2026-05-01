import { useState } from "react";

import Logo from "./Logo";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const menuItems = [
    { title: "Quiénes somos", href: "#about" },
    { title: "Servicios", href: "#services" },
    { title: "Portafolio", href: "#portfolio" },
    { title: "Contáctanos", href: "#contact" },
  ];

  return (
    <nav className="bg-page-nav fixed top-0 w-full z-50 backdrop-blur-md border-b border-gray-200 dark:border-white/10 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="shrink-0">
            <a href="/" className="flex items-center hover:opacity-80 transition-opacity">
              <Logo className="text-logo h-10 w-auto transition-colors duration-300" />
            </a>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <div className="flex items-baseline space-x-8">
              {menuItems.map((item) => (
                <a
                  key={item.title}
                  href={item.href}
                  className="px-3 py-2 text-sm font-medium text-[rgb(240,239,235)] transition-colors duration-200 hover:text-[rgb(240,239,235)] rounded-md"
                >
                  {item.title}
                </a>
              ))}
            </div>
            {/* Desktop Theme Toggle */}
            <ThemeToggle />
          </div>

          <div className="-mr-2 flex items-center gap-4 md:hidden">
            {/* Mobile Theme Toggle */}
            <ThemeToggle />

            <button
              onClick={toggleMenu}
              type="button"
              className="inline-flex items-center justify-center rounded-md p-2 text-[rgb(240,239,235)] transition-all hover:bg-white/10 hover:text-[rgb(240,239,235)] focus:outline-none focus:ring-2 focus:ring-[rgb(224,77,96)] focus:ring-offset-2 focus:ring-offset-gray-100 dark:focus:ring-offset-[rgb(150,163,166)]"
              aria-controls="mobile-menu"
              aria-expanded={isOpen}
            >
              <span className="sr-only">Open main menu</span>
              {!isOpen ? (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              ) : (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="bg-page-nav-strong md:hidden backdrop-blur-xl border-b border-gray-200 dark:border-white/10 transition-colors duration-300" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {menuItems.map((item) => (
              <a
                key={item.title}
                href={item.href}
                onClick={toggleMenu}
                className="block rounded-md px-3 py-2 text-base font-medium text-[rgb(240,239,235)] transition-colors hover:text-[rgb(224,77,96)]"
              >
                {item.title}
              </a>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
