
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const CompanyDetails = ({ formData, handleInputChange }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Company Details</h3>
      <div className="space-y-2">
        <Label>Company Name</Label>
        <Input
          name="companyName"
          value={formData.companyName}
          onChange={handleInputChange}
          placeholder="Enter company name"
        />
      </div>
      <div className="space-y-2">
        <Label>Address</Label>
        <Input
          name="address"
          value={formData.address}
          onChange={handleInputChange}
          placeholder="Enter address"
        />
      </div>
      <div className="space-y-2">
        <Label>Country</Label>
        <Input
          name="country"
          value={formData.country}
          onChange={handleInputChange}
          placeholder="Enter country"
        />
      </div>
      <div className="space-y-2">
        <Label>Phone</Label>
        <Input
          name="phone"
          value={formData.phone}
          onChange={handleInputChange}
          placeholder="Enter phone number"
        />
      </div>
      <div className="space-y-2">
        <Label>Contact Person</Label>
        <Input
          name="contactPerson"
          value={formData.contactPerson}
          onChange={handleInputChange}
          placeholder="Enter contact person"
        />
      </div>
      <div className="space-y-2">
        <Label>Tax ID</Label>
        <Input
          name="taxId"
          value={formData.taxId}
          onChange={handleInputChange}
          placeholder="Enter tax ID"
        />
      </div>
    </div>
  );
};

export default CompanyDetails;
