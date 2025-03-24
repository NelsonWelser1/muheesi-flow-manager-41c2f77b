
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import {
  Users, User, Clock, Calendar as CalendarIcon, BarChart2, FileText,
  Plus, Filter, Download, Search, Phone, Mail, CheckCircle, AlertCircle
} from "lucide-react";

const EmployeeManagement = () => {
  const [activeTab, setActiveTab] = useState('employees');
  const [date, setDate] = useState(new Date());

  // Mock data for demonstration
  const employeeData = [
    { id: 'EMP001', name: 'John Mukasa', position: 'Farm Manager', department: 'Management', joinDate: '2020-03-15', status: 'Active' },
    { id: 'EMP012', name: 'Sarah Nambi', position: 'Dairy Supervisor', department: 'Dairy', joinDate: '2021-05-20', status: 'Active' },
    { id: 'EMP018', name: 'David Ochen', position: 'Farm Worker', department: 'Plantation', joinDate: '2022-01-10', status: 'Active' },
    { id: 'EMP023', name: 'Rebecca Atwine', position: 'Accountant', department: 'Finance', joinDate: '2021-08-05', status: 'Active' },
    { id: 'EMP031', name: 'Michael Okello', position: 'Driver', department: 'Logistics', joinDate: '2022-04-12', status: 'On Leave' },
    { id: 'EMP042', name: 'Grace Tendo', position: 'Farm Worker', department: 'Dairy', joinDate: '2021-11-08', status: 'Active' },
  ];
  
  const contractorData = [
    { id: 'CON001', name: 'Kampala Vet Services', service: 'Veterinary Care', contact: 'Dr. Mugisha', phone: '+256 772 123456', status: 'Active' },
    { id: 'CON003', name: 'AgriTech Solutions', service: 'Equipment Maintenance', contact: 'Peter Ouma', phone: '+256 701 987654', status: 'Active' },
    { id: 'CON007', name: 'Harvest Transport Ltd', service: 'Product Distribution', contact: 'Janet Namuli', phone: '+256 782 456789', status: 'Inactive' },
  ];
  
  const schedulesData = [
    { id: 1, employee: 'John Mukasa', position: 'Farm Manager', shift: 'Regular (8am-5pm)', days: 'Mon-Fri', location: 'Main Office' },
    { id: 2, employee: 'Sarah Nambi', position: 'Dairy Supervisor', shift: 'Morning (5am-2pm)', days: 'Mon-Sat', location: 'Dairy Unit' },
    { id: 3, employee: 'David Ochen', position: 'Farm Worker', shift: 'Regular (8am-5pm)', days: 'Mon-Sat', location: 'Banana Plantation' },
    { id: 4, employee: 'Grace Tendo', position: 'Farm Worker', shift: 'Morning (5am-2pm)', days: 'Mon-Sat', location: 'Dairy Unit' },
  ];
  
  const attendanceData = [
    { id: 1, date: '2023-07-12', present: 28, absent: 3, late: 1 },
    { id: 2, date: '2023-07-11', present: 29, absent: 2, late: 2 },
    { id: 3, date: '2023-07-10', present: 30, absent: 1, late: 0 },
    { id: 4, date: '2023-07-09', present: 27, absent: 4, late: 1 },
    { id: 5, date: '2023-07-08', present: 28, absent: 3, late: 2 },
  ];
  
  const leaveData = [
    { id: 1, employee: 'Michael Okello', position: 'Driver', type: 'Annual Leave', from: '2023-07-10', to: '2023-07-20', status: 'Approved' },
    { id: 2, employee: 'Rebecca Atwine', position: 'Accountant', type: 'Sick Leave', from: '2023-07-05', to: '2023-07-06', status: 'Completed' },
    { id: 3, employee: 'Grace Tendo', position: 'Farm Worker', type: 'Annual Leave', from: '2023-07-25', to: '2023-08-01', status: 'Pending' },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Users className="mr-2 h-5 w-5" /> Employee & Contractor Management
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="employees">
              <User className="mr-2 h-4 w-4" /> Employees
            </TabsTrigger>
            <TabsTrigger value="contractors">
              <Users className="mr-2 h-4 w-4" /> Contractors
            </TabsTrigger>
            <TabsTrigger value="schedules">
              <Clock className="mr-2 h-4 w-4" /> Schedules
            </TabsTrigger>
            <TabsTrigger value="attendance">
              <CheckCircle className="mr-2 h-4 w-4" /> Attendance
            </TabsTrigger>
            <TabsTrigger value="leave">
              <CalendarIcon className="mr-2 h-4 w-4" /> Leave Management
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="employees" className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search employees..."
                    className="pl-8 w-[250px]"
                  />
                </div>
                <Select defaultValue="all">
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Filter by department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
                    <SelectItem value="management">Management</SelectItem>
                    <SelectItem value="dairy">Dairy</SelectItem>
                    <SelectItem value="plantation">Plantation</SelectItem>
                    <SelectItem value="finance">Finance</SelectItem>
                    <SelectItem value="logistics">Logistics</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" /> Export
                </Button>
                <Button>
                  <Plus className="mr-2 h-4 w-4" /> Add Employee
                </Button>
              </div>
            </div>
            
            <Card>
              <CardContent className="p-6">
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Position</TableHead>
                        <TableHead>Department</TableHead>
                        <TableHead>Join Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {employeeData.map((employee) => (
                        <TableRow key={employee.id}>
                          <TableCell className="font-medium">{employee.id}</TableCell>
                          <TableCell>{employee.name}</TableCell>
                          <TableCell>{employee.position}</TableCell>
                          <TableCell>{employee.department}</TableCell>
                          <TableCell>{employee.joinDate}</TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              employee.status === 'Active' ? 'bg-green-100 text-green-800' : 
                              employee.status === 'On Leave' ? 'bg-amber-100 text-amber-800' : 
                              'bg-red-100 text-red-800'
                            }`}>
                              {employee.status}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button variant="outline" size="sm">View</Button>
                              <Button variant="outline" size="sm">Edit</Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Add New Employee</CardTitle>
                </CardHeader>
                <CardContent>
                  <form className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">First Name</label>
                        <Input placeholder="Enter first name" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Last Name</label>
                        <Input placeholder="Enter last name" />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Position</label>
                        <Input placeholder="Enter position" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Department</label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select department" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="management">Management</SelectItem>
                            <SelectItem value="dairy">Dairy</SelectItem>
                            <SelectItem value="plantation">Plantation</SelectItem>
                            <SelectItem value="finance">Finance</SelectItem>
                            <SelectItem value="logistics">Logistics</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Phone Number</label>
                        <Input placeholder="Enter phone number" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Email</label>
                        <Input type="email" placeholder="Enter email" />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Join Date</label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {date ? format(date, "PPP") : "Select date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Address</label>
                      <Textarea placeholder="Enter address" />
                    </div>
                    
                    <Button type="submit" className="w-full">Save Employee</Button>
                  </form>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Employee Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-gray-50 rounded-md p-4">
                      <p className="text-sm text-muted-foreground">Total Employees</p>
                      <p className="text-3xl font-bold">32</p>
                    </div>
                    <div className="bg-gray-50 rounded-md p-4">
                      <p className="text-sm text-muted-foreground">Departments</p>
                      <p className="text-3xl font-bold">5</p>
                    </div>
                    <div className="bg-gray-50 rounded-md p-4">
                      <p className="text-sm text-muted-foreground">On Leave</p>
                      <p className="text-3xl font-bold">1</p>
                    </div>
                    <div className="bg-gray-50 rounded-md p-4">
                      <p className="text-sm text-muted-foreground">New This Month</p>
                      <p className="text-3xl font-bold">3</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Department Distribution</h4>
                    <div className="space-y-2">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span>Dairy</span>
                          <span>12 employees</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: "37.5%" }}></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-1">
                          <span>Plantation</span>
                          <span>10 employees</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div className="bg-green-600 h-2.5 rounded-full" style={{ width: "31.25%" }}></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-1">
                          <span>Management</span>
                          <span>5 employees</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div className="bg-purple-600 h-2.5 rounded-full" style={{ width: "15.625%" }}></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-1">
                          <span>Finance</span>
                          <span>3 employees</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div className="bg-yellow-600 h-2.5 rounded-full" style={{ width: "9.375%" }}></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-1">
                          <span>Logistics</span>
                          <span>2 employees</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div className="bg-red-600 h-2.5 rounded-full" style={{ width: "6.25%" }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="contractors" className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search contractors..."
                    className="pl-8 w-[250px]"
                  />
                </div>
                <Select defaultValue="all">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by service" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Services</SelectItem>
                    <SelectItem value="veterinary">Veterinary</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                    <SelectItem value="transport">Transport</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Add Contractor
              </Button>
            </div>
            
            <Card>
              <CardContent className="p-6">
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Company Name</TableHead>
                        <TableHead>Service</TableHead>
                        <TableHead>Contact Person</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {contractorData.map((contractor) => (
                        <TableRow key={contractor.id}>
                          <TableCell className="font-medium">{contractor.id}</TableCell>
                          <TableCell>{contractor.name}</TableCell>
                          <TableCell>{contractor.service}</TableCell>
                          <TableCell>{contractor.contact}</TableCell>
                          <TableCell>{contractor.phone}</TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              contractor.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {contractor.status}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button variant="outline" size="sm">View</Button>
                              <Button variant="outline" size="sm">Edit</Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Add New Contractor</CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Company Name</label>
                      <Input placeholder="Enter company name" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Service Type</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select service" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="veterinary">Veterinary Services</SelectItem>
                          <SelectItem value="maintenance">Equipment Maintenance</SelectItem>
                          <SelectItem value="transport">Transport Services</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Contact Person</label>
                      <Input placeholder="Enter contact person name" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Phone</label>
                      <Input placeholder="Enter phone number" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email</label>
                    <Input type="email" placeholder="Enter email" />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Address</label>
                    <Textarea placeholder="Enter address" />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Service Description</label>
                    <Textarea placeholder="Enter service details" />
                  </div>
                  
                  <Button type="submit" className="w-full">Save Contractor</Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="schedules" className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <Input
                  type="search"
                  placeholder="Search schedules..."
                  className="w-[250px]"
                />
                <Select defaultValue="all">
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Filter by shift" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Shifts</SelectItem>
                    <SelectItem value="morning">Morning</SelectItem>
                    <SelectItem value="regular">Regular</SelectItem>
                    <SelectItem value="evening">Evening</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline">
                  <Download className="mr-2 h-4 w-4" /> Export Schedule
                </Button>
                <Button>
                  <Plus className="mr-2 h-4 w-4" /> Add Schedule
                </Button>
              </div>
            </div>
            
            <Card>
              <CardContent className="p-6">
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Employee</TableHead>
                        <TableHead>Position</TableHead>
                        <TableHead>Shift</TableHead>
                        <TableHead>Working Days</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {schedulesData.map((schedule) => (
                        <TableRow key={schedule.id}>
                          <TableCell>{schedule.employee}</TableCell>
                          <TableCell>{schedule.position}</TableCell>
                          <TableCell>{schedule.shift}</TableCell>
                          <TableCell>{schedule.days}</TableCell>
                          <TableCell>{schedule.location}</TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button variant="outline" size="sm">Edit</Button>
                              <Button variant="outline" size="sm">View</Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-medium mb-4">Morning Shift</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Assigned</span>
                      <span>8 employees</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Time</span>
                      <span>5:00 AM - 2:00 PM</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Primary Location</span>
                      <span>Dairy Unit</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-medium mb-4">Regular Shift</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Assigned</span>
                      <span>15 employees</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Time</span>
                      <span>8:00 AM - 5:00 PM</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Primary Location</span>
                      <span>Various</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-medium mb-4">Evening Shift</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Assigned</span>
                      <span>9 employees</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Time</span>
                      <span>2:00 PM - 10:00 PM</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Primary Location</span>
                      <span>Dairy Unit</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="attendance" className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  <Filter className="mr-2 h-4 w-4" /> Filter
                </Button>
                <Select defaultValue="week">
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Select period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="week">This Week</SelectItem>
                    <SelectItem value="month">This Month</SelectItem>
                    <SelectItem value="year">This Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline">
                  <Download className="mr-2 h-4 w-4" /> Export Report
                </Button>
                <Button>
                  <Plus className="mr-2 h-4 w-4" /> Mark Attendance
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col">
                    <span className="text-sm text-muted-foreground">Present Today</span>
                    <span className="text-3xl font-bold text-green-600">28</span>
                    <span className="text-sm text-muted-foreground">out of 32 employees</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col">
                    <span className="text-sm text-muted-foreground">Absent Today</span>
                    <span className="text-3xl font-bold text-red-600">3</span>
                    <span className="text-sm text-muted-foreground">9.4% absence rate</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col">
                    <span className="text-sm text-muted-foreground">Late Today</span>
                    <span className="text-3xl font-bold text-amber-600">1</span>
                    <span className="text-sm text-muted-foreground">3.1% late rate</span>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardContent className="p-6">
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Present</TableHead>
                        <TableHead>Absent</TableHead>
                        <TableHead>Late</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {attendanceData.map((day) => (
                        <TableRow key={day.id}>
                          <TableCell>{day.date}</TableCell>
                          <TableCell>
                            <span className="text-green-600">{day.present}</span>
                          </TableCell>
                          <TableCell>
                            <span className="text-red-600">{day.absent}</span>
                          </TableCell>
                          <TableCell>
                            <span className="text-amber-600">{day.late}</span>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button variant="outline" size="sm">View Details</Button>
                              <Button variant="outline" size="sm">Edit</Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Mark Today's Attendance</CardTitle>
                </CardHeader>
                <CardContent>
                  <form className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Date</label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {format(new Date(), "PPP")}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={new Date()}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                        <div className="flex items-center space-x-3">
                          <input type="checkbox" className="rounded border-gray-300" />
                          <div>
                            <p className="font-medium">John Mukasa</p>
                            <p className="text-sm text-muted-foreground">Farm Manager</p>
                          </div>
                        </div>
                        <Select defaultValue="present">
                          <SelectTrigger className="w-[120px]">
                            <SelectValue placeholder="Status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="present">Present</SelectItem>
                            <SelectItem value="absent">Absent</SelectItem>
                            <SelectItem value="late">Late</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                        <div className="flex items-center space-x-3">
                          <input type="checkbox" className="rounded border-gray-300" />
                          <div>
                            <p className="font-medium">Sarah Nambi</p>
                            <p className="text-sm text-muted-foreground">Dairy Supervisor</p>
                          </div>
                        </div>
                        <Select defaultValue="present">
                          <SelectTrigger className="w-[120px]">
                            <SelectValue placeholder="Status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="present">Present</SelectItem>
                            <SelectItem value="absent">Absent</SelectItem>
                            <SelectItem value="late">Late</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                        <div className="flex items-center space-x-3">
                          <input type="checkbox" className="rounded border-gray-300" />
                          <div>
                            <p className="font-medium">David Ochen</p>
                            <p className="text-sm text-muted-foreground">Farm Worker</p>
                          </div>
                        </div>
                        <Select defaultValue="late">
                          <SelectTrigger className="w-[120px]">
                            <SelectValue placeholder="Status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="present">Present</SelectItem>
                            <SelectItem value="absent">Absent</SelectItem>
                            <SelectItem value="late">Late</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <Button type="submit" className="w-full">Save Attendance</Button>
                  </form>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Attendance Trends</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-sm font-medium mb-2">Weekly Overview</h4>
                      <div className="space-y-2">
                        <div>
                          <div className="flex justify-between mb-1 text-sm">
                            <span>Present</span>
                            <span>92%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-green-600 h-2 rounded-full" style={{ width: "92%" }}></div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between mb-1 text-sm">
                            <span>Absent</span>
                            <span>5%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-red-600 h-2 rounded-full" style={{ width: "5%" }}></div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between mb-1 text-sm">
                            <span>Late</span>
                            <span>3%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-amber-600 h-2 rounded-full" style={{ width: "3%" }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium mb-2">Department Attendance</h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <span>Dairy</span>
                          <span className="text-green-600">95% present</span>
                        </div>
                        <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <span>Plantation</span>
                          <span className="text-green-600">90% present</span>
                        </div>
                        <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <span>Management</span>
                          <span className="text-green-600">100% present</span>
                        </div>
                        <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <span>Finance</span>
                          <span className="text-green-600">100% present</span>
                        </div>
                        <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <span>Logistics</span>
                          <span className="text-amber-600">85% present</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="leave" className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  <Filter className="mr-2 h-4 w-4" /> Filter
                </Button>
                <Select defaultValue="all">
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Request Leave
              </Button>
            </div>
            
            <Card>
              <CardContent className="p-6">
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Employee</TableHead>
                        <TableHead>Position</TableHead>
                        <TableHead>Leave Type</TableHead>
                        <TableHead>From</TableHead>
                        <TableHead>To</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {leaveData.map((leave) => (
                        <TableRow key={leave.id}>
                          <TableCell>{leave.employee}</TableCell>
                          <TableCell>{leave.position}</TableCell>
                          <TableCell>{leave.type}</TableCell>
                          <TableCell>{leave.from}</TableCell>
                          <TableCell>{leave.to}</TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              leave.status === 'Approved' ? 'bg-green-100 text-green-800' :
                              leave.status === 'Completed' ? 'bg-blue-100 text-blue-800' :
                              'bg-amber-100 text-amber-800'
                            }`}>
                              {leave.status}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button variant="outline" size="sm">View</Button>
                              {leave.status === 'Pending' && (
                                <Button variant="outline" size="sm">Approve</Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Request Leave</CardTitle>
                </CardHeader>
                <CardContent>
                  <form className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Employee</label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select employee" />
                          </SelectTrigger>
                          <SelectContent>
                            {employeeData.map((emp) => (
                              <SelectItem key={emp.id} value={emp.id}>{emp.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Leave Type</label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="annual">Annual Leave</SelectItem>
                            <SelectItem value="sick">Sick Leave</SelectItem>
                            <SelectItem value="maternity">Maternity Leave</SelectItem>
                            <SelectItem value="paternity">Paternity Leave</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Start Date</label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full justify-start text-left font-normal"
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              Select start date
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium">End Date</label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full justify-start text-left font-normal"
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              Select end date
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Reason</label>
                      <Textarea placeholder="Enter reason for leave" />
                    </div>
                    
                    <Button type="submit" className="w-full">Submit Request</Button>
                  </form>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Leave Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <h4 className="text-sm font-medium">Current Leave Status</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gray-50 p-4 rounded-md">
                          <p className="text-sm text-muted-foreground">On Leave</p>
                          <p className="text-2xl font-bold">1</p>
                          <p className="text-sm text-muted-foreground">employee</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-md">
                          <p className="text-sm text-muted-foreground">Pending Requests</p>
                          <p className="text-2xl font-bold">2</p>
                          <p className="text-sm text-muted-foreground">requests</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h4 className="text-sm font-medium">Leave Balance Overview</h4>
                      <div className="space-y-2">
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm">Annual Leave</span>
                            <span className="text-sm">60% remaining</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-blue-600 h-2 rounded-full" style={{ width: "60%" }}></div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm">Sick Leave</span>
                            <span className="text-sm">80% remaining</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-green-600 h-2 rounded-full" style={{ width: "80%" }}></div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm">Other Leave</span>
                            <span className="text-sm">100% remaining</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-purple-600 h-2 rounded-full" style={{ width: "100%" }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h4 className="text-sm font-medium">Department Leave Schedule</h4>
                      <div className="space-y-2">
                        <div className="p-3 bg-gray-50 rounded-md">
                          <div className="flex justify-between">
                            <span>Dairy</span>
                            <span className="text-amber-600">1 on leave</span>
                          </div>
                        </div>
                        <div className="p-3 bg-gray-50 rounded-md">
                          <div className="flex justify-between">
                            <span>Plantation</span>
                            <span className="text-green-600">All present</span>
                          </div>
                        </div>
                        <div className="p-3 bg-gray-50 rounded-md">
                          <div className="flex justify-between">
                            <span>Management</span>
                            <span className="text-green-600">All present</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default EmployeeManagement;
