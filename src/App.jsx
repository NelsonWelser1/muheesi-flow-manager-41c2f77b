import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AutoFillProvider } from "./contexts/AutoFillContext";
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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AutoFillProvider>
      <TooltipProvider>
        <Toaster />
        <BrowserRouter>
          <Navigation />
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
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AutoFillProvider>
  </QueryClientProvider>
);

export default App;