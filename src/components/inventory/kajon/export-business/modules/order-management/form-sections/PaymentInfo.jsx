
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const PaymentInfo = () => {
  return (
    <div className="space-y-4">
      <Input 
        className="text-xl font-bold bg-[#fff3e0] px-4 py-2"
        defaultValue="PAYMENT INFO" 
      />
      <div className="space-y-4">
        <div className="flex justify-between items-center gap-2">
          <Input className="font-medium w-auto" defaultValue="Subtotal:" />
          <Input className="w-32" readOnly value="$0.00" />
        </div>
        <div className="flex justify-between items-center gap-2">
          <Input className="font-medium w-auto" defaultValue="Taxes (%):" />
          <Input type="number" className="w-32" placeholder="0" />
        </div>
        <div className="flex justify-between items-center gap-2">
          <Input className="font-medium w-auto" defaultValue="Shipping:" />
          <Input type="number" className="w-32" placeholder="0.00" />
        </div>
        <div className="flex justify-between items-center gap-2">
          <Input className="font-medium w-auto" defaultValue="Discount (%):" />
          <Input type="number" className="w-32" placeholder="0" />
        </div>
        <div className="flex justify-between items-center font-bold gap-2">
          <Input className="font-bold w-auto" defaultValue="TOTAL:" />
          <Input className="w-32" readOnly value="$0.00" />
        </div>
      </div>
    </div>
  );
};

export default PaymentInfo;
