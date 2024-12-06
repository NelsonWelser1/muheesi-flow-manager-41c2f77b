import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const ImporterDetails = ({ formData, handleInputChange }) => {
  return (
    <div className="space-y-4">
      <div className="uppercase font-bold text-sm mb-2">IMPORTER</div>
      <div className="space-y-2">
        <Label>Company Name</Label>
        <Input
          name="importerName"
          value={formData.importerName}
          onChange={handleInputChange}
          placeholder="IMPORT GOODS XYZ"
        />
      </div>
      <div className="space-y-2">
        <Label>Address</Label>
        <Input
          name="importerAddress"
          value={formData.importerAddress}
          onChange={handleInputChange}
          placeholder="Nieuweweg 7, 3765 GA"
        />
      </div>
      <div className="space-y-2">
        <Label>Location</Label>
        <Input
          name="importerLocation"
          value={formData.importerLocation}
          onChange={handleInputChange}
          placeholder="Utrecht, Netherlands"
        />
      </div>
      <div className="space-y-2">
        <Label>Phone</Label>
        <Input
          name="importerPhone"
          value={formData.importerPhone}
          onChange={handleInputChange}
          placeholder="(+31) 52420253"
        />
      </div>
      <div className="space-y-2">
        <Label>Contact Person</Label>
        <Input
          name="importerContact"
          value={formData.importerContact}
          onChange={handleInputChange}
          placeholder="Sarah Jansen"
        />
      </div>
    </div>
  );
};

export default ImporterDetails;