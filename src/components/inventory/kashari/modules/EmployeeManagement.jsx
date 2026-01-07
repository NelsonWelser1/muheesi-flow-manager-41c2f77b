
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useToast } from "@/components/ui/use-toast";
import { CalendarIcon, Plus, Search, Download, Phone, Mail, Edit, Clock, User, Users, Loader2 } from "lucide-react";
import { format, subDays, differenceInYears } from 'date-fns';
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useKashariEmployees } from '@/hooks/useKashariEmployees';
import { useKashariAttendance } from '@/hooks/useKashariAttendance';
import { useKashariLeave } from '@/hooks/useKashariLeave';

const EmployeeManagement = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('employees');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  // Use database hooks
  const { employees, loading: employeesLoading, addEmployee } = useKashariEmployees();
  const { attendance, loading: attendanceLoading, recordAttendance, getAttendanceStats } = useKashariAttendance();
  const { leaveRecords, loading: leaveLoading, submitLeaveRequest, approveLeave, rejectLeave } = useKashariLeave();
  
  // Form states
  const [employeeForm, setEmployeeForm] = useState({
    name: '',
    position: '',
    department: '',
    join_date: new Date(),
    contact: '',
    email: '',
    address: '',
    salary: '',
    status: 'active',
    photo_url: null
  });
  
  const [attendanceForm, setAttendanceForm] = useState({
    date: new Date(),
    employee_id: '',
    check_in: '',
    check_out: '',
    status: 'present',
    notes: ''
  });
  
  const [leaveForm, setLeaveForm] = useState({
    employee_id: '',
    leave_type: '',
    start_date: new Date(),
    end_date: new Date(),
    reason: '',
    status: 'pending'
  });
  
  // Calculate statistics
  const totalEmployees = employees.length;
  const activeEmployees = employees.filter(emp => emp.status === 'active').length;
  const attendanceStats = getAttendanceStats();
  
  // Filter records based on search term
  const filteredEmployees = employees.filter(emp => 
    emp.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.position?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.employee_id?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Department options
  const departments = [
    'Management', 'Dairy', 'Crops', 'Finance', 'Administration', 
    'Health', 'Maintenance', 'Security', 'Logistics'
  ];
  
  // Position options by department
  const positions = {
    'Management': ['Farm Manager', 'Assistant Manager', 'Operations Manager'],
    'Dairy': ['Dairy Unit Supervisor', 'Milking Technician', 'Cattle Handler'],
    'Crops': ['Plantation Manager', 'Field Worker', 'Harvester'],
    'Finance': ['Accountant', 'Bookkeeper', 'Financial Analyst'],
    'Administration': ['HR Officer', 'Administrative Assistant', 'Office Manager'],
    'Health': ['Veterinary Officer', 'Animal Health Technician', 'Health Assistant'],
    'Maintenance': ['Maintenance Supervisor', 'Mechanic', 'Electrician'],
    'Security': ['Security Officer', 'Guard', 'Supervisor'],
    'Logistics': ['Logistics Officer', 'Driver', 'Store Keeper']
  };
  
  // Leave type options
  const leaveTypes = [
    'Annual Leave', 'Sick Leave', 'Maternity Leave', 'Paternity Leave', 
    'Compassionate Leave', 'Study Leave', 'Unpaid Leave'
  ];
  
  // Handle form input change
  const handleEmployeeInputChange = (e) => {
    const { name, value } = e.target;
    setEmployeeForm(prev => ({ ...prev, [name]: value }));
  };
  
  const handleAttendanceInputChange = (e) => {
    const { name, value } = e.target;
    setAttendanceForm(prev => ({ ...prev, [name]: value }));
  };
  
  const handleLeaveInputChange = (e) => {
    const { name, value } = e.target;
    setLeaveForm(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle select change
  const handleEmployeeSelectChange = (name, value) => {
    setEmployeeForm(prev => ({ ...prev, [name]: value }));
  };
  
  const handleAttendanceSelectChange = (name, value) => {
    setAttendanceForm(prev => ({ ...prev, [name]: value }));
  };
  
  const handleLeaveSelectChange = (name, value) => {
    setLeaveForm(prev => ({ ...prev, [name]: value }));
  };
  
  // Submit employee form
  const handleEmployeeSubmit = async (e) => {
    e.preventDefault();
    
    if (!employeeForm.name || !employeeForm.position || !employeeForm.department || !employeeForm.contact) {
      toast({
        title: "Missing Fields",
        description: "Please fill all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    const result = await addEmployee({
      name: employeeForm.name,
      position: employeeForm.position,
      department: employeeForm.department,
      join_date: format(employeeForm.join_date, 'yyyy-MM-dd'),
      contact: employeeForm.contact,
      email: employeeForm.email,
      address: employeeForm.address,
      salary: employeeForm.salary ? Number(employeeForm.salary) : 0,
      status: employeeForm.status,
      photo_url: employeeForm.photo_url
    });
    
    if (result.success) {
      setEmployeeForm({
        name: '',
        position: '',
        department: '',
        join_date: new Date(),
        contact: '',
        email: '',
        address: '',
        salary: '',
        status: 'active',
        photo_url: null
      });
      setActiveTab('employees');
    }
  };
  
  // Submit attendance form
  const handleAttendanceSubmit = async (e) => {
    e.preventDefault();
    
    if (!attendanceForm.employee_id || !attendanceForm.date) {
      toast({
        title: "Missing Fields",
        description: "Please fill all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    const result = await recordAttendance({
      employee_id: attendanceForm.employee_id,
      date: format(attendanceForm.date, 'yyyy-MM-dd'),
      check_in: attendanceForm.status === 'present' || attendanceForm.status === 'late' ? attendanceForm.check_in : null,
      check_out: attendanceForm.status === 'present' || attendanceForm.status === 'late' ? attendanceForm.check_out : null,
      status: attendanceForm.status,
      notes: attendanceForm.notes
    });
    
    if (result.success) {
      setAttendanceForm({
        date: new Date(),
        employee_id: '',
        check_in: '',
        check_out: '',
        status: 'present',
        notes: ''
      });
      setActiveTab('attendance');
    }
  };
  
  // Submit leave form
  const handleLeaveSubmit = async (e) => {
    e.preventDefault();
    
    if (!leaveForm.employee_id || !leaveForm.leave_type || !leaveForm.start_date || !leaveForm.end_date) {
      toast({
        title: "Missing Fields",
        description: "Please fill all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    const startDate = new Date(leaveForm.start_date);
    const endDate = new Date(leaveForm.end_date);
    
    if (startDate > endDate) {
      toast({
        title: "Invalid Dates",
        description: "Start date must be before end date.",
        variant: "destructive",
      });
      return;
    }
    
    const result = await submitLeaveRequest({
      employee_id: leaveForm.employee_id,
      leave_type: leaveForm.leave_type,
      start_date: format(startDate, 'yyyy-MM-dd'),
      end_date: format(endDate, 'yyyy-MM-dd'),
      reason: leaveForm.reason
    });
    
    if (result.success) {
      setLeaveForm({
        employee_id: '',
        leave_type: '',
        start_date: new Date(),
        end_date: new Date(),
        reason: '',
        status: 'pending'
      });
      setActiveTab('leave');
    }
  };
  
  // Handle leave approval/rejection
  const handleLeaveAction = async (leaveId, action) => {
    if (action === 'approved') {
      await approveLeave(leaveId, 'Admin');
    } else {
      await rejectLeave(leaveId);
    }
  };
  
  // Format date
  const formatDate = (date) => {
    if (!date) return '-';
    return format(new Date(date), 'MMM d, yyyy');
  };
  
  // Get status color
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
      case 'present':
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'inactive':
      case 'absent':
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'late':
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };
  
  // Get initials for avatar
  const getInitials = (name) => {
    if (!name) return '??';
    return name.split(' ').map(part => part.charAt(0)).join('').toUpperCase();
  };
  
  // Get years of service
  const getYearsOfService = (joinDate) => {
    if (!joinDate) return 0;
    return differenceInYears(new Date(), new Date(joinDate));
  };
  
  // Filter attendance by selected date
  const filteredAttendance = attendance.filter(att => 
    format(new Date(att.date), 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd')
  );
  
  if (employeesLoading && employees.length === 0) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Employees & Contractors</CardTitle>
        <CardDescription>
          Manage staff records, attendance, leave, and human resources
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="employees">Employees</TabsTrigger>
            <TabsTrigger value="attendance">Attendance</TabsTrigger>
            <TabsTrigger value="leave">Leave Management</TabsTrigger>
            <TabsTrigger value="add-employee">Add Employee</TabsTrigger>
            <TabsTrigger value="add-attendance">Record Attendance</TabsTrigger>
            <TabsTrigger value="apply-leave">Apply Leave</TabsTrigger>
          </TabsList>
          
          <TabsContent value="employees" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between space-x-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">Total Staff</p>
                      <p className="text-2xl font-bold">{totalEmployees}</p>
                      <p className="text-sm text-muted-foreground">Employees & contractors</p>
                    </div>
                    <div className="bg-blue-100 p-3 rounded-full">
                      <Users className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between space-x-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">Active Staff</p>
                      <p className="text-2xl font-bold">{activeEmployees}</p>
                      <p className="text-sm text-muted-foreground">Currently employed</p>
                    </div>
                    <div className="bg-green-100 p-3 rounded-full">
                      <User className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between space-x-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">Attendance Rate</p>
                      <p className="text-2xl font-bold">
                        {activeEmployees > 0 ? Math.round((attendanceStats.present / activeEmployees) * 100) : 0}%
                      </p>
                      <p className="text-sm text-muted-foreground">Present today</p>
                    </div>
                    <div className="bg-amber-100 p-3 rounded-full">
                      <Clock className="h-6 w-6 text-amber-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-4">
              <div className="relative w-full sm:w-auto flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search employees..."
                  className="pl-8 w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Button size="sm" onClick={() => setActiveTab('add-employee')}>
                  <Plus className="h-4 w-4 mr-1" /> Add Employee
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-1" /> Export
                </Button>
              </div>
            </div>
            
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Position</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Join Date</TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEmployees.map((employee) => (
                    <TableRow key={employee.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={employee.photo_url} />
                            <AvatarFallback>{getInitials(employee.name)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{employee.name}</p>
                            <p className="text-xs text-muted-foreground">{employee.employee_id}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{employee.position}</TableCell>
                      <TableCell>{employee.department}</TableCell>
                      <TableCell>
                        <div className="flex flex-col text-sm">
                          <div className="flex items-center gap-1">
                            <Phone className="h-3 w-3" /> {employee.contact}
                          </div>
                          {employee.email && (
                            <div className="flex items-center gap-1">
                              <Mail className="h-3 w-3" /> {employee.email}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{formatDate(employee.join_date)}</TableCell>
                      <TableCell>{getYearsOfService(employee.join_date)} years</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(employee.status)} variant="outline">
                          {employee.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredEmployees.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-4 text-muted-foreground">
                        No employee records found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
          
          <TabsContent value="attendance" className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-4">
              <div className="relative w-full sm:w-auto flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search attendance records..."
                  className="pl-8 w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Button size="sm" onClick={() => setActiveTab('add-attendance')}>
                  <Plus className="h-4 w-4 mr-1" /> Record Attendance
                </Button>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className="flex items-center gap-1">
                      <CalendarIcon className="h-4 w-4" />
                      <span>{format(selectedDate, "MMM d, yyyy")}</span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="end">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Employee</TableHead>
                    <TableHead>Clock In</TableHead>
                    <TableHead>Clock Out</TableHead>
                    <TableHead>Hours</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAttendance.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell>{formatDate(record.date)}</TableCell>
                      <TableCell className="font-medium">
                        {record.kashari_employees?.name || 'Unknown'}
                      </TableCell>
                      <TableCell>{record.check_in || '-'}</TableCell>
                      <TableCell>{record.check_out || '-'}</TableCell>
                      <TableCell>
                        {record.check_in && record.check_out 
                          ? calculateHours(record.check_in, record.check_out) 
                          : '-'}
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(record.status)} variant="outline">
                          {record.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{record.notes || '-'}</TableCell>
                    </TableRow>
                  ))}
                  {filteredAttendance.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-4 text-muted-foreground">
                        No attendance records found for this date
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
          
          <TabsContent value="leave" className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-4">
              <div className="relative w-full sm:w-auto flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search leave records..."
                  className="pl-8 w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Button size="sm" onClick={() => setActiveTab('apply-leave')}>
                  <Plus className="h-4 w-4 mr-1" /> Apply Leave
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-1" /> Export
                </Button>
              </div>
            </div>
            
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Leave Type</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Dates</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leaveRecords.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell className="font-medium">
                        {record.kashari_employees?.name || 'Unknown'}
                      </TableCell>
                      <TableCell>{record.leave_type}</TableCell>
                      <TableCell>{record.duration || '-'} days</TableCell>
                      <TableCell>
                        {formatDate(record.start_date)} - {formatDate(record.end_date)}
                      </TableCell>
                      <TableCell>{record.reason || '-'}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(record.status)} variant="outline">
                          {record.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {record.status === 'pending' && (
                          <div className="flex gap-1">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-green-500 hover:text-green-700"
                              onClick={() => handleLeaveAction(record.id, 'approved')}
                            >
                              Approve
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-red-500 hover:text-red-700"
                              onClick={() => handleLeaveAction(record.id, 'rejected')}
                            >
                              Reject
                            </Button>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                  {leaveRecords.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-4 text-muted-foreground">
                        No leave records found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
          
          <TabsContent value="add-employee">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Add New Employee</CardTitle>
                <CardDescription>Enter employee details to create a new record</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleEmployeeSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        name="name"
                        value={employeeForm.name}
                        onChange={handleEmployeeInputChange}
                        placeholder="Enter full name"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="department">Department *</Label>
                      <Select
                        value={employeeForm.department}
                        onValueChange={(value) => handleEmployeeSelectChange('department', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                        <SelectContent>
                          {departments.map(dept => (
                            <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="position">Position *</Label>
                      <Select
                        value={employeeForm.position}
                        onValueChange={(value) => handleEmployeeSelectChange('position', value)}
                        disabled={!employeeForm.department}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select position" />
                        </SelectTrigger>
                        <SelectContent>
                          {employeeForm.department && positions[employeeForm.department]
                            ? positions[employeeForm.department].map(pos => (
                                <SelectItem key={pos} value={pos}>{pos}</SelectItem>
                              ))
                            : <SelectItem value="none">Select department first</SelectItem>
                          }
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="join_date">Join Date *</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !employeeForm.join_date && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {employeeForm.join_date ? format(employeeForm.join_date, "PPP") : <span>Select date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={employeeForm.join_date}
                            onSelect={(date) => setEmployeeForm(prev => ({ ...prev, join_date: date }))}
                            initialFocus
                            className="p-3 pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="contact">Contact Number *</Label>
                      <Input
                        id="contact"
                        name="contact"
                        value={employeeForm.contact}
                        onChange={handleEmployeeInputChange}
                        placeholder="Enter contact number"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={employeeForm.email}
                        onChange={handleEmployeeInputChange}
                        placeholder="Enter email address"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="address">Residential Address</Label>
                      <Input
                        id="address"
                        name="address"
                        value={employeeForm.address}
                        onChange={handleEmployeeInputChange}
                        placeholder="Enter address"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="salary">Salary (UGX)</Label>
                      <Input
                        id="salary"
                        name="salary"
                        type="number"
                        value={employeeForm.salary}
                        onChange={handleEmployeeInputChange}
                        placeholder="Enter salary amount"
                        min="0"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="status">Status *</Label>
                      <Select
                        value={employeeForm.status}
                        onValueChange={(value) => handleEmployeeSelectChange('status', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-2 pt-4">
                    <Button type="button" variant="outline" onClick={() => setActiveTab('employees')}>
                      Cancel
                    </Button>
                    <Button type="submit">
                      Add Employee
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="add-attendance">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Record Attendance</CardTitle>
                <CardDescription>Track employee attendance and working hours</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAttendanceSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="date">Date *</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !attendanceForm.date && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {attendanceForm.date ? format(attendanceForm.date, "PPP") : <span>Select date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={attendanceForm.date}
                            onSelect={(date) => setAttendanceForm(prev => ({ ...prev, date }))}
                            initialFocus
                            className="p-3 pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="employee_id">Employee *</Label>
                      <Select
                        value={attendanceForm.employee_id}
                        onValueChange={(value) => handleAttendanceSelectChange('employee_id', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select employee" />
                        </SelectTrigger>
                        <SelectContent>
                          {employees
                            .filter(emp => emp.status === 'active')
                            .map(emp => (
                              <SelectItem key={emp.id} value={emp.id}>{emp.full_name}</SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="status">Attendance Status *</Label>
                      <Select
                        value={attendanceForm.status}
                        onValueChange={(value) => handleAttendanceSelectChange('status', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="present">Present</SelectItem>
                          <SelectItem value="absent">Absent</SelectItem>
                          <SelectItem value="late">Late</SelectItem>
                          <SelectItem value="leave">On Leave</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {(attendanceForm.status === 'present' || attendanceForm.status === 'late') && (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="check_in">Check-In Time</Label>
                          <Input
                            id="check_in"
                            name="check_in"
                            type="time"
                            value={attendanceForm.check_in}
                            onChange={handleAttendanceInputChange}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="check_out">Check-Out Time</Label>
                          <Input
                            id="check_out"
                            name="check_out"
                            type="time"
                            value={attendanceForm.check_out}
                            onChange={handleAttendanceInputChange}
                          />
                        </div>
                      </>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea
                      id="notes"
                      name="notes"
                      value={attendanceForm.notes}
                      onChange={handleAttendanceInputChange}
                      placeholder="Enter any additional notes"
                      rows={3}
                    />
                  </div>
                  
                  <div className="flex justify-end space-x-2 pt-4">
                    <Button type="button" variant="outline" onClick={() => setActiveTab('attendance')}>
                      Cancel
                    </Button>
                    <Button type="submit">
                      Record Attendance
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="apply-leave">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Apply for Leave</CardTitle>
                <CardDescription>Submit leave application for approval</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLeaveSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="employee_id">Employee *</Label>
                      <Select
                        value={leaveForm.employee_id}
                        onValueChange={(value) => handleLeaveSelectChange('employee_id', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select employee" />
                        </SelectTrigger>
                        <SelectContent>
                          {employees
                            .filter(emp => emp.status === 'active')
                            .map(emp => (
                              <SelectItem key={emp.id} value={emp.id}>{emp.full_name}</SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="leave_type">Leave Type *</Label>
                      <Select
                        value={leaveForm.leave_type}
                        onValueChange={(value) => handleLeaveSelectChange('leave_type', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select leave type" />
                        </SelectTrigger>
                        <SelectContent>
                          {leaveTypes.map(type => (
                            <SelectItem key={type} value={type}>{type}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="start_date">Start Date *</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !leaveForm.start_date && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {leaveForm.start_date ? format(leaveForm.start_date, "PPP") : <span>Select date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={leaveForm.start_date}
                            onSelect={(date) => setLeaveForm(prev => ({ ...prev, start_date: date }))}
                            initialFocus
                            className="p-3 pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="end_date">End Date *</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !leaveForm.end_date && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {leaveForm.end_date ? format(leaveForm.end_date, "PPP") : <span>Select date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={leaveForm.end_date}
                            onSelect={(date) => setLeaveForm(prev => ({ ...prev, end_date: date }))}
                            initialFocus
                            className="p-3 pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    
                    <div className="col-span-1 sm:col-span-2 space-y-2">
                      <Label htmlFor="reason">Reason for Leave *</Label>
                      <Textarea
                        id="reason"
                        name="reason"
                        value={leaveForm.reason}
                        onChange={handleLeaveInputChange}
                        placeholder="Enter reason for leave"
                        rows={3}
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-2 pt-4">
                    <Button type="button" variant="outline" onClick={() => setActiveTab('leave')}>
                      Cancel
                    </Button>
                    <Button type="submit">
                      Apply for Leave
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

// Helper function to calculate hours worked
const calculateHours = (checkIn, checkOut) => {
  if (!checkIn || !checkOut) return '-';
  
  const [inHour, inMinute] = checkIn.split(':').map(Number);
  const [outHour, outMinute] = checkOut.split(':').map(Number);
  
  const totalInMinutes = inHour * 60 + inMinute;
  const totalOutMinutes = outHour * 60 + outMinute;
  
  const diffMinutes = totalOutMinutes - totalInMinutes;
  
  if (diffMinutes <= 0) return '-';
  
  const hours = Math.floor(diffMinutes / 60);
  const minutes = diffMinutes % 60;
  
  return `${hours}h ${minutes}m`;
};

export default EmployeeManagement;
