
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  ShoppingCart, 
  Package, 
  TrendingUp, 
  DollarSign, 
  Truck, 
  FileText,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

const ProcurementManagerDashboard = () => {
  const [formData, setFormData] = useState({
    productName: '',
    quantity: '',
    supplier: '',
    cost: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Procurement order:", formData);
    // Reset form after submission
    setFormData({
      productName: '',
      quantity: '',
      supplier: '',
      cost: '',
    });
  };

  const procurementMetrics = [
    {
      title: "Active Suppliers",
      value: "24",
      change: "+3 this month",
      icon: Truck,
      color: "text-blue-600"
    },
    {
      title: "Pending Orders",
      value: "12",
      change: "5 urgent",
      icon: ShoppingCart,
      color: "text-orange-600"
    },
    {
      title: "Monthly Spend",
      value: "UGX 85M",
      change: "-12% vs last month",
      icon: DollarSign,
      color: "text-green-600"
    },
    {
      title: "Cost Savings",
      value: "UGX 8.5M",
      change: "+15% this quarter",
      icon: TrendingUp,
      color: "text-purple-600"
    }
  ];

  const recentOrders = [
    {
      id: "PO-001",
      product: "Raw Milk",
      supplier: "Kashari Farm",
      quantity: "5000 L",
      status: "Pending",
      cost: "UGX 12M"
    },
    {
      id: "PO-002",
      product: "Coffee Beans",
      supplier: "Kazo Coffee",
      quantity: "2000 kg",
      status: "Approved",
      cost: "UGX 8.5M"
    },
    {
      id: "PO-003",
      product: "Packaging Materials",
      supplier: "Kampala Supplies",
      quantity: "1000 units",
      status: "Delivered",
      cost: "UGX 3.2M"
    }
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Delivered':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'Approved':
        return <Package className="h-4 w-4 text-blue-600" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-orange-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered':
        return 'default';
      case 'Approved':
        return 'secondary';
      default:
        return 'destructive';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Procurement Manager Dashboard</h2>
          <p className="text-muted-foreground">
            Manage suppliers, orders, and procurement processes
          </p>
        </div>
        <ShoppingCart className="h-8 w-8 text-blue-600" />
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {procurementMetrics.map((metric, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
              <metric.icon className={`h-4 w-4 ${metric.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <p className="text-xs text-muted-foreground">{metric.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="orders" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="orders">Recent Orders</TabsTrigger>
          <TabsTrigger value="create">Create Order</TabsTrigger>
          <TabsTrigger value="suppliers">Suppliers</TabsTrigger>
        </TabsList>

        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Recent Procurement Orders
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentOrders.map((order, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold">{order.id}</h3>
                        <Badge variant={getStatusColor(order.status)} className="flex items-center gap-1">
                          {getStatusIcon(order.status)}
                          {order.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {order.product} - {order.quantity}
                      </p>
                      <p className="text-sm font-medium">Supplier: {order.supplier}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{order.cost}</p>
                      <Button size="sm" variant="outline">View Details</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="create">
          <Card>
            <CardHeader>
              <CardTitle>Create Procurement Order</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="productName">Product Name</Label>
                    <Input 
                      id="productName" 
                      name="productName" 
                      value={formData.productName} 
                      onChange={handleInputChange} 
                      required 
                      placeholder="Enter product name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="quantity">Quantity</Label>
                    <Input 
                      id="quantity" 
                      name="quantity" 
                      type="number" 
                      value={formData.quantity} 
                      onChange={handleInputChange} 
                      required 
                      placeholder="Enter quantity"
                    />
                  </div>
                  <div>
                    <Label htmlFor="supplier">Supplier</Label>
                    <Input 
                      id="supplier" 
                      name="supplier" 
                      value={formData.supplier} 
                      onChange={handleInputChange} 
                      required 
                      placeholder="Enter supplier name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="cost">Cost (UGX)</Label>
                    <Input 
                      id="cost" 
                      name="cost" 
                      type="number" 
                      value={formData.cost} 
                      onChange={handleInputChange} 
                      required 
                      placeholder="Enter cost"
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Create Procurement Order
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="suppliers">
          <Card>
            <CardHeader>
              <CardTitle>Supplier Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Supplier management features will be implemented here.
              </p>
              <Button>
                <Truck className="h-4 w-4 mr-2" />
                Add New Supplier
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProcurementManagerDashboard;
