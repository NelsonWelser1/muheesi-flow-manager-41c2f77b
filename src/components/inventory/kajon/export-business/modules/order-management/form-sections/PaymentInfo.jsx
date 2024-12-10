import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const PaymentInfo = () => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold bg-[#fff3e0] px-4 py-2">PAYMENT INFO</h2>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Label>Subtotal:</Label>
          <Input className="w-32" readOnly value="$0.00" />
        </div>
        <div className="flex justify-between items-center">
          <Label>Taxes (%):</Label>
          <Input type="number" className="w-32" placeholder="0" />
        </div>
        <div className="flex justify-between items-center">
          <Label>Shipping:</Label>
          <Input type="number" className="w-32" placeholder="0.00" />
        </div>
        <div className="flex justify-between items-center">
          <Label>Discount (%):</Label>
          <Input type="number" className="w-32" placeholder="0" />
        </div>
        <div className="flex justify-between items-center font-bold">
          <Label>TOTAL:</Label>
          <Input className="w-32" readOnly value="$0.00" />
        </div>
      </div>
    </div>
  );
};

export default PaymentInfo;