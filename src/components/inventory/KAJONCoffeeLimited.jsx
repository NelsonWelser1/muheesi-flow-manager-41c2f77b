
import React, { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const KAJONCoffeeLimited = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');

  const handleFeatureClick = (feature) => {
    toast({
      title: "Feature Coming Soon",
      description: `${feature} functionality will be available soon`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">KAJON Coffee Limited</h2>
        <Button onClick={() => handleFeatureClick("Export Coffee Management")}>
          Manage Exports
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="processing">Processing</TabsTrigger>
          <TabsTrigger value="quality">Quality Control</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Coffee Types</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Robusta</span>
                    <span className="font-semibold">Available</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Arabica</span>
                    <span className="font-semibold">Available</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Current Stock</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Robusta FAQ</span>
                    <span className="font-semibold">2000kg</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Arabica AA</span>
                    <span className="font-semibold">1500kg</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="inventory" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Inventory Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Inventory management features will be implemented here.</p>
              <Button 
                className="mt-4" 
                onClick={() => handleFeatureClick("Inventory Management")}
              >
                Manage Inventory
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="processing" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Coffee Processing</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Coffee processing and production tracking features.</p>
              <Button 
                className="mt-4" 
                onClick={() => handleFeatureClick("Coffee Processing")}
              >
                View Processing
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="quality" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Quality Control</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Quality control and testing management system.</p>
              <Button 
                className="mt-4" 
                onClick={() => handleFeatureClick("Quality Control")}
              >
                Quality Dashboard
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default KAJONCoffeeLimited;
