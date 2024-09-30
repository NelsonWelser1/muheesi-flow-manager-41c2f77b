import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";

const Navigation = () => {
  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">Muheesi GKK SCWMS</Link>
        <div className="space-x-4">
          <Button asChild variant="ghost">
            <Link to="/companies">Companies</Link>
          </Button>
          <Button asChild variant="ghost">
            <Link to="/inventory">Inventory</Link>
          </Button>
          <Button asChild variant="ghost">
            <Link to="/sales">Sales & Accounts</Link>
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;