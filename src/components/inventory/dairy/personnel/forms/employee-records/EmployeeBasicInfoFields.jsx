
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const JOB_TITLES = [
  "Production Manager",
  "Quality Control Specialist",
  "Shift Supervisor",
  "Machine Operator",
  "Maintenance Technician",
  "Warehouse Staff"
];

const DEPARTMENTS = [
  "Production",
  "Quality Control",
  "Maintenance",
  "Warehouse",
  "Administration",
  "Logistics"
];

const STATUS_OPTIONS = [
  "Active",
  "On Leave",
  "Terminated",
  "Suspended",
  "Training",
  "Probation"
];

const EmployeeBasicInfoFields = ({ register, errors, setValue }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-2">
        <Label>Employee Name/ID</Label>
        <Input 
          {...register("employeeId", { required: true })} 
          placeholder="Enter employee name or ID" 
        />
        {errors.employeeId && <p className="text-sm text-red-500">Employee ID is required</p>}
      </div>

      <div className="space-y-2">
        <Label>Job Title</Label>
        <Select 
          onValueChange={(value) => setValue("jobTitle", value)}
          defaultValue=""
        >
          <SelectTrigger>
            <SelectValue placeholder="Select job title" />
          </SelectTrigger>
          <SelectContent>
            {JOB_TITLES.map((title) => (
              <SelectItem key={title} value={title}>
                {title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.jobTitle && <p className="text-sm text-red-500">Job title is required</p>}
      </div>

      <div className="space-y-2">
        <Label>Department</Label>
        <Select 
          onValueChange={(value) => setValue("department", value)}
          defaultValue=""
        >
          <SelectTrigger>
            <SelectValue placeholder="Select department" />
          </SelectTrigger>
          <SelectContent>
            {DEPARTMENTS.map((dept) => (
              <SelectItem key={dept} value={dept}>
                {dept}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.department && <p className="text-sm text-red-500">Department is required</p>}
      </div>

      <div className="space-y-2">
        <Label>Status</Label>
        <Select 
          onValueChange={(value) => setValue("status", value)}
          defaultValue="Active"
        >
          <SelectTrigger>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map((status) => (
              <SelectItem key={status} value={status}>
                {status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.status && <p className="text-sm text-red-500">Status is required</p>}
      </div>
    </div>
  );
};

export default EmployeeBasicInfoFields;
