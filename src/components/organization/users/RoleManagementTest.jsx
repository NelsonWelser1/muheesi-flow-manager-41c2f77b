import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { usePermissions } from '@/hooks/usePermissions';
import { CheckCircle, XCircle, AlertCircle, Loader2 } from 'lucide-react';

/**
 * Role Management Testing Component
 * 
 * This component helps test all critical workflows:
 * 1. Permission checks
 * 2. Role assignment validation
 * 3. Approval workflow
 * 4. Scheduled assignments
 * 5. Real-time updates
 * 6. Email notifications
 */

const RoleManagementTest = () => {
  const { permissions, isLoading } = usePermissions();
  const [testResults, setTestResults] = useState([]);
  const [isRunning, setIsRunning] = useState(false);

  const addResult = (test, passed, message) => {
    setTestResults(prev => [...prev, { test, passed, message, timestamp: new Date() }]);
  };

  const runTests = async () => {
    setIsRunning(true);
    setTestResults([]);

    // Test 1: Permission Check
    addResult(
      'Permission Check',
      permissions.isAuthenticated,
      permissions.isAuthenticated 
        ? `✓ Authenticated as ${permissions.role || 'user'}`
        : '✗ Not authenticated'
    );

    // Test 2: Admin Permission
    addResult(
      'Admin Permission',
      permissions.isSysAdmin,
      permissions.isSysAdmin
        ? '✓ Has system admin permissions'
        : `✗ No admin permissions (current role: ${permissions.role || 'none'})`
    );

    // Test 3: Feature Access
    const features = [
      { name: 'Manage Users', key: 'canManageUsers' },
      { name: 'Assign Roles', key: 'canAssignRoles' },
      { name: 'View Audit Log', key: 'canViewAuditLog' },
      { name: 'Manage Templates', key: 'canManageTemplates' },
      { name: 'Approve Requests', key: 'canApproveRequests' }
    ];

    features.forEach(feature => {
      addResult(
        feature.name,
        permissions[feature.key],
        permissions[feature.key] 
          ? `✓ Can ${feature.name.toLowerCase()}`
          : `✗ Cannot ${feature.name.toLowerCase()}`
      );
    });

    setIsRunning(false);
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading test environment...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Role Management System Tests</CardTitle>
          <CardDescription>
            Test critical workflows and permission checks
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Current User Info */}
          <div className="p-4 bg-muted rounded-lg space-y-2">
            <h3 className="font-semibold">Current User Status</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Authenticated</p>
                <p className="font-medium">{permissions.isAuthenticated ? 'Yes' : 'No'}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Role</p>
                <p className="font-medium">{permissions.role || 'None'}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Company</p>
                <p className="font-medium">{permissions.company || 'None'}</p>
              </div>
              <div>
                <p className="text-muted-foreground">System Admin</p>
                <p className="font-medium">{permissions.isSysAdmin ? 'Yes' : 'No'}</p>
              </div>
            </div>
          </div>

          {/* Run Tests Button */}
          <Button 
            onClick={runTests} 
            disabled={isRunning}
            className="w-full"
          >
            {isRunning ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Running Tests...
              </>
            ) : (
              'Run Permission Tests'
            )}
          </Button>

          {/* Test Results */}
          {testResults.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-semibold">Test Results</h3>
              {testResults.map((result, index) => (
                <div 
                  key={index}
                  className={`flex items-start gap-3 p-3 rounded-lg ${
                    result.passed ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
                  }`}
                >
                  {result.passed ? (
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <p className="font-medium text-sm">{result.test}</p>
                    <p className="text-xs text-muted-foreground">{result.message}</p>
                  </div>
                </div>
              ))}

              <div className="flex items-center justify-between p-4 bg-muted rounded-lg mt-4">
                <span className="font-medium">Total Tests</span>
                <Badge variant="outline">{testResults.length}</Badge>
              </div>
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                <span className="font-medium">Passed</span>
                <Badge className="bg-green-600">{testResults.filter(r => r.passed).length}</Badge>
              </div>
              <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
                <span className="font-medium">Failed</span>
                <Badge variant="destructive">{testResults.filter(r => !r.passed).length}</Badge>
              </div>
            </div>
          )}

          {/* Manual Test Checklist */}
          <div className="border-t pt-6">
            <h3 className="font-semibold mb-4">Manual Test Checklist</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5" />
                <div>
                  <p className="font-medium">1. Test Role Assignment</p>
                  <p className="text-muted-foreground">
                    Go to Users → Select a user → Assign Role → Verify email notification sent
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5" />
                <div>
                  <p className="font-medium">2. Test Approval Workflow</p>
                  <p className="text-muted-foreground">
                    Create role change request → Go to Approvals → Approve/Reject → Verify audit log
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5" />
                <div>
                  <p className="font-medium">3. Test Scheduled Assignment</p>
                  <p className="text-muted-foreground">
                    Go to Scheduled → Create assignment for future date → Wait or trigger manually
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5" />
                <div>
                  <p className="font-medium">4. Test Bulk Assignment</p>
                  <p className="text-muted-foreground">
                    Go to Bulk Assign → Select multiple users → Assign roles → Verify all emails sent
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5" />
                <div>
                  <p className="font-medium">5. Test CSV Import</p>
                  <p className="text-muted-foreground">
                    Download template → Fill with test data → Upload → Verify validation errors shown
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5" />
                <div>
                  <p className="font-medium">6. Test Real-time Dashboard</p>
                  <p className="text-muted-foreground">
                    Open dashboard in one window → Make role changes in another → Verify live updates
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5" />
                <div>
                  <p className="font-medium">7. Test Role Templates</p>
                  <p className="text-muted-foreground">
                    Create template → Use in bulk assignment → Verify correct role/company applied
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5" />
                <div>
                  <p className="font-medium">8. Test Audit Log</p>
                  <p className="text-muted-foreground">
                    Make various role changes → Check audit log → Verify all changes recorded
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RoleManagementTest;
