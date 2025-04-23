
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useBukomeroDairyData } from "@/hooks/useBukomeroDairyData";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const BukomeroPersonnel = () => {
  const { isLoading, error } = useBukomeroDairyData();
  
  if (isLoading) {
    return <div className="p-6">Loading personnel data...</div>;
  }
  
  if (error) {
    return <div className="p-6 text-red-500">Error loading personnel data: {error.message}</div>;
  }
  
  // Sample personnel data
  const personnel = [
    { id: 1, name: "John Mukasa", position: "Farm Manager", department: "Management", joinDate: "12 Jan, 2022", status: "Active" },
    { id: 2, name: "Sarah Namuli", position: "Veterinarian", department: "Animal Health", joinDate: "03 Mar, 2022", status: "Active" },
    { id: 3, name: "David Opio", position: "Milking Supervisor", department: "Production", joinDate: "22 May, 2022", status: "Active" },
    { id: 4, name: "Rebecca Akello", position: "Feed Specialist", department: "Nutrition", joinDate: "14 Jul, 2022", status: "Active" },
    { id: 5, name: "Daniel Mwesigwa", position: "Maintenance Technician", department: "Operations", joinDate: "30 Sep, 2022", status: "Active" },
    { id: 6, name: "Grace Nakato", position: "Administrative Assistant", department: "Management", joinDate: "05 Feb, 2023", status: "Active" },
  ];
  
  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">Personnel Management</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Staff</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">Full-time employees</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Departments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">Active departments</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Training Completion</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">92%</div>
            <p className="text-xs text-muted-foreground">Staff fully trained</p>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Staff Directory</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Position</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Join Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {personnel.map((person) => (
                <TableRow key={person.id}>
                  <TableCell className="font-medium">{person.name}</TableCell>
                  <TableCell>{person.position}</TableCell>
                  <TableCell>{person.department}</TableCell>
                  <TableCell>{person.joinDate}</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                      {person.status}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Recent Activities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between items-center border-b pb-2">
              <div>
                <p className="font-medium">Monthly Staff Meeting</p>
                <p className="text-sm text-muted-foreground">23 Apr, 2025</p>
              </div>
              <div className="text-blue-600 font-medium">Completed</div>
            </div>
            <div className="flex justify-between items-center border-b pb-2">
              <div>
                <p className="font-medium">New Hire Orientation</p>
                <p className="text-sm text-muted-foreground">20 Apr, 2025</p>
              </div>
              <div className="text-green-600 font-medium">Completed</div>
            </div>
            <div className="flex justify-between items-center border-b pb-2">
              <div>
                <p className="font-medium">Safety Training</p>
                <p className="text-sm text-muted-foreground">18 Apr, 2025</p>
              </div>
              <div className="text-orange-600 font-medium">In Progress</div>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Performance Reviews</p>
                <p className="text-sm text-muted-foreground">30 Apr, 2025</p>
              </div>
              <div className="text-gray-600 font-medium">Scheduled</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BukomeroPersonnel;
