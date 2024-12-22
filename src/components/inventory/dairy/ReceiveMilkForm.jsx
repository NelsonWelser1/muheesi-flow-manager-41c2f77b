import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const ReceiveMilkForm = () => {
  return (
    <form className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="source">Source Location</Label>
          <Select>
            <SelectTrigger className="w-full focus:ring-2 focus:ring-blue-200">
              <SelectValue placeholder="Select source location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="farm1">Farm Location 1</SelectItem>
              <SelectItem value="farm2">Farm Location 2</SelectItem>
              <SelectItem value="collection">Collection Center</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="quantity">Quantity (Liters)</Label>
          <Input 
            id="quantity" 
            type="number" 
            placeholder="Enter quantity"
            className="focus:ring-2 focus:ring-blue-200"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="temperature">Temperature (°C)</Label>
          <Input 
            id="temperature" 
            type="number" 
            step="0.1"
            placeholder="Enter temperature"
            className="focus:ring-2 focus:ring-blue-200"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="quality">Quality Grade</Label>
          <Select>
            <SelectTrigger className="w-full focus:ring-2 focus:ring-blue-200">
              <SelectValue placeholder="Select quality grade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="grade-a">Grade A</SelectItem>
              <SelectItem value="grade-b">Grade B</SelectItem>
              <SelectItem value="grade-c">Grade C</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="border-t pt-6">
        <div className="space-y-2">
          <Label htmlFor="notes">Additional Notes</Label>
          <Input 
            id="notes" 
            placeholder="Enter any additional notes"
            className="focus:ring-2 focus:ring-blue-200"
          />
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <Button type="submit" className="w-full md:w-auto">
          Record Milk Receipt
        </Button>
      </div>
    </form>
  );
};

export default ReceiveMilkForm;