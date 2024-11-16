import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import CompanyShowcase from '../components/CompanyShowcase';

const LandingPage = () => {
  return (
    <div className="relative min-h-screen">
      {/* Watermark */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-5 bg-center bg-no-repeat bg-contain"
        style={{ 
          backgroundImage: 'url("__ MUHEESI KKGF-4-company logoes - png2.png")',
          zIndex: -1 
        }}
      />
      
      <div className="container mx-auto p-4">
        <div className="text-center mb-12">
          {/* Main Logo */}
          <div className="flex justify-center mb-8">
            <img 
              src="__ MUHEESI KKG-Tri-company logoes - png.png"
              alt="Muheesi GKK Logo"
              className="w-[400px] h-auto"
            />
          </div>
          
          <h1 className="text-4xl font-bold mb-6">Welcome to Muheesi GKK Int.System</h1>
          <p className="text-xl mb-8">A comprehensive Supply Chain and Warehouse Management System for Grand Berna Dairies, KAJON Coffee Limited, and Kyalima Farmers Limited.</p>
          <Button asChild className="text-lg">
            <Link to="/dashboard">Enter Dashboard</Link>
          </Button>
        </div>
        <CompanyShowcase />
      </div>
    </div>
  );
};

export default LandingPage;