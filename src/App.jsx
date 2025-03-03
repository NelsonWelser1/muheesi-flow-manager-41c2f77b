
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AutoFillProvider } from "./contexts/AutoFillContext";
import { SupabaseAuthProvider } from "./integrations/supabase/auth";
import Navigation from "./components/Navigation";
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import ManageInventory from "./pages/ManageInventory";
import ManageCompanies from "./pages/ManageCompanies";
import Feedback from "./pages/Feedback";
import ExportManagementDashboard from "./components/inventory/kajon/export-business/ExportManagementDashboard";
import CoffeeExportManagerDashboard from "./components/inventory/kajon/export-business/CoffeeExportManagerDashboard";
import KashariFarmDashboard from "./components/inventory/kashari/KashariFarmDashboard";
import BukomeroDairyDashboard from "./components/inventory/bukomero/BukomeroDairyDashboard";
import SmartProductionDashboard from "./components/inventory/dairy/production/SmartProductionDashboard";
import SalesMarketingDashboard from "./components/inventory/dairy/sales/SalesMarketingDashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AutoFillProvider>
      <SupabaseAuthProvider>
        <TooltipProvider>
          <Toaster />
          <BrowserRouter>
            <div className="flex flex-col min-h-screen">
              <Navigation />
              <main className="flex-grow overflow-y-auto">
                <Routes>
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/manage-inventory" element={<ManageInventory />} />
                  <Route path="/manage-companies" element={<ManageCompanies />} />
                  <Route path="/feedback" element={<Feedback />} />
                  <Route path="/manage-inventory/kajon-export" element={<ExportManagementDashboard />} />
                  <Route path="/manage-inventory/kajon-export/export-manager" element={<CoffeeExportManagerDashboard />} />
                  <Route path="/manage-inventory/kashari-farm" element={<KashariFarmDashboard />} />
                  <Route path="/manage-inventory/bukomero-dairy" element={<BukomeroDairyDashboard />} />
                  <Route path="/manage-inventory/smart-production" element={<SmartProductionDashboard />} />
                  <Route path="/manage-inventory/sales-marketing" element={<SalesMarketingDashboard />} />
                </Routes>
              </main>
            </div>
          </BrowserRouter>
        </TooltipProvider>
      </SupabaseAuthProvider>
    </AutoFillProvider>
  </QueryClientProvider>
);

export default App;
