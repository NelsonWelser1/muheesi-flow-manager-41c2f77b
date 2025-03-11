
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserCog } from "lucide-react";

const CurrentShiftSchedule = ({ currentShift }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserCog className="h-5 w-5" />
          Current Shift Schedule
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">Name</th>
                <th className="text-left p-2">Role</th>
                <th className="text-left p-2">Shift</th>
                <th className="text-left p-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {currentShift.map((employee, index) => {
                const shiftStart = new Date(employee.shift_start);
                const shiftEnd = new Date(employee.shift_end);
                const now = new Date();
                const status = now >= shiftStart && now <= shiftEnd ? "Active" : "Scheduled";
                
                return (
                  <tr key={index} className="border-b">
                    <td className="p-2">{employee.employee_id}</td>
                    <td className="p-2">{employee.job_title}</td>
                    <td className="p-2">
                      {shiftStart.toLocaleTimeString()} - {shiftEnd.toLocaleTimeString()}
                    </td>
                    <td className="p-2">
                      <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                        status === "Active" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                      }`}>
                        {status}
                      </span>
                    </td>
                  </tr>
                );
              })}
              {!currentShift.length && (
                <tr>
                  <td colSpan={4} className="text-center p-4 text-gray-500">
                    No active shifts
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default CurrentShiftSchedule;
