
import React from 'react';
import { X, Beef, Droplet, CircleSlash, Thermometer, Database, ChartBar, Home } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from 'react-router-dom';

const GrandBernaDetails = ({ onClose }) => {
  const navigate = useNavigate();

  const handleHomeClick = () => {
    navigate('/');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4">
      <Card className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white p-6">
        <div className="flex justify-between items-center mb-4">
          <Button 
            variant="outline" 
            className="flex items-center"
            onClick={handleHomeClick}
          >
            <Home className="h-4 w-4 mr-2" />
            Home
          </Button>
          
          <Button 
            variant="ghost" 
            className="absolute right-2 top-2" 
            onClick={onClose}
            size="icon"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left column: Image and icons */}
          <div className="flex flex-col items-center space-y-6">
            <div className="relative w-full h-48 bg-gradient-to-br from-blue-100 to-blue-400 rounded-lg flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 opacity-20 bg-[url('/combined-logo.png')] bg-contain bg-center bg-no-repeat"></div>
              <div className="z-10 text-center">
                <h2 className="text-3xl font-bold text-blue-800">Grand Berna Dairies</h2>
                <p className="text-sm font-medium text-blue-700 mt-1">Excellence in Dairy Production</p>
              </div>
            </div>
            
            <div className="w-full">
              <h3 className="text-lg font-semibold text-center mb-4 text-blue-700">Our Products</h3>
              <div className="grid grid-cols-3 gap-4 w-full mb-6">
                <div className="flex flex-col items-center p-4 bg-blue-50 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <Beef className="h-10 w-10 text-blue-600 mb-2" />
                  <p className="text-sm font-medium text-center">Quality Livestock</p>
                </div>
                <div className="flex flex-col items-center p-4 bg-blue-50 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <Droplet className="h-10 w-10 text-blue-600 mb-2" />
                  <p className="text-sm font-medium text-center">Fresh Dairy Products</p>
                </div>
                <div className="flex flex-col items-center p-4 bg-blue-50 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <CircleSlash className="h-10 w-10 text-blue-600 mb-2" />
                  <p className="text-sm font-medium text-center">Artisanal Cheese</p>
                </div>
              </div>

              <h3 className="text-lg font-semibold text-center mb-4 text-blue-700">Modern Operations</h3>
              <div className="grid grid-cols-3 gap-4 w-full">
                <div className="flex flex-col items-center p-4 bg-blue-50 rounded-lg border border-blue-100 shadow-sm">
                  <Thermometer className="h-10 w-10 text-blue-600 mb-2" />
                  <p className="text-xs font-medium text-center">Pasteurization Systems</p>
                </div>
                <div className="flex flex-col items-center p-4 bg-blue-50 rounded-lg border border-blue-100 shadow-sm">
                  <Database className="h-10 w-10 text-blue-600 mb-2" />
                  <p className="text-xs font-medium text-center">Fermentation Control</p>
                </div>
                <div className="flex flex-col items-center p-4 bg-blue-50 rounded-lg border border-blue-100 shadow-sm">
                  <ChartBar className="h-10 w-10 text-blue-600 mb-2" />
                  <p className="text-xs font-medium text-center">Quality Metrics</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right column: Text content */}
          <div className="space-y-4">
            <h1 className="text-2xl font-bold text-blue-800 border-b-2 border-blue-200 pb-2">About Grand Berna Dairies</h1>
            
            <div className="prose prose-blue max-w-none">
              <p>
                Grand Berna Dairies is a premier dairy production company based in the lush grasslands of Uganda. 
                Founded with a commitment to quality and sustainability, we specialize in a wide range of dairy products 
                including fresh milk, processed milk variants, artisanal cheese, yogurt, and high-quality meat products.
              </p>
              
              <div className="mt-4 bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-100">
                <h3 className="text-lg font-semibold mt-1 text-blue-700">Modern Production Facilities</h3>
                <p className="text-sm">
                  Our state-of-the-art facilities implement advanced dairy production practices including:
                </p>
                <ul className="list-disc pl-5 space-y-1 mt-1 text-sm">
                  <li>Precision pasteurization systems for optimal food safety</li>
                  <li>Controlled fermentation environments for consistent product quality</li>
                  <li>Advanced cooling systems maintaining product freshness</li>
                  <li>Comprehensive cold chain management for extended shelf life</li>
                </ul>
              </div>
              
              <h3 className="text-lg font-semibold mt-4 text-blue-800">Metrics Tracking System</h3>
              <p>
                We maintain a comprehensive metrics tracking system that monitors:
              </p>
              <ul className="grid grid-cols-2 gap-2 mt-2">
                <li className="flex items-center bg-blue-50 p-2 rounded">
                  <ChartBar className="h-4 w-4 text-blue-600 mr-2" />
                  <span className="text-sm">Production volumes</span>
                </li>
                <li className="flex items-center bg-blue-50 p-2 rounded">
                  <Database className="h-4 w-4 text-blue-600 mr-2" />
                  <span className="text-sm">Inventory levels</span>
                </li>
                <li className="flex items-center bg-blue-50 p-2 rounded">
                  <Thermometer className="h-4 w-4 text-blue-600 mr-2" />
                  <span className="text-sm">Quality control</span>
                </li>
                <li className="flex items-center bg-blue-50 p-2 rounded">
                  <Droplet className="h-4 w-4 text-blue-600 mr-2" />
                  <span className="text-sm">Distribution channels</span>
                </li>
              </ul>
              
              <h3 className="text-lg font-semibold mt-4 text-blue-700">Quality Assurance</h3>
              <p>
                Our facilities process over 1,000 liters of fresh milk daily, sourced from our own 
                healthy cattle herds raised on natural pastures. We maintain strict quality control throughout our 
                production chain, from farm to packaging.
              </p>
            </div>
            
            <div className="pt-4 border-t">
              <h4 className="font-medium mb-2">Contact Us</h4>
              <p className="text-sm">Email: grandbernadairies.sales@gmail.com</p>
              <p className="text-sm">Phone: +256 776 670680 / +256 757 757517</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default GrandBernaDetails;
