
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const ParameterInputGroup = ({ parameter, register }) => {
  return (
    <div className="border p-4 rounded-lg space-y-4">
      <h3 className="font-medium text-lg">{parameter}</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor={`${parameter.toLowerCase().replace(' ', '_')}_value`}>
            Actual Value
          </Label>
          <Input
            id={`${parameter.toLowerCase().replace(' ', '_')}_value`}
            {...register(`${parameter.toLowerCase().replace(' ', '_')}_value`, { required: true })}
            placeholder="Enter measured value"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor={`${parameter.toLowerCase().replace(' ', '_')}_standard`}>
            Standard Value
          </Label>
          <Input
            id={`${parameter.toLowerCase().replace(' ', '_')}_standard`}
            {...register(`${parameter.toLowerCase().replace(' ', '_')}_standard`, { required: true })}
            placeholder="Enter standard value"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor={`${parameter.toLowerCase().replace(' ', '_')}_status`}>
            Status
          </Label>
          <Input
            id={`${parameter.toLowerCase().replace(' ', '_')}_status`}
            {...register(`${parameter.toLowerCase().replace(' ', '_')}_status`, { required: true })}
            placeholder="passed/failed"
          />
        </div>
      </div>
    </div>
  );
};

export default ParameterInputGroup;
