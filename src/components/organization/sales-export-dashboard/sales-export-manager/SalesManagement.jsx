
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, TrendingUp, ShoppingCart, Clock } from 'lucide-react';

const SalesManagement = () => {
  const activeSalesOrders = [
    {
      orderId: "SO-2024-001",
      customer: "European Coffee Traders",
      product: "Premium Arabica",
      quantity: "25 tons",
      value: 185000,
      status: "confirmed",
      deliveryDate: "2024-06-20"
    },
    {
      orderId: "SO-2024-002", 
      customer: "Asian Premium Imports",
      product: "Specialty Robusta",
      quantity: "15 tons",
      value: 95000,
      status: "processing",
      deliveryDate: "2024-06-25"
    },
    {
      orderId: "SO-2024-003",
      customer: "American Specialty Co.",
      product: "Organic Arabica",
      quantity: "30 tons",
      value: 220000,
      status: "pending",
      deliveryDate: "2024-07-05"
    },
    {
      orderId: "SO-2024-004",
      customer: "Middle East Distributors",
      product: "Premium Blend",
      quantity: "20 tons",
      value: 145000,
      status: "shipped",
      deliveryDate: "2024-06-15"
    }
  ];

  const salesPipeline = [
    { stage: "Prospects", count: 25, value: 850000 },
    { stage: "Qualified Leads", count: 18, value: 620000 },
    { stage: "Proposals Sent", count: 12, value: 485000 },
    { stage: "Negotiations", count: 8, value: 320000 },
    { stage: "Closed Won", count: 5, value: 180000 }
  ];

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'confirmed': return 'bg-green-500 text-white';
      case 'processing': return 'bg-blue-500 text-white';
      case 'pending': return 'bg-yellow-500 text-white';
      case 'shipped': return 'bg-purple-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Sales Management</h3>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Sales Order
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Active Sales Orders
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {activeSalesOrders.map((order, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-semibold">{order.orderId}</h4>
                    <p className="text-sm text-muted-foreground">{order.customer}</p>
                  </div>
                  <Badge className={getStatusColor(order.status)}>
                    {order.status}
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Product</p>
                    <p className="font-medium">{order.product}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Quantity</p>
                    <p className="font-medium">{order.quantity}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Value</p>
                    <p className="font-semibold text-green-600">${order.value.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Delivery</p>
                    <p className="font-medium">{order.deliveryDate}</p>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Sales Pipeline
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {salesPipeline.map((stage, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-semibold">{stage.stage}</h4>
                  <span className="text-sm text-muted-foreground">
                    {stage.count} opportunities
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-green-600">
                    ${stage.value.toLocaleString()}
                  </span>
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${(stage.count / 25) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sales Management Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button className="h-20 flex-col">
              <Plus className="h-6 w-6 mb-2" />
              Create Quote
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <ShoppingCart className="h-6 w-6 mb-2" />
              Order Tracking
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <TrendingUp className="h-6 w-6 mb-2" />
              Pipeline Review
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <Clock className="h-6 w-6 mb-2" />
              Follow-ups
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SalesManagement;
