
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useBukomeroDairyData } from "@/hooks/useBukomeroDairyData";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const BukomeroLogistics = () => {
  const { isLoading, error } = useBukomeroDairyData();
  
  if (isLoading) {
    return <div className="p-6">Loading logistics data...</div>;
  }
  
  if (error) {
    return <div className="p-6 text-red-500">Error loading logistics data: {error.message}</div>;
  }
  
  // Sample delivery schedule data
  const deliveries = [
    { id: 1, destination: "Grand Berna Processing Plant", product: "Raw Milk", quantity: "250 liters", date: "23 Apr, 2025", status: "Scheduled" },
    { id: 2, destination: "Kyiboga Farmer's Market", product: "Raw Milk", quantity: "120 liters", date: "23 Apr, 2025", status: "Scheduled" },
    { id: 3, destination: "Mbarara Distributor", product: "Raw Milk", quantity: "180 liters", date: "22 Apr, 2025", status: "Delivered" },
    { id: 4, destination: "Kampala Store", product: "Raw Milk", quantity: "200 liters", date: "21 Apr, 2025", status: "Delivered" },
    { id: 5, destination: "Local Shops", product: "Raw Milk", quantity: "80 liters", date: "20 Apr, 2025", status: "Delivered" },
  ];
  
  // Sample inventory data
  const inventoryItems = [
    { id: 1, item: "Cattle Feed", quantity: "1,200 kg", reorderLevel: "300 kg", status: "Adequate" },
    { id: 2, item: "Veterinary Supplies", quantity: "Various", reorderLevel: "N/A", status: "Adequate" },
    { id: 3, item: "Milk Containers", quantity: "45 units", reorderLevel: "10 units", status: "Adequate" },
    { id: 4, item: "Cleaning Supplies", quantity: "Various", reorderLevel: "N/A", status: "Low" },
    { id: 5, item: "Fuel", quantity: "120 liters", reorderLevel: "50 liters", status: "Adequate" },
  ];
  
  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">Logistics Management</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Today's Deliveries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">Scheduled for today</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Vehicle Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Operational</div>
            <p className="text-xs text-muted-foreground">All vehicles ready</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Delivery Efficiency</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">98%</div>
            <p className="text-xs text-muted-foreground">On-time delivery rate</p>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Delivery Schedule</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Destination</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {deliveries.map((delivery) => (
                <TableRow key={delivery.id}>
                  <TableCell className="font-medium">{delivery.destination}</TableCell>
                  <TableCell>{delivery.product}</TableCell>
                  <TableCell>{delivery.quantity}</TableCell>
                  <TableCell>{delivery.date}</TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                      delivery.status === "Delivered" 
                        ? "bg-green-50 text-green-700 ring-green-600/20" 
                        : "bg-yellow-50 text-yellow-700 ring-yellow-600/20"
                    }`}>
                      {delivery.status}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Inventory Status</CardTitle>
        </CardHeader>
        <CardContent>
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
              {inventoryItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.item}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>{item.reorderLevel}</TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                      item.status === "Adequate" 
                        ? "bg-green-50 text-green-700 ring-green-600/20" 
                        : "bg-orange-50 text-orange-700 ring-orange-600/20"
                    }`}>
                      {item.status}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default BukomeroLogistics;
