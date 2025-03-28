
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { UserPlus, Users, RefreshCw, Download, UserCheck, BarChart2, MessageSquare, Calendar } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useStaffData } from '../../../hooks/useStaffData';
import { format } from 'date-fns';

const StaffMembers = ({ farmId, isDataEntry = false }) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('staff-list');
  const { staffData, isLoading, error, addStaffMember, updateStaffMember, fetchStaffData } = useStaffData(farmId);
  
  // New staff form state
  const [newStaff, setNewStaff] = useState({
    firstName: '',
    lastName: '',
    role: 'farm_worker',
    contactNumber: '',
    email: '',
    startDate: '',
    salary: '',
    status: 'active',
    address: '',
    notes: ''
  });

  useEffect(() => {
    fetchStaffData();
  }, [farmId]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewStaff(prev => ({ ...prev, [name]: value }));
  };

  // Handle select changes
  const handleSelectChange = (name, value) => {
    setNewStaff(prev => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!newStaff.firstName || !newStaff.lastName || !newStaff.role || !newStaff.contactNumber) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    try {
      await addStaffMember({
        ...newStaff,
        farm_id: farmId,
        salary: parseFloat(newStaff.salary) || 0,
        created_at: new Date().toISOString()
      });
      
      toast({
        title: "Success",
        description: "Staff member added successfully.",
      });
      
      // Reset form
      setNewStaff({
        firstName: '',
        lastName: '',
        role: 'farm_worker',
        contactNumber: '',
        email: '',
        startDate: '',
        salary: '',
        status: 'active',
        address: '',
        notes: ''
      });
      
      // Refresh data
      fetchStaffData();
      
      // Switch to staff list tab
      setActiveTab('staff-list');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add staff member: " + error.message,
        variant: "destructive"
      });
    }
  };

  const handleRefresh = () => {
    fetchStaffData();
    toast({
      title: "Data Refreshed",
      description: "Staff data has been updated."
    });
  };

  const handleExport = () => {
    toast({
      title: "Export Started",
      description: "Preparing staff data export..."
    });
  };

  // Get role label for display
  const getRoleLabel = (role) => {
    const roles = {
      'farm_manager': 'Farm Manager',
      'herd_manager': 'Herd Manager',
      'veterinarian': 'Veterinarian',
      'milk_technician': 'Milk Technician',
      'farm_worker': 'Farm Worker',
      'tractor_operator': 'Tractor Operator',
      'security': 'Security',
      'admin': 'Admin',
      'other': 'Other'
    };
    return roles[role] || role;
  };

  // Count staff by role
  const countByRole = (role) => {
    return staffData.filter(staff => staff.role === role).length;
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Staff Management</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="staff-list" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Staff List
          </TabsTrigger>
          <TabsTrigger value="add-staff" className="flex items-center gap-2" disabled={!isDataEntry}>
            <UserPlus className="h-4 w-4" />
            Add Staff
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart2 className="h-4 w-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="staff-list">
          <Card>
            <CardHeader>
              <CardTitle>Staff Members</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                </div>
              ) : error ? (
                <div className="text-center py-8 text-red-500">
                  Error loading staff data: {error.message}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead className="hidden md:table-cell">Contact</TableHead>
                        <TableHead className="hidden lg:table-cell">Start Date</TableHead>
                        <TableHead className="text-right">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {staffData.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-4">
                            No staff members found.
                          </TableCell>
                        </TableRow>
                      ) : (
                        staffData.map((staff) => (
                          <TableRow key={staff.id}>
                            <TableCell className="flex items-center gap-3">
                              <Avatar>
                                <AvatarImage src={staff.avatar} alt={`${staff.firstName} ${staff.lastName}`} />
                                <AvatarFallback>
                                  {staff.firstName?.charAt(0) || ''}{staff.lastName?.charAt(0) || ''}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">{staff.firstName} {staff.lastName}</div>
                                <div className="text-xs text-muted-foreground hidden md:block lg:hidden">
                                  {staff.contactNumber}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>{getRoleLabel(staff.role)}</TableCell>
                            <TableCell className="hidden md:table-cell">{staff.contactNumber}</TableCell>
                            <TableCell className="hidden lg:table-cell">
                              {staff.startDate ? format(new Date(staff.startDate), 'PP') : 'N/A'}
                            </TableCell>
                            <TableCell className="text-right">
                              <Badge variant={staff.status === 'active' ? 'default' : 'secondary'}>
                                {staff.status?.charAt(0).toUpperCase() + staff.status?.slice(1)}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="add-staff">
          <Card>
            <CardHeader>
              <CardTitle>Add New Staff Member</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      value={newStaff.firstName}
                      onChange={handleInputChange}
                      placeholder="Enter first name"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      value={newStaff.lastName}
                      onChange={handleInputChange}
                      placeholder="Enter last name"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="role">Role *</Label>
                    <Select
                      value={newStaff.role}
                      onValueChange={(value) => handleSelectChange('role', value)}
                      required
                    >
                      <SelectTrigger id="role">
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="farm_manager">Farm Manager</SelectItem>
                        <SelectItem value="herd_manager">Herd Manager</SelectItem>
                        <SelectItem value="veterinarian">Veterinarian</SelectItem>
                        <SelectItem value="milk_technician">Milk Technician</SelectItem>
                        <SelectItem value="farm_worker">Farm Worker</SelectItem>
                        <SelectItem value="tractor_operator">Tractor Operator</SelectItem>
                        <SelectItem value="security">Security</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={newStaff.status}
                      onValueChange={(value) => handleSelectChange('status', value)}
                    >
                      <SelectTrigger id="status">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="on_leave">On Leave</SelectItem>
                        <SelectItem value="terminated">Terminated</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contactNumber">Contact Number *</Label>
                    <Input
                      id="contactNumber"
                      name="contactNumber"
                      value={newStaff.contactNumber}
                      onChange={handleInputChange}
                      placeholder="Enter contact number"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={newStaff.email}
                      onChange={handleInputChange}
                      placeholder="Enter email address"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input
                      id="startDate"
                      name="startDate"
                      type="date"
                      value={newStaff.startDate}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="salary">Monthly Salary (UGX)</Label>
                    <Input
                      id="salary"
                      name="salary"
                      type="number"
                      value={newStaff.salary}
                      onChange={handleInputChange}
                      placeholder="Enter salary amount"
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      name="address"
                      value={newStaff.address}
                      onChange={handleInputChange}
                      placeholder="Enter address"
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea
                      id="notes"
                      name="notes"
                      value={newStaff.notes}
                      onChange={handleInputChange}
                      placeholder="Enter any additional notes"
                      rows={3}
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button type="submit" disabled={isLoading} className="bg-blue-600 hover:bg-blue-700">
                    {isLoading ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      'Add Staff Member'
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Staff Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Staff by Role</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span>Farm Managers:</span>
                        <span className="font-medium">{countByRole('farm_manager')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Herd Managers:</span>
                        <span className="font-medium">{countByRole('herd_manager')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Veterinarians:</span>
                        <span className="font-medium">{countByRole('veterinarian')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Milk Technicians:</span>
                        <span className="font-medium">{countByRole('milk_technician')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Farm Workers:</span>
                        <span className="font-medium">{countByRole('farm_worker')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Other Staff:</span>
                        <span className="font-medium">
                          {countByRole('other') + countByRole('tractor_operator') + countByRole('security') + countByRole('admin')}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Staff Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span>Total Staff:</span>
                          <span className="font-medium">{staffData.length}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '100%' }}></div>
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <span>Active:</span>
                        <span className="font-medium">
                          {staffData.filter(staff => staff.status === 'active').length}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>On Leave:</span>
                        <span className="font-medium">
                          {staffData.filter(staff => staff.status === 'on_leave').length}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Terminated:</span>
                        <span className="font-medium">
                          {staffData.filter(staff => staff.status === 'terminated').length}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StaffMembers;
