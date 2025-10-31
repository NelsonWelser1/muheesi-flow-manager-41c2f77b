
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Filter, Plus, Eye, Edit, Trash2, Users, Building } from 'lucide-react';

const EmployeeManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const employees = [
    {
      id: "EMP001",
      name: "John Doe",
      position: "Factory Manager",
      department: "Production",
      company: "Grand Berna Dairies",
      status: "Active",
      joinDate: "2023-01-15",
      salary: "UGX 800,000"
    },
    {
      id: "EMP002",
      name: "Jane Smith",
      position: "Quality Control Officer",
      department: "Quality Assurance",
      company: "KAJON Coffee",
      status: "Active",
      joinDate: "2023-03-20",
      salary: "UGX 650,000"
    },
    {
      id: "EMP003",
      name: "Michael Johnson",
      position: "Farm Supervisor",
      department: "Agriculture",
      company: "Kyalima Farmers",
      status: "Active",
      joinDate: "2022-11-10",
      salary: "UGX 550,000"
    }
  ];

  const departments = [
    { name: "Production", count: 45, company: "Grand Berna Dairies" },
    { name: "Quality Assurance", count: 12, company: "All Companies" },
    { name: "Sales & Marketing", count: 18, company: "KAJON Coffee" },
    { name: "Agriculture", count: 35, company: "Kyalima Farmers" },
    { name: "Administration", count: 8, company: "All Companies" },
    { name: "Logistics", count: 15, company: "Grand Berna Dairies" }
  ];

  return (
    <Tabs defaultValue="directory" className="space-y-4">
      <TabsList>
        <TabsTrigger value="directory">Employee Directory</TabsTrigger>
        <TabsTrigger value="departments">Departments</TabsTrigger>
        <TabsTrigger value="add-employee">Add Employee</TabsTrigger>
      </TabsList>

      <TabsContent value="directory">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Employee Directory</CardTitle>
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search employees..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 w-64"
                  />
                </div>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Employee
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {employees.map((employee) => (
                <div key={employee.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{employee.name}</h3>
                      <p className="text-sm text-muted-foreground">{employee.position}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline">{employee.department}</Badge>
                        <Badge variant="secondary">{employee.company}</Badge>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{employee.salary}</p>
                    <p className="text-sm text-muted-foreground">Joined: {employee.joinDate}</p>
                    <div className="flex gap-1 mt-2">
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="departments">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {departments.map((dept, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  {dept.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dept.count} employees</div>
                <p className="text-sm text-muted-foreground">{dept.company}</p>
                <Button className="w-full mt-4" variant="outline">
                  View Department
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </TabsContent>

      <TabsContent value="add-employee">
        <Card>
          <CardHeader>
            <CardTitle>Add New Employee</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input placeholder="First Name" />
              <Input placeholder="Last Name" />
              <Input placeholder="Employee ID" />
              <Input placeholder="Position" />
              <Input placeholder="Department" />
              <Input placeholder="Company" />
              <Input placeholder="Email" />
              <Input placeholder="Phone Number" />
              <Input type="date" placeholder="Join Date" />
              <Input placeholder="Salary" />
            </div>
            <div className="flex gap-2 mt-6">
              <Button>Save Employee</Button>
              <Button variant="outline">Cancel</Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default EmployeeManagement;
