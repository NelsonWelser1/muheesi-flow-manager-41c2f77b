import React from 'react';
import CompanyShowcase from '../components/CompanyShowcase';
const LandingPage = () => {
  return <div className="container mx-auto p-4">
      <div className="text-center mb-6">
        <h1 className="font-bold mb-4 text-4xl">Welcome to Muheesi GKK Integrated System</h1>
        <p className="text-xl">A comprehensive Supply Chain, Factory and Warehouse Management System</p>
      </div>
      <CompanyShowcase />
    </div>;
};
export default LandingPage;