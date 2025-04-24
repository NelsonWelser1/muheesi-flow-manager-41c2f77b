
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Logistics = () => {
  // Example deliveries data
  const deliveries = [
    { id: 1, date: "2024-04-20", product: "Fresh Milk", quantity: "500 liters", destination: "Kyiboga Processing Plant", status: "Delivered" },
    { id: 2, date: "2024-04-22", product: "Fresh Milk", quantity: "450 liters", destination: "Kyiboga Processing Plant", status: "In Transit" },
    { id: 3, date: "2024-04-23", product: "Fresh Milk", quantity: "525 liters", destination: "Kyiboga Processing Plant", status: "Scheduled" },
  ];

  // Example inventory data
  const inventory = [
    { id: 1, item: "Animal Feed", quantity: "2 tons", reorderLevel: "0.5 tons", status: "Adequate" },
    { id: 2, item: "Medicine", quantity: "150 units", reorderLevel: "50 units", status: "Adequate" },
    { id: 3, item: "Milk Containers", quantity: "20 units", reorderLevel: "15 units", status: "Low" },
    { id: 4, item: "Cleaning Supplies", quantity: "45 units", reorderLevel: "30 units", status: "Adequate" },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Logistics Management</h2>
      
      <Tabs defaultValue="deliveries">
        <TabsList>
          <TabsTrigger value="deliveries">Milk Deliveries</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="orders">Purchase Orders</TabsTrigger>
        </TabsList>
        
        <TabsContent value="deliveries" className="space-y-4 pt-4">
          <div className="flex justify-between">
            <h3 className="text-xl font-medium">Milk Deliveries</h3>
            <Button>Schedule Delivery</Button>
          </div>
          
          <Card>
            <CardContent className="pt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Destination</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {deliveries.map((delivery) => (
                    <TableRow key={delivery.id}>
                      <TableCell>{delivery.date}</TableCell>
                      <TableCell>{delivery.product}</TableCell>
                      <TableCell>{delivery.quantity}</TableCell>
                      <TableCell>{delivery.destination}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs 
                          ${delivery.status === 'Delivered' ? 'bg-green-100 text-green-800' : 
                            delivery.status === 'In Transit' ? 'bg-blue-100 text-blue-800' : 
                            'bg-amber-100 text-amber-800'}`}>
                          {delivery.status}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="inventory" className="space-y-4 pt-4">
          <div className="flex justify-between">
            <h3 className="text-xl font-medium">Farm Inventory</h3>
            <Button>Add Inventory Item</Button>
          </div>
          
          <Card>
            <CardContent className="pt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Reorder Level</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {inventory.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.item}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>{item.reorderLevel}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs 
                          ${item.status === 'Adequate' ? 'bg-green-100 text-green-800' : 
                            item.status === 'Low' ? 'bg-amber-100 text-amber-800' : 
                            'bg-red-100 text-red-800'}`}>
                          {item.status}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="orders" className="space-y-4 pt-4">
          <div className="flex justify-between">
            <h3 className="text-xl font-medium">Purchase Orders</h3>
            <Button>Create Purchase Order</Button>
          </div>
          
          <Card>
            <CardContent className="pt-6 flex items-center justify-center h-40">
              <p className="text-muted-foreground">No purchase orders have been created yet.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Logistics;
