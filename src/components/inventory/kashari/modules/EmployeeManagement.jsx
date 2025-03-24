
import React, { useState } from 'react';
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
import { CalendarIcon, Plus, Search, Filter, Download, Phone, Mail, MapPin, Edit, Clock, User, Users } from "lucide-react";
import { format, subDays, differenceInYears } from 'date-fns';
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const EmployeeManagement = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('employees');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  // Mock employee data
  const [employees, setEmployees] = useState([
    {
      id: 'EMP001',
      name: 'John Mugisha',
      position: 'Farm Manager',
      department: 'Management',
      joinDate: '2020-03-15',
      contact: '+256 772 123 456',
      email: 'john.m@kasharifarm.com',
      address: 'Kazo Town, Uganda',
      salary: 1500000,
      status: 'active',
      photo: null
    },
    {
      id: 'EMP002',
      name: 'Sarah Kamugisha',
      position: 'Dairy Unit Supervisor',
      department: 'Dairy',
      joinDate: '2020-05-20',
      contact: '+256 782 234 567',
      email: 'sarah.k@kasharifarm.com',
      address: 'Rushere, Uganda',
      salary: 1200000,
      status: 'active',
      photo: null
    },
    {
      id: 'EMP003',
      name: 'David Asiimwe',
      position: 'Plantation Manager',
      department: 'Crops',
      joinDate: '2021-01-10',
      contact: '+256 755 345 678',
      email: 'david.a@kasharifarm.com',
      address: 'Kanoni, Uganda',
      salary: 1200000,
      status: 'active',
      photo: null
    },
    {
      id: 'EMP004',
      name: 'Grace Atuhaire',
      position: 'Accountant',
      department: 'Finance',
      joinDate: '2021-06-05',
      contact: '+256 701 456 789',
      email: 'grace.a@kasharifarm.com',
      address: 'Kazo, Uganda',
      salary: 1300000,
      status: 'active',
      photo: null
    },
    {
      id: 'EMP005',
      name: 'Peter Tumusiime',
      position: 'Veterinary Officer',
      department: 'Health',
      joinDate: '2021-09-15',
      contact: '+256 778 567 890',
      email: 'peter.t@kasharifarm.com',
      address: 'Mbarara, Uganda',
      salary: 1350000,
      status: 'active',
      photo: null
    },
    {
      id: 'EMP006',
      name: 'Mary Namugwanya',
      position: 'HR Officer',
      department: 'Administration',
      joinDate: '2022-02-20',
      contact: '+256 752 678 901',
      email: 'mary.n@kasharifarm.com',
      address: 'Kiruhura, Uganda',
      salary: 1100000,
      status: 'active',
      photo: null
    }
  ]);
  
  // Mock attendance data
  const [attendance, setAttendance] = useState([
    {
      id: 'ATT001',
      employeeId: 'EMP001',
      employeeName: 'John Mugisha',
      date: subDays(new Date(), 1),
      checkIn: '08:05',
      checkOut: '17:30',
      status: 'present',
      notes: 'Regular working day'
    },
    {
      id: 'ATT002',
      employeeId: 'EMP002',
      employeeName: 'Sarah Kamugisha',
      date: subDays(new Date(), 1),
      checkIn: '07:55',
      checkOut: '17:45',
      status: 'present',
      notes: 'Regular working day'
    },
    {
      id: 'ATT003',
      employeeId: 'EMP003',
      employeeName: 'David Asiimwe',
      date: subDays(new Date(), 1),
      checkIn: '08:10',
      checkOut: '17:20',
      status: 'present',
      notes: 'Regular working day'
    },
    {
      id: 'ATT004',
      employeeId: 'EMP004',
      employeeName: 'Grace Atuhaire',
      date: subDays(new Date(), 1),
      checkIn: null,
      checkOut: null,
      status: 'absent',
      notes: 'Sick leave'
    },
    {
      id: 'ATT005',
      employeeId: 'EMP005',
      employeeName: 'Peter Tumusiime',
      date: subDays(new Date(), 1),
      checkIn: '08:30',
      checkOut: '17:15',
      status: 'present',
      notes: 'Regular working day'
    },
    {
      id: 'ATT006',
      employeeId: 'EMP006',
      employeeName: 'Mary Namugwanya',
      date: subDays(new Date(), 1),
      checkIn: '08:00',
      checkOut: '17:00',
      status: 'present',
      notes: 'Regular working day'
    }
  ]);
  
  // Mock leave data
  const [leaveRecords, setLeaveRecords] = useState([
    {
      id: 'LV001',
      employeeId: 'EMP004',
      employeeName: 'Grace Atuhaire',
      type: 'Sick Leave',
      startDate: '2023-07-15',
      endDate: '2023-07-18',
      duration: 4,
      status: 'approved',
      reason: 'Medical treatment',
      approvedBy: 'John Mugisha'
    },
    {
      id: 'LV002',
      employeeId: 'EMP002',
      employeeName: 'Sarah Kamugisha',
      type: 'Annual Leave',
      startDate: '2023-08-01',
      endDate: '2023-08-07',
      duration: 7,
      status: 'approved',
      reason: 'Family visit',
      approvedBy: 'John Mugisha'
    },
    {
      id: 'LV003',
      employeeId: 'EMP006',
      employeeName: 'Mary Namugwanya',
      type: 'Maternity Leave',
      startDate: '2023-09-01',
      endDate: '2023-12-01',
      duration: 92,
      status: 'pending',
      reason: 'Maternity leave application',
      approvedBy: null
    },
    {
      id: 'LV004',
      employeeId: 'EMP003',
      employeeName: 'David Asiimwe',
      type: 'Annual Leave',
      startDate: '2023-07-20',
      endDate: '2023-07-25',
      duration: 6,
      status: 'approved',
      reason: 'Personal time off',
      approvedBy: 'John Mugisha'
    }
  ]);
  
  // Form states
  const [employeeForm, setEmployeeForm] = useState({
    name: '',
    position: '',
    department: '',
    joinDate: new Date(),
    contact: '',
    email: '',
    address: '',
    salary: '',
    status: 'active',
    photo: null
  });
  
  const [attendanceForm, setAttendanceForm] = useState({
    date: new Date(),
    employeeId: '',
    checkIn: '',
    checkOut: '',
    status: 'present',
    notes: ''
  });
  
  const [leaveForm, setLeaveForm] = useState({
    employeeId: '',
    type: '',
    startDate: new Date(),
    endDate: new Date(),
    reason: '',
    status: 'pending'
  });
  
  // Calculate statistics
  const totalEmployees = employees.length;
  const activeEmployees = employees.filter(emp => emp.status === 'active').length;
  const presentToday = attendance
    .filter(att => 
      format(att.date, 'yyyy-MM-dd') === format(subDays(new Date(), 1), 'yyyy-MM-dd') && 
      att.status === 'present'
    ).length;
  
  // Filter records based on search term
  const filteredEmployees = employees.filter(emp => 
    emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.id.toLowerCase().includes(searchTerm.toLowerCase())
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
    setEmployeeForm(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleAttendanceInputChange = (e) => {
    const { name, value } = e.target;
    setAttendanceForm(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleLeaveInputChange = (e) => {
    const { name, value } = e.target;
    setLeaveForm(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle select change
  const handleEmployeeSelectChange = (name, value) => {
    setEmployeeForm(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleAttendanceSelectChange = (name, value) => {
    setAttendanceForm(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleLeaveSelectChange = (name, value) => {
    setLeaveForm(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle date change
  const handleEmployeeDateChange = (date) => {
    setEmployeeForm(prev => ({
      ...prev,
      joinDate: date
    }));
  };
  
  const handleAttendanceDateChange = (date) => {
    setAttendanceForm(prev => ({
      ...prev,
      date: date
    }));
  };
  
  const handleLeaveStartDateChange = (date) => {
    setLeaveForm(prev => ({
      ...prev,
      startDate: date
    }));
  };
  
  const handleLeaveEndDateChange = (date) => {
    setLeaveForm(prev => ({
      ...prev,
      endDate: date
    }));
  };
  
  // Submit employee form
  const handleEmployeeSubmit = (e) => {
    e.preventDefault();
    
    // Validation
    if (!employeeForm.name || !employeeForm.position || !employeeForm.department || !employeeForm.contact) {
      toast({
        title: "Missing Fields",
        description: "Please fill all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    // Create new employee record
    const newEmployee = {
      id: `EMP${String(employees.length + 1).padStart(3, '0')}`,
      name: employeeForm.name,
      position: employeeForm.position,
      department: employeeForm.department,
      joinDate: format(employeeForm.joinDate, 'yyyy-MM-dd'),
      contact: employeeForm.contact,
      email: employeeForm.email,
      address: employeeForm.address,
      salary: employeeForm.salary ? Number(employeeForm.salary) : 0,
      status: employeeForm.status,
      photo: employeeForm.photo
    };
    
    // Add to records
    setEmployees(prev => [...prev, newEmployee]);
    
    // Reset form
    setEmployeeForm({
      name: '',
      position: '',
      department: '',
      joinDate: new Date(),
      contact: '',
      email: '',
      address: '',
      salary: '',
      status: 'active',
      photo: null
    });
    
    // Show success message
    toast({
      title: "Success",
      description: "Employee record has been added.",
    });
    
    // Switch to employees tab
    setActiveTab('employees');
  };
  
  // Submit attendance form
  const handleAttendanceSubmit = (e) => {
    e.preventDefault();
    
    // Validation
    if (!attendanceForm.employeeId || !attendanceForm.date) {
      toast({
        title: "Missing Fields",
        description: "Please fill all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    // Get employee name
    const employee = employees.find(emp => emp.id === attendanceForm.employeeId);
    
    if (!employee) {
      toast({
        title: "Error",
        description: "Selected employee not found.",
        variant: "destructive",
      });
      return;
    }
    
    // Create new attendance record
    const newAttendance = {
      id: `ATT${String(attendance.length + 1).padStart(3, '0')}`,
      employeeId: attendanceForm.employeeId,
      employeeName: employee.name,
      date: attendanceForm.date,
      checkIn: attendanceForm.status === 'present' ? attendanceForm.checkIn : null,
      checkOut: attendanceForm.status === 'present' ? attendanceForm.checkOut : null,
      status: attendanceForm.status,
      notes: attendanceForm.notes
    };
    
    // Add to records
    setAttendance(prev => [...prev, newAttendance]);
    
    // Reset form
    setAttendanceForm({
      date: new Date(),
      employeeId: '',
      checkIn: '',
      checkOut: '',
      status: 'present',
      notes: ''
    });
    
    // Show success message
    toast({
      title: "Success",
      description: "Attendance record has been added.",
    });
    
    // Switch to attendance tab
    setActiveTab('attendance');
  };
  
  // Submit leave form
  const handleLeaveSubmit = (e) => {
    e.preventDefault();
    
    // Validation
    if (!leaveForm.employeeId || !leaveForm.type || !leaveForm.startDate || !leaveForm.endDate) {
      toast({
        title: "Missing Fields",
        description: "Please fill all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    // Get employee name
    const employee = employees.find(emp => emp.id === leaveForm.employeeId);
    
    if (!employee) {
      toast({
        title: "Error",
        description: "Selected employee not found.",
        variant: "destructive",
      });
      return;
    }
    
    // Calculate duration
    const startDate = new Date(leaveForm.startDate);
    const endDate = new Date(leaveForm.endDate);
    
    // Check if start date is before end date
    if (startDate > endDate) {
      toast({
        title: "Invalid Dates",
        description: "Start date must be before end date.",
        variant: "destructive",
      });
      return;
    }
    
    // Calculate duration in days (inclusive of start and end dates)
    const durationInMs = endDate.getTime() - startDate.getTime();
    const durationInDays = Math.floor(durationInMs / (1000 * 60 * 60 * 24)) + 1;
    
    // Create new leave record
    const newLeave = {
      id: `LV${String(leaveRecords.length + 1).padStart(3, '0')}`,
      employeeId: leaveForm.employeeId,
      employeeName: employee.name,
      type: leaveForm.type,
      startDate: format(startDate, 'yyyy-MM-dd'),
      endDate: format(endDate, 'yyyy-MM-dd'),
      duration: durationInDays,
      status: leaveForm.status,
      reason: leaveForm.reason,
      approvedBy: null
    };
    
    // Add to records
    setLeaveRecords(prev => [...prev, newLeave]);
    
    // Reset form
    setLeaveForm({
      employeeId: '',
      type: '',
      startDate: new Date(),
      endDate: new Date(),
      reason: '',
      status: 'pending'
    });
    
    // Show success message
    toast({
      title: "Success",
      description: "Leave request has been submitted.",
    });
    
    // Switch to leave tab
    setActiveTab('leave');
  };
  
  // Format date
  const formatDate = (date) => {
    return format(new Date(date), 'MMM d, yyyy');
  };
  
  // Get status color
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'inactive':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'present':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'absent':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'late':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };
  
  // Get initials for avatar
  const getInitials = (name) => {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase();
  };
  
  // Get years of service
  const getYearsOfService = (joinDate) => {
    return differenceInYears(new Date(), new Date(joinDate));
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Employees & Contractors</CardTitle>
        <CardDescription>
          Manage staff records, attendance, leave, and human resources
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
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
                      <p className="text-2xl font-bold">{Math.round((presentToday / activeEmployees) * 100)}%</p>
                      <p className="text-sm text-muted-foreground">Present yesterday</p>
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
                            <AvatarImage src={employee.photo} />
                            <AvatarFallback>{getInitials(employee.name)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{employee.name}</p>
                            <p className="text-xs text-muted-foreground">{employee.id}</p>
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
                          <div className="flex items-center gap-1">
                            <Mail className="h-3 w-3" /> {employee.email}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{formatDate(employee.joinDate)}</TableCell>
                      <TableCell>{getYearsOfService(employee.joinDate)} years</TableCell>
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
                      <span>
                        {format(selectedDate, "MMM d, yyyy")}
                      </span>
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
                  {attendance
                    .filter(att => format(att.date, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd'))
                    .map((record) => (
                      <TableRow key={record.id}>
                        <TableCell>{formatDate(record.date)}</TableCell>
                        <TableCell className="font-medium">{record.employeeName}</TableCell>
                        <TableCell>{record.checkIn || '-'}</TableCell>
                        <TableCell>{record.checkOut || '-'}</TableCell>
                        <TableCell>
                          {record.checkIn && record.checkOut 
                            ? calculateHours(record.checkIn, record.checkOut) 
                            : '-'}
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(record.status)} variant="outline">
                            {record.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{record.notes}</TableCell>
                      </TableRow>
                    ))}
                  {attendance.filter(att => format(att.date, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd')).length === 0 && (
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
                      <TableCell className="font-medium">{record.employeeName}</TableCell>
                      <TableCell>{record.type}</TableCell>
                      <TableCell>{record.duration} days</TableCell>
                      <TableCell>
                        {formatDate(record.startDate)} - {formatDate(record.endDate)}
                      </TableCell>
                      <TableCell>{record.reason}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(record.status)} variant="outline">
                          {record.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {record.status === 'pending' && (
                          <div className="flex gap-1">
                            <Button variant="ghost" size="sm" className="text-green-500 hover:text-green-700">
                              Approve
                            </Button>
                            <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700">
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
                      <Label htmlFor="joinDate">Join Date *</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !employeeForm.joinDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {employeeForm.joinDate ? format(employeeForm.joinDate, "PPP") : <span>Select date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={employeeForm.joinDate}
                            onSelect={handleEmployeeDateChange}
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
                            onSelect={handleAttendanceDateChange}
                            initialFocus
                            className="p-3 pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="employeeId">Employee *</Label>
                      <Select
                        value={attendanceForm.employeeId}
                        onValueChange={(value) => handleAttendanceSelectChange('employeeId', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select employee" />
                        </SelectTrigger>
                        <SelectContent>
                          {employees
                            .filter(emp => emp.status === 'active')
                            .map(emp => (
                              <SelectItem key={emp.id} value={emp.id}>{emp.name}</SelectItem>
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
                    
                    {attendanceForm.status === 'present' || attendanceForm.status === 'late' ? (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="checkIn">Check-In Time</Label>
                          <Input
                            id="checkIn"
                            name="checkIn"
                            type="time"
                            value={attendanceForm.checkIn}
                            onChange={handleAttendanceInputChange}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="checkOut">Check-Out Time</Label>
                          <Input
                            id="checkOut"
                            name="checkOut"
                            type="time"
                            value={attendanceForm.checkOut}
                            onChange={handleAttendanceInputChange}
                          />
                        </div>
                      </>
                    ) : null}
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
                      <Label htmlFor="employeeId">Employee *</Label>
                      <Select
                        value={leaveForm.employeeId}
                        onValueChange={(value) => handleLeaveSelectChange('employeeId', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select employee" />
                        </SelectTrigger>
                        <SelectContent>
                          {employees
                            .filter(emp => emp.status === 'active')
                            .map(emp => (
                              <SelectItem key={emp.id} value={emp.id}>{emp.name}</SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="type">Leave Type *</Label>
                      <Select
                        value={leaveForm.type}
                        onValueChange={(value) => handleLeaveSelectChange('type', value)}
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
                      <Label htmlFor="startDate">Start Date *</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !leaveForm.startDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {leaveForm.startDate ? format(leaveForm.startDate, "PPP") : <span>Select date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={leaveForm.startDate}
                            onSelect={handleLeaveStartDateChange}
                            initialFocus
                            className="p-3 pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="endDate">End Date *</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !leaveForm.endDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {leaveForm.endDate ? format(leaveForm.endDate, "PPP") : <span>Select date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={leaveForm.endDate}
                            onSelect={handleLeaveEndDateChange}
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
