
import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building, Users, Truck, BarChart3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-blue-900 via-blue-800 to-purple-900">
      <div className="absolute inset-0 bg-black/20"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="text-center">
          <Badge variant="secondary" className="mb-4 bg-blue-100 text-blue-900 hover:bg-blue-200">
            Internal Employee Portal
          </Badge>
          <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6 animate-fade-in">
            GKK Integrated
            <span className="block text-blue-300">Management System</span>
          </h1>
          <p className="text-xl lg:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto leading-relaxed">
            Comprehensive Supply Chain, Factory and Warehouse Management for 
            <span className="font-semibold text-white"> Grand Berna Dairies</span>, 
            <span className="font-semibold text-white"> KAJON Coffee</span>, and 
            <span className="font-semibold text-white"> Kyalima Farmers</span>
          </p>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
              <Building className="h-8 w-8 text-blue-300 mx-auto mb-2" />
              <p className="text-white font-medium">3 Companies</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
              <Users className="h-8 w-8 text-green-300 mx-auto mb-2" />
              <p className="text-white font-medium">Multi-User</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
              <Truck className="h-8 w-8 text-yellow-300 mx-auto mb-2" />
              <p className="text-white font-medium">Supply Chain</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
              <BarChart3 className="h-8 w-8 text-purple-300 mx-auto mb-2" />
              <p className="text-white font-medium">Analytics</p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg"
              onClick={() => navigate('/manage-inventory')}
            >
              Manage Inventory
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white text-white hover:bg-white hover:text-blue-900 px-8 py-3 text-lg"
              onClick={() => navigate('/manage-companies')}
            >
              View Companies
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
