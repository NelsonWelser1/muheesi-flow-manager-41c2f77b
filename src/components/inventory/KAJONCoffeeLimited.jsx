import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const KAJONCoffeeLimited = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Coffee Management</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="coffee-type">Coffee Type</Label>
            <Select>
              <SelectTrigger id="coffee-type">
                <SelectValue placeholder="Select coffee type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="arabica">Arabica</SelectItem>
                <SelectItem value="robusta">Robusta</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="storage-details">Storage Details</Label>
            <Input id="storage-details" placeholder="Enter storage details" />
          </div>
          <div>
            <Label htmlFor="quality-check">Quality Check</Label>
            <Input id="quality-check" placeholder="Enter quality check results" />
          </div>
          <div>
            <Label htmlFor="moisture-levels">Moisture Levels</Label>
            <Input id="moisture-levels" type="number" placeholder="Enter moisture levels (%)" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Warehouse Operations (Kazo Coffee Store)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="product-storage">Product Storage Data</Label>
            <Input id="product-storage" placeholder="Enter product storage details" />
          </div>
          <div>
            <Label htmlFor="warehouse-quality-checks">Quality Checks</Label>
            <Input id="warehouse-quality-checks" placeholder="Enter quality check results" />
          </div>
          <div>
            <Label htmlFor="procurement-costs">Procurement Costs</Label>
            <Input id="procurement-costs" type="number" placeholder="Enter procurement costs" />
          </div>
          <div>
            <Label htmlFor="logistics-costs">Logistics Costs</Label>
            <Input id="logistics-costs" type="number" placeholder="Enter logistics costs" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Outbound Logistics</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="shipment-details">Product Shipment Details</Label>
            <Input id="shipment-details" placeholder="Enter shipment details" />
          </div>
          <div>
            <Label htmlFor="outbound-product-quality">Product Quality</Label>
            <Input id="outbound-product-quality" placeholder="Enter product quality" />
          </div>
          <div>
            <Label htmlFor="outbound-tracking">Outbound Shipment Tracking</Label>
            <Input id="outbound-tracking" placeholder="Enter tracking information" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default KAJONCoffeeLimited;