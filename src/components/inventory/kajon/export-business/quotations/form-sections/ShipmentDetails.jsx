import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const ShipmentDetails = ({ formData, handleInputChange }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <Label>Method of dispatch</Label>
          <Select
            name="dispatchMethod"
            value={formData.dispatchMethod}
            onValueChange={(value) => handleInputChange({ target: { name: 'dispatchMethod', value } })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select method" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sea">Sea</SelectItem>
              <SelectItem value="air">Air</SelectItem>
              <SelectItem value="road">Road</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Type of shipment</Label>
          <Select
            name="shipmentType"
            value={formData.shipmentType}
            onValueChange={(value) => handleInputChange({ target: { name: 'shipmentType', value } })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="FCL">FCL</SelectItem>
              <SelectItem value="LCL">LCL</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Country of origin</Label>
          <Input
            name="originCountry"
            value={formData.originCountry}
            onChange={handleInputChange}
            placeholder="Uganda"
          />
        </div>
        <div>
          <Label>Country of destination</Label>
          <Input
            name="destinationCountry"
            value={formData.destinationCountry}
            onChange={handleInputChange}
            placeholder="The Netherlands"
          />
        </div>
      </div>
    </div>
  );
};

export default ShipmentDetails;