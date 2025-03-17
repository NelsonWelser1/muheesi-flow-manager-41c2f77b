
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

const StatusField = ({ setValue, register, errors }) => {
  return (
    <div className="space-y-2">
      <Label>Status</Label>
      <Select 
        defaultValue="pending"
        onValueChange={(value) => setValue("status", value)}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="pending">Pending</SelectItem>
          <SelectItem value="paid">Paid</SelectItem>
          <SelectItem value="overdue">Overdue</SelectItem>
          <SelectItem value="cancelled">Cancelled</SelectItem>
        </SelectContent>
      </Select>
      <Input 
        type="hidden" 
        {...register("status", { required: "Status is required" })} 
      />
      {errors?.status && (
        <p className="text-sm text-red-500">{errors.status.message}</p>
      )}
    </div>
  );
};

export default StatusField;
