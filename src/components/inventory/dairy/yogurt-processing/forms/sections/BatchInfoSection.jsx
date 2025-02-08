
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const BatchInfoSection = ({ register }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <Label htmlFor="date_time">Date & Time</Label>
        <Input
          type="datetime-local"
          {...register('date_time', { required: true })}
        />
      </div>

      <div>
        <Label htmlFor="batch_id">Batch ID</Label>
        <Input
          {...register('batch_id', { required: true })}
          placeholder="Enter batch ID"
        />
      </div>
    </div>
  );
};

export default BatchInfoSection;
