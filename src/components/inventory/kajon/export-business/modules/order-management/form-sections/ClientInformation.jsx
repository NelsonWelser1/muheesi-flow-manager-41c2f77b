
import React from 'react';
import { Input } from "@/components/ui/input";

const ClientInformation = () => {
  return (
    <div className="space-y-4">
      <Input 
        className="text-xl font-bold bg-[#fff3e0] px-4 py-2"
        defaultValue="CLIENT INFORMATION" 
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Input 
              className="font-medium w-auto" 
              defaultValue="Name"
            />
            <Input placeholder="Client name" />
          </div>
          <div className="space-y-2">
            <Input 
              className="font-medium w-auto" 
              defaultValue="Address"
            />
            <Input placeholder="Client address" />
          </div>
        </div>
        <div className="space-y-4">
          <div className="space-y-2">
            <Input 
              className="font-medium w-auto" 
              defaultValue="Email"
            />
            <Input type="email" placeholder="client@example.com" />
          </div>
          <div className="space-y-2">
            <Input 
              className="font-medium w-auto" 
              defaultValue="Phone"
            />
            <Input placeholder="Phone number" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientInformation;
