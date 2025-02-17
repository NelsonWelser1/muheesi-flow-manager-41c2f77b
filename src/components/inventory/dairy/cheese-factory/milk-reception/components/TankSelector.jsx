
import React from 'react';
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const TankSelector = ({ value, onValueChange }) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="storage_tank">Storage Tank</Label>
      <Select 
        value={value} 
        onValueChange={onValueChange}
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
  );
};
