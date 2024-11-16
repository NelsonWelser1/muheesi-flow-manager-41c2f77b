import React, { useState } from 'react';
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
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { to: "/dashboard", label: "Dashboard" },
    { to: "/manage-inventory", label: "Manage Inventory" },
    { to: "/manage-companies", label: "Manage Companies" },
    { to: "/feedback", label: "Feedback" },
  ];

  return (
    <nav className="bg-gray-800 text-white p-4 relative">
      {/* Watermark */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-5 bg-center bg-no-repeat bg-contain"
        style={{ 
          backgroundImage: 'url("__ MUHEESI KKGF-4-company logoes - png2.png")',
          zIndex: -1 
        }}
      />
      
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center">
          <img 
            src="__ MUHEESI KKG-Tri-company logoes - png.png"
            alt="Muheesi GKK Logo"
            className="h-12 w-auto mr-3"
          />
          <span className="text-2xl font-bold font-futuristic">
            Muheesi GKK Integrated System
          </span>
        </Link>
        
        <div className="hidden md:flex space-x-4">
          {navItems.map((item) => (
            <Button key={item.to} asChild className="bg-white text-black font-bold">
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