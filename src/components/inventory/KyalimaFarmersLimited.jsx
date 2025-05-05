
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { Home } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const KyalimaFarmersLimited = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleManageInventory = () => {
    setIsLoading(true);
    // Simulate API call or navigation preparation
    setTimeout(() => {
      toast({
        title: "Inventory Management",
        description: "Loading Kyalima Farmers inventory management system",
      });
      setIsLoading(false);
      navigate('/manage-inventory/kyalima');
    }, 500);
  };
  
  const handleGoHome = () => {
    navigate('/manage-inventory');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Kyalima Farmers Limited</h1>
        <Button variant="outline" onClick={handleGoHome} className="flex items-center gap-2">
          <Home className="h-4 w-4" />
          <span>Home</span>
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Kyalima Agri-Business</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Manage agricultural assets and commodities inventory.</p>
            <Button onClick={handleManageInventory} disabled={isLoading} className="w-full">
              {isLoading ? "Loading..." : "Manage Inventory"}
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Cooperative Management</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Manage member cooperatives and associated processes.</p>
            <Button variant="secondary" className="w-full">Cooperative Dashboard</Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Financial Services</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Track loans, savings and financial services for farmers.</p>
            <Button variant="secondary" className="w-full">Financial Console</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default KyalimaFarmersLimited;
