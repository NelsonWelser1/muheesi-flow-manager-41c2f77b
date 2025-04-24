
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusIcon, FileEditIcon, TrashIcon } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const Personnel = () => {
  // Example staff data
  const staffMembers = [
    { id: 1, name: "John Doe", role: "Farm Manager", contact: "+256 712 345678", joinDate: "2023-05-15" },
    { id: 2, name: "Jane Smith", role: "Veterinarian", contact: "+256 723 456789", joinDate: "2023-07-22" },
    { id: 3, name: "Robert Johnson", role: "Milking Technician", contact: "+256 734 567890", joinDate: "2023-09-10" },
    { id: 4, name: "Sarah Williams", role: "Farm Assistant", contact: "+256 745 678901", joinDate: "2024-01-05" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Personnel Management</h2>
        <Button>
          <PlusIcon className="h-4 w-4 mr-2" />
          Add Staff Member
        </Button>
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
                <TableHead>Role</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Join Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {staffMembers.map((staff) => (
                <TableRow key={staff.id}>
                  <TableCell className="font-medium">{staff.name}</TableCell>
                  <TableCell>{staff.role}</TableCell>
                  <TableCell>{staff.contact}</TableCell>
                  <TableCell>{new Date(staff.joinDate).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <FileEditIcon className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500">
                      <TrashIcon className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Staff Schedule</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">No schedules have been created yet.</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Performance Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">No performance data is available.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Personnel;
