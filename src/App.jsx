
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AutoFillProvider } from "./contexts/AutoFillContext";
import { SupabaseAuthProvider } from "./integrations/supabase/auth";
import Navigation from "./components/Navigation";
import LandingPage from "./pages/LandingPage";
import ManageInventory from "./pages/ManageInventory";
import ManageCompanies from "./pages/ManageCompanies";
import CoffeeExportManagerDashboard from "./components/inventory/kajon/export-business/CoffeeExportManagerDashboard";
import KashariFarmDashboard from "./components/inventory/kashari/KashariFarmDashboard";
import BukomeroDairyDashboard from "./components/inventory/bukomero/BukomeroDairyDashboard";

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
      <AutoFillProvider>
        <SupabaseAuthProvider>
          <TooltipProvider>
            <Toaster />
            <BrowserRouter>
              <Navigation />
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/home" element={<Navigate to="/" replace />} />
                <Route path="/manage-inventory" element={<ManageInventory />} />
                <Route path="/manage-companies" element={<ManageCompanies />} />
                <Route path="/manage-inventory/kajon-export/export-manager" element={<CoffeeExportManagerDashboard />} />
                <Route path="/manage-inventory/kashari-farm" element={<KashariFarmDashboard />} />
                <Route path="/manage-inventory/bukomero-dairy" element={<BukomeroDairyDashboard />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </SupabaseAuthProvider>
      </AutoFillProvider>
    </QueryClientProvider>
  );
};

export default App;
