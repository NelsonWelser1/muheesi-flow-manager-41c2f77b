
import React from 'react';
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from 'date-fns';

export const TankSelector = ({ value, onValueChange }) => {
  const generateBatchId = (tankValue) => {
    const date = format(new Date(), 'yyyyMMdd');
    const time = format(new Date(), 'HHmmss');
    return `${date}-${tankValue}-${time}`;
  };

  const handleValueChange = (newValue) => {
    const batchId = generateBatchId(newValue);
    onValueChange(newValue, batchId);
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="storage_tank">Storage Tank</Label>
      <Select 
        value={value} 
        onValueChange={handleValueChange}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select tank" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Tank A">Tank A</SelectItem>
          <SelectItem value="Tank B">Tank B</SelectItem>
          <SelectItem value="Direct-Processing">Direct Processing</SelectItem>
        </SelectContent>
      </Select>
      {value && (
        <div className="text-sm text-muted-foreground mt-1">
          Batch ID: {generateBatchId(value)}
        </div>
      )}
    </div>
  );
};
