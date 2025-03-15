
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const TotalAmountSection = ({ totalAmount }) => {
  return (
    <div className="space-y-2">
      <Label>Total Amount (Auto-calculated)</Label>
      <Input 
        readOnly 
        className="bg-gray-50 font-bold" 
        value={`UGX ${totalAmount.toLocaleString()}`} 
      />
    </div>
  );
};

export default TotalAmountSection;
