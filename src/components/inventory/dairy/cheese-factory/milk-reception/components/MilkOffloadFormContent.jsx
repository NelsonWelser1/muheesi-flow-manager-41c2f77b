
import React from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { TankSelector } from './TankSelector';
import { QualityGradeSelector } from './QualityGradeSelector';

export const MilkOffloadFormContent = ({
  formData,
  loading,
  handleTankSelection,
  handleInputChange,
  handleSubmit,
  onQualityChange
}) => {
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <TankSelector 
          value={formData.storage_tank} 
          onValueChange={handleTankSelection} 
        />
        
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
            placeholder="Available volume will be suggested"
          />
        </div>

        <QualityGradeSelector 
          value={formData.quality_check}
          onValueChange={onQualityChange}
        />

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
            placeholder="Last recorded temperature"
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
            placeholder="Last recorded fat percentage"
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
            placeholder="Last recorded protein percentage"
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
            placeholder="Last recorded plate count"
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
            placeholder="Last recorded pH level"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="destination">Destination</Label>
          <Input
            id="destination"
            name="destination"
            value={formData.destination}
            onChange={handleInputChange}
            required
            placeholder="Processing destination"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          name="notes"
          value={formData.notes}
          onChange={handleInputChange}
          className="min-h-[100px]"
          placeholder="Add any additional notes here..."
        />
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? (
          <div className="flex items-center gap-2">
            <span className="animate-spin">◌</span>
            Recording Offload...
          </div>
        ) : (
          "Submit Offload Record"
        )}
      </Button>
    </form>
  );
};
