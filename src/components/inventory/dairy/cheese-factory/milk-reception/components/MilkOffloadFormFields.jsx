
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const MilkOffloadFormFields = ({ formData, handleInputChange }) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="milk_volume">Milk Volume (L)</Label>
        <Input
          id="milk_volume"
          name="milk_volume"
          type="number"
          step="0.01"
          value={formData.milk_volume}
          onChange={handleInputChange}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="temperature">Temperature (°C)</Label>
        <Input
          id="temperature"
          name="temperature"
          type="number"
          step="0.1"
          value={formData.temperature}
          onChange={handleInputChange}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="fat_percentage">Fat Percentage (%)</Label>
        <Input
          id="fat_percentage"
          name="fat_percentage"
          type="number"
          step="0.01"
          value={formData.fat_percentage}
          onChange={handleInputChange}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="protein_percentage">Protein Percentage (%)</Label>
        <Input
          id="protein_percentage"
          name="protein_percentage"
          type="number"
          step="0.01"
          value={formData.protein_percentage}
          onChange={handleInputChange}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="total_plate_count">Total Plate Count</Label>
        <Input
          id="total_plate_count"
          name="total_plate_count"
          type="number"
          value={formData.total_plate_count}
          onChange={handleInputChange}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="acidity">Acidity (pH)</Label>
        <Input
          id="acidity"
          name="acidity"
          type="number"
          step="0.01"
          value={formData.acidity}
          onChange={handleInputChange}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="destination">Destination</Label>
        <Input
          id="destination"
          name="destination"
          value={formData.destination}
          onChange={handleInputChange}
        />
      </div>
    </>
  );
};
