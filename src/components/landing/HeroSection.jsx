
import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building, Users, Truck, BarChart3, Package, Factory, Coffee, Milk } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
  const navigate = useNavigate();

  const mainFeatures = [
    {
      title: "Manage Inventory",
      description: "Access all company inventories",
      icon: Package,
      color: "bg-blue-500",
      onClick: () => navigate('/manage-inventory')
    },
    {
      title: "Company Management", 
      description: "Manage company operations",
      icon: Building,
      color: "bg-green-500",
      onClick: () => navigate('/manage-companies')
    },
    {
      title: "Export Business",
      description: "KAJON Coffee exports",
      icon: Coffee,
      color: "bg-purple-500",
      onClick: () => navigate('/manage-inventory/kajon-export')
    },
    {
      title: "Dairy Operations",
      description: "Bukomero Dairy management",
      icon: Milk,
      color: "bg-orange-500",
      onClick: () => navigate('/manage-inventory/bukomero-dairy')
    }
  ];

  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-blue-900 via-blue-800 to-purple-900">
      <div className="absolute inset-0 bg-black/20"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="text-center mb-12">
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
        </div>

        {/* Main Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {mainFeatures.map((feature, index) => (
            <div 
              key={index}
              className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:-translate-y-1 cursor-pointer group"
              onClick={feature.onClick}
            >
              <div className={`${feature.color} p-3 rounded-lg mb-4 w-fit`}>
                <feature.icon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-white font-semibold text-lg mb-2 group-hover:text-blue-200 transition-colors">
                {feature.title}
              </h3>
              <p className="text-blue-100 text-sm">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
        
        {/* System Stats Grid */}
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
        
        {/* Action Buttons */}
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
            Manage Companies
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
