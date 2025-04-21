
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AutoFillProvider } from "./contexts/AutoFillContext";
import { SupabaseAuthProvider } from "./integrations/supabase/auth";
import Navigation from "./components/Navigation";
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import ManageInventory from "./pages/ManageInventory";
import ManageCompanies from "./pages/ManageCompanies";
import Personnel from "./pages/Personnel";
import Sales from "./pages/Sales";
import Accounts from "./pages/Accounts";
import CEODashboard from "./components/executive/CEODashboard";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 30000
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AutoFillProvider>
      <SupabaseAuthProvider>
        <TooltipProvider>
          <Toaster />
          <BrowserRouter>
            <Navigation />
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/dashboard" element={<Dashboard />} />
              
              {/* Management routes */}
              <Route path="/manage-companies" element={<ManageCompanies />} />
              <Route path="/manage-inventory" element={<ManageInventory />} />
              <Route path="/inventory" element={<ManageInventory />} />
              <Route path="/personnel" element={<Personnel />} />
              <Route path="/sales" element={<Sales />} />
              <Route path="/accounts" element={<Accounts />} />
              
              {/* Executive routes */}
              <Route path="/reports/*" element={<CEODashboard />} />
              <Route path="/approvals/*" element={<CEODashboard />} />
              <Route path="/meetings/*" element={<CEODashboard />} />
              
              {/* Default CEO Dashboard for unmatched management routes */}
              <Route path="/management/*" element={<CEODashboard />} />
              
              {/* Fallback route */}
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </SupabaseAuthProvider>
    </AutoFillProvider>
  </QueryClientProvider>
);

export default App;
