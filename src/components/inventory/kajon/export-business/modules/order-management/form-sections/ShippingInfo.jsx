import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const ShippingInfo = () => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold bg-[#fff3e0] px-4 py-2">SHIPPING INFO</h2>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Method</Label>
          <Input placeholder="Shipping method" />
        </div>
        <div className="space-y-2">
          <Label>Company</Label>
          <Input placeholder="Shipping company" />
        </div>
        <div className="space-y-2">
          <Label>Track #</Label>
          <Input placeholder="Tracking number" />
        </div>
        <div className="space-y-2">
          <Label>Arrival Date</Label>
          <Input type="date" />
        </div>
      </div>
    </div>
  );
};

export default ShippingInfo;