import React from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AutoFillProvider } from "./contexts/AutoFillContext";
import { SupabaseAuthProvider } from "./integrations/supabase/auth";
import Navigation from "./components/Navigation";
import LogoBackground from "./components/layout/LogoBackground";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import AuthPage from "./pages/AuthPage";
import LandingPage from "./pages/LandingPage";
import ManageInventory from "./pages/ManageInventory";
import ManageCompanies from "./pages/ManageCompanies";
import CoffeeExportManagerDashboard from "./components/inventory/kajon/export-business/CoffeeExportManagerDashboard";
import KashariFarmDashboard from "./components/inventory/kashari/KashariFarmDashboard";
import BukomeroDairyDashboard from "./components/inventory/bukomero/BukomeroDairyDashboard";
import SystemHealthMonitor from "./components/organization/monitoring/SystemHealthMonitor";
import DatabaseManagement from "./components/organization/database/DatabaseManagement";
import SecurityCenter from "./components/organization/security/SecurityCenter";
import AnalyticsDashboard from "./components/organization/analytics/AnalyticsDashboard";
import NotificationsCenter from "./components/organization/notifications/NotificationsCenter";
import SystemConfiguration from "./components/organization/settings/SystemConfiguration";
import CompanyManagement from "./components/organization/company/CompanyManagement";
import CompanyDetails from "./components/organization/company/CompanyDetails";
import UserManagement from "./components/organization/users/UserManagement";
import UserDetails from "./components/organization/users/UserDetails";
import AssignRole from "./components/organization/users/AssignRole";
import BulkUserOperations from "./components/organization/users/BulkUserOperations";
import BulkRoleAssignment from "./components/organization/users/BulkRoleAssignment";
import AuditLog from "./components/organization/users/AuditLog";
import RoleApprovalWorkflow from "./components/organization/users/RoleApprovalWorkflow";
import NotificationsDashboard from "./components/organization/users/NotificationsDashboard";
import ScheduledAssignments from "./components/organization/users/ScheduledAssignments";
import RoleTemplates from "./components/organization/users/RoleTemplates";
import RoleManagementTest from "./components/organization/users/RoleManagementTest";
import ErrorBoundary from "./components/ErrorBoundary";

// Create QueryClient with proper configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

const App = () => {
  console.log('App component rendering with QueryClient:', queryClient);
  
  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <AutoFillProvider>
          <SupabaseAuthProvider>
            <TooltipProvider>
              <Toaster />
              <LogoBackground />
              <BrowserRouter>
                <Navigation />
                <Routes>
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/" element={<ProtectedRoute><LandingPage /></ProtectedRoute>} />
                <Route path="/home" element={<Navigate to="/" replace />} />
                <Route path="/manage-inventory" element={<ProtectedRoute><ManageInventory /></ProtectedRoute>} />
                <Route path="/manage-companies" element={<ProtectedRoute><ManageCompanies /></ProtectedRoute>} />
                <Route path="/manage-accounts" element={<ProtectedRoute><UserManagement /></ProtectedRoute>} />
                <Route path="/system-health" element={<ProtectedRoute><SystemHealthMonitor /></ProtectedRoute>} />
                <Route path="/database-management" element={<ProtectedRoute><DatabaseManagement /></ProtectedRoute>} />
                <Route path="/security-center" element={<ProtectedRoute><SecurityCenter /></ProtectedRoute>} />
                <Route path="/analytics" element={<ProtectedRoute><AnalyticsDashboard /></ProtectedRoute>} />
                <Route path="/notifications" element={<ProtectedRoute><NotificationsCenter /></ProtectedRoute>} />
                <Route path="/system-config" element={<ProtectedRoute><SystemConfiguration /></ProtectedRoute>} />
                <Route path="/companies" element={<ProtectedRoute><CompanyManagement /></ProtectedRoute>} />
                <Route path="/company/:companyName" element={<ProtectedRoute><CompanyDetails /></ProtectedRoute>} />
                <Route path="/users" element={<ProtectedRoute><UserManagement /></ProtectedRoute>} />
                <Route path="/users/bulk-operations" element={<ProtectedRoute><BulkUserOperations /></ProtectedRoute>} />
                <Route path="/users/bulk-role-assignment" element={<ProtectedRoute><BulkRoleAssignment /></ProtectedRoute>} />
                <Route path="/users/audit-log" element={<ProtectedRoute><AuditLog /></ProtectedRoute>} />
                <Route path="/users/role-approvals" element={<ProtectedRoute><RoleApprovalWorkflow /></ProtectedRoute>} />
                <Route path="/users/notifications-dashboard" element={<ProtectedRoute><NotificationsDashboard /></ProtectedRoute>} />
                <Route path="/users/scheduled-assignments" element={<ProtectedRoute><ScheduledAssignments /></ProtectedRoute>} />
                <Route path="/users/role-templates" element={<ProtectedRoute><RoleTemplates /></ProtectedRoute>} />
                <Route path="/users/test" element={<ProtectedRoute><RoleManagementTest /></ProtectedRoute>} />
                <Route path="/users/:userId" element={<ProtectedRoute><UserDetails /></ProtectedRoute>} />
                <Route path="/users/:userId/assign-role" element={<ProtectedRoute><AssignRole /></ProtectedRoute>} />
                <Route path="/manage-inventory/kajon-export/export-manager" element={<ProtectedRoute><CoffeeExportManagerDashboard /></ProtectedRoute>} />
                <Route path="/manage-inventory/kashari-farm" element={<ProtectedRoute><KashariFarmDashboard /></ProtectedRoute>} />
                <Route path="/manage-inventory/bukomero-dairy" element={<ProtectedRoute><BukomeroDairyDashboard /></ProtectedRoute>} />
                </Routes>
              </BrowserRouter>
            </TooltipProvider>
          </SupabaseAuthProvider>
        </AutoFillProvider>
      </ErrorBoundary>
    </QueryClientProvider>
  );
};

export default App;
