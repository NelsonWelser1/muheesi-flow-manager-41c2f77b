
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const NetSalarySection = ({ netSalary }) => {
  return (
    <div className="space-y-2">
      <Label>Net Salary (Auto-calculated)</Label>
      <Input type="number" value={netSalary.toFixed(2)} readOnly className="bg-gray-50 font-bold" />
    </div>
  );
};

export default NetSalarySection;
