
import React, { useState } from 'react';
import ShipmentsList from './components/ShipmentsList';
import NewShipmentForm from './components/NewShipmentForm';
import { Toaster } from "@/components/ui/toaster";

const Shipments = () => {
  const [view, setView] = useState('list'); // 'list' or 'create'
  
  const handleCreateNew = () => {
    setView('create');
  };
  
  const handleCancel = () => {
    setView('list');
  };

  return (
    <div className="p-4 md:p-6">
      {view === 'list' ? (
        <ShipmentsList onCreateNew={handleCreateNew} />
      ) : (
        <NewShipmentForm onCancel={handleCancel} />
      )}
      <Toaster />
    </div>
  );
};

export default Shipments;
