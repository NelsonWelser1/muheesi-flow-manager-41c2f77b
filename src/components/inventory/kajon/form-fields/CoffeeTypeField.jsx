import React from 'react';
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const CoffeeTypeField = ({ selectedCoffeeType, setSelectedCoffeeType }) => {
  return (
    <div>
      <Label htmlFor="coffeeType">Coffee Type</Label>
      <Select 
        id="coffeeType" 
        required
        onValueChange={setSelectedCoffeeType}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select coffee type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="robusta">Robusta Coffee</SelectItem>
          <SelectItem value="arabica">Arabica Coffee</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default CoffeeTypeField;