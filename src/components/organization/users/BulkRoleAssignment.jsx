import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import * as XLSX from 'xlsx';
import { 
  ArrowLeft,
  Upload,
  Users,
  Download,
  CheckCircle,
  AlertCircle,
  FileSpreadsheet
} from 'lucide-react';

const BulkRoleAssignment = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedCompany, setSelectedCompany] = useState('');
  const [csvData, setCsvData] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);

  // Fetch all users
  const { data: users, isLoading } = useQuery({
    queryKey: ['all-users-bulk'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          *,
          user_roles!user_roles_user_id_fkey (
            id,
            role,
            company
          )
        `)
        .order('full_name');

      if (error) throw error;
      return data.map(user => ({
        ...user,
        user_roles: user.user_roles?.[0] || null
      }));
    }
  });

  // Fetch companies
  const { data: companies } = useQuery({
    queryKey: ['all-companies'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_roles')
        .select('company')
        .not('company', 'is', null);

      if (error) throw error;
      const uniqueCompanies = [...new Set(data.map(r => r.company))];
      return uniqueCompanies;
    }
  });

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json = XLSX.utils.sheet_to_json(worksheet);
        
        // Validate CSV structure
        const validData = json.filter(row => row.email && row.role && row.company);
        if (validData.length === 0) {
          toast.error('Invalid CSV format. Required columns: email, role, company');
          return;
        }
        
        setCsvData(validData);
        toast.success(`Loaded ${validData.length} users from CSV`);
      } catch (error) {
        toast.error('Failed to parse CSV file');
        console.error(error);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const downloadTemplate = () => {
    const template = [
      { email: 'user@example.com', role: 'manager', company: 'Grand Berna Dairies' },
      { email: 'staff@example.com', role: 'staff', company: 'KAJON Coffee Limited' }
    ];
    
    const worksheet = XLSX.utils.json_to_sheet(template);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Role Assignment');
    XLSX.writeFile(workbook, 'role_assignment_template.xlsx');
  };

  const toggleUserSelection = (userId) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const bulkAssignMutation = useMutation({
    mutationFn: async ({ assignments }) => {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      const results = { success: [], failed: [] };

      for (const assignment of assignments) {
        try {
          const { userId, role, company, userEmail, userName } = assignment;

          // Get old role for audit
          const { data: oldRoleData } = await supabase
            .from('user_roles')
            .select('role, company')
            .eq('user_id', userId)
            .maybeSingle();

          // Update or insert role
          if (oldRoleData) {
            await supabase
              .from('user_roles')
              .update({ role, company, assigned_by: currentUser.id })
              .eq('user_id', userId);
          } else {
            await supabase
              .from('user_roles')
              .insert({ user_id: userId, role, company, assigned_by: currentUser.id });
          }

          // Log the change
          await supabase
            .from('role_change_audit_log')
            .insert({
              changed_by: currentUser.id,
              affected_user: userId,
              old_role: oldRoleData?.role || null,
              new_role: role,
              old_company: oldRoleData?.company || null,
              new_company: company,
              action_type: oldRoleData ? 'updated' : 'assigned',
              notes: 'Bulk assignment'
            });

          // Send notification email
          await supabase.functions.invoke('send-role-notification', {
            body: {
              userName,
              userEmail,
              role,
              company,
              actionType: oldRoleData ? 'updated' : 'assigned',
              changedBy: currentUser.email
            }
          });

          results.success.push(userEmail);
        } catch (error) {
          console.error('Failed to assign role:', error);
          results.failed.push(assignment.userEmail);
        }
      }

      return results;
    },
    onSuccess: (results) => {
      queryClient.invalidateQueries(['all-users-bulk']);
      queryClient.invalidateQueries(['all-users']);
      
      if (results.failed.length === 0) {
        toast.success(`Successfully assigned roles to ${results.success.length} users`);
      } else {
        toast.warning(`Assigned ${results.success.length} roles, ${results.failed.length} failed`);
      }
      
      setSelectedUsers([]);
      setCsvData([]);
    },
    onError: (error) => {
      toast.error(`Bulk assignment failed: ${error.message}`);
    }
  });

  const handleBulkAssign = async () => {
    if (!selectedRole || !selectedCompany) {
      toast.error('Please select both role and company');
      return;
    }

    if (selectedUsers.length === 0) {
      toast.error('Please select at least one user');
      return;
    }

    const assignments = selectedUsers.map(userId => {
      const user = users.find(u => u.id === userId);
      return {
        userId,
        userEmail: user.email,
        userName: user.full_name,
        role: selectedRole,
        company: selectedCompany
      };
    });

    setIsProcessing(true);
    await bulkAssignMutation.mutateAsync({ assignments });
    setIsProcessing(false);
  };

  const handleCsvBulkAssign = async () => {
    if (csvData.length === 0) {
      toast.error('Please upload a CSV file first');
      return;
    }

    const assignments = csvData.map(row => {
      const user = users.find(u => u.email.toLowerCase() === row.email.toLowerCase());
      if (!user) {
        throw new Error(`User not found: ${row.email}`);
      }
      return {
        userId: user.id,
        userEmail: user.email,
        userName: user.full_name,
        role: row.role,
        company: row.company
      };
    });

    setIsProcessing(true);
    await bulkAssignMutation.mutateAsync({ assignments });
    setIsProcessing(false);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-12">Loading users...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/users')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Users className="h-8 w-8" />
            Bulk Role Assignment
          </h1>
          <p className="text-muted-foreground mt-1">
            Assign roles to multiple users at once
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Manual Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Manual Selection</CardTitle>
            <CardDescription>Select users and assign roles manually</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Role *</Label>
              <Select value={selectedRole} onValueChange={setSelectedRole}>
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sysadmin">System Administrator</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="staff">Staff</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Company *</Label>
              <Select value={selectedCompany} onValueChange={setSelectedCompany}>
                <SelectTrigger>
                  <SelectValue placeholder="Select company" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All Companies">All Companies</SelectItem>
                  <SelectItem value="Grand Berna Dairies">Grand Berna Dairies</SelectItem>
                  <SelectItem value="KAJON Coffee Limited">KAJON Coffee Limited</SelectItem>
                  <SelectItem value="Kyalima Farmers Limited">Kyalima Farmers Limited</SelectItem>
                  {companies?.filter(c => !['All Companies', 'Grand Berna Dairies', 'KAJON Coffee Limited', 'Kyalima Farmers Limited'].includes(c)).map((company) => (
                    <SelectItem key={company} value={company}>{company}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Select Users ({selectedUsers.length} selected)</Label>
                {selectedUsers.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedUsers([])}
                  >
                    Clear
                  </Button>
                )}
              </div>
              <div className="border rounded-lg max-h-64 overflow-y-auto p-4 space-y-2">
                {users?.map((user) => (
                  <div key={user.id} className="flex items-center space-x-2">
                    <Checkbox
                      checked={selectedUsers.includes(user.id)}
                      onCheckedChange={() => toggleUserSelection(user.id)}
                    />
                    <label className="flex-1 text-sm cursor-pointer" onClick={() => toggleUserSelection(user.id)}>
                      {user.full_name} ({user.email})
                    </label>
                    {user.user_roles && (
                      <Badge variant="outline" className="text-xs">
                        {user.user_roles.role}
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <Button
              onClick={handleBulkAssign}
              disabled={isProcessing || selectedUsers.length === 0 || !selectedRole || !selectedCompany}
              className="w-full"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              {isProcessing ? 'Assigning...' : `Assign to ${selectedUsers.length} Users`}
            </Button>
          </CardContent>
        </Card>

        {/* CSV Import */}
        <Card>
          <CardHeader>
            <CardTitle>CSV Import</CardTitle>
            <CardDescription>Upload a CSV file to assign roles in bulk</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Download Template</Label>
              <Button
                variant="outline"
                onClick={downloadTemplate}
                className="w-full"
              >
                <Download className="h-4 w-4 mr-2" />
                Download CSV Template
              </Button>
              <p className="text-xs text-muted-foreground">
                Required columns: email, role, company
              </p>
            </div>

            <div className="space-y-2">
              <Label>Upload CSV File</Label>
              <div className="border-2 border-dashed rounded-lg p-8 text-center">
                <input
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="csv-upload"
                />
                <label htmlFor="csv-upload" className="cursor-pointer">
                  <FileSpreadsheet className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm font-medium">Click to upload CSV/Excel</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Supports .csv, .xlsx, .xls files
                  </p>
                </label>
              </div>
            </div>

            {csvData.length > 0 && (
              <div className="space-y-2">
                <Label>Preview ({csvData.length} rows)</Label>
                <div className="border rounded-lg max-h-64 overflow-y-auto p-4 space-y-2">
                  {csvData.slice(0, 10).map((row, index) => (
                    <div key={index} className="text-sm p-2 bg-muted rounded">
                      <strong>{row.email}</strong> → {row.role} @ {row.company}
                    </div>
                  ))}
                  {csvData.length > 10 && (
                    <p className="text-xs text-muted-foreground text-center">
                      ...and {csvData.length - 10} more
                    </p>
                  )}
                </div>
              </div>
            )}

            <Button
              onClick={handleCsvBulkAssign}
              disabled={isProcessing || csvData.length === 0}
              className="w-full"
            >
              <Upload className="h-4 w-4 mr-2" />
              {isProcessing ? 'Processing...' : `Assign ${csvData.length} Roles from CSV`}
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex gap-2">
            <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0" />
            <div className="text-sm text-blue-900">
              <p className="font-medium mb-1">Important Notes:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>All affected users will receive email notifications</li>
                <li>All changes will be logged in the audit trail</li>
                <li>System administrators must be assigned to "All Companies"</li>
                <li>Only system administrators can perform bulk assignments</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BulkRoleAssignment;
