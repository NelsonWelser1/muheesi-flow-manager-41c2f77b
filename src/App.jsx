import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navigation from "./components/Navigation";
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import Inventory from "./pages/Inventory";
import Companies from "./pages/Companies";
import Feedback from "./pages/Feedback";
import { Toaster } from "@/components/ui/toaster";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background relative">
        {/* Global Watermark */}
        <div 
          className="fixed inset-0 pointer-events-none opacity-5 bg-center bg-no-repeat bg-contain"
          style={{ 
            backgroundImage: 'url("__ MUHEESI KKGF-4-company logoes - png2.png")',
            zIndex: -1 
          }}
        />
        
        <Navigation />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/manage-inventory" element={<Inventory />} />
          <Route path="/manage-companies" element={<Companies />} />
          <Route path="/feedback" element={<Feedback />} />
        </Routes>
        <Toaster />
      </div>
    </Router>
  );
}

export default App;