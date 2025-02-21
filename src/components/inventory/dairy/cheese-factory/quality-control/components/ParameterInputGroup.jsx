
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const ParameterInputGroup = ({ parameter, register }) => {
  const parameterKey = parameter.toLowerCase().replace(/ /g, '_');

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
          <Input
            type="hidden"
            {...register(`${parameterKey}_status`)}
            defaultValue="failed"
          />
          <Select 
            defaultValue="failed"
            onValueChange={(value) => {
              const event = { target: { name: `${parameterKey}_status`, value } };
              register(`${parameterKey}_status`).onChange(event);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="passed">Passed</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default ParameterInputGroup;
