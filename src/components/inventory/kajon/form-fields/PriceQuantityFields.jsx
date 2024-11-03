import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const PriceQuantityFields = () => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="buyingPrice" className="text-base">Buying Price</Label>
        <div className="grid grid-cols-12 gap-3">
          <div className="col-span-9">
            <Input 
              id="buyingPrice" 
              type="number" 
              min="0" 
              required 
              className="w-full text-lg" 
              placeholder="Enter price"
            />
          </div>
          <div className="col-span-3">
            <Select defaultValue="UGX">
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="UGX">UGX</SelectItem>
                <SelectItem value="USD">USD</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-base">Quantity with Unit</Label>
        <div className="grid grid-cols-12 gap-3">
          <div className="col-span-9">
            <Input 
              id="quantity" 
              type="number" 
              min="0" 
              required 
              className="w-full text-lg"
              placeholder="Enter quantity"
            />
          </div>
          <div className="col-span-3">
            <Select id="unit" required>
              <SelectTrigger className="w-full">
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
      </div>
    </>
  );
};

export default PriceQuantityFields;