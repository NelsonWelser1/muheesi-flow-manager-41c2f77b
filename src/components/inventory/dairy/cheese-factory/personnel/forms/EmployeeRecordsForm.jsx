
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const EmployeeRecordsForm = () => {
  return (
    <Card>
      <CardContent className="pt-6">
        <form className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Employee Name</Label>
              <Input placeholder="Enter employee name" />
            </div>
            <div className="space-y-2">
              <Label>Position</Label>
              <Input placeholder="Enter position" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Department</Label>
              <Input placeholder="Enter department" />
            </div>
            <div className="space-y-2">
              <Label>Employee ID</Label>
              <Input placeholder="Enter ID" />
            </div>
          </div>

          <Button type="submit" className="w-full">Save Record</Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default EmployeeRecordsForm;
