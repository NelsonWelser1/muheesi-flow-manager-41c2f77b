import React from 'react';
import { Input } from "@/components/ui/input";

const ShipToSection = () => {
  return (
    <div className="bg-blue-100 p-4 rounded">
      <h3 className="font-bold mb-2">SHIP TO</h3>
      <div className="space-y-2">
        <Input placeholder="Name" />
        <Input placeholder="Address Line 1" />
        <Input placeholder="City, State, ZIP" />
        <Input placeholder="Email" type="email" />
        <Input placeholder="Contact Number" type="tel" /> {/* Added contact field */}
      </div>
    </div>
  );
};

export default ShipToSection;