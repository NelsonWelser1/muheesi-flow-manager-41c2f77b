import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft,
  Shield,
  Search,
  Calendar,
  User,
  Building2,
  FileText
} from 'lucide-react';
import { format } from 'date-fns';

const AuditLog = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');

  const { data: auditLogs, isLoading } = useQuery({
    queryKey: ['audit-logs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('role_change_audit_log')
        .select(`
          *,
          changed_by_profile:profiles!role_change_audit_log_changed_by_fkey(full_name, email),
          affected_user_profile:profiles!role_change_audit_log_affected_user_fkey(full_name, email)
        `)
        .order('changed_at', { ascending: false });

      if (error) throw error;
      return data;
    }
  });

  const getActionBadgeColor = (actionType) => {
    switch (actionType) {
      case 'assigned':
        return 'bg-green-50 text-green-700 border-green-300';
      case 'updated':
        return 'bg-blue-50 text-blue-700 border-blue-300';
      case 'removed':
        return 'bg-red-50 text-red-700 border-red-300';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-300';
    }
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'sysadmin':
        return 'bg-destructive/10 text-destructive border-destructive';
      case 'manager':
        return 'bg-primary/10 text-primary border-primary';
      case 'staff':
        return 'bg-muted/10 text-muted-foreground border-muted';
      default:
        return 'bg-muted/10 text-muted-foreground border-muted';
    }
  };

  const filteredLogs = auditLogs?.filter(log => {
    const matchesSearch = 
      log.affected_user_profile.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.affected_user_profile.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.changed_by_profile?.full_name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = filterRole === 'all' || log.new_role === filterRole;
    
    return matchesSearch && matchesRole;
  });

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-12">Loading audit logs...</div>
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
            <FileText className="h-8 w-8" />
            Role Change Audit Log
          </h1>
          <p className="text-muted-foreground mt-1">
            Complete history of all role assignments and changes
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
            <div>
              <CardTitle>Audit Trail</CardTitle>
              <CardDescription>{filteredLogs?.length || 0} records found</CardDescription>
            </div>
            <div className="flex gap-2">
              <div className="relative flex-1 md:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="px-3 py-2 border rounded-md bg-background"
              >
                <option value="all">All Roles</option>
                <option value="sysadmin">System Admin</option>
                <option value="manager">Manager</option>
                <option value="staff">Staff</option>
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredLogs?.map((log) => (
              <Card key={log.id} className="border-l-4" style={{
                borderLeftColor: log.action_type === 'assigned' ? '#22c55e' : 
                                log.action_type === 'updated' ? '#3b82f6' : '#ef4444'
              }}>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className={getActionBadgeColor(log.action_type)}>
                          {log.action_type.toUpperCase()}
                        </Badge>
                        <span className="text-sm text-muted-foreground flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {format(new Date(log.changed_at), 'PPp')}
                        </span>
                      </div>
                      
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Affected User</p>
                        <p className="font-medium flex items-center gap-2">
                          <User className="h-4 w-4" />
                          {log.affected_user_profile.full_name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {log.affected_user_profile.email}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Changed By</p>
                        <p className="text-sm">
                          {log.changed_by_profile?.full_name || 'System'}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <p className="text-xs text-muted-foreground mb-2">Role Change</p>
                        <div className="flex items-center gap-2">
                          {log.old_role && (
                            <>
                              <Badge variant="outline" className={getRoleBadgeColor(log.old_role)}>
                                {log.old_role}
                              </Badge>
                              <span className="text-muted-foreground">→</span>
                            </>
                          )}
                          <Badge variant="outline" className={getRoleBadgeColor(log.new_role)}>
                            {log.new_role}
                          </Badge>
                        </div>
                      </div>

                      <div>
                        <p className="text-xs text-muted-foreground mb-2">Company Change</p>
                        <div className="flex items-center gap-2">
                          {log.old_company && (
                            <>
                              <span className="text-sm flex items-center gap-1">
                                <Building2 className="h-3 w-3" />
                                {log.old_company}
                              </span>
                              <span className="text-muted-foreground">→</span>
                            </>
                          )}
                          <span className="text-sm font-medium flex items-center gap-1">
                            <Building2 className="h-3 w-3" />
                            {log.new_company}
                          </span>
                        </div>
                      </div>

                      {log.notes && (
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Notes</p>
                          <p className="text-sm">{log.notes}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {filteredLogs?.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No audit logs found</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuditLog;
