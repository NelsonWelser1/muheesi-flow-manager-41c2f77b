
import React from 'react';
import { Button } from "@/components/ui/button";
import ViewRecordsButton from '../records/ViewRecordsButton';
import DeliveryManagementForm from '../forms/DeliveryManagementForm';
import OrderEntryForm from '../forms/OrderEntryForm';
import PerformanceAnalyticsForm from '../forms/PerformanceAnalyticsForm';

const ContentView = ({ activeComponent, handleBack }) => {
  if (activeComponent === 'deliveries') {
    return (
      <>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Delivery Management</h3>
          <ViewRecordsButton 
            recordType="deliveries" 
            to="/manage-inventory/logistics/records/deliveries"
          />
        </div>
        <DeliveryManagementForm />
      </>
    );
  } else if (activeComponent === 'orders') {
    return (
      <>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Order Entry</h3>
          <ViewRecordsButton 
            recordType="orders" 
            to="/manage-inventory/logistics/records/orders"
          />
        </div>
        <OrderEntryForm />
      </>
    );
  } else if (activeComponent === 'performance') {
    return (
      <>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Performance Analytics</h3>
          <ViewRecordsButton 
            recordType="performance" 
            to="/manage-inventory/logistics/records/performance"
          />
        </div>
        <PerformanceAnalyticsForm />
      </>
    );
  }

  return null;
};

export default ContentView;
