import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";

const Navigation = () => {
  const googleColors = [
    'text-[#4285F4]', // Google Blue
    'text-[#34A853]', // Google Green
    'text-[#FBBC05]', // Google Yellow
    'text-[#EA4335]', // Google Red
  ];

  const navItems = [
    { to: "/dashboard", label: "Dashboard" },
    { to: "/manage-inventory", label: "Manage Inventory" },
    { to: "/manage-companies", label: "Manage Companies" },
    { to: "/feedback", label: "Feedback" },
  ];

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-white">Muheesi GKK Int.System</Link>
        <div className="space-x-4">
          {navItems.map((item, index) => (
            <Button
              key={item.to}
              asChild
              variant="ghost"
              className={`bg-white hover:bg-gray-100 ${googleColors[index]} font-bold py-2 px-4 rounded transition-all duration-300 transform hover:scale-105 animate-vibrate`}
            >
              <Link to={item.to}>{item.label}</Link>
            </Button>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;