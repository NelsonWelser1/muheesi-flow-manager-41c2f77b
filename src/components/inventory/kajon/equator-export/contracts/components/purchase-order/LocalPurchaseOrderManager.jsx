
import React, { useState, useEffect } from 'react';
import LocalPurchaseOrderList from './LocalPurchaseOrderList';
import LocalPurchaseOrderForm from './LocalPurchaseOrderForm';
import { useLocalPurchaseOrders } from '@/hooks/useLocalPurchaseOrders';
import { useToast } from '@/components/ui/use-toast';
import { initializeDatabase } from '@/integrations/supabase/hooks/runMigration';

const LocalPurchaseOrderManager = () => {
  const [activeView, setActiveView] = useState('list');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const { fetchOrders, loading, orders } = useLocalPurchaseOrders();
  const { toast } = useToast();
  
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        // First initialize the database
        await initializeDatabase();
        // Then fetch the orders
        await fetchOrders();
      } catch (error) {
        console.error("Error loading purchase orders:", error);
        toast({
          title: "Error",
          description: "Failed to load purchase orders. Please try again.",
          variant: "destructive",
        });
      }
    };
    
    loadInitialData();
  }, [fetchOrders, toast]);
  
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
    <div className="container mx-auto p-4">
      {activeView === 'list' && (
        <LocalPurchaseOrderList 
          orders={orders || []}
          loading={loading}
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
