import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Menu, X } from 'lucide-react';

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const googleColors = [
    'text-[#4285F4]', // Google Blue
    'text-[#34A853]', // Google Green
    'text-[#FBBC05]', // Google Yellow
    'text-black',     // Black for Feedback
  ];

  const navItems = [
    { to: "/dashboard", label: "Dashboard" },
    { to: "/manage-inventory", label: "Manage Inventory" },
    { to: "/manage-companies", label: "Manage Companies" },
    { to: "/feedback", label: "Feedback" },
  ];

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-xl font-bold text-white">Muheesi GKK Int.System</Link>
          <button
            className="lg:hidden text-white"
            onClick={toggleMenu}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <div className="hidden lg:flex space-x-4">
            {navItems.map((item, index) => (
              <Button
                key={item.to}
                asChild
                variant="ghost"
                className={`bg-white hover:bg-gray-100 ${googleColors[index]} font-bold py-2 px-4 rounded transition-all duration-300 transform hover:scale-105`}
              >
                <Link to={item.to}>{item.label}</Link>
              </Button>
            ))}
          </div>
        </div>
        {isMenuOpen && (
          <div id="mobile-menu" className="mt-4 lg:hidden">
            {navItems.map((item, index) => (
              <Button
                key={item.to}
                asChild
                variant="ghost"
                className={`w-full mb-2 bg-white hover:bg-gray-100 ${googleColors[index]} font-bold py-2 px-4 rounded transition-all duration-300`}
                onClick={toggleMenu}
              >
                <Link to={item.to}>{item.label}</Link>
              </Button>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;