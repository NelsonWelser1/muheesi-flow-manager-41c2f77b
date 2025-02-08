
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const MilkDetailsSection = ({ register, errors }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <Label htmlFor="milk_volume">Milk Volume (Liters)</Label>
        <Input
          type="number"
          step="0.01"
          {...register('milk_volume', { 
            required: true, 
            min: 0,
            valueAsNumber: true 
          })}
        />
      </div>

      <div>
        <Label htmlFor="pre_standardization_fat">Pre-standardization Fat %</Label>
        <Input
          type="number"
          step="0.01"
          {...register('pre_standardization_fat', { 
            required: true, 
            min: 0,
            max: 99.99,
            valueAsNumber: true
          })}
        />
        {errors.pre_standardization_fat && (
          <span className="text-sm text-red-500">Fat % must be between 0 and 99.99</span>
        )}
      </div>

      <div>
        <Label htmlFor="target_fat">Target Fat %</Label>
        <Input
          type="number"
          step="0.01"
          {...register('target_fat', { 
            required: true, 
            min: 0,
            max: 99.99,
            valueAsNumber: true
          })}
        />
        {errors.target_fat && (
          <span className="text-sm text-red-500">Fat % must be between 0 and 99.99</span>
        )}
      </div>
    </div>
  );
};

export default MilkDetailsSection;
