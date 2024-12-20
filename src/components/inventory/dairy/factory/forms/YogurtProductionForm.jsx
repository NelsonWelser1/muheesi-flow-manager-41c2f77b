import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const YogurtProductionForm = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    // Add form submission logic here
    console.log('Yogurt production form submitted');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Yogurt Production Entry</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Batch Number</Label>
              <Input placeholder="Enter batch number" />
            </div>
            
            <div className="space-y-2">
              <Label>Yogurt Type</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="plain">Plain</SelectItem>
                  <SelectItem value="flavored">Flavored</SelectItem>
                  <SelectItem value="greek">Greek Style</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Milk Quantity (Liters)</Label>
              <Input type="number" placeholder="Enter quantity" />
            </div>

            <div className="space-y-2">
              <Label>Fermentation Time (Hours)</Label>
              <Input type="number" placeholder="Enter hours" />
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

export default YogurtProductionForm;