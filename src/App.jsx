import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navigation from './components/Navigation';
import Dashboard from './pages/Dashboard';
import ManageInventory from './pages/ManageInventory';
import ManageCompanies from './pages/ManageCompanies';
import ManageAccounts from './pages/ManageAccounts';
import Feedback from './pages/Feedback';

function App() {
  return (
    <Router>
      <div className="App">
        <Navigation />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/manage-inventory" element={<ManageInventory />} />
          <Route path="/manage-companies" element={<ManageCompanies />} />
          <Route path="/manage-accounts" element={<ManageAccounts />} />
          <Route path="/feedback" element={<Feedback />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;