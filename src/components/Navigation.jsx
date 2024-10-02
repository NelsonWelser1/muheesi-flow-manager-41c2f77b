import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";

const Navigation = () => {
  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center">
          <img 
            src="/combined-logo.png" 
            alt="Muheesi GKK Integrated System Logo" 
            className="h-8 w-auto sm:h-10 md:h-12 lg:h-16 object-contain"
          />
        </Link>
        <div className="space-x-2 sm:space-x-4">
          <Button asChild variant="ghost" className="text-xs sm:text-sm">
            <Link to="/dashboard">Dashboard</Link>
          </Button>
          <Button asChild variant="ghost" className="text-xs sm:text-sm">
            <Link to="/companies">Companies</Link>
          </Button>
          <Button asChild variant="ghost" className="text-xs sm:text-sm">
            <Link to="/inventory">Inventory</Link>
          </Button>
          <Button asChild variant="ghost" className="text-xs sm:text-sm">
            <Link to="/sales">Sales</Link>
          </Button>
          <Button asChild variant="ghost" className="text-xs sm:text-sm">
            <Link to="/accounts">Accounts</Link>
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;