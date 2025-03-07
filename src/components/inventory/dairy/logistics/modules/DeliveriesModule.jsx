
import React from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import DeliveryManagementForm from '../forms/DeliveryManagementForm';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const DeliveriesModule = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Delivery Management</h2>
        <Button 
          variant="outline" 
          onClick={() => navigate('/manage-inventory/logistics')}
        >
          Back to Dashboard
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Manage Deliveries</CardTitle>
        </CardHeader>
        <CardContent>
          <DeliveryManagementForm />
        </CardContent>
      </Card>
    </div>
  );
};

export default DeliveriesModule;
