
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { TankSelector } from './TankSelector';
import { QualityGradeSelector } from './QualityGradeSelector';

export const MilkOffloadFormContent = ({ 
  formData, 
  loading, 
  handleTankSelection, 
  handleInputChange,
  onQualityChange,
  handleSubmit 
}) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="batch_id">Batch ID</Label>
          <Input
            id="batch_id"
            name="batch_id"
            value={formData.batch_id}
            readOnly
            className="bg-muted"
            placeholder="Auto-generated on tank selection"
            required
          />
        </div>

        <div className="space-y-2">
          <Label>Storage Tank</Label>
          <TankSelector 
            value={formData.storage_tank} 
            onValueChange={handleTankSelection}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="milk_volume">Volume (L)</Label>
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
        <Label>Quality Grade</Label>
        <QualityGradeSelector
          value={formData.quality_check}
          onChange={onQualityChange}
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
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          name="notes"
          value={formData.notes}
          onChange={handleInputChange}
          placeholder="Add any additional notes here..."
        />
      </div>

      <Button 
        type="submit" 
        className="w-full"
        disabled={loading}
      >
        {loading ? (
          <div className="flex items-center gap-2">
            <span className="animate-spin">◌</span>
            Recording Offload...
          </div>
        ) : (
          "Submit Offload Record"
        )}
      </Button>
    </div>
  );
};
