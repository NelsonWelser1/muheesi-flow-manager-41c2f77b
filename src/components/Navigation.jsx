
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Menu } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navigation = () => {
  const navigate = useNavigate();
  
  const navItems = [
    { to: "/dashboard", label: "Dashboard" },
    { to: "/manage-inventory", label: "Manage Inventory" },
    { to: "/manage-companies", label: "Manage Companies" },
    { to: "/feedback", label: "Feedback" },
  ];

  const handleHomeClick = (e) => {
    e.preventDefault();
    console.log("Navigation: Redirecting to home page");
    navigate('/');
  };

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link 
          to="/" 
          className="text-2xl font-bold font-futuristic"
          onClick={handleHomeClick}
        >
          Muheesi GKK Integrated System
        </Link>
        <div className="hidden md:flex space-x-4">
          {navItems.map((item) => (
            <Button 
              key={item.to} 
              asChild 
              className="bg-[#9b87f5] hover:bg-[#9b87f5] text-white font-bold"
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
            <DropdownMenuContent className="bg-white">
              {navItems.map((item) => (
                <DropdownMenuItem key={item.to} asChild>
                  <Link to={item.to}>{item.label}</Link>
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
