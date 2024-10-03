import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";

const Navigation = () => {
  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">Muheesi GKK Int.System</Link>
        <div className="space-x-4">
          <Button asChild variant="ghost">
            <Link to="/dashboard">Dashboard</Link>
          </Button>
          <Button asChild variant="ghost">
            <Link to="/manage-inventory">Manage Inventory</Link>
          </Button>
          <Button asChild variant="ghost">
            <Link to="/manage-companies">Manage Companies</Link>
          </Button>
          <Button asChild variant="ghost">
            <Link to="/feedback">Feedback</Link>
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;