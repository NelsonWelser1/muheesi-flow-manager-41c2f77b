import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";

const LandingPage = () => {
  return (
    <div className="container mx-auto p-4 text-center">
      <h1 className="text-4xl font-bold mb-6">Welcome to Muheesi GKK Integrated System</h1>
      <img 
        src="/combined-logo.png" 
        alt="Combined logo of Grand Berna Dairies, KAJON Coffee Limited, and Kyalima Farmers Limited" 
        className="mx-auto mb-8 max-w-full h-auto"
      />
      <p className="text-xl mb-8">A comprehensive Supply Chain and Warehouse Management System for Grand Berna Dairies, KAJON Coffee Limited, and Kyalima Farmers Limited.</p>
      <Button asChild className="text-lg">
        <Link to="/dashboard">Enter Dashboard</Link>
      </Button>
    </div>
  );
};

export default LandingPage;