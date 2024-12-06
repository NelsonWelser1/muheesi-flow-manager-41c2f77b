import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const CompanyDetails = ({ formData, handleInputChange }) => {
  return (
    <div className="space-y-4">
      <div className="uppercase font-bold text-sm mb-2">EXPORTER</div>
      <div className="space-y-2">
        <Label>COMPANY NAME</Label>
        <Input
          name="companyName"
          value={formData.companyName}
          onChange={handleInputChange}
          placeholder="KAJON Coffee Limited"
        />
      </div>
      <div className="space-y-2">
        <Label>Address</Label>
        <Input
          name="address"
          value={formData.address}
          onChange={handleInputChange}
          placeholder="8339 Entebbe Town"
        />
      </div>
      <div className="space-y-2">
        <Label>Country</Label>
        <Input
          name="country"
          value={formData.country}
          onChange={handleInputChange}
          placeholder="Uganda"
        />
      </div>
      <div className="space-y-2">
        <Label>Phone</Label>
        <Input
          name="phone"
          value={formData.phone}
          onChange={handleInputChange}
          placeholder="(+774) 449035"
        />
      </div>
      <div className="space-y-2">
        <Label>Contact Person</Label>
        <Input
          name="contactPerson"
          value={formData.contactPerson}
          onChange={handleInputChange}
          placeholder="Freida Satterfield"
        />
      </div>
      <div className="space-y-2">
        <Label>Company Tax ID</Label>
        <Input
          name="taxId"
          value={formData.taxId}
          onChange={handleInputChange}
          placeholder="83271223"
        />
      </div>
    </div>
  );
};

export default CompanyDetails;