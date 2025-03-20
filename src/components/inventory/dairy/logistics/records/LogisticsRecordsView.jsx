
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useNavigate, useParams } from "react-router-dom";
import DeliveriesRecords from './DeliveriesRecords';
import OrdersRecords from './OrdersRecords';
import PerformanceRecords from './PerformanceRecords';

const LogisticsRecordsView = () => {
  const { recordType } = useParams();
  const [activeTab, setActiveTab] = useState(recordType || 'deliveries');
  const navigate = useNavigate();

  useEffect(() => {
    // Set default tab if recordType is not provided or is invalid
    if (!recordType) {
      navigate('/manage-inventory/logistics/records/deliveries');
    } else if (!['deliveries', 'orders', 'performance'].includes(recordType)) {
      // Redirect to a valid tab if an invalid recordType is provided
      navigate('/manage-inventory/logistics/records/deliveries');
    } else {
      setActiveTab(recordType);
    }
  }, [recordType, navigate]);

  const handleTabChange = (value) => {
    setActiveTab(value);
    navigate(`/manage-inventory/logistics/records/${value}`);
  };

  const handleBack = () => {
    navigate('/manage-inventory/logistics');
  };

  return (
    <div className="space-y-4">
      <Button 
        variant="outline" 
        size="sm" 
        onClick={handleBack}
        className="mb-2"
      >
        ← Back to Logistics Dashboard
      </Button>
      
      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle>Logistics Records</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs 
            defaultValue={activeTab} 
            value={activeTab} 
            onValueChange={handleTabChange}
          >
            <TabsList className="grid w-full grid-cols-3 mb-4">
              <TabsTrigger value="deliveries">Deliveries</TabsTrigger>
              <TabsTrigger value="orders">Orders</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
            </TabsList>
            
            <TabsContent value="deliveries">
              <DeliveriesRecords />
            </TabsContent>

            <TabsContent value="orders">
              <OrdersRecords />
            </TabsContent>

            <TabsContent value="performance">
              <PerformanceRecords />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default LogisticsRecordsView;
