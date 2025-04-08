
import React, { useState } from 'react';
import LocalPurchaseOrderList from './LocalPurchaseOrderList';
import LocalPurchaseOrderForm from './LocalPurchaseOrderForm';

const LocalPurchaseOrderManager = () => {
  const [activeView, setActiveView] = useState('list');
  const [selectedOrder, setSelectedOrder] = useState(null);
  
  const handleNewOrder = () => {
    setSelectedOrder(null);
    setActiveView('form');
  };
  
  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setActiveView('view');
  };
  
  const handleEditOrder = (order) => {
    setSelectedOrder(order);
    setActiveView('form');
  };
  
  const handleBackToList = () => {
    setActiveView('list');
    setSelectedOrder(null);
  };

  return (
    <div>
      {activeView === 'list' && (
        <LocalPurchaseOrderList 
          onNewOrder={handleNewOrder}
          onViewOrder={handleViewOrder}
          onEditOrder={handleEditOrder}
        />
      )}
      
      {activeView === 'form' && (
        <LocalPurchaseOrderForm 
          onBack={handleBackToList}
          existingOrder={selectedOrder}
        />
      )}
      
      {activeView === 'view' && selectedOrder && (
        <LocalPurchaseOrderForm 
          onBack={handleBackToList}
          existingOrder={selectedOrder}
          readonly={true}
        />
      )}
    </div>
  );
};

export default LocalPurchaseOrderManager;
