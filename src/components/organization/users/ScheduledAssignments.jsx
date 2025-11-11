import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { 
  ArrowLeft,
  Calendar,
  Plus,
  Trash2,
  Clock,
  User
} from 'lucide-react';
import { format } from 'date-fns';

const ScheduledAssignments = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    userId: '',
    role: '',
    company: '',
    startDate: '',
    endDate: '',
    notes: ''
  });

  const { data: assignments, isLoading } = useQuery({
    queryKey: ['scheduled-assignments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('scheduled_role_assignments')
        .select(`
          *,
          user_profile:profiles!scheduled_role_assignments_user_id_fkey(full_name, email),
          created_by_profile:profiles!scheduled_role_assignments_created_by_fkey(full_name)
        `)
        .order('start_date', { ascending: true });

      if (error) throw error;
      return data;
    }
  });

  const { data: users } = useQuery({
    queryKey: ['users-for-scheduling'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, email')
        .order('full_name');

      if (error) throw error;
      return data;
    }
  });

  const { data: companies } = useQuery({
    queryKey: ['companies-list'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_roles')
        .select('company')
        .not('company', 'is', null);

      if (error) throw error;
      return [...new Set(data.map(r => r.company))];
    }
  });

  const createMutation = useMutation({
    mutationFn: async (assignmentData) => {
      const { data: { user } } = await supabase.auth.getUser();

      const { error } = await supabase
        .from('scheduled_role_assignments')
        .insert({
          ...assignmentData,
          created_by: user.id
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['scheduled-assignments']);
      toast.success('Scheduled assignment created');
      setIsCreating(false);
      setFormData({
        userId: '',
        role: '',
        company: '',
        startDate: '',
        endDate: '',
        notes: ''
      });
    },
    onError: (error) => {
      toast.error(`Failed to create: ${error.message}`);
    }
  });

  const cancelMutation = useMutation({
    mutationFn: async (assignmentId) => {
      const { error } = await supabase
        .from('scheduled_role_assignments')
        .update({ status: 'cancelled' })
        .eq('id', assignmentId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['scheduled-assignments']);
      toast.success('Assignment cancelled');
    },
    onError: (error) => {
      toast.error(`Failed to cancel: ${error.message}`);
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.userId || !formData.role || !formData.company || !formData.startDate) {
      toast.error('Please fill in all required fields');
      return;
    }

    createMutation.mutate({
      user_id: formData.userId,
      role: formData.role,
      company: formData.company,
      start_date: new Date(formData.startDate).toISOString(),
      end_date: formData.endDate ? new Date(formData.endDate).toISOString() : null,
      notes: formData.notes
    });
  };

  const getStatusBadge = (assignment) => {
    const now = new Date();
    const start = new Date(assignment.start_date);
    const end = assignment.end_date ? new Date(assignment.end_date) : null;

    if (assignment.status === 'cancelled') {
      return <Badge variant="outline" className="bg-gray-50 text-gray-700">Cancelled</Badge>;
    }
    if (assignment.status === 'completed') {
      return <Badge variant="outline" className="bg-blue-50 text-blue-700">Completed</Badge>;
    }
    if (now >= start && (!end || now <= end)) {
      return <Badge variant="outline" className="bg-green-50 text-green-700">Active</Badge>;
    }
    if (now < start) {
      return <Badge variant="outline" className="bg-yellow-50 text-yellow-700">Scheduled</Badge>;
    }
    return <Badge variant="outline">Unknown</Badge>;
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-12">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/users')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Calendar className="h-8 w-8" />
              Scheduled Role Assignments
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage temporary and future role assignments
            </p>
          </div>
        </div>
        <Button onClick={() => setIsCreating(!isCreating)}>
          <Plus className="h-4 w-4 mr-2" />
          Schedule Assignment
        </Button>
      </div>

      {isCreating && (
        <Card>
          <CardHeader>
            <CardTitle>Create Scheduled Assignment</CardTitle>
            <CardDescription>Assign a role that takes effect on a specific date</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>User *</Label>
                  <Select value={formData.userId} onValueChange={(value) => setFormData({...formData, userId: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select user" />
                    </SelectTrigger>
                    <SelectContent>
                      {users?.map((user) => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.full_name} ({user.email})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Role *</Label>
                  <Select value={formData.role} onValueChange={(value) => setFormData({...formData, role: value})}>
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
                  <Select value={formData.company} onValueChange={(value) => setFormData({...formData, company: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select company" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All Companies">All Companies</SelectItem>
                      {companies?.map((company) => (
                        <SelectItem key={company} value={company}>{company}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Start Date *</Label>
                  <Input
                    type="datetime-local"
                    value={formData.startDate}
                    onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <Label>End Date (Optional)</Label>
                  <Input
                    type="datetime-local"
                    value={formData.endDate}
                    onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                  />
                  <p className="text-xs text-muted-foreground">Leave empty for permanent assignment</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Notes</Label>
                <Textarea
                  placeholder="Add notes about this scheduled assignment..."
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  rows={3}
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit">Create Schedule</Button>
                <Button type="button" variant="outline" onClick={() => setIsCreating(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>All Scheduled Assignments ({assignments?.length || 0})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {assignments?.map((assignment) => (
              <Card key={assignment.id}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-2">
                        {getStatusBadge(assignment)}
                        <Badge variant="outline">{assignment.role}</Badge>
                        <span className="text-sm text-muted-foreground">@</span>
                        <span className="text-sm">{assignment.company}</span>
                      </div>

                      <div>
                        <p className="font-medium flex items-center gap-2">
                          <User className="h-4 w-4" />
                          {assignment.user_profile.full_name}
                        </p>
                        <p className="text-sm text-muted-foreground">{assignment.user_profile.email}</p>
                      </div>

                      <div className="text-sm">
                        <p className="flex items-center gap-2 text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          Start: {format(new Date(assignment.start_date), 'PPp')}
                        </p>
                        {assignment.end_date && (
                          <p className="flex items-center gap-2 text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            End: {format(new Date(assignment.end_date), 'PPp')}
                          </p>
                        )}
                      </div>

                      {assignment.notes && (
                        <p className="text-sm text-muted-foreground">{assignment.notes}</p>
                      )}

                      <p className="text-xs text-muted-foreground">
                        Created by {assignment.created_by_profile.full_name}
                      </p>
                    </div>

                    {assignment.status === 'scheduled' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => cancelMutation.mutate(assignment.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}

            {assignments?.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No scheduled assignments</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ScheduledAssignments;
