
import React from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { TankSelector } from './TankSelector';
import { QualityGradeSelector } from './QualityGradeSelector';
import { MilkOffloadFormFields } from './MilkOffloadFormFields';

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
        
        <QualityGradeSelector 
          value={formData.quality_check}
          onValueChange={onQualityChange}
        />

        <MilkOffloadFormFields 
          formData={formData}
          handleInputChange={handleInputChange}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          name="notes"
          value={formData.notes}
          onChange={handleInputChange}
          className="min-h-[100px]"
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
