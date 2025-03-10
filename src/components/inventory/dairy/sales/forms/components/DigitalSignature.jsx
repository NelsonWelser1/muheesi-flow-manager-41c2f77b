
import React from 'react';
import { Label } from "@/components/ui/label";

const DigitalSignature = () => {
  return (
    <div className="space-y-2 border p-4 rounded-lg">
      <Label>Digital Signature</Label>
      <div className="h-20 border border-dashed border-gray-300 flex items-center justify-center bg-gray-50">
        <p className="text-gray-400">Signature capture field will appear here</p>
      </div>
    </div>
  );
};

export default DigitalSignature;
