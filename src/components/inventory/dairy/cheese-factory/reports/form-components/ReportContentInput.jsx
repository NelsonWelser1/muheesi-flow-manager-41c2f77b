
import React from 'react';
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export const ReportContentInput = ({ content, onChange }) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="reportContent">Report Content</Label>
      <Textarea
        id="reportContent"
        value={content}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Enter report details"
        className="min-h-[200px] w-full"
        required
      />
    </div>
  );
};

export default ReportContentInput;
