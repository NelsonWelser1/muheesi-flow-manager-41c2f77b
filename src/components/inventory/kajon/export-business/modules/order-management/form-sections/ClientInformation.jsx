import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const ClientInformation = () => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold bg-[#fff3e0] px-4 py-2">CLIENT INFORMATION</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Name</Label>
            <Input placeholder="Client name" />
          </div>
          <div className="space-y-2">
            <Label>Address</Label>
            <Input placeholder="Client address" />
          </div>
        </div>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Email</Label>
            <Input type="email" placeholder="client@example.com" />
          </div>
          <div className="space-y-2">
            <Label>Phone</Label>
            <Input placeholder="Phone number" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientInformation;