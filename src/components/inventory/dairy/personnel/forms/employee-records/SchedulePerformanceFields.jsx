
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const SchedulePerformanceFields = ({ register, errors }) => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label>Shift Schedule Start</Label>
          <Input 
            type="datetime-local" 
            {...register("shiftStart", { required: true })} 
          />
          {errors.shiftStart && <p className="text-sm text-red-500">Shift start time is required</p>}
        </div>

        <div className="space-y-2">
          <Label>Shift Schedule End</Label>
          <Input 
            type="datetime-local" 
            {...register("shiftEnd", { required: true })} 
          />
          {errors.shiftEnd && <p className="text-sm text-red-500">Shift end time is required</p>}
        </div>

        <div className="space-y-2">
          <Label>Performance Rating (1-5)</Label>
          <Input 
            type="number" 
            min="1" 
            max="5" 
            {...register("performanceRating", { 
              required: true,
              min: 1,
              max: 5
            })} 
          />
          {errors.performanceRating && <p className="text-sm text-red-500">Performance rating (1-5) is required</p>}
        </div>

        <div className="space-y-2">
          <Label>Review Date & Time</Label>
          <Input 
            type="datetime-local" 
            {...register("reviewDateTime", { required: true })} 
          />
          {errors.reviewDateTime && <p className="text-sm text-red-500">Review date & time is required</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label>Performance Review Comments</Label>
        <Textarea 
          {...register("comments")} 
          placeholder="Enter performance review comments" 
        />
      </div>
    </>
  );
};

export default SchedulePerformanceFields;
