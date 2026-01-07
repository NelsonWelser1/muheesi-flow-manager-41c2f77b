import React, { useState } from 'react';
import OrdersList from './modules/order-management/OrdersList';
import OrderForm from './modules/order-management/OrderForm';
import { useCoffeeOrders } from '@/hooks/useCoffeeOrders';
import { Loader2 } from 'lucide-react';

const OrderManagement = () => {
  const [view, setView] = useState('list');
  const { orders, loading, addOrder, updateOrder, deleteOrder, fetchOrders } = useCoffeeOrders();

  const handleCreateOrder = async (orderData) => {
    const result = await addOrder(orderData);
    if (result.success) {
      setView('list');
    }
    return result;
  };

  const handleUpdateOrder = async (id, updates) => {
    return await updateOrder(id, updates);
  };

  const handleDeleteOrder = async (id) => {
    return await deleteOrder(id);
  };

  // Transform orders for OrdersList component
  const formattedOrders = orders.map(order => ({
    id: order.order_number || order.id,
    date: order.order_date ? new Date(order.order_date).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A',
    customer: order.customer_name,
    status: order.status || 'pending',
    total: order.total_amount ? `$${order.total_amount.toLocaleString()}` : 'N/A',
    delivery: order.delivery_date ? new Date(order.delivery_date).toLocaleDateString() : 'N/A',
    items: `${order.quantity || 0} ${order.unit || 'kg'}`,
    fulfillment: order.fulfillment || 'Unfulfilled',
    rawData: order
  }));

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 bg-card rounded-lg">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 bg-card rounded-lg">
      {view === 'list' ? (
        <OrdersList 
          orders={formattedOrders} 
          onCreateOrder={() => setView('form')}
          onUpdateOrder={handleUpdateOrder}
          onDeleteOrder={handleDeleteOrder}
          onRefresh={fetchOrders}
        />
      ) : (
        <OrderForm 
          onBack={() => setView('list')}
          onSubmit={handleCreateOrder}
        />
      )}
    </div>
  );
};

export default OrderManagement;
