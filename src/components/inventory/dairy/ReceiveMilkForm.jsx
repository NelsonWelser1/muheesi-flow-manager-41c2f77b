import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";

const ReceiveMilkForm = () => {
  const { toast } = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted');
    toast({
      title: "Success",
      description: "Milk reception data has been recorded",
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-[800px] mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Date and Time */}
        <div className="space-y-2">
          <Label htmlFor="receptionDateTime">Date and Time of Reception</Label>
          <Input 
            id="receptionDateTime" 
            type="datetime-local"
            className="focus:ring-2 focus:ring-blue-200 border-gray-200"
            required
          />
        </div>

        {/* Supplier Information */}
        <div className="space-y-2">
          <Label htmlFor="supplier">Supplier Name/ID</Label>
          <Input 
            id="supplier" 
            type="text"
            placeholder="Enter supplier name or ID"
            className="focus:ring-2 focus:ring-blue-200 border-gray-200"
            required
          />
        </div>

        {/* Milk Volume */}
        <div className="space-y-2">
          <Label htmlFor="quantity">Milk Volume (Liters)</Label>
          <Input 
            id="quantity" 
            type="number" 
            step="0.1"
            placeholder="Enter volume"
            className="focus:ring-2 focus:ring-blue-200 border-gray-200"
            required
          />
        </div>

        {/* Temperature */}
        <div className="space-y-2">
          <Label htmlFor="temperature">Temperature at Reception (°C)</Label>
          <Input 
            id="temperature" 
            type="number" 
            step="0.1"
            placeholder="Enter temperature"
            className="focus:ring-2 focus:ring-blue-200 border-gray-200"
            required
          />
        </div>

        {/* Milk Type */}
        <div className="space-y-2">
          <Label htmlFor="milkType">Milk Type</Label>
          <Select required>
            <SelectTrigger className="w-full focus:ring-2 focus:ring-blue-200 border-gray-200">
              <SelectValue placeholder="Select milk type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cow">Cow Milk</SelectItem>
              <SelectItem value="goat">Goat Milk</SelectItem>
              <SelectItem value="sheep">Sheep Milk</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Batch ID */}
        <div className="space-y-2">
          <Label htmlFor="batchId">Batch ID</Label>
          <Input 
            id="batchId" 
            type="text"
            placeholder="Enter batch ID"
            className="focus:ring-2 focus:ring-blue-200 border-gray-200"
            required
          />
        </div>
      </div>

      {/* Quality Parameters Section */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold mb-4">Quality Parameters</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="fatPercentage">Fat Percentage (%)</Label>
            <Input 
              id="fatPercentage" 
              type="number" 
              step="0.01"
              placeholder="Enter fat %"
              className="focus:ring-2 focus:ring-blue-200 border-gray-200"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="proteinPercentage">Protein Percentage (%)</Label>
            <Input 
              id="proteinPercentage" 
              type="number" 
              step="0.01"
              placeholder="Enter protein %"
              className="focus:ring-2 focus:ring-blue-200 border-gray-200"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="totalPlateCount">Total Plate Count (CFU/ml)</Label>
            <Input 
              id="totalPlateCount" 
              type="number"
              placeholder="Enter TPC"
              className="focus:ring-2 focus:ring-blue-200 border-gray-200"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="acidity">Acidity (%)</Label>
            <Input 
              id="acidity" 
              type="number" 
              step="0.01"
              placeholder="Enter acidity"
              className="focus:ring-2 focus:ring-blue-200 border-gray-200"
              required
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
          Record Milk Receipt
        </Button>
      </div>
    </form>
  );
};

export default ReceiveMilkForm;