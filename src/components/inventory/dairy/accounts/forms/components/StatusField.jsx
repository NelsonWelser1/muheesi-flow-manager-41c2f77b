
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const StatusField = ({ setValue, register, errors }) => {
  // Ensure setValue is properly passed from parent
  const handleValueChange = (value) => {
    if (setValue && typeof setValue === 'function') {
      setValue("status", value);
    } else {
      console.error("setValue is not a function in StatusField");
    }
  };

  return (
    <div className="space-y-2">
      <Label>Status</Label>
      <Select 
        defaultValue="pending"
        onValueChange={handleValueChange}
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
      <Input type="hidden" {...register("status")} />
    </div>
  );
};

export default StatusField;
