
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import OrdersRecords from '../OrdersRecords';

const OrdersRecordsView = ({ onBack }) => {
  return (
    <div className="space-y-6">
      <Button 
        variant="outline" 
        onClick={onBack}
        className="mb-4"
      >
        <Input 
          className="bg-transparent border-0 p-0" 
          defaultValue="← Back to Order Management" 
        />
      </Button>
      
      <OrdersRecords />
    </div>
  );
};

export default OrdersRecordsView;
