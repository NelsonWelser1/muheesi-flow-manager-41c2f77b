
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Package } from "lucide-react";
import { useNavigate } from 'react-router-dom';

const ManageInventory = () => {
  const navigate = useNavigate();

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-[#1A1F2C]">Inventory Management</h1>
          <p className="text-[#8E9196]">Track and manage inventory across all companies</p>
        </div>
        <Button 
          variant="outline" 
          className="flex items-center gap-2"
          onClick={() => navigate('/executive-dashboard')}
        >
          <ArrowLeft size={16} />
          Back to Dashboard
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Package className="mr-2 h-5 w-5 text-[#6E59A5]" />
            Inventory Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64">
            <p>Inventory management features will be implemented here.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ManageInventory;
