
import React from 'react';
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const QualityGradeSelector = ({ value, onValueChange }) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="quality_check">Quality Grade</Label>
      <Select 
        value={value} 
        onValueChange={onValueChange}
        name="quality_check"
      >
        <SelectTrigger id="quality_check">
          <SelectValue placeholder="Select quality grade" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Grade A">Grade A</SelectItem>
          <SelectItem value="Grade B">Grade B</SelectItem>
          <SelectItem value="Grade C">Grade C</SelectItem>
          <SelectItem value="Rejected">Rejected</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
