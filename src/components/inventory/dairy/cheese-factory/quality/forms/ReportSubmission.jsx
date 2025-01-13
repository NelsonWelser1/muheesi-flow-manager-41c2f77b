import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const ReportSubmission = ({ formData, setFormData }) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="reportType">Report Type</Label>
        <Select
          value={formData.reportType}
          onValueChange={(value) => setFormData({ ...formData, reportType: value })}
          required
        >
          <SelectTrigger>
            <SelectValue placeholder="Select report type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="routine">Routine Quality Check</SelectItem>
            <SelectItem value="special">Special Investigation</SelectItem>
            <SelectItem value="compliance">Compliance Check</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="recipientLevel">Submit to Management Level</Label>
        <Select
          value={formData.recipientLevel}
          onValueChange={(value) => setFormData({ ...formData, recipientLevel: value })}
          required
        >
          <SelectTrigger>
            <SelectValue placeholder="Select management level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="executive">Strategic/Executive Management</SelectItem>
            <SelectItem value="operational">Operational/Field Management</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Additional Notes</Label>
        <Textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          placeholder="Enter any additional observations or notes"
          className="h-32"
        />
      </div>
    </div>
  );
};

export default ReportSubmission;