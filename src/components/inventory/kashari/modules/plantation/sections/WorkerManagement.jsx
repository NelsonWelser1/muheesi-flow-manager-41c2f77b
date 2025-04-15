
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon, PlusCircle, Search, User, Users, Phone, Clock } from 'lucide-react';
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from 'date-fns';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePlantationData } from '@/hooks/usePlantationData';

const WorkerManagement = () => {
  const { workersData, loading, error } = usePlantationData();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [payRate, setPayRate] = useState('');
  const [payPeriod, setPayPeriod] = useState('daily');
  const [status, setStatus] = useState('active');
  const [notes, setNotes] = useState('');
  const [workers, setWorkers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('add');
  
  // Work records
  const [workDate, setWorkDate] = useState(null);
  const [workerId, setWorkerId] = useState('');
  const [taskType, setTaskType] = useState('');
  const [location, setLocation] = useState('');
  const [hoursWorked, setHoursWorked] = useState('');
  const [workNotes, setWorkNotes] = useState('');
  const [workRecords, setWorkRecords] = useState([]);
  const [workSearchTerm, setWorkSearchTerm] = useState('');
  
  const jobTitles = [
    { value: 'field_worker', label: 'Field Worker' },
    { value: 'supervisor', label: 'Supervisor' },
    { value: 'driver', label: 'Driver' },
    { value: 'security', label: 'Security' },
    { value: 'temporary', label: 'Temporary Worker' }
  ];

  const payPeriods = [
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' }
  ];

  const statusOptions = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'on_leave', label: 'On Leave' }
  ];

  const taskTypes = [
    { value: 'planting', label: 'Planting' },
    { value: 'weeding', label: 'Weeding' },
    { value: 'pruning', label: 'Pruning' },
    { value: 'harvesting', label: 'Harvesting' },
    { value: 'spraying', label: 'Spraying' },
    { value: 'fertilizing', label: 'Fertilizing' },
    { value: 'irrigation', label: 'Irrigation' },
    { value: 'transport', label: 'Transport' },
    { value: 'other', label: 'Other' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    const newWorker = {
      id: Date.now(),
      name,
      phone,
      jobTitle,
      startDate,
      payRate: Number(payRate),
      payPeriod,
      status,
      notes,
      createdAt: new Date()
    };
    setWorkers([...workers, newWorker]);
    
    // Reset form
    setName('');
    setPhone('');
    setJobTitle('');
    setStartDate(null);
    setPayRate('');
    setPayPeriod('daily');
    setStatus('active');
    setNotes('');
  };

  const handleWorkRecordSubmit = (e) => {
    e.preventDefault();
    const newRecord = {
      id: Date.now(),
      workDate,
      workerId,
      workerName: [...workers, ...workersData].find(w => w.id.toString() === workerId.toString())?.name || '',
      taskType,
      location,
      hoursWorked: Number(hoursWorked),
      notes: workNotes,
      createdAt: new Date()
    };
    setWorkRecords([...workRecords, newRecord]);
    
    // Reset form
    setWorkDate(null);
    setWorkerId('');
    setTaskType('');
    setLocation('');
    setHoursWorked('');
    setWorkNotes('');
  };

  const filteredWorkers = [...workers, ...workersData].filter(worker => {
    if (!searchTerm) return true;
    
    const search = searchTerm.toLowerCase();
    return (
      (worker.name && worker.name.toLowerCase().includes(search)) ||
      (worker.phone && worker.phone.toLowerCase().includes(search)) ||
      (worker.jobTitle && jobTitles.find(j => j.value === worker.jobTitle)?.label.toLowerCase().includes(search)) ||
      (worker.notes && worker.notes.toLowerCase().includes(search))
    );
  });

  const filteredWorkRecords = workRecords.filter(record => {
    if (!workSearchTerm) return true;
    
    const search = workSearchTerm.toLowerCase();
    return (
      (record.workerName && record.workerName.toLowerCase().includes(search)) ||
      (record.taskType && taskTypes.find(t => t.value === record.taskType)?.label.toLowerCase().includes(search)) ||
      (record.location && record.location.toLowerCase().includes(search)) ||
      (record.notes && record.notes.toLowerCase().includes(search))
    );
  });

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="add">Add Worker</TabsTrigger>
          <TabsTrigger value="workers">Worker List</TabsTrigger>
          <TabsTrigger value="work">Work Records</TabsTrigger>
        </TabsList>
        
        <TabsContent value="add" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Add Worker</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium">Full Name</label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Worker's full name"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="phone" className="text-sm font-medium">Phone Number</label>
                    <Input
                      id="phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Contact number"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="jobTitle" className="text-sm font-medium">Job Title</label>
                    <Select value={jobTitle} onValueChange={setJobTitle}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select job title" />
                      </SelectTrigger>
                      <SelectContent>
                        {jobTitles.map(job => (
                          <SelectItem key={job.value} value={job.value}>
                            {job.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Start Date</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {startDate ? format(startDate, 'PPP') : <span>Select date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={startDate}
                          onSelect={setStartDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="payRate" className="text-sm font-medium">Pay Rate (UGX)</label>
                    <Input
                      id="payRate"
                      type="number"
                      min="0"
                      step="1000"
                      value={payRate}
                      onChange={(e) => setPayRate(e.target.value)}
                      placeholder="Amount in UGX"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="payPeriod" className="text-sm font-medium">Pay Period</label>
                    <Select value={payPeriod} onValueChange={setPayPeriod}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select pay period" />
                      </SelectTrigger>
                      <SelectContent>
                        {payPeriods.map(period => (
                          <SelectItem key={period.value} value={period.value}>
                            {period.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="status" className="text-sm font-medium">Status</label>
                    <Select value={status} onValueChange={setStatus}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        {statusOptions.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2 md:col-span-2 lg:col-span-3">
                    <label htmlFor="notes" className="text-sm font-medium">Notes</label>
                    <Textarea
                      id="notes"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Additional notes about the worker"
                      rows={3}
                    />
                  </div>
                </div>
                
                <Button type="submit" className="w-full md:w-auto">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Worker
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="workers" className="mt-4">
          <Card>
            <CardHeader className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2 text-primary" />
                Worker List
              </CardTitle>
              <div className="relative w-full md:w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search workers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-4 text-muted-foreground">Loading worker data...</div>
              ) : filteredWorkers.length === 0 ? (
                <div className="text-center py-4 text-muted-foreground">
                  {[...workers, ...workersData].length === 0 
                    ? "No workers added yet. Use the form to add workers."
                    : "No matching workers found. Try a different search term."}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Job Title</TableHead>
                        <TableHead>Start Date</TableHead>
                        <TableHead>Pay Rate (UGX)</TableHead>
                        <TableHead>Pay Period</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredWorkers.map(worker => (
                        <TableRow key={worker.id}>
                          <TableCell className="font-medium">{worker.name}</TableCell>
                          <TableCell>{worker.phone || 'N/A'}</TableCell>
                          <TableCell>
                            {jobTitles.find(j => j.value === worker.jobTitle)?.label || worker.jobTitle || 'N/A'}
                          </TableCell>
                          <TableCell>{worker.startDate ? format(new Date(worker.startDate), 'dd/MM/yyyy') : 'N/A'}</TableCell>
                          <TableCell>{typeof worker.payRate === 'number' ? worker.payRate.toLocaleString() : worker.payRate || 'N/A'}</TableCell>
                          <TableCell>
                            {payPeriods.find(p => p.value === worker.payPeriod)?.label || worker.payPeriod || 'N/A'}
                          </TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              worker.status === 'active' ? 'bg-green-100 text-green-800' : 
                              worker.status === 'inactive' ? 'bg-red-100 text-red-800' : 
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {statusOptions.find(s => s.value === worker.status)?.label || worker.status || 'N/A'}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="work" className="mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Add Work Record</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleWorkRecordSubmit} className="space-y-4">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Work Date</label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {workDate ? format(workDate, 'PPP') : <span>Select date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={workDate}
                            onSelect={setWorkDate}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="workerId" className="text-sm font-medium">Worker</label>
                      <Select value={workerId} onValueChange={setWorkerId}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select worker" />
                        </SelectTrigger>
                        <SelectContent>
                          {[...workers, ...workersData].map(worker => (
                            <SelectItem key={worker.id} value={worker.id.toString()}>
                              {worker.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="taskType" className="text-sm font-medium">Task Type</label>
                      <Select value={taskType} onValueChange={setTaskType}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select task type" />
                        </SelectTrigger>
                        <SelectContent>
                          {taskTypes.map(task => (
                            <SelectItem key={task.value} value={task.value}>
                              {task.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="location" className="text-sm font-medium">Location/Plot</label>
                      <Input
                        id="location"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="Work location or plot"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="hoursWorked" className="text-sm font-medium">Hours Worked</label>
                      <Input
                        id="hoursWorked"
                        type="number"
                        min="0"
                        step="0.5"
                        value={hoursWorked}
                        onChange={(e) => setHoursWorked(e.target.value)}
                        placeholder="Number of hours"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="workNotes" className="text-sm font-medium">Notes</label>
                      <Textarea
                        id="workNotes"
                        value={workNotes}
                        onChange={(e) => setWorkNotes(e.target.value)}
                        placeholder="Additional notes about the work performed"
                        rows={3}
                      />
                    </div>
                  </div>
                  
                  <Button type="submit" className="w-full">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Work Record
                  </Button>
                </form>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-col gap-4 justify-between items-start">
                <CardTitle className="flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-primary" />
                  Work Records
                </CardTitle>
                <div className="relative w-full">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search work records..."
                    value={workSearchTerm}
                    onChange={(e) => setWorkSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </CardHeader>
              <CardContent>
                {filteredWorkRecords.length === 0 ? (
                  <div className="text-center py-4 text-muted-foreground">
                    {workRecords.length === 0 
                      ? "No work records added yet. Use the form to add records."
                      : "No matching records found. Try a different search term."}
                  </div>
                ) : (
                  <div className="overflow-y-auto max-h-[400px]">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Worker</TableHead>
                          <TableHead>Task</TableHead>
                          <TableHead>Location</TableHead>
                          <TableHead>Hours</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredWorkRecords.map(record => (
                          <TableRow key={record.id}>
                            <TableCell>{record.workDate ? format(record.workDate, 'dd/MM/yyyy') : 'N/A'}</TableCell>
                            <TableCell>{record.workerName || 'N/A'}</TableCell>
                            <TableCell>
                              {taskTypes.find(t => t.value === record.taskType)?.label || record.taskType || 'N/A'}
                            </TableCell>
                            <TableCell>{record.location || 'N/A'}</TableCell>
                            <TableCell>{record.hoursWorked}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WorkerManagement;
