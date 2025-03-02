
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const ReportTitleInput = ({ title, onChange }) => {
  return (
    <div>
      <Label htmlFor="reportTitle">Report Title</Label>
      <Input
        id="reportTitle"
        value={title}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Enter report title"
        required
      />
    </div>
  );
};
