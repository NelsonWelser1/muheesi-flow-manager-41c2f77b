import React from 'react';
import CompanyShowcase from '../components/CompanyShowcase';
import HeroSection from '../components/landing/HeroSection';
import QuickAccessDashboard from '../components/landing/QuickAccessDashboard';
import SystemStats from '../components/landing/SystemStats';
import UserDashboard from '../components/dashboard/UserDashboard';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto p-6">
        <UserDashboard />
      </div>
      <HeroSection />
      <QuickAccessDashboard />
      <SystemStats />
      <CompanyShowcase />
    </div>
  );
};

export default LandingPage;
