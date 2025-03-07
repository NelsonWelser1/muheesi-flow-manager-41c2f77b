
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BackButton } from '../forms/displays/components';

const LogisticsOverview = () => {
  const navigate = useNavigate();
  
  const handleBack = () => {
    navigate('/manage-inventory/logistics');
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <BackButton onBack={handleBack} />
          <h1 className="text-3xl font-bold mt-4">Logistics Overview</h1>
          <p className="text-gray-500">Key performance indicators and metrics</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Delivery Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500">Overview of delivery performance metrics coming soon</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Order Fulfillment</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500">Order fulfillment analytics coming soon</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Delivery Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500">Delivery timeline visualization coming soon</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Logistics Efficiency</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500">Logistics efficiency metrics coming soon</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LogisticsOverview;
