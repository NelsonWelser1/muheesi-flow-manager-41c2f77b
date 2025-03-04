
import React, { Suspense, useState, useEffect } from "react";
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
import SandboxFallback from "./components/SandboxFallback";

// Create custom error boundary component
class AppErrorBoundary extends React.Component {
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

// Loading component for suspense fallback with retry capability
const LoadingFallback = () => {
  const [retryCount, setRetryCount] = useState(0);
  
  useEffect(() => {
    // Auto-retry logic after delay
    if (retryCount > 0) {
      const timer = setTimeout(() => {
        console.log(`Auto-retry attempt ${retryCount}`);
        window.location.reload();
      }, 10000); // 10 seconds delay
      
      return () => clearTimeout(timer);
    }
  }, [retryCount]);

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="text-center p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-2">Loading application...</h2>
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto my-4"></div>
        <p className="mb-4">Please wait while we set things up for you.</p>
        {retryCount > 0 && (
          <p className="text-amber-600">
            Retry attempt {retryCount}... 
          </p>
        )}
        <button 
          onClick={() => setRetryCount(prev => prev + 1)}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Retry Now
        </button>
      </div>
    </div>
  );
};

// Create QueryClient instance with improved stability
const createQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 2, // Increased retries for better reliability
      staleTime: 1000 * 60 * 10, // 10 minutes - increased for better performance
      cacheTime: 1000 * 60 * 15, // 15 minutes
    },
  },
});

// App initialization indicator to prevent duplicate mounting
window.__APP_INITIALIZED = window.__APP_INITIALIZED || false;

const App = () => {
  console.log("App component rendering, initialized:", window.__APP_INITIALIZED);
  
  // Use a ref to ensure we only initialize once
  const [queryClient] = React.useState(() => {
    if (!window.__APP_INITIALIZED) {
      console.log("Creating new QueryClient");
      window.__APP_INITIALIZED = true;
      return createQueryClient();
    } else {
      console.log("Using existing QueryClient");
      return window.__QUERY_CLIENT || createQueryClient();
    }
  });
  
  // Store client reference globally
  window.__QUERY_CLIENT = queryClient;
  
  return (
    <AppErrorBoundary>
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
                </TooltipProvider>
              </BrowserRouter>
            </SupabaseAuthProvider>
          </AutoFillProvider>
        </Suspense>
      </QueryClientProvider>
    </AppErrorBoundary>
  );
};

export default App;
