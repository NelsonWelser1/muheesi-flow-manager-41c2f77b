import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const TransportDetails = ({ formData, handleInputChange }) => {
  return (
    <div className="space-y-4">
      <div className="uppercase font-bold text-sm mb-2">TRANSPORT COMPANY</div>
      <div className="space-y-2">
        <Label>Company Name</Label>
        <Input
          name="transportCompany"
          value={formData.transportCompany}
          onChange={handleInputChange}
          placeholder="TRANSPORT SECURE"
        />
      </div>
      <div className="space-y-2">
        <Label>Address</Label>
        <Input
          name="transportAddress"
          value={formData.transportAddress}
          onChange={handleInputChange}
          placeholder="400 Queens street"
        />
      </div>
      <div className="space-y-2">
        <Label>Location</Label>
        <Input
          name="transportLocation"
          value={formData.transportLocation}
          onChange={handleInputChange}
          placeholder="Brisbane, Queensland, 4823"
        />
      </div>
      <div className="space-y-2">
        <Label>Country</Label>
        <Input
          name="transportCountry"
          value={formData.transportCountry}
          onChange={handleInputChange}
          placeholder="Australia"
        />
      </div>
      <div className="space-y-2">
        <Label>Phone</Label>
        <Input
          name="transportPhone"
          value={formData.transportPhone}
          onChange={handleInputChange}
          placeholder="(+5130) 4322167"
        />
      </div>
      <div className="space-y-2">
        <Label>Contact Person</Label>
        <Input
          name="transportContact"
          value={formData.transportContact}
          onChange={handleInputChange}
          placeholder="Samuel Jones"
        />
      </div>
    </div>
  );
};

export default TransportDetails;