
import React from 'react';
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from 'date-fns';
import { Input } from "@/components/ui/input";

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

  const currentBatchId = value ? generateBatchId(value) : '';

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="batch_id">Batch ID</Label>
        <Input
          id="batch_id"
          name="batch_id"
          value={currentBatchId}
          readOnly
          className="bg-muted"
          placeholder="Auto-generated when tank is selected"
        />
      </div>

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
      </div>
    </div>
  );
};
