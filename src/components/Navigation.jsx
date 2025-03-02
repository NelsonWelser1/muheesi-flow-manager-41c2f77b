
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Menu } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navigation = () => {
  const navItems = [
    { to: "/dashboard", label: "Dashboard" },
    { to: "/manage-inventory", label: "Manage Inventory" },
    { to: "/manage-companies", label: "Manage Companies" },
    { to: "/feedback", label: "Feedback" },
  ];

  // Handle navigation without page reload
  const handleNavigation = (e) => {
    // Let React Router handle the navigation
    // No need to prevent default as Link component handles this
  };

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link 
          to="/" 
          className="text-2xl font-bold font-futuristic"
        >
          Muheesi GKK Integrated System
        </Link>
        <div className="hidden md:flex space-x-4">
          {navItems.map((item) => (
            <Button 
              key={item.to} 
              asChild 
              className="bg-[#9b87f5] hover:bg-[#9b87f5] text-white font-bold"
              onClick={handleNavigation}
            >
              <Link to={item.to}>{item.label}</Link>
            </Button>
          ))}
        </div>
        <div className="md:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline"><Menu /></Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {navItems.map((item) => (
                <DropdownMenuItem key={item.to} asChild>
                  <Link to={item.to} onClick={handleNavigation}>{item.label}</Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
