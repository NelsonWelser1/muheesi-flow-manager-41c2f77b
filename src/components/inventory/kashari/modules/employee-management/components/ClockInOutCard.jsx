
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";

const ClockInOutCard = ({ employees, clockInfo, setClockInfo, handleClockInOut }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Clock In/Out</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Select 
            value={clockInfo.employeeId} 
            onValueChange={value => setClockInfo({
              ...clockInfo,
              employeeId: value
            })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Employee" />
            </SelectTrigger>
            <SelectContent>
              {employees.map(employee => (
                <SelectItem key={employee.id} value={employee.employee_id}>
                  {employee.employee_id}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <div className="flex space-x-2">
            <Button 
              variant={clockInfo.isClockingIn ? "default" : "outline"} 
              onClick={() => setClockInfo({
                ...clockInfo,
                isClockingIn: true
              })} 
              className="flex-1"
            >
              Clock In
            </Button>
            <Button 
              variant={!clockInfo.isClockingIn ? "default" : "outline"} 
              onClick={() => setClockInfo({
                ...clockInfo,
                isClockingIn: false
              })} 
              className="flex-1"
            >
              Clock Out
            </Button>
          </div>
          
          <Button 
            className="w-full" 
            onClick={handleClockInOut} 
            disabled={!clockInfo.employeeId}
          >
            <Clock className="mr-2 h-4 w-4" />
            {clockInfo.isClockingIn ? "Record Clock In" : "Record Clock Out"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ClockInOutCard;
