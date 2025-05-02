
import React from 'react';
import { X, Wheat, Tractor, Leaf } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const KyalimaFarmersDetails = ({ onClose }) => {
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
          {/* Left column: Image and icons */}
          <div className="flex flex-col items-center space-y-6">
            <div className="relative w-full h-48 bg-gradient-to-br from-green-100 to-green-300 rounded-lg flex items-center justify-center">
              <div className="absolute inset-0 opacity-20 bg-[url('/combined-logo.png')] bg-contain bg-center bg-no-repeat"></div>
              <h2 className="text-3xl font-bold text-green-800 z-10">Kyalima Farmers Limited</h2>
            </div>
            
            <div className="grid grid-cols-3 gap-4 w-full">
              <div className="flex flex-col items-center p-4 bg-green-50 rounded-lg">
                <Wheat className="h-10 w-10 text-green-600 mb-2" />
                <p className="text-sm font-medium text-center">Quality Grains</p>
              </div>
              <div className="flex flex-col items-center p-4 bg-green-50 rounded-lg">
                <Tractor className="h-10 w-10 text-green-600 mb-2" />
                <p className="text-sm font-medium text-center">Modern Farming</p>
              </div>
              <div className="flex flex-col items-center p-4 bg-green-50 rounded-lg">
                <Leaf className="h-10 w-10 text-green-600 mb-2" />
                <p className="text-sm font-medium text-center">Sustainable Agriculture</p>
              </div>
            </div>
          </div>
          
          {/* Right column: Text content */}
          <div className="space-y-4">
            <h1 className="text-2xl font-bold text-green-800">About Kyalima Farmers Limited</h1>
            
            <div className="prose prose-green max-w-none">
              <p>
                Kyalima Farmers Limited is a leading agricultural enterprise in Uganda, specializing in the cultivation 
                and distribution of high-quality grains and the management of premium livestock. Our operations span 
                thousands of hectares of fertile land dedicated to sustainable farming practices.
              </p>
              
              <h3 className="text-lg font-semibold mt-4">Our Products</h3>
              <p>
                We are major producers of rice, maize, hulled white sesame, soybean, and cocoa. Our grain production 
                reaches tens of thousands of metric tons annually. Additionally, we maintain a substantial livestock 
                program with premium bulls, heifers, and breeding stock.
              </p>
              
              <h3 className="text-lg font-semibold mt-4">Farming Practices</h3>
              <p>
                Kyalima Farmers Limited employs modern agricultural techniques combined with traditional knowledge 
                to maximize yield while preserving the long-term health of our farmland. We utilize crop rotation, 
                integrated pest management, and precision farming to ensure sustainable production.
              </p>
              
              <h3 className="text-lg font-semibold mt-4">Community Impact</h3>
              <p>
                Our operations provide employment to hundreds of local farmers and contribute significantly to 
                food security in the region. We also offer training programs to smallholder farmers to improve 
                agricultural practices throughout the community.
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
