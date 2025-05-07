
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileText, Search, Plus, Filter } from 'lucide-react';
import OrderForm from './forms/OrderForm';

// Sample data for demonstration
const ordersSample = [
  { 
    id: "EXP-2023-001",
    client: "Equata Coffee Limited",
    product: "Robusta Grade 1",
    quantity: "35 MT",
    value: "$157,500",
    status: "Processing",
    date: "2023-11-15"
  },
  { 
    id: "EXP-2023-002",
    client: "Nordic Roasters Group",
    product: "Arabica AA",
    quantity: "20 MT",
    value: "$134,000",
    status: "Shipped",
    date: "2023-11-10"
  },
  { 
    id: "EXP-2023-003",
    client: "Coffee Bean Co.",
    product: "Robusta Peaberry",
    quantity: "18 MT",
    value: "$75,600",
    status: "Processing",
    date: "2023-11-07"
  },
  { 
    id: "EXP-2023-004",
    client: "Equata Coffee Limited",
    product: "Arabica A",
    quantity: "15 MT",
    value: "$87,750",
    status: "Documents",
    date: "2023-11-05"
  },
  { 
    id: "EXP-2023-005",
    client: "Global Coffee Solutions",
    product: "Robusta Grade 2",
    quantity: "40 MT",
    value: "$152,000",
    status: "Completed",
    date: "2023-10-28"
  }
];

const ExportOrders = () => {
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const [selectedTab, setSelectedTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Filter orders based on status tab and search query
  const filteredOrders = ordersSample.filter(order => {
    const matchesTab = selectedTab === "all" || 
      order.status.toLowerCase() === selectedTab.toLowerCase();
      
    const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
      order.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.product.toLowerCase().includes(searchQuery.toLowerCase());
      
    return matchesTab && matchesSearch;
  });
  
  const handleCreateOrder = () => {
    setIsCreatingOrder(true);
  };
  
  const handleCancelCreate = () => {
    setIsCreatingOrder(false);
  };
  
  if (isCreatingOrder) {
    return <OrderForm onCancel={handleCancelCreate} />;
  }
  
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-xl flex items-center">
              <FileText className="mr-2 h-5 w-5" />
              Export Orders Management
            </CardTitle>
            <CardDescription>
              Manage international coffee export orders and track their status
            </CardDescription>
          </div>
          <Button onClick={handleCreateOrder} className="flex items-center">
            <Plus className="mr-2 h-4 w-4" />
            Create Order
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by order ID, client or product..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Select defaultValue="newest">
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest first</SelectItem>
                <SelectItem value="oldest">Oldest first</SelectItem>
                <SelectItem value="highest">Highest value</SelectItem>
                <SelectItem value="lowest">Lowest value</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid grid-cols-5 mb-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="processing">Processing</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="shipped">Shipped</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-0">
            <OrdersTable orders={filteredOrders} />
          </TabsContent>
          
          <TabsContent value="processing" className="mt-0">
            <OrdersTable orders={filteredOrders} />
          </TabsContent>
          
          <TabsContent value="documents" className="mt-0">
            <OrdersTable orders={filteredOrders} />
          </TabsContent>
          
          <TabsContent value="shipped" className="mt-0">
            <OrdersTable orders={filteredOrders} />
          </TabsContent>
          
          <TabsContent value="completed" className="mt-0">
            <OrdersTable orders={filteredOrders} />
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="flex justify-between border-t pt-4">
        <div className="text-sm text-muted-foreground">
          Showing {filteredOrders.length} of {ordersSample.length} orders
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" disabled>
            Previous
          </Button>
          <Button variant="outline" size="sm" disabled>
            Next
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

// Orders table component
const OrdersTable = ({ orders }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case "Processing": return "bg-amber-100 text-amber-800";
      case "Documents": return "bg-blue-100 text-blue-800";
      case "Shipped": return "bg-purple-100 text-purple-800";
      case "Completed": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };
  
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order ID</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Product</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Value</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.length === 0 ? (
            <TableRow>
              <TableCell colSpan="8" className="h-24 text-center">
                No orders found
              </TableCell>
            </TableRow>
          ) : (
            orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">{order.id}</TableCell>
                <TableCell>{order.client}</TableCell>
                <TableCell>{order.product}</TableCell>
                <TableCell>{order.quantity}</TableCell>
                <TableCell>{order.value}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </TableCell>
                <TableCell>{order.date}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm">View</Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default ExportOrders;
