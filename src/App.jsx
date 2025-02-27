
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import ManageInventory from "./pages/ManageInventory";
import Accounts from "./pages/Accounts";
import ManageAccounts from "./pages/ManageAccounts";
import ManageCompanies from "./pages/ManageCompanies";
import Sales from "./pages/Sales";
import Feedback from "./pages/Feedback";
import Contact from "./pages/Contact";
import Companies from "./pages/Companies";
import Inventory from "./pages/Inventory";
import { Toaster } from "@/components/ui/toaster";
import { AutoFillProvider } from "./contexts/AutoFillContext";
import { SupabaseAuthProvider } from "./integrations/supabase/auth";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";

// Import Packaging & Labeling components
import PackagingLabeling from "./components/inventory/dairy/packaging/PackagingLabeling";
import PackagingManagement from "./components/inventory/dairy/packaging/PackagingManagement";
import LabelingManagement from "./components/inventory/dairy/packaging/LabelingManagement";

// Create a query client
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AutoFillProvider>
        <SupabaseAuthProvider>
          <TooltipProvider>
            <Router>
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/manage-inventory" element={<ManageInventory />} />
                <Route path="/accounts" element={<Accounts />} />
                <Route path="/manage-accounts" element={<ManageAccounts />} />
                <Route path="/manage-companies" element={<ManageCompanies />} />
                <Route path="/sales" element={<Sales />} />
                <Route path="/feedback" element={<Feedback />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/companies" element={<Companies />} />
                <Route path="/inventory" element={<Inventory />} />
                
                {/* Packaging & Labeling Routes */}
                <Route path="/manage-inventory/grand-berna-dairies/packaging-and-labeling" element={<PackagingLabeling />} />
                <Route path="/manage-inventory/grand-berna-dairies/packaging-and-labeling/packaging-management" element={<PackagingManagement />} />
                <Route path="/manage-inventory/grand-berna-dairies/packaging-and-labeling/labeling-management" element={<LabelingManagement />} />
              
                {/* Add more routes as needed */}
              </Routes>
            </Router>
          </TooltipProvider>
        </SupabaseAuthProvider>
      </AutoFillProvider>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
