import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { 
  ArrowLeft,
  CheckCircle,
  XCircle,
  Clock,
  User,
  Shield,
  Building2,
  FileText
} from 'lucide-react';
import { format } from 'date-fns';

const RoleApprovalWorkflow = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [reviewNotes, setReviewNotes] = useState('');
  const [filterStatus, setFilterStatus] = useState('pending');

  const { data: pendingRequests, isLoading } = useQuery({
    queryKey: ['pending-role-changes', filterStatus],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('pending_role_changes')
        .select(`
          *,
          requested_by_profile:profiles!pending_role_changes_requested_by_fkey(full_name, email),
          affected_user_profile:profiles!pending_role_changes_affected_user_fkey(full_name, email),
          reviewed_by_profile:profiles!pending_role_changes_reviewed_by_fkey(full_name, email)
        `)
        .eq('status', filterStatus)
        .order('requested_at', { ascending: false });

      if (error) throw error;
      return data;
    }
  });

  const reviewMutation = useMutation({
    mutationFn: async ({ requestId, status, notes }) => {
      const { data: { user } } = await supabase.auth.getUser();

      // Update the request status
      const { error: updateError } = await supabase
        .from('pending_role_changes')
        .update({
          status,
          reviewed_by: user.id,
          reviewed_at: new Date().toISOString(),
          review_notes: notes
        })
        .eq('id', requestId);

      if (updateError) throw updateError;

      // If approved, actually assign the role
      if (status === 'approved') {
        const request = pendingRequests.find(r => r.id === requestId);
        
        // Check if user already has a role
        const { data: existingRole } = await supabase
          .from('user_roles')
          .select('id')
          .eq('user_id', request.affected_user)
          .maybeSingle();

        if (existingRole) {
          await supabase
            .from('user_roles')
            .update({
              role: request.requested_role,
              company: request.requested_company,
              assigned_by: user.id
            })
            .eq('user_id', request.affected_user);
        } else {
          await supabase
            .from('user_roles')
            .insert({
              user_id: request.affected_user,
              role: request.requested_role,
              company: request.requested_company,
              assigned_by: user.id
            });
        }

        // Log in audit
        await supabase
          .from('role_change_audit_log')
          .insert({
            changed_by: user.id,
            affected_user: request.affected_user,
            old_role: request.current_role,
            new_role: request.requested_role,
            old_company: request.current_company,
            new_company: request.requested_company,
            action_type: existingRole ? 'updated' : 'assigned',
            notes: `Approved request: ${notes}`
          });

        // Send notification email
        try {
          await supabase.functions.invoke('send-role-notification', {
            body: {
              userName: request.affected_user_profile.full_name,
              userEmail: request.affected_user_profile.email,
              role: request.requested_role,
              company: request.requested_company,
              actionType: existingRole ? 'updated' : 'assigned',
              changedBy: user.email
            }
          });
        } catch (emailError) {
          console.error('Failed to send notification:', emailError);
        }
      }
    },
    onSuccess: (_, { status }) => {
      queryClient.invalidateQueries(['pending-role-changes']);
      queryClient.invalidateQueries(['all-users']);
      toast.success(`Request ${status} successfully`);
      setSelectedRequest(null);
      setReviewNotes('');
    },
    onError: (error) => {
      toast.error(`Failed to process request: ${error.message}`);
    }
  });

  const handleReview = (requestId, status) => {
    reviewMutation.mutate({ requestId, status, notes: reviewNotes });
  };

  const getStatusBadge = (status) => {
    const colors = {
      pending: 'bg-yellow-50 text-yellow-700 border-yellow-300',
      approved: 'bg-green-50 text-green-700 border-green-300',
      rejected: 'bg-red-50 text-red-700 border-red-300',
      cancelled: 'bg-gray-50 text-gray-700 border-gray-300'
    };
    return colors[status] || colors.pending;
  };

  const getRoleBadge = (role) => {
    const colors = {
      sysadmin: 'bg-destructive/10 text-destructive border-destructive',
      manager: 'bg-primary/10 text-primary border-primary',
      staff: 'bg-muted/10 text-muted-foreground border-muted'
    };
    return colors[role] || colors.staff;
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-12">Loading requests...</div>
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
            <Clock className="h-8 w-8" />
            Role Change Approvals
          </h1>
          <p className="text-muted-foreground mt-1">
            Review and approve role change requests
          </p>
        </div>
      </div>

      <div className="flex gap-2">
        {['pending', 'approved', 'rejected'].map((status) => (
          <Button
            key={status}
            variant={filterStatus === status ? 'default' : 'outline'}
            onClick={() => setFilterStatus(status)}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Requests List */}
        <div className="space-y-4">
          {pendingRequests?.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No {filterStatus} requests</p>
              </CardContent>
            </Card>
          ) : (
            pendingRequests?.map((request) => (
              <Card
                key={request.id}
                className={`cursor-pointer transition-all ${
                  selectedRequest?.id === request.id ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => setSelectedRequest(request)}
              >
                <CardContent className="pt-6">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className={getStatusBadge(request.status)}>
                          {request.status}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(request.requested_at), 'PPp')}
                        </span>
                      </div>
                    </div>

                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Requested By</p>
                      <p className="font-medium text-sm">
                        {request.requested_by_profile.full_name}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Affected User</p>
                      <p className="font-medium flex items-center gap-2">
                        <User className="h-4 w-4" />
                        {request.affected_user_profile.full_name}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-muted-foreground mb-2">Requested Change</p>
                      <div className="flex items-center gap-2 text-sm">
                        {request.current_role && (
                          <>
                            <Badge variant="outline" className={getRoleBadge(request.current_role)}>
                              {request.current_role}
                            </Badge>
                            <span className="text-muted-foreground">→</span>
                          </>
                        )}
                        <Badge variant="outline" className={getRoleBadge(request.requested_role)}>
                          {request.requested_role}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-sm mt-2">
                        <Building2 className="h-3 w-3" />
                        {request.current_company && `${request.current_company} → `}
                        <strong>{request.requested_company}</strong>
                      </div>
                    </div>

                    {request.justification && (
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Justification</p>
                        <p className="text-sm">{request.justification}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Review Panel */}
        <Card className="lg:sticky lg:top-6 h-fit">
          <CardHeader>
            <CardTitle>Review Request</CardTitle>
            <CardDescription>
              {selectedRequest
                ? 'Approve or reject this role change request'
                : 'Select a request to review'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {selectedRequest ? (
              <>
                <div className="p-4 bg-muted rounded-lg space-y-2">
                  <p className="font-medium">{selectedRequest.affected_user_profile.full_name}</p>
                  <p className="text-sm text-muted-foreground">
                    {selectedRequest.affected_user_profile.email}
                  </p>
                  <div className="flex items-center gap-2 pt-2">
                    <Badge variant="outline" className={getRoleBadge(selectedRequest.requested_role)}>
                      {selectedRequest.requested_role}
                    </Badge>
                    <span className="text-xs">at</span>
                    <Badge variant="outline">{selectedRequest.requested_company}</Badge>
                  </div>
                </div>

                {selectedRequest.status === 'pending' && (
                  <>
                    <div className="space-y-2">
                      <Label>Review Notes</Label>
                      <Textarea
                        placeholder="Add notes about your decision..."
                        value={reviewNotes}
                        onChange={(e) => setReviewNotes(e.target.value)}
                        rows={4}
                      />
                    </div>

                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleReview(selectedRequest.id, 'approved')}
                        className="flex-1 bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Approve
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => handleReview(selectedRequest.id, 'rejected')}
                        className="flex-1"
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Reject
                      </Button>
                    </div>
                  </>
                )}

                {selectedRequest.status !== 'pending' && selectedRequest.reviewed_by_profile && (
                  <div className="p-4 bg-muted rounded-lg space-y-2">
                    <p className="text-sm font-medium">Review Decision</p>
                    <Badge variant="outline" className={getStatusBadge(selectedRequest.status)}>
                      {selectedRequest.status}
                    </Badge>
                    <p className="text-sm text-muted-foreground">
                      By {selectedRequest.reviewed_by_profile.full_name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(selectedRequest.reviewed_at), 'PPp')}
                    </p>
                    {selectedRequest.review_notes && (
                      <p className="text-sm pt-2">{selectedRequest.review_notes}</p>
                    )}
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Select a request to review</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RoleApprovalWorkflow;
