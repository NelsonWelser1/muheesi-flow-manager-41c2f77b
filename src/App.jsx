
import React, { Suspense, useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
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
import Feedback from "./pages/Feedback";
import ExportManagementDashboard from "./components/inventory/kajon/export-business/ExportManagementDashboard";
import CoffeeExportManagerDashboard from "./components/inventory/kajon/export-business/CoffeeExportManagerDashboard";
import KashariFarmDashboard from "./components/inventory/kashari/KashariFarmDashboard";
import BukomeroDairyDashboard from "./components/inventory/bukomero/BukomeroDairyDashboard";
import SmartProductionDashboard from "./components/inventory/dairy/production/SmartProductionDashboard";
import SalesMarketingDashboard from "./components/inventory/dairy/sales/SalesMarketingDashboard";
import SandboxFallback from "./components/SandboxFallback";
import Index from "./pages/Index";

// Loading component for suspense fallback
const LoadingFallback = () => (
  <div className="flex justify-center items-center h-screen">
    <div className="text-center p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-2">Loading application...</h2>
      <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto my-4"></div>
      <p className="mb-4">Please wait while we set things up for you.</p>
    </div>
  </div>
);

// Create QueryClient instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 3,
    },
  },
});

// Custom error boundary component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("App error caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
          <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
          <p className="mb-4">{this.state.error?.message || "An unexpected error occurred"}</p>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={() => {
              this.setState({ hasError: false, error: null });
              window.location.reload();
            }}
          >
            Refresh Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

const App = () => {
  const [initialized, setInitialized] = useState(false);

  // Make sure the routing is initialized properly
  useEffect(() => {
    console.log("App initialized, current path:", window.location.pathname);
    setInitialized(true);
  }, []);

  if (!initialized) {
    return <LoadingFallback />;
  }

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <Suspense fallback={<LoadingFallback />}>
          <AutoFillProvider>
            <SupabaseAuthProvider>
              <BrowserRouter>
                <TooltipProvider>
                  <Toaster />
                  <SandboxFallback />
                  <div className="flex flex-col min-h-screen">
                    <Navigation />
                    <main className="flex-grow overflow-y-auto">
                      <Routes>
                        <Route path="/" element={<Index />} />
                        <Route path="/landing" element={<LandingPage />} />
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
                        <Route path="*" element={<Navigate to="/" replace />} />
                      </Routes>
                    </main>
                  </div>
                </TooltipProvider>
              </BrowserRouter>
            </SupabaseAuthProvider>
          </AutoFillProvider>
        </Suspense>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
