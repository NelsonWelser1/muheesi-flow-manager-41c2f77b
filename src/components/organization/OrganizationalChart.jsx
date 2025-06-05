import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Users, Building2, Briefcase, FileText, Shield, Settings, HeadphonesIcon, UserCheck } from "lucide-react";
import OperationalProceduresDocuments from './operational-procedures/OperationalProceduresDocuments';

const OrganizationalChart = () => {
  const [selectedProcedures, setSelectedProcedures] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);

  const dispatchRoleSelection = (role) => {
    setSelectedRole(role);
    const event = new CustomEvent('roleSelected', { detail: role });
    window.dispatchEvent(event);
  };

  if (selectedProcedures) {
    return (
      <div>
        <Button 
          variant="ghost" 
          onClick={() => setSelectedProcedures(false)}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Organizational Chart
        </Button>
        <OperationalProceduresDocuments />
      </div>
    );
  }

  return (
    <div className="w-full p-6 space-y-6">
      {/* Company Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          GKK Group Organizational Structure
        </h2>
        <p className="text-gray-600">
          Integrated management across Dairy, Coffee, and Agricultural operations
        </p>
      </div>

      {/* Board of Directors */}
      <div className="mb-8">
        <h3 className="text-2xl font-bold text-center text-gray-900 mb-4">
          Board of Directors
        </h3>
        <div className="flex justify-center">
          <Card className="w-80 shadow-lg border-2 border-green-200 bg-gradient-to-br from-green-50 to-green-100">
            <CardHeader className="text-center">
              <div className="mx-auto mb-2 p-3 bg-green-600 rounded-full w-fit">
                <Users className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-xl text-green-800">Board of Directors</CardTitle>
              <Badge className="mx-auto bg-green-600 text-white">Governance</Badge>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-sm text-green-700 mb-4">
                Overseeing strategic direction and governance
              </p>
              <div className="space-y-2">
                <button 
                  className="w-full text-left text-blue-700 hover:underline text-sm cursor-pointer"
                  onClick={() => dispatchRoleSelection('board-member')}
                >
                  • Strategic Oversight
                </button>
                <button 
                  className="w-full text-left text-blue-700 hover:underline text-sm cursor-pointer"
                  onClick={() => dispatchRoleSelection('board-member')}
                >
                  • Financial Governance
                </button>
                <button 
                  className="w-full text-left text-blue-700 hover:underline text-sm cursor-pointer"
                  onClick={() => dispatchRoleSelection('board-member')}
                >
                  • Risk Management
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Executive Level */}
      <div className="flex justify-center mb-8">
        <Card className="w-80 shadow-lg border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100">
          <CardHeader className="text-center">
            <div className="mx-auto mb-2 p-3 bg-blue-600 rounded-full w-fit">
              <UserCheck className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-xl text-blue-800">Chief Executive Officer</CardTitle>
            <Badge className="mx-auto bg-blue-600 text-white">Executive Leadership</Badge>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-sm text-blue-700 mb-4">
              Overall strategic direction and company leadership
            </p>
            <div className="space-y-2">
              <button 
                className="w-full text-left text-blue-700 hover:underline text-sm cursor-pointer"
                onClick={() => dispatchRoleSelection('ceo')}
              >
                • Strategic Planning & Vision
              </button>
              <button 
                className="w-full text-left text-blue-700 hover:underline text-sm cursor-pointer"
                onClick={() => dispatchRoleSelection('ceo')}
              >
                • Board Relations
              </button>
              <button 
                className="w-full text-left text-blue-700 hover:underline text-sm cursor-pointer"
                onClick={() => dispatchRoleSelection('ceo')}
              >
                • Executive Leadership
              </button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Management Level - Department Heads */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Dairy Division */}
        <Card className="shadow-md border-blue-100">
          <CardHeader className="text-center">
            <div className="mx-auto mb-2 p-3 bg-blue-500 rounded-full w-fit">
              <Building2 className="h-6 w-6 text-white" />
            </div>
            <CardTitle className="text-lg text-blue-700">Dairy Division Head</CardTitle>
            <Badge className="mx-auto bg-blue-500 text-white">Management</Badge>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-sm text-gray-600 mb-4">
              Overseeing all dairy production and operations
            </p>
            <div className="space-y-2">
              <button 
                className="w-full text-left text-blue-700 hover:underline text-sm cursor-pointer"
                onClick={() => dispatchRoleSelection('dairy-head')}
              >
                • Production Management
              </button>
              <button 
                className="w-full text-left text-blue-700 hover:underline text-sm cursor-pointer"
                onClick={() => dispatchRoleSelection('dairy-head')}
              >
                • Quality Control
              </button>
              <button 
                className="w-full text-left text-blue-700 hover:underline text-sm cursor-pointer"
                onClick={() => dispatchRoleSelection('dairy-head')}
              >
                • Supply Chain
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Coffee Division */}
        <Card className="shadow-md border-orange-100">
          <CardHeader className="text-center">
            <div className="mx-auto mb-2 p-3 bg-orange-500 rounded-full w-fit">
              <Briefcase className="h-6 w-6 text-white" />
            </div>
            <CardTitle className="text-lg text-orange-700">Coffee Division Head</CardTitle>
            <Badge className="mx-auto bg-orange-500 text-white">Management</Badge>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-sm text-gray-600 mb-4">
              Managing coffee production, processing, and export
            </p>
            <div className="space-y-2">
              <button 
                className="w-full text-left text-blue-700 hover:underline text-sm cursor-pointer"
                onClick={() => dispatchRoleSelection('coffee-head')}
              >
                • Export Management
              </button>
              <button 
                className="w-full text-left text-blue-700 hover:underline text-sm cursor-pointer"
                onClick={() => dispatchRoleSelection('coffee-head')}
              >
                • Farm Relations
              </button>
              <button 
                className="w-full text-left text-blue-700 hover:underline text-sm cursor-pointer"
                onClick={() => dispatchRoleSelection('coffee-head')}
              >
                • Quality Assurance
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Finance Department */}
        <Card className="shadow-md border-purple-100">
          <CardHeader className="text-center">
            <div className="mx-auto mb-2 p-3 bg-purple-500 rounded-full w-fit">
              <Settings className="h-6 w-6 text-white" />
            </div>
            <CardTitle className="text-lg text-purple-700">Finance Director</CardTitle>
            <Badge className="mx-auto bg-purple-500 text-white">Management</Badge>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-sm text-gray-600 mb-4">
              Overseeing financial planning, reporting, and compliance
            </p>
            <div className="space-y-2">
              <button 
                className="w-full text-left text-blue-700 hover:underline text-sm cursor-pointer"
                onClick={() => dispatchRoleSelection('finance-director')}
              >
                • Budget Management
              </button>
              <button 
                className="w-full text-left text-blue-700 hover:underline text-sm cursor-pointer"
                onClick={() => dispatchRoleSelection('finance-director')}
              >
                • Financial Reporting
              </button>
              <button 
                className="w-full text-left text-blue-700 hover:underline text-sm cursor-pointer"
                onClick={() => dispatchRoleSelection('finance-director')}
              >
                • Compliance
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Customer Support */}
        <Card className="shadow-md border-yellow-100">
          <CardHeader className="text-center">
            <div className="mx-auto mb-2 p-3 bg-yellow-500 rounded-full w-fit">
              <HeadphonesIcon className="h-6 w-6 text-white" />
            </div>
            <CardTitle className="text-lg text-yellow-700">Customer Support Manager</CardTitle>
            <Badge className="mx-auto bg-yellow-500 text-white">Management</Badge>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-sm text-gray-600 mb-4">
              Managing customer relations and support services
            </p>
            <div className="space-y-2">
              <button 
                className="w-full text-left text-blue-700 hover:underline text-sm cursor-pointer"
                onClick={() => dispatchRoleSelection('support-manager')}
              >
                • Customer Relations
              </button>
              <button 
                className="w-full text-left text-blue-700 hover:underline text-sm cursor-pointer"
                onClick={() => dispatchRoleSelection('support-manager')}
              >
                • Service Delivery
              </button>
              <button 
                className="w-full text-left text-blue-700 hover:underline text-sm cursor-pointer"
                onClick={() => dispatchRoleSelection('support-manager')}
              >
                • Feedback Analysis
              </button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Company Policies Section */}
      <div className="mt-12">
        <h3 className="text-2xl font-bold text-center text-gray-900 mb-8">
          Company Policies & Procedures
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow border-green-200">
            <CardHeader className="text-center">
              <div className="mx-auto mb-2 p-3 bg-green-600 rounded-full w-fit">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-lg text-green-800">Operational Procedures</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-3">
              <p className="text-sm text-gray-600 mb-4">
                Standard operating procedures for all production areas
              </p>
              <ul className="space-y-2 text-sm">
                <li 
                  className="flex items-center text-blue-700 hover:underline cursor-pointer"
                  onClick={() => setSelectedProcedures(true)}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Production Area Procedures
                </li>
                <li 
                  className="flex items-center text-blue-700 hover:underline cursor-pointer"
                  onClick={() => setSelectedProcedures(true)}
                >
                  <Shield className="h-4 w-4 mr-2" />
                  Safety Guidelines & Do's/Don'ts
                </li>
                <li 
                  className="flex items-center text-blue-700 hover:underline cursor-pointer"
                  onClick={() => setSelectedProcedures(true)}
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Document Upload Templates
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow border-red-200">
            <CardHeader className="text-center">
              <div className="mx-auto mb-2 p-3 bg-red-600 rounded-full w-fit">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-lg text-red-800">Safety & Compliance</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-3">
              <p className="text-sm text-gray-600 mb-4">
                Guidelines for maintaining a safe and compliant workplace
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center text-blue-700 hover:underline cursor-pointer">
                  <Shield className="h-4 w-4 mr-2" />
                  Emergency Response Protocols
                </li>
                <li className="flex items-center text-blue-700 hover:underline cursor-pointer">
                  <FileText className="h-4 w-4 mr-2" />
                  Regulatory Compliance Documents
                </li>
                <li className="flex items-center text-blue-700 hover:underline cursor-pointer">
                  <Settings className="h-4 w-4 mr-2" />
                  Safety Training Schedules
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow border-blue-200">
            <CardHeader className="text-center">
              <div className="mx-auto mb-2 p-3 bg-blue-600 rounded-full w-fit">
                <Settings className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-lg text-blue-800">HR & Administration</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-3">
              <p className="text-sm text-gray-600 mb-4">
                Policies related to human resources and administration
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center text-blue-700 hover:underline cursor-pointer">
                  <Users className="h-4 w-4 mr-2" />
                  Employee Handbook
                </li>
                <li className="flex items-center text-blue-700 hover:underline cursor-pointer">
                  <FileText className="h-4 w-4 mr-2" />
                  Leave and Attendance Policies
                </li>
                <li className="flex items-center text-blue-700 hover:underline cursor-pointer">
                  <Settings className="h-4 w-4 mr-2" />
                  Performance Review Procedures
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Operational Structure */}
      <div className="mt-12">
        <h3 className="text-2xl font-bold text-center text-gray-900 mb-8">
          Operational Structure by Company
        </h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Grand Berna Dairies */}
          <Card className="border-blue-100">
            <CardHeader className="text-center">
              <div className="mx-auto mb-2 p-3 bg-blue-500 rounded-full w-fit">
                <Building2 className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-lg text-blue-700">Grand Berna Dairies</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-3">
              <p className="text-sm text-gray-600">
                Dairy production and distribution
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center text-blue-700 hover:underline cursor-pointer">
                  <Users className="h-4 w-4 mr-2" />
                  Production Team
                </li>
                <li className="flex items-center text-blue-700 hover:underline cursor-pointer">
                  <FileText className="h-4 w-4 mr-2" />
                  Quality Control Department
                </li>
                <li className="flex items-center text-blue-700 hover:underline cursor-pointer">
                  <Settings className="h-4 w-4 mr-2" />
                  Distribution Network
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* KAJON Coffee */}
          <Card className="border-orange-100">
            <CardHeader className="text-center">
              <div className="mx-auto mb-2 p-3 bg-orange-500 rounded-full w-fit">
                <Briefcase className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-lg text-orange-700">KAJON Coffee</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-3">
              <p className="text-sm text-gray-600">
                Coffee processing and export operations
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center text-blue-700 hover:underline cursor-pointer">
                  <Users className="h-4 w-4 mr-2" />
                  Farm Management
                </li>
                <li className="flex items-center text-blue-700 hover:underline cursor-pointer">
                  <FileText className="h-4 w-4 mr-2" />
                  Processing Facilities
                </li>
                <li className="flex items-center text-blue-700 hover:underline cursor-pointer">
                  <Settings className="h-4 w-4 mr-2" />
                  Export Division
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Kyalima Farmers */}
          <Card className="border-green-100">
            <CardHeader className="text-center">
              <div className="mx-auto mb-2 p-3 bg-green-500 rounded-full w-fit">
                <Users className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-lg text-green-700">Kyalima Farmers</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-3">
              <p className="text-sm text-gray-600">
                Agricultural production and supply chain
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center text-blue-700 hover:underline cursor-pointer">
                  <Users className="h-4 w-4 mr-2" />
                  Farmers Network
                </li>
                <li className="flex items-center text-blue-700 hover:underline cursor-pointer">
                  <FileText className="h-4 w-4 mr-2" />
                  Supply Chain Logistics
                </li>
                <li className="flex items-center text-blue-700 hover:underline cursor-pointer">
                  <Settings className="h-4 w-4 mr-2" />
                  Agricultural Extension Services
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default OrganizationalChart;
