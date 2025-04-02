
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const ShippingInfo = () => {
  return (
    <div className="space-y-4">
      <Input 
        className="text-xl font-bold bg-[#fff3e0] px-4 py-2"
        defaultValue="SHIPPING INFO" 
      />
      <div className="space-y-4">
        <div className="space-y-2">
          <Input 
            className="font-medium w-auto" 
            defaultValue="Method"
          />
          <Input placeholder="Shipping method" />
        </div>
        <div className="space-y-2">
          <Input 
            className="font-medium w-auto" 
            defaultValue="Company"
          />
          <Input placeholder="Shipping company" />
        </div>
        <div className="space-y-2">
          <Input 
            className="font-medium w-auto" 
            defaultValue="Track #"
          />
          <Input placeholder="Tracking number" />
        </div>
        <div className="space-y-2">
          <Input 
            className="font-medium w-auto" 
            defaultValue="Arrival Date"
          />
          <Input type="date" />
        </div>
        <div className="space-y-2">
          <Input 
            className="font-medium w-auto" 
            defaultValue="Additional Terms"
          />
          <Textarea 
            placeholder="Enter any additional shipping terms or instructions here..."
          />
        </div>
      </div>
    </div>
  );
};

export default ShippingInfo;
