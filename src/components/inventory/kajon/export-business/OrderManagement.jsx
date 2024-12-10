import React, { useState } from 'react';
import OrdersList from './modules/order-management/OrdersList';
import OrderForm from './modules/order-management/OrderForm';

const OrderManagement = () => {
  const [view, setView] = useState('list');
  
  // Mock data for demonstration
  const orders = [
    { id: '#002', date: '11 Feb, 2024', customer: 'Wade Warren', status: 'pending', total: '$20.00', delivery: 'N/A', items: '2 items', fulfillment: 'Unfulfilled' },
    { id: '#004', date: '13 Feb, 2024', customer: 'Esther Howard', status: 'success', total: '$22.00', delivery: 'N/A', items: '3 items', fulfillment: 'Fulfilled' },
    { id: '#007', date: '15 Feb, 2024', customer: 'Jenny Wilson', status: 'pending', total: '$25.00', delivery: 'N/A', items: '1 items', fulfillment: 'Unfulfilled' },
  ];

  return (
    <div className="space-y-6 p-6 bg-white rounded-lg">
      {view === 'list' ? (
        <OrdersList 
          orders={orders} 
          onCreateOrder={() => setView('form')} 
        />
      ) : (
        <OrderForm 
          onBack={() => setView('list')} 
        />
      )}
    </div>
  );
};

export default OrderManagement;