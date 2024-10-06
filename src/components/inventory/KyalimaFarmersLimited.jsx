import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const KyalimaFarmersLimited = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>TZ2UG Rice Imports</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="rice-product-quality">Product Quality Data</Label>
            <Input id="rice-product-quality" placeholder="Enter product quality data" />
          </div>
          <div>
            <Label htmlFor="rice-procurement-costs">Procurement Costs</Label>
            <Input id="rice-procurement-costs" type="number" placeholder="Enter procurement costs" />
          </div>
          <div>
            <Label htmlFor="rice-logistics">Logistics</Label>
            <Input id="rice-logistics" placeholder="Enter logistics details" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Coffee Farm (Kyiboga District)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="coffee-quality">Coffee Quality</Label>
            <Input id="coffee-quality" placeholder="Enter coffee quality data" />
          </div>
          <div>
            <Label htmlFor="coffee-logistics-expenses">Logistical Expenses</Label>
            <Input id="coffee-logistics-expenses" type="number" placeholder="Enter logistical expenses" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Bull Fattening</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="mothers">Number of Mothers</Label>
            <Input id="mothers" type="number" placeholder="Enter number of mothers" />
          </div>
          <div>
            <Label htmlFor="bulls">Number of Bulls</Label>
            <Input id="bulls" type="number" placeholder="Enter number of bulls" />
          </div>
          <div>
            <Label htmlFor="calves">Number of Calves</Label>
            <Input id="calves" type="number" placeholder="Enter number of calves" />
          </div>
          <div>
            <Label htmlFor="cattle-losses">Reasons for Cattle Losses</Label>
            <Textarea id="cattle-losses" placeholder="Enter reasons for cattle losses" />
          </div>
          <div>
            <Label htmlFor="common-diseases">Common Diseases</Label>
            <Textarea id="common-diseases" placeholder="Enter common diseases" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default KyalimaFarmersLimited;