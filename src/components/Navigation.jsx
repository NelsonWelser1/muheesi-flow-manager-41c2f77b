
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Menu } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { navItems } from '../nav-items';

const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const dashboardNavItems = [
    {
      to: "/manage-inventory",
      label: "Manage Inventory"
    }, 
    {
      to: "/manage-companies",
      label: "Manage Companies"
    },
    {
      to: "/company-policies",
      label: "Company Policies"
    }
  ];

  const handleHomeClick = (e) => {
    e.preventDefault();
    navigate('/');
  };

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold font-futuristic">
          Muheesi GKK Integrated System
        </Link>
        <div className="hidden md:flex space-x-4">
          {dashboardNavItems.map(item => (
            <Button 
              key={item.to} 
              asChild 
              className="bg-[#9b87f5] hover:bg-[#9b87f5] text-white font-bold"
            >
              <Link to={item.to}>{item.label}</Link>
            </Button>
          ))}
          
          {navItems.map(item => item.to !== "/" && (
            <Button 
              key={item.to} 
              asChild 
              className={`${location.pathname === item.to ? 'bg-[#7a5af8]' : 'bg-[#9b87f5]'} hover:bg-[#7a5af8] text-white font-bold`}
            >
              <Link to={item.to}>
                {item.icon && <span className="mr-2">{item.icon}</span>}
                {item.title}
              </Link>
            </Button>
          ))}
        </div>
        <div className="md:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline"><Menu /></Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {dashboardNavItems.map(item => (
                <DropdownMenuItem key={item.to} asChild>
                  <Link to={item.to}>{item.label}</Link>
                </DropdownMenuItem>
              ))}
              {navItems.map(item => item.to !== "/" && (
                <DropdownMenuItem key={item.to} asChild>
                  <Link to={item.to}>
                    {item.icon && <span className="mr-2">{item.icon}</span>}
                    {item.title}
                  </Link>
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
