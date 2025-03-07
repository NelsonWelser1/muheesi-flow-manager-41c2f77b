import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LogisticsRoutes from './routes/logistics-routes';

// Main App component - this is just a skeleton, adjust according to your existing App.jsx
const App = () => {
  return (
    <Router>
      <Routes>
        {/* Other routes */}
        <Route path="/manage-inventory/logistics/*" element={<LogisticsRoutes />} />
        {/* Redirect to the logistics dashboard as a fallback route for testing */}
        <Route path="/" element={<div className="p-8">
          <h1 className="text-2xl font-bold mb-4">Welcome to Muheesi GKK Integrated System</h1>
          <p className="mb-4">This is the main dashboard page.</p>
          <a href="/manage-inventory/logistics" className="text-blue-500 hover:underline">
            Go to Logistics Dashboard
          </a>
        </div>} />
        {/* Other routes */}
      </Routes>
    </Router>
  );
};

export default App;
