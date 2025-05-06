
import React from 'react';
import { X, Wheat, Tractor, Leaf, Building, Factory, Milk } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from 'react-router-dom';

const KyalimaFarmersDetails = ({ onClose }) => {
  const navigate = useNavigate();
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4">
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
            <div className="relative w-full h-48 bg-gradient-to-br from-green-100 to-green-500 rounded-lg flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 opacity-20 bg-[url('/combined-logo.png')] bg-contain bg-center bg-no-repeat"></div>
              <div className="z-10 text-center">
                <h2 className="text-3xl font-bold text-green-800">Kyalima Farmers Limited</h2>
                <p className="text-sm font-medium text-green-700 mt-1">Cultivating Excellence Across Ventures</p>
              </div>
            </div>
            
            <div className="w-full">
              <h3 className="text-lg font-semibold text-center mb-4 text-green-700">Our Agricultural Operations</h3>
              <div className="grid grid-cols-3 gap-4 w-full mb-6">
                <div className="flex flex-col items-center p-4 bg-green-50 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <Wheat className="h-10 w-10 text-green-600 mb-2" />
                  <p className="text-sm font-medium text-center">Quality Grains</p>
                </div>
                <div className="flex flex-col items-center p-4 bg-green-50 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <Tractor className="h-10 w-10 text-green-600 mb-2" />
                  <p className="text-sm font-medium text-center">Modern Farming</p>
                </div>
                <div className="flex flex-col items-center p-4 bg-green-50 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <Leaf className="h-10 w-10 text-green-600 mb-2" />
                  <p className="text-sm font-medium text-center">Sustainable Agriculture</p>
                </div>
              </div>

              <h3 className="text-lg font-semibold text-center mb-4 text-green-700">Our Ventures</h3>
              <div className="grid grid-cols-2 gap-4 w-full">
                <div className="flex flex-col items-center p-4 bg-blue-50 rounded-lg border border-blue-100 shadow-sm">
                  <Factory className="h-10 w-10 text-blue-600 mb-2" />
                  <p className="text-sm font-bold text-center">Bukomero Dairy Farm</p>
                  <p className="text-xs text-center text-gray-600 mt-1">Premium Dairy Production</p>
                </div>
                <div className="flex flex-col items-center p-4 bg-green-50 rounded-lg border border-green-100 shadow-sm">
                  <Building className="h-10 w-10 text-green-600 mb-2" />
                  <p className="text-sm font-bold text-center">Kashari Mixed Farm</p>
                  <p className="text-xs text-center text-gray-600 mt-1">Integrated Agricultural Operations</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right column: Text content */}
          <div className="space-y-4">
            <h1 className="text-2xl font-bold text-green-800 border-b-2 border-green-200 pb-2">About Kyalima Farmers Limited</h1>
            
            <div className="prose prose-green max-w-none">
              <p className="text-gray-700">
                Kyalima Farmers Limited is a parent entity that manages several agricultural and dairy 
                ventures across Uganda. With a focus on sustainable and integrated farming practices, we operate 
                diverse agricultural businesses producing high-quality food products.
              </p>
              
              <div className="mt-4 bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg border border-green-100">
                <h3 className="text-lg font-semibold mt-1 text-green-700">Our Key Ventures</h3>
                <ul className="list-disc pl-5 space-y-2 mt-2">
                  <li className="flex items-start">
                    <Milk className="h-5 w-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold">Bukomero Dairy Farm</span>: Specialized dairy production facility 
                      focusing on high-quality dairy products with modern processing equipment and quality control.
                    </div>
                  </li>
                  <li className="flex items-start">
                    <Leaf className="h-5 w-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold">Kashari Mixed Farm</span>: Integrated agricultural operation 
                      combining dairy farming with banana, maize, and coffee plantations for diversified production.
                    </div>
                  </li>
                </ul>
              </div>
              
              <h3 className="text-lg font-semibold mt-4 text-green-800">Production Capabilities</h3>
              <p>
                Our operations span thousands of hectares of fertile land dedicated to sustainable farming 
                practices. We are major producers of rice, maize, hulled white sesame, soybean, and cocoa, 
                with our grain production reaching tens of thousands of metric tons annually.
              </p>
              
              <p>
                Our livestock program maintains substantial breeding stock with premium bulls, heifers, and mothers, 
                ensuring high-quality dairy and meat production across our ventures.
              </p>
            </div>
            
            <div className="pt-4 border-t">
              <h4 className="font-medium mb-2">Contact Us</h4>
              <p className="text-sm">Email: kyalimafarmersdirectors@gmail.com</p>
              <p className="text-sm">Phone: +256 776 670680 / +256 757 757517</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default KyalimaFarmersDetails;
