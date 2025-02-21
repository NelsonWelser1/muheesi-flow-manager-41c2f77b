
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const ParameterInputGroup = ({ parameter, formData, onChange }) => {
  return (
    <div className="border p-4 rounded-lg space-y-4">
      <h3 className="font-medium text-lg">{parameter.name}</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor={parameter.actualKey}>
            Actual Value
          </Label>
          <Input
            id={parameter.actualKey}
            type="number"
            step="0.01"
            value={formData[parameter.actualKey]}
            onChange={(e) => onChange(parameter.actualKey, e.target.value)}
            placeholder="Enter measured value"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor={parameter.standardKey}>
            Standard Value
          </Label>
          <Input
            id={parameter.standardKey}
            type="number"
            step="0.01"
            value={formData[parameter.standardKey]}
            onChange={(e) => onChange(parameter.standardKey, e.target.value)}
            placeholder="Enter standard value"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor={parameter.statusKey}>
            Status
          </Label>
          <Select 
            value={formData[parameter.statusKey]} 
            onValueChange={(value) => onChange(parameter.statusKey, value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Passed">Passed</SelectItem>
              <SelectItem value="Failed">Failed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default ParameterInputGroup;
