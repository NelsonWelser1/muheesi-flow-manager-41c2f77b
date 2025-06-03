
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const TransportDetails = ({ formData, handleInputChange }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Transport Details</h3>
      <div className="space-y-2">
        <Label>Transport Company</Label>
        <Input
          name="transportCompany"
          value={formData.transportCompany}
          onChange={handleInputChange}
          placeholder="Enter transport company"
        />
      </div>
      <div className="space-y-2">
        <Label>Address</Label>
        <Input
          name="transportAddress"
          value={formData.transportAddress}
          onChange={handleInputChange}
          placeholder="Enter transport address"
        />
      </div>
      <div className="space-y-2">
        <Label>Location</Label>
        <Input
          name="transportLocation"
          value={formData.transportLocation}
          onChange={handleInputChange}
          placeholder="Enter location"
        />
      </div>
      <div className="space-y-2">
        <Label>Country</Label>
        <Input
          name="transportCountry"
          value={formData.transportCountry}
          onChange={handleInputChange}
          placeholder="Enter country"
        />
      </div>
      <div className="space-y-2">
        <Label>Phone</Label>
        <Input
          name="transportPhone"
          value={formData.transportPhone}
          onChange={handleInputChange}
          placeholder="Enter phone number"
        />
      </div>
      <div className="space-y-2">
        <Label>Contact Person</Label>
        <Input
          name="transportContact"
          value={formData.transportContact}
          onChange={handleInputChange}
          placeholder="Enter contact person"
        />
      </div>
    </div>
  );
};

export default TransportDetails;
