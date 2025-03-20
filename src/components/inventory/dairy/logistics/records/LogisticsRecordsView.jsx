
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
    if (recordType && ['deliveries', 'orders', 'performance'].includes(recordType)) {
      setActiveTab(recordType);
    }
  }, [recordType]);

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
          <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab}>
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
