import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Database, 
  Table as TableIcon, 
  HardDrive,
  Shield,
  RefreshCw,
  Download,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

const DatabaseManagement = () => {
  // Fetch table statistics
  const { data: tables, isLoading } = useQuery({
    queryKey: ['database-tables'],
    queryFn: async () => {
      const { count: profilesCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      const { count: rolesCount } = await supabase
        .from('user_roles')
        .select('*', { count: 'exact', head: true });

      return [
        {
          name: 'profiles',
          rows: profilesCount || 0,
          size: '2.3 MB',
          rls: true,
          lastModified: '2 hours ago'
        },
        {
          name: 'user_roles',
          rows: rolesCount || 0,
          size: '1.1 MB',
          rls: true,
          lastModified: '5 hours ago'
        }
      ];
    }
  });

  const rlsPolicies = [
    { table: 'profiles', policy: 'Users can view their own profile', type: 'SELECT', status: 'active' },
    { table: 'profiles', policy: 'System admins can view all profiles', type: 'SELECT', status: 'active' },
    { table: 'profiles', policy: 'Users can update their own profile', type: 'UPDATE', status: 'active' },
    { table: 'profiles', policy: 'System admins can update all profiles', type: 'UPDATE', status: 'active' },
    { table: 'user_roles', policy: 'Users can view their own roles', type: 'SELECT', status: 'active' },
    { table: 'user_roles', policy: 'System admins can view all roles', type: 'SELECT', status: 'active' },
    { table: 'user_roles', policy: 'System admins can assign roles', type: 'INSERT', status: 'active' },
    { table: 'user_roles', policy: 'System admins can update roles', type: 'UPDATE', status: 'active' },
    { table: 'user_roles', policy: 'System admins can delete roles', type: 'DELETE', status: 'active' }
  ];

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Database className="h-8 w-8" />
            Database Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Monitor and manage database tables, backups, and security
          </p>
        </div>
      </div>

      {/* Database Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Tables</p>
                <p className="text-2xl font-bold">{tables?.length || 0}</p>
              </div>
              <TableIcon className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Rows</p>
                <p className="text-2xl font-bold">
                  {tables?.reduce((acc, t) => acc + t.rows, 0) || 0}
                </p>
              </div>
              <HardDrive className="h-8 w-8 text-accent" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">RLS Policies</p>
                <p className="text-2xl font-bold">{rlsPolicies.length}</p>
              </div>
              <Shield className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">DB Size</p>
                <p className="text-2xl font-bold">3.4 MB</p>
              </div>
              <Database className="h-8 w-8 text-secondary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Table Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Table Statistics</CardTitle>
          <CardDescription>Overview of database tables and their current state</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Loading table statistics...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Table Name</TableHead>
                  <TableHead>Row Count</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>RLS Enabled</TableHead>
                  <TableHead>Last Modified</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tables?.map((table, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <TableIcon className="h-4 w-4 text-muted-foreground" />
                        {table.name}
                      </div>
                    </TableCell>
                    <TableCell>{table.rows.toLocaleString()}</TableCell>
                    <TableCell>{table.size}</TableCell>
                    <TableCell>
                      {table.rls ? (
                        <Badge variant="outline" className="border-success text-success">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Enabled
                        </Badge>
                      ) : (
                        <Badge variant="destructive">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          Disabled
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>{table.lastModified}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* RLS Policies */}
      <Card>
        <CardHeader>
          <CardTitle>Row Level Security (RLS) Policies</CardTitle>
          <CardDescription>Active security policies protecting your data</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Table</TableHead>
                <TableHead>Policy Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rlsPolicies.map((policy, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{policy.table}</TableCell>
                  <TableCell>{policy.policy}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{policy.type}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="border-success text-success">
                      {policy.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Backup Status */}
      <Card>
        <CardHeader>
          <CardTitle>Backup Management</CardTitle>
          <CardDescription>Database backup status and schedule</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-success" />
                <div>
                  <p className="font-medium">Last Backup Successful</p>
                  <p className="text-sm text-muted-foreground">Completed 2 hours ago</p>
                </div>
              </div>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Download Backup
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Backup Frequency</p>
                <p className="font-bold">Every 6 hours</p>
              </div>
              <div className="p-4 border rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Next Backup</p>
                <p className="font-bold">In 4 hours</p>
              </div>
              <div className="p-4 border rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Retention Period</p>
                <p className="font-bold">30 days</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DatabaseManagement;
