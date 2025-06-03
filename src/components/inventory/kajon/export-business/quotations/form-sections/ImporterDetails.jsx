
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const ImporterDetails = ({ formData, handleInputChange }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Importer Details</h3>
      <div className="space-y-2">
        <Label>Importer Name</Label>
        <Input
          name="importerName"
          value={formData.importerName}
          onChange={handleInputChange}
          placeholder="Enter importer name"
        />
      </div>
      <div className="space-y-2">
        <Label>Address</Label>
        <Input
          name="importerAddress"
          value={formData.importerAddress}
          onChange={handleInputChange}
          placeholder="Enter importer address"
        />
      </div>
      <div className="space-y-2">
        <Label>Location</Label>
        <Input
          name="importerLocation"
          value={formData.importerLocation}
          onChange={handleInputChange}
          placeholder="Enter location"
        />
      </div>
      <div className="space-y-2">
        <Label>Phone</Label>
        <Input
          name="importerPhone"
          value={formData.importerPhone}
          onChange={handleInputChange}
          placeholder="Enter phone number"
        />
      </div>
      <div className="space-y-2">
        <Label>Contact Person</Label>
        <Input
          name="importerContact"
          value={formData.importerContact}
          onChange={handleInputChange}
          placeholder="Enter contact person"
        />
      </div>
    </div>
  );
};

export default ImporterDetails;
