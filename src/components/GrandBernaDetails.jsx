
import React from 'react';
import { X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Cow, Milk, Cheese } from 'lucide-react';

const GrandBernaDetails = ({ onClose }) => {
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
            <div className="relative w-full h-48 bg-gradient-to-br from-blue-100 to-blue-300 rounded-lg flex items-center justify-center">
              <div className="absolute inset-0 opacity-20 bg-[url('/combined-logo.png')] bg-contain bg-center bg-no-repeat"></div>
              <h2 className="text-3xl font-bold text-blue-800 z-10">Grand Berna Dairies</h2>
            </div>
            
            <div className="grid grid-cols-3 gap-4 w-full">
              <div className="flex flex-col items-center p-4 bg-blue-50 rounded-lg">
                <Cow className="h-10 w-10 text-blue-600 mb-2" />
                <p className="text-sm font-medium text-center">Quality Livestock</p>
              </div>
              <div className="flex flex-col items-center p-4 bg-blue-50 rounded-lg">
                <Milk className="h-10 w-10 text-blue-600 mb-2" />
                <p className="text-sm font-medium text-center">Fresh Dairy Products</p>
              </div>
              <div className="flex flex-col items-center p-4 bg-blue-50 rounded-lg">
                <Cheese className="h-10 w-10 text-blue-600 mb-2" />
                <p className="text-sm font-medium text-center">Artisanal Cheese</p>
              </div>
            </div>
          </div>
          
          {/* Right column: Text content */}
          <div className="space-y-4">
            <h1 className="text-2xl font-bold text-blue-800">About Grand Berna Dairies</h1>
            
            <div className="prose prose-blue max-w-none">
              <p>
                Grand Berna Dairies is a premier dairy production company based in the lush grasslands of Uganda. 
                Founded with a commitment to quality and sustainability, we specialize in a wide range of dairy products 
                including fresh milk, processed milk variants, artisanal cheese, yogurt, and high-quality meat products.
              </p>
              
              <h3 className="text-lg font-semibold mt-4">Our Production</h3>
              <p>
                Our state-of-the-art facilities process over 1,000 liters of fresh milk daily, sourced from our own 
                healthy cattle herds raised on natural pastures. Our cheese factory produces premium varieties 
                using traditional methods combined with modern safety standards.
              </p>
              
              <h3 className="text-lg font-semibold mt-4">Quality Assurance</h3>
              <p>
                We maintain strict quality control throughout our production chain, from farm to packaging. 
                Our cold storage facilities ensure freshness and extended shelf life for all our dairy products.
              </p>
              
              <h3 className="text-lg font-semibold mt-4">Sustainability Initiatives</h3>
              <p>
                Grand Berna Dairies is committed to sustainable farming practices. We implement rotational grazing, 
                water conservation systems, and utilize renewable energy sources in our processing facilities to 
                reduce our environmental footprint.
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
