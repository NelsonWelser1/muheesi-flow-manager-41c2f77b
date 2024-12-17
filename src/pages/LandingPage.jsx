import React from 'react';
import CompanyShowcase from '../components/CompanyShowcase';

const LandingPage = () => {
  return (
    <div className="container mx-auto p-4">
      <div className="text-center mb-6">
        <h1 className="text-4xl font-bold mb-4">Welcome to Muheesi GKK Int.System</h1>
        <p className="text-xl">A comprehensive Supply Chain and Warehouse Management System</p>
      </div>
      <CompanyShowcase />
    </div>
  );
};

export default LandingPage;