
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package2, Tags, Barcode, QrCode, ArrowLeft, Home, LogOut, Clock } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { format } from 'date-fns';

const PackagingLabeling = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('packaging'); // Default to packaging tab
  
  // Mock user data - in a real app, this would come from an auth context
  const currentUser = {
    name: "John Doe",
    role: "Inventory Manager"
  };
  
  useEffect(() => {
    // Check if we have state from navigation and update the active tab
    if (location.state && location.state.selectedTab) {
      setActiveTab(location.state.selectedTab);
    }
  }, [location.state]);
  
  const handleBack = () => {
    navigate("/manage-inventory");
  };

  return (
    <div className="space-y-4 container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
            onClick={handleBack}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Inventory Management
          </Button>
          <h1 className="text-3xl font-bold">Grand Berna Dairies</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-600">
            <div>{currentUser.name}</div>
            <div>{currentUser.role}</div>
          </div>
          <div className="text-sm text-gray-600">
            <Clock className="inline mr-2" />
            {format(new Date(), 'MMM dd, yyyy, h:mm:ss a')}
          </div>
          <Button variant="outline" onClick={() => navigate('/home')}>
            <Home className="h-4 w-4 mr-2" />
            Home
          </Button>
          <Button variant="outline" onClick={() => navigate('/logout')}>
            <LogOut className="h-4 w-4 mr-2" />
            Log Out
          </Button>
        </div>
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
            <Packaging 
              active={activeTab === 'packaging'} 
              onClick={() => navigate("/manage-inventory/grand-berna-dairies/packaging-and-labeling/packaging-management")}
            />
            <Labeling 
              active={activeTab === 'labeling'} 
              onClick={() => navigate("/manage-inventory/grand-berna-dairies/packaging-and-labeling/labeling-management")}
            />
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

const Packaging = ({ active, onClick }) => {
  return (
    <button 
      onClick={onClick} 
      className={`group relative p-6 rounded-lg border ${
        active 
          ? 'border-primary bg-primary/10' 
          : 'border-border hover:border-primary'
      } transition-all duration-300 bg-card hover:shadow-lg text-orange-800 bg-cyan-50 px-[24px]`}
      data-tab-id="packaging"
    >
      <div className="flex flex-col items-center justify-center gap-2 h-24">
        <Package2 className="h-6 w-6" />
        <span className="font-semibold">Packaging</span>
        <span className="text-xs text-muted-foreground">Manage product packaging details</span>
        <Barcode className="absolute bottom-2 right-2 h-4 w-4 text-muted-foreground/50" />
      </div>
    </button>
  );
};

const Labeling = ({ active, onClick }) => {
  return (
    <button 
      onClick={onClick} 
      className={`group relative p-6 rounded-lg border ${
        active 
          ? 'border-primary bg-primary/10' 
          : 'border-border hover:border-primary'
      } transition-all duration-300 bg-card hover:shadow-lg text-orange-800 bg-cyan-50 px-[24px]`}
      data-tab-id="labeling"
    >
      <div className="flex flex-col items-center justify-center gap-2 h-24">
        <Tags className="h-6 w-6" />
        <span className="font-semibold">Labeling</span>
        <span className="text-xs text-muted-foreground">Configure product labels</span>
        <QrCode className="absolute bottom-2 right-2 h-4 w-4 text-muted-foreground/50" />
      </div>
    </button>
  );
};

export default PackagingLabeling;
