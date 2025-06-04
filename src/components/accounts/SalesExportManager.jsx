
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Globe, TrendingUp, Users, Package } from 'lucide-react';

const SalesExportManager = () => {
  const [formData, setFormData] = useState({
    productName: '',
    quantity: '',
    customerName: '',
    destination: '',
    saleType: '',
    customerType: '',
    priority: '',
    expectedDelivery: ''
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
    console.log("Sales order:", formData);
    // Implement sales order submission logic
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Globe className="h-6 w-6 text-blue-600" />
        <h3 className="text-lg font-semibold">Sales & Export Manager</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Total Sales</p>
                <p className="text-xl font-bold">$3.2M</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">Export Revenue</p>
                <p className="text-xl font-bold">$2.1M</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm text-muted-foreground">Active Customers</p>
                <p className="text-xl font-bold">148</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-sm text-muted-foreground">Pending Orders</p>
                <p className="text-xl font-bold">32</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Create Sales Order</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="productName">Product Name</Label>
                <Select name="productName" onValueChange={(value) => handleInputChange({ target: { name: 'productName', value } })} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select product" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="premium-arabica">Premium Arabica Coffee</SelectItem>
                    <SelectItem value="specialty-robusta">Specialty Robusta</SelectItem>
                    <SelectItem value="organic-blend">Organic Coffee Blend</SelectItem>
                    <SelectItem value="instant-coffee">Instant Coffee</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="quantity">Quantity (tons)</Label>
                <Input id="quantity" name="quantity" type="number" step="0.1" value={formData.quantity} onChange={handleInputChange} required />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="customerName">Customer Name</Label>
                <Input id="customerName" name="customerName" value={formData.customerName} onChange={handleInputChange} required />
              </div>
              <div>
                <Label htmlFor="customerType">Customer Type</Label>
                <Select name="customerType" onValueChange={(value) => handleInputChange({ target: { name: 'customerType', value } })} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select customer type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">New Customer</SelectItem>
                    <SelectItem value="existing">Existing Customer</SelectItem>
                    <SelectItem value="vip">VIP Customer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="destination">Destination</Label>
                <Input id="destination" name="destination" placeholder="City, Country" value={formData.destination} onChange={handleInputChange} required />
              </div>
              <div>
                <Label htmlFor="saleType">Sale Type</Label>
                <Select name="saleType" onValueChange={(value) => handleInputChange({ target: { name: 'saleType', value } })} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select sale type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="local">Local</SelectItem>
                    <SelectItem value="export">Export</SelectItem>
                    <SelectItem value="contract">Contract Sale</SelectItem>
                    <SelectItem value="spot">Spot Sale</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="priority">Priority</Label>
                <Select name="priority" onValueChange={(value) => handleInputChange({ target: { name: 'priority', value } })} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="expectedDelivery">Expected Delivery</Label>
                <Input id="expectedDelivery" name="expectedDelivery" type="date" value={formData.expectedDelivery} onChange={handleInputChange} required />
              </div>
            </div>
            
            <Button type="submit" className="w-full">Create Sales Order</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SalesExportManager;
