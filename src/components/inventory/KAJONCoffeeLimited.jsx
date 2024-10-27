import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import KazoCoffeeProject from './kajon/KazoCoffeeProject';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const KAJONCoffeeLimited = () => {
  const [currentStock, setCurrentStock] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setCurrentStock({
      location: e.target.location.value,
      coffeeType: e.target.coffeeType.value,
      quantity: e.target.quantity.value,
      unit: e.target.unit.value,
    });
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="stock" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="stock">Stock Management</TabsTrigger>
          <TabsTrigger value="kazo-project">Kazo Coffee Project</TabsTrigger>
        </TabsList>

        <TabsContent value="stock">
          <Card>
            <CardHeader>
              <CardTitle>KAJON Coffee Limited Stock Update</CardTitle>
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
                  <Label htmlFor="coffeeType">Coffee Type</Label>
                  <Select id="coffeeType" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select coffee type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="robusta-faq">Robusta Coffee: FAQ (Fair Average Quality)</SelectItem>
                      <SelectItem value="robusta-screen18">Robusta Coffee: Screen 18</SelectItem>
                      <SelectItem value="robusta-screen15">Robusta Coffee: Screen 15</SelectItem>
                      <SelectItem value="robusta-screen12">Robusta Coffee: Screen 12</SelectItem>
                      <SelectItem value="robusta-organic">Robusta Coffee: Organic Robusta</SelectItem>
                      <SelectItem value="arabica-bugisuaa">Arabica Coffee: Bugisu AA</SelectItem>
                      <SelectItem value="arabica-bugisua">Arabica Coffee: Bugisu A</SelectItem>
                      <SelectItem value="arabica-bugisupb">Arabica Coffee: Bugisu PB</SelectItem>
                      <SelectItem value="arabica-bugisub">Arabica Coffee: Bugisu B</SelectItem>
                      <SelectItem value="arabica-drugar">Arabica Coffee: DRUGAR (Dried Uganda Arabica)</SelectItem>
                      <SelectItem value="arabica-parchment">Arabica Coffee: Parchment Arabica</SelectItem>
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
                      <SelectItem value="kg">Kilograms (Kg)</SelectItem>
                      <SelectItem value="bag50">Bags of 50kg</SelectItem>
                      <SelectItem value="bag10">Bags of 10kg</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit">Submit</Button>
              </form>

              {currentStock && (
                <Card>
                  <CardHeader>
                    <CardTitle>Current Stock Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>Location: {currentStock.location}</p>
                    <p>Coffee Type: {currentStock.coffeeType}</p>
                    <p>Quantity: {currentStock.quantity} {currentStock.unit}</p>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="kazo-project">
          <KazoCoffeeProject />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default KAJONCoffeeLimited;
