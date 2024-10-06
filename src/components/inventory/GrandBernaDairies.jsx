import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const GrandBernaDairies = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Factory Operations</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="factory-name">Factory Name</Label>
              <Input id="factory-name" placeholder="Enter factory name" />
            </div>
            <div>
              <Label htmlFor="manager">Manager</Label>
              <Input id="manager" placeholder="Enter manager name" />
            </div>
          </div>
          <div>
            <Label htmlFor="production-line">Production Line Number</Label>
            <Input id="production-line" type="number" placeholder="Enter production line number" />
          </div>
          <div>
            <Label htmlFor="product-type">Product Type</Label>
            <Select>
              <SelectTrigger id="product-type">
                <SelectValue placeholder="Select product type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cheese">Cheese</SelectItem>
                <SelectItem value="yogurt">Yogurt</SelectItem>
                <SelectItem value="processed-milk">Processed Milk</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="varieties">Varieties</Label>
            <Input id="varieties" placeholder="Enter product varieties" />
          </div>
          <div>
            <Label htmlFor="quantity">Quantity</Label>
            <Input id="quantity" type="number" placeholder="Enter quantity" />
          </div>
          <div>
            <Label htmlFor="quality-control">Quality Control</Label>
            <Input id="quality-control" placeholder="Enter quality control measures" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Cold Room Management</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="cold-room-name">Cold Room Name</Label>
            <Input id="cold-room-name" placeholder="Enter cold room name" />
          </div>
          <div>
            <Label htmlFor="temperature">Daily Temperature</Label>
            <Input id="temperature" type="number" placeholder="Enter temperature in °C" />
          </div>
          <div>
            <Label htmlFor="received-product-quality">Received Product Quality</Label>
            <Input id="received-product-quality" placeholder="Enter product quality" />
          </div>
          <div>
            <Label htmlFor="received-product-quantity">Received Product Quantity</Label>
            <Input id="received-product-quantity" type="number" placeholder="Enter quantity" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Sales and Accounts</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="daily-production">Daily Production</Label>
            <Input id="daily-production" type="number" placeholder="Enter daily production figures" />
          </div>
          <div>
            <Label htmlFor="costs">Costs</Label>
            <Input id="costs" type="number" placeholder="Enter production costs" />
          </div>
          <div>
            <Label htmlFor="revenue">Revenue</Label>
            <Input id="revenue" type="number" placeholder="Enter revenue" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GrandBernaDairies;