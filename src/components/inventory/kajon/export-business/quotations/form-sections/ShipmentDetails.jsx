
import React from 'react';
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const ShipmentDetails = ({ formData, handleInputChange }) => {
  const handleSelectChange = (name, value) => {
    handleInputChange({ target: { name, value } });
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Shipment Details</h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Dispatch Method</Label>
          <Select value={formData.dispatchMethod} onValueChange={(value) => handleSelectChange('dispatchMethod', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select dispatch method" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sea">Sea</SelectItem>
              <SelectItem value="air">Air</SelectItem>
              <SelectItem value="land">Land</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Shipment Type</Label>
          <Select value={formData.shipmentType} onValueChange={(value) => handleSelectChange('shipmentType', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select shipment type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="FCL">FCL</SelectItem>
              <SelectItem value="LCL">LCL</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Origin Country</Label>
          <Select value={formData.originCountry} onValueChange={(value) => handleSelectChange('originCountry', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select origin country" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Uganda">Uganda</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Destination Country</Label>
          <Select value={formData.destinationCountry} onValueChange={(value) => handleSelectChange('destinationCountry', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select destination country" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="The Netherlands">The Netherlands</SelectItem>
              <SelectItem value="Germany">Germany</SelectItem>
              <SelectItem value="Belgium">Belgium</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default ShipmentDetails;
