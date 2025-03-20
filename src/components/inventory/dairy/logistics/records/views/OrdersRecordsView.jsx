
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import OrdersRecords from '../OrdersRecords';

const OrdersRecordsView = ({ onBack }) => {
  return (
    <div className="space-y-6">
      <Button 
        variant="outline" 
        onClick={onBack}
        className="mb-4"
      >
        ← Back to Order Management
      </Button>
      
      <OrdersRecords />
    </div>
  );
};

export default OrdersRecordsView;
