
import React from 'react';
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const ReportTypeSelect = ({ value, onValueChange }) => {
  const reportTypes = [
    'Daily Stock Summary',
    'Weekly Inventory Report',
    'Monthly Analysis',
    'Quality Control Report',
    'Stock Movement Report',
    'Custom Report'
  ];

  return (
    <div>
      <Label htmlFor="reportType">Report Type</Label>
      <Select
        value={value}
        onValueChange={onValueChange}
        required
      >
        <SelectTrigger>
          <SelectValue placeholder="Select report type" />
        </SelectTrigger>
        <SelectContent>
          {reportTypes.map((type) => (
            <SelectItem key={type} value={type}>{type}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
