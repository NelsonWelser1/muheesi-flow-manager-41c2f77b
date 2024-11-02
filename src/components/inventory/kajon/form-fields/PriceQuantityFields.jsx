import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const PriceQuantityFields = () => {
  return (
    <>
      <div>
        <Label htmlFor="buyingPrice">Buying Price</Label>
        <div className="flex gap-2">
          <Input 
            id="buyingPrice" 
            type="number" 
            min="0" 
            required 
            className="flex-1 text-lg font-medium" 
          />
          <Select defaultValue="UGX" className="w-[120px]">
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
      <div>
        <Label>Quantity with Unit</Label>
        <div className="flex gap-2">
          <Input 
            id="quantity" 
            type="number" 
            min="0" 
            required 
            className="flex-1 text-lg font-medium" 
          />
          <Select id="unit" required className="w-[120px]">
            <SelectTrigger>
              <SelectValue placeholder="Unit" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="kgs">Kgs</SelectItem>
              <SelectItem value="tons">Tons</SelectItem>
              <SelectItem value="bags">Bags</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </>
  );
};

export default PriceQuantityFields;