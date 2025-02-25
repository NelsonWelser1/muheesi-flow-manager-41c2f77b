
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const ProcessedMilkForm = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    // Add form submission logic here
    console.log('Processed milk form submitted');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Processed Milk Entry</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Batch Number</Label>
              <Input placeholder="Enter batch number" />
            </div>
            
            <div className="space-y-2">
              <Label>Processing Type</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pasteurized">Pasteurized</SelectItem>
                  <SelectItem value="uht">UHT</SelectItem>
                  <SelectItem value="homogenized">Homogenized</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Raw Milk Quantity (Liters)</Label>
              <Input type="number" placeholder="Enter quantity" />
            </div>

            <div className="space-y-2">
              <Label>Processing Temperature (°C)</Label>
              <Input type="number" placeholder="Enter temperature" />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Quality Notes</Label>
            <Input placeholder="Enter quality notes" />
          </div>

          <Button type="submit" className="w-full">Record Production</Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ProcessedMilkForm;
