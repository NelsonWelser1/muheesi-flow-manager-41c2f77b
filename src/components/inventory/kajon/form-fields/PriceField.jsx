import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const PriceField = () => {
  return (
    <div>
      <Label htmlFor="buyingPrice">Buying Price</Label>
      <div className="flex gap-2">
        <Input 
          id="buyingPrice" 
          type="number" 
          min="0" 
          required 
          className="flex-1 text-2xl h-14 px-4" 
          placeholder="0.00"
        />
        <Select defaultValue="UGX" className="w-[100px]">
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="UGX">UGX</SelectItem>
            <SelectItem value="USD">USD</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default PriceField;