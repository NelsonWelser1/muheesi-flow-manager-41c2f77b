
import React from 'react';
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const CurrencySelector = ({ currency, setCurrency }) => {
  return (
    <div className="space-y-2">
      <Label>Currency</Label>
      <Select 
        value={currency}
        onValueChange={setCurrency}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select currency" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="USD">USD ($)</SelectItem>
          <SelectItem value="UGX">UGX (Shilling)</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default CurrencySelector;
