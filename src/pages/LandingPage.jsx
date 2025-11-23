import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { LogIn, UserPlus, Shield, Users, Building2 } from 'lucide-react';
import CompanyShowcase from '../components/CompanyShowcase';
import HeroSection from '../components/landing/HeroSection';
import QuickAccessDashboard from '../components/landing/QuickAccessDashboard';
import SystemStats from '../components/landing/SystemStats';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <HeroSection />
      <QuickAccessDashboard />
      <SystemStats />
      
      {/* Authentication Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Employee Access Portal</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Sign in to access full system features or create an account to get started
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-8">
          {/* Login Card */}
          <Card className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 border-blue-100 bg-gradient-to-br from-blue-50 to-white">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-4 bg-blue-100 rounded-full w-fit">
                <LogIn className="h-8 w-8 text-blue-600" />
              </div>
              <CardTitle className="text-xl">Sign In</CardTitle>
              <CardDescription>
                Access your account and manage operations
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button 
                onClick={() => navigate('/auth')}
                className="w-full bg-blue-600 hover:bg-blue-700"
                size="lg"
              >
                Sign In to Portal
              </Button>
            </CardContent>
          </Card>

          {/* Signup Card */}
          <Card className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 border-green-100 bg-gradient-to-br from-green-50 to-white">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-4 bg-green-100 rounded-full w-fit">
                <UserPlus className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle className="text-xl">Create Account</CardTitle>
              <CardDescription>
                New employee? Get started with your account
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button 
                onClick={() => navigate('/auth')}
                variant="outline"
                className="w-full border-green-600 text-green-600 hover:bg-green-50"
                size="lg"
              >
                Sign Up Now
              </Button>
            </CardContent>
          </Card>

          {/* System Admin Card */}
          <Card className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 border-purple-100 bg-gradient-to-br from-purple-50 to-white">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-4 bg-purple-100 rounded-full w-fit">
                <Shield className="h-8 w-8 text-purple-600" />
              </div>
              <CardTitle className="text-xl">System Admin</CardTitle>
              <CardDescription>
                Advanced controls and system management
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button 
                onClick={() => navigate('/system-admin')}
                variant="outline"
                className="w-full border-purple-600 text-purple-600 hover:bg-purple-50"
                size="lg"
              >
                Admin Portal
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          <div className="bg-white rounded-lg p-4 shadow-md border border-gray-100 text-center">
            <Building2 className="h-6 w-6 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">5</p>
            <p className="text-sm text-gray-600">Companies</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-md border border-gray-100 text-center">
            <Users className="h-6 w-6 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">150+</p>
            <p className="text-sm text-gray-600">Employees</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-md border border-gray-100 text-center">
            <Shield className="h-6 w-6 text-purple-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">Secure</p>
            <p className="text-sm text-gray-600">Access</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-md border border-gray-100 text-center">
            <LogIn className="h-6 w-6 text-orange-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">24/7</p>
            <p className="text-sm text-gray-600">Available</p>
          </div>
        </div>
      </div>

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
        <CompanyShowcase />
      </div>
    </div>
  );
};

export default LandingPage;
