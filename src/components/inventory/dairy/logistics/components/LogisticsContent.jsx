
import React from 'react';
import { Button } from "@/components/ui/button";
import DeliveryManagementForm from '../forms/DeliveryManagementForm';
import OrderEntryForm from '../forms/OrderEntryForm';
import PerformanceAnalyticsForm from '../forms/PerformanceAnalyticsForm';
import DeliveriesRecordsView from '../records/views/DeliveriesRecordsView';
import OrdersRecordsView from '../records/views/OrdersRecordsView';
import PerformanceRecordsView from '../records/views/PerformanceRecordsView';
import LogisticsRecordsView from '../records/LogisticsRecordsView';

const LogisticsContent = ({ activeComponent, setActiveComponent }) => {
  if (activeComponent === 'deliveries') {
    return (
      <>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Delivery Management</h3>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setActiveComponent('view-deliveries')}
            className="flex items-center gap-2"
          >
            View Delivery Records
          </Button>
        </div>
        <DeliveryManagementForm />
      </>
    );
  } else if (activeComponent === 'view-deliveries') {
    return <DeliveriesRecordsView onBack={() => setActiveComponent('deliveries')} />;
  } else if (activeComponent === 'orders') {
    return (
      <>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Order Entry</h3>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setActiveComponent('view-orders')}
            className="flex items-center gap-2"
          >
            View Order Records
          </Button>
        </div>
        <OrderEntryForm />
      </>
    );
  } else if (activeComponent === 'view-orders') {
    return <OrdersRecordsView onBack={() => setActiveComponent('orders')} />;
  } else if (activeComponent === 'performance') {
    return (
      <>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Performance Analytics</h3>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setActiveComponent('view-performance')}
            className="flex items-center gap-2"
          >
            View Performance Records
          </Button>
        </div>
        <PerformanceAnalyticsForm />
      </>
    );
  } else if (activeComponent === 'view-performance') {
    return <PerformanceRecordsView onBack={() => setActiveComponent('performance')} />;
  } else if (activeComponent === 'records') {
    return <LogisticsRecordsView />;
  }
  
  return null;
};

export default LogisticsContent;
