
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package2, Tags, Barcode, QrCode, ArrowLeft } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";

const PackagingLabeling = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('packaging'); // Default to packaging tab
  
  useEffect(() => {
    // Check if we have state from navigation and update the active tab
    if (location.state && location.state.selectedTab) {
      setActiveTab(location.state.selectedTab);
    }
  }, [location.state]);
  
  const tiles = [{
    title: "Packaging",
    description: "Manage product packaging details",
    icon: <Package2 className="h-6 w-6" />,
    path: "/manage-inventory/grand-berna-dairies/packaging-and-labeling/packaging-management",
    secondaryIcon: <Barcode className="absolute bottom-2 right-2 h-4 w-4 text-muted-foreground/50" />,
    id: "packaging"
  }, {
    title: "Labeling",
    description: "Configure product labels",
    icon: <Tags className="h-6 w-6" />,
    path: "/manage-inventory/grand-berna-dairies/packaging-and-labeling/labeling-management",
    secondaryIcon: <QrCode className="absolute bottom-2 right-2 h-4 w-4 text-muted-foreground/50" />,
    id: "labeling"
  }];

  const handleBack = () => {
    navigate("/manage-inventory");
  };

  return (
    <div className="space-y-4 container mx-auto py-6">
      <div className="flex items-center justify-between mb-4">
        <Button 
          variant="ghost" 
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
          onClick={handleBack}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Inventory Management
        </Button>
      </div>
      
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Packaging & Labeling Management</CardTitle>
          <div className="text-sm text-muted-foreground">
            Grand Berna Dairies | Processing Division
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {tiles.map(tile => (
              <button 
                key={tile.title} 
                onClick={() => navigate(tile.path)} 
                className={`group relative p-6 rounded-lg border ${
                  activeTab === tile.id 
                    ? 'border-primary bg-primary/10' 
                    : 'border-border hover:border-primary'
                } transition-all duration-300 bg-card hover:shadow-lg text-orange-800 bg-cyan-50 px-[24px]`}
                data-tab-id={tile.id}
              >
                <div className="flex flex-col items-center justify-center gap-2 h-24">
                  {tile.icon}
                  <span className="font-semibold">{tile.title}</span>
                  <span className="text-xs text-muted-foreground">{tile.description}</span>
                  {tile.secondaryIcon}
                </div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
      
      <div className="w-full max-w-4xl mx-auto mt-6">
        <div className="text-sm text-muted-foreground">
          <p>Use the packaging and labeling management system to track all product packaging operations and label generation in compliance with regulatory requirements.</p>
          <p className="mt-2">All entries are logged and can be audited by quality control.</p>
        </div>
      </div>
    </div>
  );
};

export default PackagingLabeling;
