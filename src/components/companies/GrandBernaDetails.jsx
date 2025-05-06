
import React from 'react';
import { X, Milk, Beef, Factory, Truck } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from 'react-router-dom';

const GrandBernaDetails = ({ onClose }) => {
  const navigate = useNavigate();
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4" data-select-id="grand-berna-details">
      <Card className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white p-6">
        <Button 
          variant="ghost" 
          className="absolute right-2 top-2" 
          onClick={onClose}
          size="icon"
        >
          <X className="h-4 w-4" />
        </Button>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left column: Image, header and icons */}
          <div className="flex flex-col items-center space-y-6">
            <div className="relative w-full h-48 bg-gradient-to-br from-blue-100 to-blue-500 rounded-lg flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 opacity-20 bg-[url('/combined-logo.png')] bg-contain bg-center bg-no-repeat"></div>
              <div className="z-10 text-center">
                <h2 className="text-3xl font-bold text-blue-800">Grand Berna Dairies</h2>
                <p className="text-sm font-medium text-blue-700 mt-1">Premium Dairy Products</p>
              </div>
            </div>
            
            <div className="w-full">
              <h3 className="text-lg font-semibold text-center mb-4 text-blue-700">Our Dairy Operations</h3>
              <div className="grid grid-cols-2 gap-4 w-full mb-6">
                <div className="flex flex-col items-center p-4 bg-blue-50 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <Milk className="h-10 w-10 text-blue-600 mb-2" />
                  <p className="text-sm font-medium text-center">Milk Processing</p>
                </div>
                <div className="flex flex-col items-center p-4 bg-blue-50 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <Beef className="h-10 w-10 text-blue-600 mb-2" />
                  <p className="text-sm font-medium text-center">Dairy Farming</p>
                </div>
              </div>
              
              <h3 className="text-lg font-semibold text-center mb-4 text-blue-700">Our Facilities</h3>
              <div className="grid grid-cols-2 gap-4 w-full">
                <div className="flex flex-col items-center p-4 bg-blue-50 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <Factory className="h-10 w-10 text-blue-600 mb-2" />
                  <p className="text-sm font-medium text-center">Modern Processing Plant</p>
                </div>
                <div className="flex flex-col items-center p-4 bg-blue-50 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <Truck className="h-10 w-10 text-blue-600 mb-2" />
                  <p className="text-sm font-medium text-center">Distribution Network</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right column: Text content */}
          <div className="space-y-4">
            <h1 className="text-2xl font-bold text-blue-800 border-b-2 border-blue-200 pb-2">About Grand Berna Dairies</h1>
            
            <div className="prose prose-blue max-w-none">
              <p className="text-gray-700">
                Grand Berna Dairies is a leading dairy producer in Uganda, specializing in fresh and processed 
                milk products. With state-of-the-art facilities in Kyiboga and Mbarara, we bring high-quality 
                dairy to Ugandan tables every day.
              </p>
              
              <div className="mt-4 bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-100">
                <h3 className="text-lg font-semibold mt-1 text-blue-700">Our Products</h3>
                <ul className="list-disc pl-5 space-y-2 mt-2">
                  <li>Fresh Milk - Directly from our farms daily</li>
                  <li>Processed Milk - UHT and pasteurized varieties</li>
                  <li>Artisanal Cheese - Multiple varieties</li>
                  <li>Yogurt - Plain and fruit flavors</li>
                  <li>Quality Meat - Beef, Goat, Pork, and Poultry</li>
                </ul>
              </div>
              
              <h3 className="text-lg font-semibold mt-4 text-blue-800">Quality Assurance</h3>
              <p>
                At Grand Berna Dairies, quality is our priority. Our processing facilities meet international 
                standards, and our products undergo rigorous testing to ensure safety and nutritional value.
              </p>
              
              <p>
                We work directly with local farmers to ensure the highest quality milk, supporting community 
                development while delivering excellence to our customers.
              </p>
            </div>
            
            <div className="pt-4 border-t">
              <h4 className="font-medium mb-2">Contact Us</h4>
              <p className="text-sm">Email: grandbernadairies.sales@gmail.com</p>
              <p className="text-sm">Phone: +256 776 670680 / +256 757 757517 / +256 787 121022</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default GrandBernaDetails;
