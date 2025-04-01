import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  RefreshCw, Download, User, Users, FileText, 
  BarChart2, PlusCircle, Search, Filter, Mail, Phone, 
  Calendar, DollarSign, MapPin, Clipboard, Trash2, Pencil 
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useStaffData } from '@/hooks/useStaffData';
import { format } from 'date-fns';

const StaffMembers = ({ farmId, isDataEntry = false }) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('directory');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const { 
    staffData, 
    isLoading, 
    isSubmitting,
    error, 
    addStaffMember, 
    updateStaffMember,
    deleteStaffMember,
    fetchStaffData 
  } = useStaffData(farmId);
  
  const [newStaff, setNewStaff] = useState({
    firstName: '',
    lastName: '',
    role: 'farm_worker',
    contactNumber: '',
    email: '',
    startDate: format(new Date(), 'yyyy-MM-dd'),
    salary: '',
    status: 'active',
    address: '',
    notes: '',
    avatar: ''
  });

  const [editingStaff, setEditingStaff] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (editingStaff) {
      setEditingStaff(prev => ({ ...prev, [name]: value }));
      if (formErrors[name]) {
        setFormErrors(prev => ({ ...prev, [name]: null }));
      }
    } else {
      setNewStaff(prev => ({ ...prev, [name]: value }));
      if (formErrors[name]) {
        setFormErrors(prev => ({ ...prev, [name]: null }));
      }
    }
  };

  const handleSelectChange = (name, value) => {
    if (editingStaff) {
      setEditingStaff(prev => ({ ...prev, [name]: value }));
      if (formErrors[name]) {
        setFormErrors(prev => ({ ...prev, [name]: null }));
      }
    } else {
      setNewStaff(prev => ({ ...prev, [name]: value }));
      if (formErrors[name]) {
        setFormErrors(prev => ({ ...prev, [name]: null }));
      }
    }
  };

  const validateForm = (staff) => {
    const errors = {};
    if (!staff.firstName) errors.firstName = "First name is required";
    if (!staff.lastName) errors.lastName = "Last name is required";
    if (!staff.contactNumber) errors.contactNumber = "Contact number is required";
    
    if (staff.email && !/^\S+@\S+\.\S+$/.test(staff.email)) {
      errors.email = "Invalid email format";
    }
    
    if (staff.salary && isNaN(parseFloat(staff.salary))) {
      errors.salary = "Salary must be a valid number";
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleEditStaff = (staff) => {
    setEditingStaff(staff);
    setActiveTab('edit');
    setFormErrors({});
  };

  const handleCancelEdit = () => {
    setEditingStaff(null);
    setActiveTab('directory');
    setFormErrors({});
  };

  const handleDeleteStaff = async (id) => {
    if (window.confirm('Are you sure you want to delete this staff member?')) {
      await deleteStaffMember(id);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm(newStaff)) {
      toast({
        title: "Validation Error",
        description: "Please correct the errors in the form",
        variant: "destructive"
      });
      return;
    }

    const result = await addStaffMember({
      ...newStaff,
      farm_id: farmId
    });
    
    if (result) {
      setNewStaff({
        firstName: '',
        lastName: '',
        role: 'farm_worker',
        contactNumber: '',
        email: '',
        startDate: format(new Date(), 'yyyy-MM-dd'),
        salary: '',
        status: 'active',
        address: '',
        notes: '',
        avatar: ''
      });
      
      setActiveTab('directory');
      setFormErrors({});
    }
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm(editingStaff)) {
      toast({
        title: "Validation Error",
        description: "Please correct the errors in the form",
        variant: "destructive"
      });
      return;
    }

    const result = await updateStaffMember(editingStaff.id, editingStaff);
    
    if (result) {
      setEditingStaff(null);
      setActiveTab('directory');
      setFormErrors({});
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
    try {
      const headers = ['First Name', 'Last Name', 'Role', 'Contact Number', 'Email', 'Start Date', 'Salary', 'Status', 'Address', 'Notes'];
      const csvRows = [headers];
      
      staffData.forEach(staff => {
        const row = [
          staff.firstName,
          staff.lastName,
          staff.role,
          staff.contactNumber,
          staff.email || '',
          staff.startDate || '',
          staff.salary || '',
          staff.status,
          staff.address || '',
          staff.notes || ''
        ];
        csvRows.push(row);
      });
      
      const csvContent = csvRows.map(row => row.map(cell => 
        typeof cell === 'string' ? `"${cell.replace(/"/g, '""')}"` : cell
      ).join(',')).join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `staff-members-${format(new Date(), 'yyyy-MM-dd')}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Export Successful",
        description: "Staff data has been exported to CSV"
      });
    } catch (err) {
      console.error('Error exporting staff data:', err);
      toast({
        title: "Export Failed",
        description: err.message,
        variant: "destructive"
      });
    }
  };

  const filteredStaff = staffData.filter(staff => {
    const fullName = `${staff.firstName} ${staff.lastName}`.toLowerCase();
    const matchesSearch = fullName.includes(searchQuery.toLowerCase()) || 
                          (staff.email && staff.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
                          staff.contactNumber.includes(searchQuery);
    
    const matchesRole = filterRole === 'all' || staff.role === filterRole;
    
    return matchesSearch && matchesRole;
  });

  const getInitials = (firstName, lastName) => {
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
  };

  const roleDisplayMap = {
    'farm_manager': 'Farm Manager',
    'farm_worker': 'Farm Worker',
    'milking_staff': 'Milking Staff',
    'livestock_handler': 'Livestock Handler',
    'vet_technician': 'Veterinary Technician',
    'supervisor': 'Supervisor',
    'admin': 'Administrator'
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
          <TabsTrigger value="directory" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Staff Directory
          </TabsTrigger>
          <TabsTrigger value="add" className="flex items-center gap-2" disabled={!isDataEntry}>
            <PlusCircle className="h-4 w-4" />
            Add Staff
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart2 className="h-4 w-4" />
            Analytics
          </TabsTrigger>
          {editingStaff && (
            <TabsTrigger value="edit" className="flex items-center gap-2">
              <Pencil className="h-4 w-4" />
              Edit Staff
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="directory">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle>Staff Directory</CardTitle>
              <div className="flex space-x-2">
                <div className="relative">
                  <Search className="h-4 w-4 absolute left-2.5 top-2.5 text-gray-500" />
                  <Input
                    placeholder="Search staff..."
                    className="pl-8 w-[200px]"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Select value={filterRole} onValueChange={(value) => setFilterRole(value)}>
                  <SelectTrigger className="w-[160px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <span>{filterRole === 'all' ? 'All Roles' : roleDisplayMap[filterRole]}</span>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="farm_manager">Farm Manager</SelectItem>
                    <SelectItem value="farm_worker">Farm Worker</SelectItem>
                    <SelectItem value="milking_staff">Milking Staff</SelectItem>
                    <SelectItem value="livestock_handler">Livestock Handler</SelectItem>
                    <SelectItem value="vet_technician">Veterinary Technician</SelectItem>
                    <SelectItem value="supervisor">Supervisor</SelectItem>
                    <SelectItem value="admin">Administrator</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                </div>
              ) : error ? (
                <div className="text-center py-8 text-red-500">
                  Error loading staff data: {error}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Staff</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Start Date</TableHead>
                        <TableHead>Status</TableHead>
                        {isDataEntry && <TableHead className="text-right">Actions</TableHead>}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredStaff.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={isDataEntry ? 6 : 5} className="text-center py-4">
                            No staff members found.
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredStaff.map((staff) => (
                          <TableRow key={staff.id}>
                            <TableCell className="flex items-center gap-3">
                              <Avatar className="h-8 w-8 border border-gray-200">
                                <AvatarImage src={staff.avatar} alt={`${staff.firstName} ${staff.lastName}`} />
                                <AvatarFallback className="bg-primary text-primary-foreground">
                                  {getInitials(staff.firstName, staff.lastName)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">{staff.firstName} {staff.lastName}</div>
                                <div className="text-xs text-muted-foreground">{staff.email}</div>
                              </div>
                            </TableCell>
                            <TableCell>
                              {roleDisplayMap[staff.role] || staff.role}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <Phone className="h-3 w-3 text-muted-foreground" />
                                <span>{staff.contactNumber}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              {staff.startDate ? format(new Date(staff.startDate), 'PP') : 'N/A'}
                            </TableCell>
                            <TableCell>
                              <Badge variant={
                                staff.status === 'active' ? 'default' :
                                staff.status === 'on_leave' ? 'secondary' :
                                'outline'
                              }>
                                {staff.status === 'active' ? 'Active' : 
                                 staff.status === 'on_leave' ? 'On Leave' : 
                                 staff.status === 'terminated' ? 'Terminated' : 
                                 staff.status}
                              </Badge>
                            </TableCell>
                            {isDataEntry && (
                              <TableCell className="text-right">
                                <Button variant="ghost" size="icon" onClick={() => handleEditStaff(staff)}>
                                  <Pencil className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" onClick={() => handleDeleteStaff(staff.id)}>
                                  <Trash2 className="h-4 w-4 text-red-500" />
                                </Button>
                              </TableCell>
                            )}
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

        <TabsContent value="add">
          <Card>
            <CardHeader>
              <CardTitle>Add New Staff Member</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name <span className="text-red-500">*</span></Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      value={newStaff.firstName}
                      onChange={handleInputChange}
                      placeholder="Enter first name"
                      className={formErrors.firstName ? "border-red-500" : ""}
                      required
                    />
                    {formErrors.firstName && <p className="text-xs text-red-500">{formErrors.firstName}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name <span className="text-red-500">*</span></Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      value={newStaff.lastName}
                      onChange={handleInputChange}
                      placeholder="Enter last name"
                      className={formErrors.lastName ? "border-red-500" : ""}
                      required
                    />
                    {formErrors.lastName && <p className="text-xs text-red-500">{formErrors.lastName}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Select
                      value={newStaff.role}
                      onValueChange={(value) => handleSelectChange('role', value)}
                    >
                      <SelectTrigger id="role">
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="farm_manager">Farm Manager</SelectItem>
                        <SelectItem value="farm_worker">Farm Worker</SelectItem>
                        <SelectItem value="milking_staff">Milking Staff</SelectItem>
                        <SelectItem value="livestock_handler">Livestock Handler</SelectItem>
                        <SelectItem value="vet_technician">Veterinary Technician</SelectItem>
                        <SelectItem value="supervisor">Supervisor</SelectItem>
                        <SelectItem value="admin">Administrator</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contactNumber">Contact Number <span className="text-red-500">*</span></Label>
                    <Input
                      id="contactNumber"
                      name="contactNumber"
                      value={newStaff.contactNumber}
                      onChange={handleInputChange}
                      placeholder="Enter contact number"
                      className={formErrors.contactNumber ? "border-red-500" : ""}
                      required
                    />
                    {formErrors.contactNumber && <p className="text-xs text-red-500">{formErrors.contactNumber}</p>}
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
                      className={formErrors.email ? "border-red-500" : ""}
                    />
                    {formErrors.email && <p className="text-xs text-red-500">{formErrors.email}</p>}
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
                    <Label htmlFor="salary">Salary (UGX)</Label>
                    <Input
                      id="salary"
                      name="salary"
                      type="number"
                      value={newStaff.salary}
                      onChange={handleInputChange}
                      placeholder="Enter salary amount"
                      className={formErrors.salary ? "border-red-500" : ""}
                    />
                    {formErrors.salary && <p className="text-xs text-red-500">{formErrors.salary}</p>}
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

                <div className="flex justify-end mt-6">
                  <Button type="submit" disabled={isSubmitting} className="bg-green-600 hover:bg-green-700">
                    {isSubmitting ? (
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

        <TabsContent value="edit">
          {editingStaff && (
            <Card>
              <CardHeader>
                <CardTitle>Edit Staff Member</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleUpdateSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name <span className="text-red-500">*</span></Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        value={editingStaff.firstName}
                        onChange={handleInputChange}
                        placeholder="Enter first name"
                        className={formErrors.firstName ? "border-red-500" : ""}
                        required
                      />
                      {formErrors.firstName && <p className="text-xs text-red-500">{formErrors.firstName}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name <span className="text-red-500">*</span></Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        value={editingStaff.lastName}
                        onChange={handleInputChange}
                        placeholder="Enter last name"
                        className={formErrors.lastName ? "border-red-500" : ""}
                        required
                      />
                      {formErrors.lastName && <p className="text-xs text-red-500">{formErrors.lastName}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="role">Role</Label>
                      <Select
                        value={editingStaff.role}
                        onValueChange={(value) => handleSelectChange('role', value)}
                      >
                        <SelectTrigger id="role">
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="farm_manager">Farm Manager</SelectItem>
                          <SelectItem value="farm_worker">Farm Worker</SelectItem>
                          <SelectItem value="milking_staff">Milking Staff</SelectItem>
                          <SelectItem value="livestock_handler">Livestock Handler</SelectItem>
                          <SelectItem value="vet_technician">Veterinary Technician</SelectItem>
                          <SelectItem value="supervisor">Supervisor</SelectItem>
                          <SelectItem value="admin">Administrator</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="contactNumber">Contact Number <span className="text-red-500">*</span></Label>
                      <Input
                        id="contactNumber"
                        name="contactNumber"
                        value={editingStaff.contactNumber}
                        onChange={handleInputChange}
                        placeholder="Enter contact number"
                        className={formErrors.contactNumber ? "border-red-500" : ""}
                        required
                      />
                      {formErrors.contactNumber && <p className="text-xs text-red-500">{formErrors.contactNumber}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={editingStaff.email}
                        onChange={handleInputChange}
                        placeholder="Enter email address"
                        className={formErrors.email ? "border-red-500" : ""}
                      />
                      {formErrors.email && <p className="text-xs text-red-500">{formErrors.email}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="startDate">Start Date</Label>
                      <Input
                        id="startDate"
                        name="startDate"
                        type="date"
                        value={editingStaff.startDate}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="salary">Salary (UGX)</Label>
                      <Input
                        id="salary"
                        name="salary"
                        type="number"
                        value={editingStaff.salary}
                        onChange={handleInputChange}
                        placeholder="Enter salary amount"
                        className={formErrors.salary ? "border-red-500" : ""}
                      />
                      {formErrors.salary && <p className="text-xs text-red-500">{formErrors.salary}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="status">Status</Label>
                      <Select
                        value={editingStaff.status}
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

                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="address">Address</Label>
                      <Input
                        id="address"
                        name="address"
                        value={editingStaff.address}
                        onChange={handleInputChange}
                        placeholder="Enter address"
                      />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="notes">Notes</Label>
                      <Textarea
                        id="notes"
                        name="notes"
                        value={editingStaff.notes}
                        onChange={handleInputChange}
                        placeholder="Enter any additional notes"
                        rows={3}
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 mt-6">
                    <Button type="button" variant="outline" onClick={handleCancelEdit}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700">
                      {isSubmitting ? (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          Updating...
                        </>
                      ) : (
                        'Update Staff Member'
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}
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
                      {['farm_manager', 'farm_worker', 'milking_staff', 'livestock_handler', 'vet_technician', 'supervisor', 'admin'].map(role => {
                        const count = staffData.filter(s => s.role === role).length;
                        const percentage = staffData.length > 0 ? Math.round((count / staffData.length) * 100) : 0;
                        
                        return (
                          <div key={role}>
                            <div className="flex justify-between mb-1">
                              <span>{roleDisplayMap[role]}</span>
                              <span className="font-medium">{count}</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                              <div 
                                className="bg-primary h-2.5 rounded-full" 
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Staff Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {['active', 'on_leave', 'terminated'].map(status => {
                        const count = staffData.filter(s => s.status === status).length;
                        const percentage = staffData.length > 0 ? Math.round((count / staffData.length) * 100) : 0;
                        
                        return (
                          <div key={status}>
                            <div className="flex justify-between mb-1">
                              <span>{status === 'active' ? 'Active' : status === 'on_leave' ? 'On Leave' : 'Terminated'}</span>
                              <span className="font-medium">{count}</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                              <div 
                                className={`h-2.5 rounded-full ${
                                  status === 'active' ? 'bg-green-600' : 
                                  status === 'on_leave' ? 'bg-yellow-500' : 
                                  'bg-red-500'
                                }`}
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>

                <Card className="md:col-span-2">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Staffing Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <Users className="h-6 w-6 mx-auto text-blue-500 mb-2" />
                        <div className="text-2xl font-bold">{staffData.length}</div>
                        <div className="text-sm text-gray-500">Total Staff</div>
                      </div>
                      
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <Calendar className="h-6 w-6 mx-auto text-green-500 mb-2" />
                        <div className="text-2xl font-bold">
                          {staffData.filter(s => {
                            if (!s.startDate) return false;
                            const startDate = new Date(s.startDate);
                            const sixMonthsAgo = new Date();
                            sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
                            return startDate >= sixMonthsAgo;
                          }).length}
                        </div>
                        <div className="text-sm text-gray-500">New ({`<`} 6 months)</div>
                      </div>
                      
                      <div className="text-center p-4 bg-purple-50 rounded-lg">
                        <DollarSign className="h-6 w-6 mx-auto text-purple-500 mb-2" />
                        <div className="text-2xl font-bold">
                          {new Intl.NumberFormat('en-US', {
                            style: 'decimal',
                            maximumFractionDigits: 0
                          }).format(
                            staffData.reduce((sum, staff) => sum + (parseInt(staff.salary) || 0), 0)
                          )}
                        </div>
                        <div className="text-sm text-gray-500">Monthly Payroll (UGX)</div>
                      </div>
                      
                      <div className="text-center p-4 bg-orange-50 rounded-lg">
                        <User className="h-6 w-6 mx-auto text-orange-500 mb-2" />
                        <div className="text-2xl font-bold">
                          {staffData.filter(s => s.role === 'farm_manager').length}
                        </div>
                        <div className="text-sm text-gray-500">Managers</div>
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
