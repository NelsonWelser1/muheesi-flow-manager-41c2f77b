
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

const CurrencyField = ({ setValue, register, errors }) => {
  return (
    <div className="space-y-2">
      <Label>Currency</Label>
      <Select 
        defaultValue="UGX"
        onValueChange={(value) => setValue("currency", value)}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select currency" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="UGX">UGX</SelectItem>
          <SelectItem value="USD">USD</SelectItem>
          <SelectItem value="EUR">EUR</SelectItem>
          <SelectItem value="GBP">GBP</SelectItem>
          <SelectItem value="JPY">JPY</SelectItem>
        </SelectContent>
      </Select>
      <Input 
        type="hidden" 
        {...register("currency", { required: "Currency is required" })} 
      />
      {errors?.currency && (
        <p className="text-sm text-red-500">{errors.currency.message}</p>
      )}
    </div>
  );
};

export default CurrencyField;
