
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const ParameterInputGroup = ({ parameter, register }) => {
  const parameterKey = parameter.name.toLowerCase().replace(/ /g, '_');

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
            {...register(parameter.actualKey, { required: true })}
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
            {...register(parameter.standardKey, { required: true })}
            placeholder="Enter standard value"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor={parameter.statusKey}>
            Status
          </Label>
          <Input
            type="hidden"
            {...register(parameter.statusKey)}
            defaultValue="failed"
          />
          <Select 
            defaultValue="failed"
            onValueChange={(value) => {
              const event = { target: { name: parameter.statusKey, value } };
              register(parameter.statusKey).onChange(event);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pass">Pass</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default ParameterInputGroup;
