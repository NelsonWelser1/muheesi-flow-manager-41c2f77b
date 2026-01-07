import React, { Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { LogIn, UserPlus, Shield, Users, Building2, Loader2 } from 'lucide-react';
import CompanyShowcase from '../components/CompanyShowcase';
import HeroSection from '../components/landing/HeroSection';
import QuickAccessDashboard from '../components/landing/QuickAccessDashboard';
import SystemStats from '../components/landing/SystemStats';
import ComponentErrorBoundary from '../components/ui/ComponentErrorBoundary';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <HeroSection />
      <QuickAccessDashboard />
      <SystemStats />
      

      {/* Company Showcase - Public Access */}
      <div className="bg-gradient-to-br from-gray-100 to-blue-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Business Portfolio</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Explore our diverse range of products and services across all business units. 
              Browse freely without authentication required.
            </p>
          </div>
        </div>
        <ComponentErrorBoundary componentName="Company Showcase">
          <Suspense fallback={
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          }>
            <CompanyShowcase />
          </Suspense>
        </ComponentErrorBoundary>
      </div>
    </div>
  );
};

export default LandingPage;
