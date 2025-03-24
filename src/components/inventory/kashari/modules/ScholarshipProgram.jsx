
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { Search, Plus, Download, RefreshCw } from "lucide-react";
import { format } from 'date-fns';

const ScholarshipProgram = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('recipients');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Mock data for scholarship recipients
  const [scholarships, setScholarships] = useState([
    {
      id: "SCH-001",
      studentName: "Sarah Namugwanya",
      school: "Kyampangara Primary School",
      grade: "P7",
      amount: 850000,
      startDate: "2023-01-15",
      endDate: "2023-12-15",
      status: "active",
      guardianContact: "+256 778 123 456",
      performanceRating: "Excellent"
    },
    {
      id: "SCH-002",
      studentName: "Joshua Mugisha",
      school: "St. Mary's Secondary School",
      grade: "S3",
      amount: 1250000,
      startDate: "2023-02-01",
      endDate: "2023-12-01",
      status: "active",
      guardianContact: "+256 705 789 012",
      performanceRating: "Good"
    },
    {
      id: "SCH-003",
      studentName: "Esther Kyomugisha",
      school: "Kanoni Girls School",
      grade: "S6",
      amount: 1500000,
      startDate: "2023-01-10",
      endDate: "2023-12-10",
      status: "active",
      guardianContact: "+256 772 345 678",
      performanceRating: "Excellent"
    },
    {
      id: "SCH-004",
      studentName: "David Tumusiime",
      school: "Kazo Central College",
      grade: "S4",
      amount: 1350000,
      startDate: "2023-02-15",
      endDate: "2023-12-15",
      status: "on-hold",
      guardianContact: "+256 753 901 234",
      performanceRating: "Fair"
    },
    {
      id: "SCH-005",
      studentName: "Grace Atuhaire",
      school: "Buremba Primary School",
      grade: "P6",
      amount: 750000,
      startDate: "2023-01-20",
      endDate: "2023-12-20",
      status: "active",
      guardianContact: "+256 782 567 890",
      performanceRating: "Good"
    }
  ]);
  
  // Form state for new application
  const [newApplication, setNewApplication] = useState({
    studentName: '',
    school: '',
    grade: '',
    amount: '',
    reason: '',
    guardianName: '',
    guardianContact: '',
    guardianRelation: ''
  });
  
  // Filter scholarships based on search term
  const filteredScholarships = scholarships.filter(scholarship => 
    scholarship.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    scholarship.school.toLowerCase().includes(searchTerm.toLowerCase()) ||
    scholarship.id.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewApplication(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSelectChange = (name, value) => {
    setNewApplication(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmitApplication = (e) => {
    e.preventDefault();
    
    // Validation
    if (!newApplication.studentName || !newApplication.school || !newApplication.grade || !newApplication.amount) {
      toast({
        title: "Missing Fields",
        description: "Please fill all required fields before submitting.",
        variant: "destructive",
      });
      return;
    }
    
    // Create new scholarship record
    const newScholarship = {
      id: `SCH-${String(scholarships.length + 1).padStart(3, '0')}`,
      studentName: newApplication.studentName,
      school: newApplication.school,
      grade: newApplication.grade,
      amount: parseFloat(newApplication.amount),
      startDate: format(new Date(), 'yyyy-MM-dd'),
      endDate: format(new Date(new Date().setFullYear(new Date().getFullYear() + 1)), 'yyyy-MM-dd'),
      status: "pending",
      guardianContact: newApplication.guardianContact,
      performanceRating: "N/A"
    };
    
    // Update scholarships list
    setScholarships(prev => [...prev, newScholarship]);
    
    // Reset form
    setNewApplication({
      studentName: '',
      school: '',
      grade: '',
      amount: '',
      reason: '',
      guardianName: '',
      guardianContact: '',
      guardianRelation: ''
    });
    
    // Show success message
    toast({
      title: "Application Submitted",
      description: "Scholarship application has been submitted successfully.",
    });
    
    // Switch to recipients tab
    setActiveTab('recipients');
  };
  
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-UG', {
      style: 'currency',
      currency: 'UGX'
    }).format(amount);
  };
  
  // Function to get status badge color
  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'on-hold':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'completed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Scholarship Program</CardTitle>
        <CardDescription>
          Manage educational scholarships for needy students in the community
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="recipients">Recipients</TabsTrigger>
            <TabsTrigger value="apply">New Application</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>
          
          <TabsContent value="recipients" className="space-y-4">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
              <div className="relative w-full md:w-auto flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search recipients..."
                  className="pl-8 w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2 w-full md:w-auto">
                <Button variant="outline" size="sm" onClick={() => setActiveTab('apply')}>
                  <Plus className="h-4 w-4 mr-1" /> New Application
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
                    <TableHead>ID</TableHead>
                    <TableHead>Student Name</TableHead>
                    <TableHead>School</TableHead>
                    <TableHead>Grade</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Performance</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredScholarships.length > 0 ? (
                    filteredScholarships.map((scholarship) => (
                      <TableRow key={scholarship.id}>
                        <TableCell className="font-medium">{scholarship.id}</TableCell>
                        <TableCell>{scholarship.studentName}</TableCell>
                        <TableCell>{scholarship.school}</TableCell>
                        <TableCell>{scholarship.grade}</TableCell>
                        <TableCell>{formatCurrency(scholarship.amount)}</TableCell>
                        <TableCell>
                          {format(new Date(scholarship.startDate), 'MMM d, yyyy')} - 
                          {format(new Date(scholarship.endDate), 'MMM d, yyyy')}
                        </TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(scholarship.status)}`}>
                            {scholarship.status.charAt(0).toUpperCase() + scholarship.status.slice(1)}
                          </span>
                        </TableCell>
                        <TableCell>{scholarship.performanceRating}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-4 text-muted-foreground">
                        No scholarship records found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
          
          <TabsContent value="apply">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Scholarship Application Form</CardTitle>
                <CardDescription>Submit new scholarship application for review</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmitApplication} className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-base font-medium">Student Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="studentName">Student Full Name *</Label>
                        <Input
                          id="studentName"
                          name="studentName"
                          value={newApplication.studentName}
                          onChange={handleInputChange}
                          placeholder="Enter student's full name"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="school">School *</Label>
                        <Input
                          id="school"
                          name="school"
                          value={newApplication.school}
                          onChange={handleInputChange}
                          placeholder="Enter school name"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="grade">Grade/Class *</Label>
                        <Select
                          value={newApplication.grade}
                          onValueChange={(value) => handleSelectChange('grade', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select grade/class" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="P1">P1</SelectItem>
                            <SelectItem value="P2">P2</SelectItem>
                            <SelectItem value="P3">P3</SelectItem>
                            <SelectItem value="P4">P4</SelectItem>
                            <SelectItem value="P5">P5</SelectItem>
                            <SelectItem value="P6">P6</SelectItem>
                            <SelectItem value="P7">P7</SelectItem>
                            <SelectItem value="S1">S1</SelectItem>
                            <SelectItem value="S2">S2</SelectItem>
                            <SelectItem value="S3">S3</SelectItem>
                            <SelectItem value="S4">S4</SelectItem>
                            <SelectItem value="S5">S5</SelectItem>
                            <SelectItem value="S6">S6</SelectItem>
                            <SelectItem value="University">University</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="amount">Amount Requested (UGX) *</Label>
                        <Input
                          id="amount"
                          name="amount"
                          type="number"
                          value={newApplication.amount}
                          onChange={handleInputChange}
                          placeholder="Enter amount in UGX"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="reason">Reason for Application</Label>
                      <Textarea
                        id="reason"
                        name="reason"
                        value={newApplication.reason}
                        onChange={handleInputChange}
                        placeholder="Explain why the student needs financial assistance"
                        rows={3}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-base font-medium">Guardian Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="guardianName">Guardian Full Name</Label>
                        <Input
                          id="guardianName"
                          name="guardianName"
                          value={newApplication.guardianName}
                          onChange={handleInputChange}
                          placeholder="Enter guardian's full name"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="guardianContact">Guardian Contact *</Label>
                        <Input
                          id="guardianContact"
                          name="guardianContact"
                          value={newApplication.guardianContact}
                          onChange={handleInputChange}
                          placeholder="Enter guardian's phone number"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="guardianRelation">Relationship to Student</Label>
                        <Select
                          value={newApplication.guardianRelation}
                          onValueChange={(value) => handleSelectChange('guardianRelation', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select relationship" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Parent">Parent</SelectItem>
                            <SelectItem value="Grandparent">Grandparent</SelectItem>
                            <SelectItem value="Sibling">Sibling</SelectItem>
                            <SelectItem value="Aunt/Uncle">Aunt/Uncle</SelectItem>
                            <SelectItem value="Other Relative">Other Relative</SelectItem>
                            <SelectItem value="Guardian">Guardian</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => setActiveTab('recipients')}>
                      Cancel
                    </Button>
                    <Button type="submit">Submit Application</Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="reports">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Scholarship Program Reports</CardTitle>
                <CardDescription>View scholarship statistics and performance metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex flex-col">
                        <p className="text-sm text-muted-foreground">Total Scholarships</p>
                        <p className="text-3xl font-bold">{scholarships.length}</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Active: {scholarships.filter(s => s.status === 'active').length}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex flex-col">
                        <p className="text-sm text-muted-foreground">Total Investment</p>
                        <p className="text-3xl font-bold">
                          {formatCurrency(scholarships.reduce((sum, s) => sum + s.amount, 0))}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          This Year (2023)
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex flex-col">
                        <p className="text-sm text-muted-foreground">Performance Rating</p>
                        <p className="text-3xl font-bold">Good</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Aggregate performance
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-medium">Recent Reports</h3>
                    <Button variant="outline" size="sm">
                      <RefreshCw className="h-4 w-4 mr-1" /> Refresh
                    </Button>
                  </div>
                  
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Report Name</TableHead>
                        <TableHead>Generated On</TableHead>
                        <TableHead>Coverage Period</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">Scholarship Performance Report</TableCell>
                        <TableCell>{format(new Date(), 'MMM d, yyyy')}</TableCell>
                        <TableCell>Jan - Jun 2023</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">View</Button>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Financial Summary</TableCell>
                        <TableCell>{format(new Date(), 'MMM d, yyyy')}</TableCell>
                        <TableCell>2023 Academic Year</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">View</Button>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Student Progress Report</TableCell>
                        <TableCell>{format(new Date(), 'MMM d, yyyy')}</TableCell>
                        <TableCell>Term 2, 2023</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">View</Button>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ScholarshipProgram;
