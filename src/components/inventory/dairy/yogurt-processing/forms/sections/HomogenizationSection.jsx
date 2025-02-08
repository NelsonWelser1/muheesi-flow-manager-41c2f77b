
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const HomogenizationSection = ({ register }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <Label htmlFor="homogenizer_id">Homogenizer ID</Label>
        <Input
          {...register('homogenizer_id', { required: true })}
          placeholder="Enter homogenizer ID"
        />
      </div>

      <div>
        <Label htmlFor="homogenization_duration">Homogenization Duration (minutes)</Label>
        <Input
          type="number"
          {...register('homogenization_duration', { 
            required: true, 
            min: 0,
            valueAsNumber: true
          })}
        />
      </div>
    </div>
  );
};

export default HomogenizationSection;
