import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const GrandBernaDairies = () => {
  const [currentStock, setCurrentStock] = useState(null);

  const handleSubmit = (e, locationType) => {
    e.preventDefault();
    setCurrentStock({
      locationType,
      product: e.target.product.value,
      quantity: e.target.quantity.value,
      unit: e.target.unit.value,
    });
  };

  const StockForm = ({ locationType }) => (
    <form onSubmit={(e) => handleSubmit(e, locationType)} className="space-y-4">
      <div>
        <Label htmlFor="product">Product Category</Label>
        <Input id="product" placeholder="Enter product category" required />
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
            <SelectItem value="l">Liters (L)</SelectItem>
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
      {locationType === 'dairyCoolers' && (
        <div>
          <Label htmlFor="source">Source</Label>
          <Select id="source" required>
            <SelectTrigger>
              <SelectValue placeholder="Select source" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="farm">Farm</SelectItem>
              <SelectItem value="supplier">Supplier</SelectItem>
              <SelectItem value="distributor">Distributor</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
      {locationType === 'factory' && (
        <div>
          <Label htmlFor="source">Source</Label>
          <Select id="source" required>
            <SelectTrigger>
              <SelectValue placeholder="Select source" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="coolers">Coolers</SelectItem>
              <SelectItem value="farm">Farm</SelectItem>
              <SelectItem value="supplier">Supplier</SelectItem>
              <SelectItem value="distributor">Distributor</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
      {locationType === 'coldRoom' && (
        <>
          <div>
            <Label htmlFor="source">Source</Label>
            <Select id="source" required>
              <SelectTrigger>
                <SelectValue placeholder="Select source" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="factory">Factory Only</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="destination">Destination</Label>
            <Select id="destination" required>
              <SelectTrigger>
                <SelectValue placeholder="Select destination" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="distributor">Distributor</SelectItem>
                <SelectItem value="client">Client</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="destinationDetails">Indicate Distributor/Client Details</Label>
            <Input id="destinationDetails" placeholder="Enter details" required />
          </div>
        </>
      )}
      <div>
        <Label htmlFor="entrant">Data Entrant Name</Label>
        <Input id="entrant" placeholder="Enter your name" required />
      </div>
      <div>
        <Label htmlFor="pin">PIN (Personal Identification Number)</Label>
        <Input id="pin" type="password" placeholder="Enter your PIN" required />
      </div>
      <Button type="submit">Submit</Button>
    </form>
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Grand Berna Dairies Stock Update</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="dairyCoolers">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="dairyCoolers">Dairy Coolers</TabsTrigger>
              <TabsTrigger value="factory">Factory</TabsTrigger>
              <TabsTrigger value="coldRoom">Cold Room</TabsTrigger>
            </TabsList>
            <TabsContent value="dairyCoolers">
              <StockForm locationType="dairyCoolers" />
            </TabsContent>
            <TabsContent value="factory">
              <StockForm locationType="factory" />
            </TabsContent>
            <TabsContent value="coldRoom">
              <StockForm locationType="coldRoom" />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {currentStock && (
        <Card>
          <CardHeader>
            <CardTitle>Current Stock Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Location Type: {currentStock.locationType}</p>
            <p>Product: {currentStock.product}</p>
            <p>Quantity: {currentStock.quantity} {currentStock.unit}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default GrandBernaDairies;