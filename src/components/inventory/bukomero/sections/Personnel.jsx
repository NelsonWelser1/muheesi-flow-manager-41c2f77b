
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const BukomeroPersonnel = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Staff</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-sm text-gray-500">Full-time employees</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Attendance Today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">22</div>
            <p className="text-sm text-gray-500">91.7% attendance rate</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Shift Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-medium text-green-600">Morning Shift Active</div>
            <p className="text-sm text-gray-500">12 staff on duty</p>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Staff Roster</CardTitle>
          <Button size="sm">Manage Shifts</Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
              <div>
                <h4 className="font-medium">Morning Shift (6:00 AM - 2:00 PM)</h4>
                <p className="text-sm text-gray-500">12 staff assigned</p>
              </div>
              <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Active</span>
            </div>
            <div className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
              <div>
                <h4 className="font-medium">Evening Shift (2:00 PM - 10:00 PM)</h4>
                <p className="text-sm text-gray-500">8 staff assigned</p>
              </div>
              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">Upcoming</span>
            </div>
            <div className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
              <div>
                <h4 className="font-medium">Night Shift (10:00 PM - 6:00 AM)</h4>
                <p className="text-sm text-gray-500">4 staff assigned</p>
              </div>
              <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">Scheduled</span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Department Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Milk Collection & Reception</span>
              <span className="font-medium">6 staff</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Processing & Production</span>
              <span className="font-medium">8 staff</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Quality Control</span>
              <span className="font-medium">3 staff</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Packaging & Storage</span>
              <span className="font-medium">4 staff</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Administration</span>
              <span className="font-medium">3 staff</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BukomeroPersonnel;
