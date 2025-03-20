import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import DeliveriesRecords from './DeliveriesRecords';
import OrdersRecords from './OrdersRecords';
import PerformanceRecords from './PerformanceRecords';
const LogisticsRecordsView = () => {
  const [activeTab, setActiveTab] = useState('deliveries');
  const navigate = useNavigate();
  const handleBack = () => {
    navigate('/manage-inventory/logistics');
  };
  return <div className="space-y-4">
      
      
      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle>Logistics Records</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="deliveries" value={activeTab} onValueChange={setActiveTab}>
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
    </div>;
};
export default LogisticsRecordsView;