import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { UserPlus, Trash2, RefreshCw, Search, Calendar, User, Phone, Mail, DollarSign, MapPin, FileText } from "lucide-react";
import { useStaffData } from "@/hooks/useStaffData";

const StaffMembers = ({ farmId }) => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [staffToDelete, setStaffToDelete] = useState(null);
  
  const {
    staffData,
    isLoading,
    isSubmitting,
    error,
    fetchStaffData,
    addStaffMember,
    deleteStaffMember
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
    notes: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewStaff(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name, value) => {
    setNewStaff(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddStaff = async () => {
    const result = await addStaffMember(newStaff);
    if (result) {
      setShowAddForm(false);
      resetForm();
    }
  };

  const handleDeleteStaff = async () => {
    if (staffToDelete) {
      const success = await deleteStaffMember(staffToDelete.id);
      if (success) {
        setDeleteDialogOpen(false);
        setStaffToDelete(null);
      }
    }
  };

  const confirmDelete = (staff) => {
    setStaffToDelete(staff);
    setDeleteDialogOpen(true);
  };

  const resetForm = () => {
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
      notes: ''
    });
  };

  const filteredStaff = staffData.filter(
    (staff) =>
      staff.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const roleLabels = {
    farm_worker: 'Farm Worker',
    farm_manager: 'Farm Manager',
    herd_manager: 'Herd Manager',
    vet_technician: 'Veterinary Technician',
    dairy_technician: 'Dairy Technician',
    maintenance_staff: 'Maintenance Staff'
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl">Staff Management</CardTitle>
        <div className="flex items-center space-x-2">
          <div className="relative w-64">
            <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search staff..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon" onClick={fetchStaffData}>
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button onClick={() => setShowAddForm(true)} className="flex items-center gap-2">
            <UserPlus className="h-4 w-4" />
            Add Staff
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {showAddForm && (
          <Card className="mb-6 border-2 border-dashed">
            <CardHeader>
              <CardTitle className="text-lg">Add New Staff Member</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    value={newStaff.firstName}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    value={newStaff.lastName}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Select name="role" value={newStaff.role} onValueChange={(value) => handleSelectChange('role', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(roleLabels).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contactNumber">Contact Number</Label>
                  <Input
                    id="contactNumber"
                    name="contactNumber"
                    value={newStaff.contactNumber}
                    onChange={handleInputChange}
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
                  <Label htmlFor="salary">Salary (UGX)</Label>
                  <Input
                    id="salary"
                    name="salary"
                    type="number"
                    value={newStaff.salary}
                    onChange={handleInputChange}
                    placeholder="e.g. 250000"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select name="status" value={newStaff.status} onValueChange={(value) => handleSelectChange('status', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="on_leave">On Leave</SelectItem>
                      <SelectItem value="terminated">Terminated</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    name="address"
                    value={newStaff.address}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    name="notes"
                    value={newStaff.notes}
                    onChange={handleInputChange}
                    className="min-h-[100px]"
                  />
                </div>

                <div className="md:col-span-2 flex justify-end space-x-2 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      resetForm();
                      setShowAddForm(false);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleAddStaff}
                    disabled={isSubmitting || !newStaff.firstName || !newStaff.lastName || !newStaff.contactNumber}
                  >
                    {isSubmitting ? (
                      <><RefreshCw className="mr-2 h-4 w-4 animate-spin" /> Adding...</>
                    ) : (
                      'Add Staff Member'
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Staff List Table */}
        {isLoading ? (
          <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        ) : error ? (
          <div className="text-center py-10 text-red-500">
            Error loading staff data: {error}
          </div>
        ) : filteredStaff.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            {searchTerm ? "No staff found matching your search." : "No staff members found. Add some staff members to get started."}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Salary</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStaff.map((staff) => (
                  <TableRow key={staff.id}>
                    <TableCell className="font-medium">
                      {staff.firstName} {staff.lastName}
                    </TableCell>
                    <TableCell>{roleLabels[staff.role] || staff.role}</TableCell>
                    <TableCell>{staff.contactNumber}</TableCell>
                    <TableCell>
                      {staff.startDate ? format(new Date(staff.startDate), 'dd MMM yyyy') : 'N/A'}
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        staff.status === 'active' ? 'bg-green-100 text-green-800' :
                        staff.status === 'on_leave' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {staff.status === 'active' ? 'Active' :
                         staff.status === 'on_leave' ? 'On Leave' :
                         staff.status === 'terminated' ? 'Terminated' :
                         staff.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      {staff.salary ? `UGX ${parseFloat(staff.salary).toLocaleString()}` : 'N/A'}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => confirmDelete(staff)} 
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently remove {staffToDelete?.firstName} {staffToDelete?.lastName} from the staff records.
                This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleDeleteStaff}
                className="bg-red-600 hover:bg-red-700"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
};

export default StaffMembers;
