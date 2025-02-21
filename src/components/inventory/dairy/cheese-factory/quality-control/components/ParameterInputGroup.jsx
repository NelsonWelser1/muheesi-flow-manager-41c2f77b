
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const ParameterInputGroup = ({ parameter, register }) => {
  const parameterKey = parameter.toLowerCase().replace(' ', '_');

  return (
    <div className="border p-4 rounded-lg space-y-4">
      <h3 className="font-medium text-lg">{parameter}</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor={`${parameterKey}_value`}>
            Actual Value
          </Label>
          <Input
            id={`${parameterKey}_value`}
            {...register(`${parameterKey}_value`, { required: true })}
            placeholder="Enter measured value"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor={`${parameterKey}_standard`}>
            Standard Value
          </Label>
          <Input
            id={`${parameterKey}_standard`}
            {...register(`${parameterKey}_standard`, { required: true })}
            placeholder="Enter standard value"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor={`${parameterKey}_status`}>
            Status
          </Label>
          <Select 
            onValueChange={(value) => {
              const event = { target: { value } };
              register(`${parameterKey}_status`).onChange(event);
            }}
            defaultValue=""
          >
            <SelectTrigger id={`${parameterKey}_status`}>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="passed">Passed</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
            </SelectContent>
          </Select>
          <Input
            type="hidden"
            {...register(`${parameterKey}_status`, { required: true })}
          />
        </div>
      </div>
    </div>
  );
};

export default ParameterInputGroup;
