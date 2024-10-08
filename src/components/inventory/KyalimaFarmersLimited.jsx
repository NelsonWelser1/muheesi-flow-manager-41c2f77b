import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const KyalimaFarmersLimited = () => {
  const [currentStock, setCurrentStock] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the data to your backend
    // For now, we'll just set some dummy data
    setCurrentStock({
      location: e.target.location.value,
      product: e.target.product.value,
      quantity: e.target.quantity.value,
      unit: e.target.unit.value,
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Kyalima Farmers Limited Stock Update</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="manager">Store/Warehouse Manager</Label>
              <Input id="manager" placeholder="Enter manager name" required />
            </div>
            <div>
              <Label htmlFor="location">Stock Location</Label>
              <Input id="location" placeholder="Enter store/warehouse location" required />
            </div>
            <div>
              <Label htmlFor="product">Product Category</Label>
              <Select id="product" required>
                <SelectTrigger>
                  <SelectValue placeholder="Select product category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rice">Rice</SelectItem>
                  <SelectItem value="coffee">Coffee</SelectItem>
                  <SelectItem value="maize">Maize</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="type">Product Type</Label>
              <Input id="type" placeholder="Enter product type (e.g., Arabica, Robusta)" required />
            </div>
            <div>
              <Label htmlFor="quantity">Quantity</Label>
              <Input id="quantity" type="number" placeholder="Enter quantity" required />
            </div>
            <div>
              <Label htmlFor="unit">Unit of Measurement</Label>
              <Select id="unit" required>
                <SelectTrigger>
                  <SelectValue placeholder="Select unit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="kg">Kilograms (Kg)</SelectItem>
                  <SelectItem value="bag50">Bags of 50kg</SelectItem>
                  <SelectItem value="bag10">Bags of 10kg</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="flow">Stock Flow</Label>
              <Select id="flow" required>
                <SelectTrigger>
                  <SelectValue placeholder="Select stock flow" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="inflow">Inflow</SelectItem>
                  <SelectItem value="outflow">Outflow</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="source">Source/Destination</Label>
              <Input id="source" placeholder="Enter source (for inflow) or destination (for outflow)" required />
            </div>
            <div>
              <Label htmlFor="entrant">Data Entrant Name</Label>
              <Input id="entrant" placeholder="Enter your name" required />
            </div>
            <div>
              <Label htmlFor="passcode">Passcode</Label>
              <Input id="passcode" type="password" placeholder="Enter your passcode" required />
            </div>
            <Button type="submit">Submit</Button>
          </form>
        </CardContent>
      </Card>

      {currentStock && (
        <Card>
          <CardHeader>
            <CardTitle>Current Stock Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Location: {currentStock.location}</p>
            <p>Product: {currentStock.product}</p>
            <p>Quantity: {currentStock.quantity} {currentStock.unit}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default KyalimaFarmersLimited;