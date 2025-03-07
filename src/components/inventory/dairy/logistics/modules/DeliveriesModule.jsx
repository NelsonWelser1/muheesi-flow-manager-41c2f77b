
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import DeliveryRecordsDisplay from '../forms/displays/DeliveryRecordsDisplay';
import DeliveryManagementForm from '../forms/DeliveryManagementForm';

const DeliveriesModule = () => {
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/manage-inventory/logistics');
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <header className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Deliveries Management</h1>
          <p className="text-gray-500">Create and manage delivery records</p>
        </div>
        
        <Button 
          className="flex items-center gap-2" 
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'View Deliveries' : <><Plus className="h-4 w-4" /> New Delivery</>}
        </Button>
      </header>

      {showForm ? (
        <Card>
          <CardHeader>
            <CardTitle>Create Delivery</CardTitle>
          </CardHeader>
          <CardContent>
            <DeliveryManagementForm 
              onSuccess={() => setShowForm(false)}
              onCancel={() => setShowForm(false)}
            />
          </CardContent>
        </Card>
      ) : (
        <DeliveryRecordsDisplay onBack={handleBack} />
      )}
    </div>
  );
};

export default DeliveriesModule;
