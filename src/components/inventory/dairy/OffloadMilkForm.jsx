import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const OffloadMilkForm = () => {
  return (
    <form className="space-y-6 max-w-[800px] mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2 border-b pb-4 md:border-b-0 md:border-r md:pr-4">
          <Label htmlFor="destination">Destination</Label>
          <Select>
            <SelectTrigger className="w-full focus:ring-2 focus:ring-blue-200 border-gray-200">
              <SelectValue placeholder="Select destination" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="processing">Processing Plant</SelectItem>
              <SelectItem value="storage">Storage Facility</SelectItem>
              <SelectItem value="distribution">Distribution Center</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="quantity">Quantity (Liters)</Label>
          <Input 
            id="quantity" 
            type="number" 
            placeholder="Enter quantity"
            className="focus:ring-2 focus:ring-blue-200 border-gray-200"
          />
        </div>

        <div className="space-y-2 border-t pt-4 md:border-t-0 md:pt-0">
          <Label htmlFor="tanker">Tanker Number</Label>
          <Input 
            id="tanker" 
            placeholder="Enter tanker number"
            className="focus:ring-2 focus:ring-blue-200 border-gray-200"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="driver">Driver Name</Label>
          <Input 
            id="driver" 
            placeholder="Enter driver name"
            className="focus:ring-2 focus:ring-blue-200 border-gray-200"
          />
        </div>
      </div>

      <div className="border-t pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2 border-b pb-4 md:border-b-0 md:border-r md:pr-4">
            <Label htmlFor="cleaningStatus">Tanker Cleaning Status</Label>
            <Select>
              <SelectTrigger className="w-full focus:ring-2 focus:ring-blue-200 border-gray-200">
                <SelectValue placeholder="Select cleaning status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cleaned">Cleaned</SelectItem>
                <SelectItem value="pending">Pending Cleaning</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="temperature">Temperature at Dispatch (°C)</Label>
            <Input 
              id="temperature" 
              type="number" 
              step="0.1"
              placeholder="Enter temperature"
              className="focus:ring-2 focus:ring-blue-200 border-gray-200"
            />
          </div>
        </div>
      </div>

      <div className="border-t pt-6">
        <div className="space-y-2">
          <Label htmlFor="notes">Additional Notes</Label>
          <Input 
            id="notes" 
            placeholder="Enter any additional notes"
            className="focus:ring-2 focus:ring-blue-200 border-gray-200"
          />
        </div>
      </div>

      <div className="flex justify-end pt-4 border-t">
        <Button type="submit" className="w-full md:w-auto">
          Record Milk Dispatch
        </Button>
      </div>
    </form>
  );
};

export default OffloadMilkForm;