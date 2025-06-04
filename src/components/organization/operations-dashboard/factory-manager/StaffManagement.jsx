
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Clock, Calendar, AlertCircle } from 'lucide-react';

const StaffManagement = () => {
  const currentShift = [
    {
      id: 1,
      name: "John Kamau",
      position: "Production Supervisor",
      department: "Cheese Production",
      shift: "Morning (6:00 AM - 2:00 PM)",
      status: "On Duty",
      location: "Production Line A"
    },
    {
      id: 2,
      name: "Mary Nakato",
      position: "Quality Control Specialist",
      department: "Quality Assurance",
      shift: "Morning (6:00 AM - 2:00 PM)",
      status: "On Duty",
      location: "QC Laboratory"
    },
    {
      id: 3,
      name: "Peter Mugisha",
      position: "Machine Operator",
      department: "Yogurt Processing",
      shift: "Morning (6:00 AM - 2:00 PM)",
      status: "On Break",
      location: "Yogurt Line"
    },
    {
      id: 4,
      name: "Grace Achieng",
      position: "Packaging Supervisor",
      department: "Packaging",
      shift: "Morning (6:00 AM - 2:00 PM)",
      status: "On Duty",
      location: "Packaging Area"
    },
    {
      id: 5,
      name: "David Ssali",
      position: "Maintenance Technician",
      department: "Maintenance",
      shift: "Morning (6:00 AM - 2:00 PM)",
      status: "On Duty",
      location: "Coffee Unit"
    }
  ];

  const shiftSchedule = [
    {
      shift: "Morning (6:00 AM - 2:00 PM)",
      scheduled: 32,
      present: 28,
      departments: ["Production", "Quality Control", "Packaging", "Maintenance"]
    },
    {
      shift: "Afternoon (2:00 PM - 10:00 PM)",
      scheduled: 25,
      present: 24,
      departments: ["Production", "Quality Control", "Packaging"]
    },
    {
      shift: "Night (10:00 PM - 6:00 AM)",
      scheduled: 15,
      present: 13,
      departments: ["Security", "Cleaning", "Maintenance"]
    }
  ];

  const staffMetrics = [
    {
      title: "Total Staff on Duty",
      value: "28/32",
      change: "4 absent today",
      color: "text-blue-600"
    },
    {
      title: "Productivity Rate",
      value: "94.2%",
      change: "+2.1% from yesterday",
      color: "text-green-600"
    },
    {
      title: "Safety Incidents",
      value: "0",
      change: "15 days incident-free",
      color: "text-green-600"
    },
    {
      title: "Training Compliance",
      value: "96.8%",
      change: "2 staff pending",
      color: "text-orange-600"
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'On Duty':
        return 'default';
      case 'On Break':
        return 'secondary';
      case 'Absent':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {staffMetrics.map((metric, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
              <Users className={`h-4 w-4 ${metric.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <p className="text-xs text-muted-foreground">{metric.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Current Shift Staff
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {currentShift.map((staff) => (
              <div key={staff.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-semibold">{staff.name}</h3>
                  <p className="text-sm text-muted-foreground">{staff.position}</p>
                  <p className="text-xs text-muted-foreground">
                    {staff.department} • {staff.location}
                  </p>
                </div>
                <Badge variant={getStatusColor(staff.status)}>{staff.status}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Shift Schedule Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {shiftSchedule.map((shift, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold">{shift.shift}</h3>
                  <div className="text-right">
                    <p className="font-bold">{shift.present}/{shift.scheduled}</p>
                    <p className="text-xs text-muted-foreground">Present/Scheduled</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Departments: {shift.departments.join(", ")}
                </p>
                <div className="mt-2">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${(shift.present / shift.scheduled) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Staff Management Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button className="h-20 flex-col">
              <Calendar className="h-6 w-6 mb-2" />
              Schedule Shifts
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <Users className="h-6 w-6 mb-2" />
              Attendance Report
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <AlertCircle className="h-6 w-6 mb-2" />
              Safety Training
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <Clock className="h-6 w-6 mb-2" />
              Performance Review
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StaffManagement;
