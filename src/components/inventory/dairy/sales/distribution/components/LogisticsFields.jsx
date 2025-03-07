
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const LogisticsFields = ({ register }) => {
  return (
    <>
      <div className="space-y-2">
        <Label>Driver ID</Label>
        <Input {...register("driver_id")} />
      </div>

      <div className="space-y-2">
        <Label>Vehicle ID</Label>
        <Input {...register("vehicle_id")} />
      </div>

      <div className="space-y-2">
        <Label>Destination</Label>
        <Input {...register("destination")} />
      </div>
    </>
  );
};

export default LogisticsFields;
