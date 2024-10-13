import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";

const Navigation = () => {
  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold font-futuristic">Muheesi GKK Integrated System</Link>
        <div className="space-x-4">
          <Button asChild className="bg-white text-black font-bold">
            <Link to="/dashboard">Dashboard</Link>
          </Button>
          <Button asChild className="bg-white text-black font-bold bg-gradient-to-r from-black via-yellow to-red bg-[length:3px_3px] bg-repeat-x">
            <Link to="/manage-inventory">Manage Inventory</Link>
          </Button>
          <Button asChild className="bg-white text-black font-bold">
            <Link to="/manage-companies">Manage Companies</Link>
          </Button>
          <Button asChild className="bg-white text-black font-bold">
            <Link to="/feedback">Feedback</Link>
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;