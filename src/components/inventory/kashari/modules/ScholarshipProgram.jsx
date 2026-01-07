
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Plus, Download, Loader2 } from "lucide-react";
import { format } from 'date-fns';
import { useKashariScholarships } from '@/hooks/useKashariScholarships';

const ScholarshipProgram = () => {
  const [activeTab, setActiveTab] = useState('recipients');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Use database hook
  const { 
    scholarships, 
    loading, 
    addScholarship, 
    getScholarshipStats 
  } = useKashariScholarships();
  
  // Form state for new application
  const [newApplication, setNewApplication] = useState({
    student_name: '',
    school: '',
    grade: '',
    amount: '',
    reason: '',
    guardian_name: '',
    guardian_contact: '',
    guardian_relation: ''
  });
  
  // Filter scholarships based on search term
  const filteredScholarships = scholarships.filter(scholarship => 
    scholarship.student_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    scholarship.school?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    scholarship.scholarship_id?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const stats = getScholarshipStats();
  
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
  
  const handleSubmitApplication = async (e) => {
    e.preventDefault();
    
    if (!newApplication.student_name || !newApplication.school || !newApplication.grade || !newApplication.amount) {
      return;
    }
    
    const result = await addScholarship({
      student_name: newApplication.student_name,
      school: newApplication.school,
      grade: newApplication.grade,
      amount: parseFloat(newApplication.amount),
      guardian_contact: newApplication.guardian_contact,
      guardian_name: newApplication.guardian_name,
      reason: newApplication.reason
    });
    
    if (result.success) {
      setNewApplication({
        student_name: '',
        school: '',
        grade: '',
        amount: '',
        reason: '',
        guardian_name: '',
        guardian_contact: '',
        guardian_relation: ''
      });
      setActiveTab('recipients');
    }
  };
  
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-UG', {
      style: 'currency',
      currency: 'UGX'
    }).format(amount || 0);
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
  
  if (loading && scholarships.length === 0) {
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
        <CardTitle>Scholarship Program</CardTitle>
        <CardDescription>
          Manage educational scholarships for needy students in the community
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab}>
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
                        <TableCell className="font-medium">{scholarship.scholarship_id}</TableCell>
                        <TableCell>{scholarship.student_name}</TableCell>
                        <TableCell>{scholarship.school}</TableCell>
                        <TableCell>{scholarship.grade}</TableCell>
                        <TableCell>{formatCurrency(scholarship.amount)}</TableCell>
                        <TableCell>
                          {scholarship.start_date && scholarship.end_date ? (
                            <>
                              {format(new Date(scholarship.start_date), 'MMM d, yyyy')} - 
                              {format(new Date(scholarship.end_date), 'MMM d, yyyy')}
                            </>
                          ) : '-'}
                        </TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(scholarship.status)}`}>
                            {scholarship.status?.charAt(0).toUpperCase() + scholarship.status?.slice(1)}
                          </span>
                        </TableCell>
                        <TableCell>{scholarship.performance_rating || 'N/A'}</TableCell>
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
                        <Label htmlFor="student_name">Student Full Name *</Label>
                        <Input
                          id="student_name"
                          name="student_name"
                          value={newApplication.student_name}
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
                        <Label htmlFor="guardian_name">Guardian Full Name</Label>
                        <Input
                          id="guardian_name"
                          name="guardian_name"
                          value={newApplication.guardian_name}
                          onChange={handleInputChange}
                          placeholder="Enter guardian's full name"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="guardian_contact">Guardian Contact *</Label>
                        <Input
                          id="guardian_contact"
                          name="guardian_contact"
                          value={newApplication.guardian_contact}
                          onChange={handleInputChange}
                          placeholder="Enter guardian's phone number"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="guardian_relation">Relationship to Student</Label>
                        <Select
                          value={newApplication.guardian_relation}
                          onValueChange={(value) => handleSelectChange('guardian_relation', value)}
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
                        <p className="text-3xl font-bold">{stats.total}</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {stats.active} active, {stats.pending} pending
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex flex-col">
                        <p className="text-sm text-muted-foreground">Total Amount Allocated</p>
                        <p className="text-3xl font-bold">{formatCurrency(stats.totalAmount)}</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Across all scholarships
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex flex-col">
                        <p className="text-sm text-muted-foreground">On Hold</p>
                        <p className="text-3xl font-bold">{stats.onHold}</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Requiring attention
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-base font-medium">Performance Overview</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex flex-col">
                          <p className="text-sm text-muted-foreground">Completed Scholarships</p>
                          <p className="text-2xl font-bold">{stats.completed}</p>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex flex-col">
                          <p className="text-sm text-muted-foreground">Active Scholarships</p>
                          <p className="text-2xl font-bold">{stats.active}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
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
