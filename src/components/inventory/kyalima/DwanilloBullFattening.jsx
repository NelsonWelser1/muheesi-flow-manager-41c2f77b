import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const DwanilloBullFattening = () => {
  const [currentStock, setCurrentStock] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setCurrentStock({
      location: e.target.location.value,
      productType: e.target.productType.value,
      quantity: e.target.quantity.value,
      unit: e.target.unit.value,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Dwanillo Bull Fattening & Milk Cows Stock Update</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="location">Stock Location</Label>
            <Input id="location" placeholder="Enter farm/storage location" required />
          </div>
          <div>
            <Label htmlFor="productType">Product Type</Label>
            <Select id="productType" required>
              <SelectTrigger>
                <SelectValue placeholder="Select product type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bulls">Bulls</SelectItem>
                <SelectItem value="milk">Milk</SelectItem>
                <SelectItem value="feed">Feed</SelectItem>
              </SelectContent>
            </Select>
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
                <SelectItem value="head">Head (for bulls)</SelectItem>
                <SelectItem value="liters">Liters (for milk)</SelectItem>
                <SelectItem value="kg">Kilograms (for feed)</SelectItem>
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
            <Select id="source" required>
              <SelectTrigger>
                <SelectValue placeholder="Select source/destination" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="farm">Farm</SelectItem>
                <SelectItem value="supplier">Supplier</SelectItem>
                <SelectItem value="customer">Customer</SelectItem>
                <SelectItem value="storage">Storage</SelectItem>
              </SelectContent>
            </Select>
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
      {currentStock && (
        <CardContent>
          <h3 className="font-bold mb-2">Current Stock Summary</h3>
          <p>Location: {currentStock.location}</p>
          <p>Product Type: {currentStock.productType}</p>
          <p>Quantity: {currentStock.quantity} {currentStock.unit}</p>
        </CardContent>
      )}
    </Card>
  );
};

export default DwanilloBullFattening;