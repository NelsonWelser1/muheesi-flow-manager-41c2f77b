
import React, { useState } from 'react';
import ShipmentsList from './components/ShipmentsList';
import NewShipmentForm from './components/NewShipmentForm';
import { Toaster } from "@/components/ui/toaster";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const Shipments = ({ viewOnly = false }) => {
  const [view, setView] = useState('list'); // 'list' or 'create'
  
  const handleCreateNew = () => {
    if (viewOnly) return;
    setView('create');
  };
  
  const handleCancel = () => {
    setView('list');
  };

  return (
    <div className="p-4 md:p-6">
      {viewOnly && (
        <Alert variant="warning" className="bg-amber-50 border-amber-200 mb-4">
          <AlertCircle className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-800">
            You are viewing shipments in read-only mode. Creating or modifying shipments is only available to operational staff.
          </AlertDescription>
        </Alert>
      )}
      
      {view === 'list' ? (
        <ShipmentsList onCreateNew={handleCreateNew} viewOnly={viewOnly} />
      ) : (
        <NewShipmentForm onCancel={handleCancel} />
      )}
      <Toaster />
    </div>
  );
};

export default Shipments;
