
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Building, ArrowLeft, Users, Package, DollarSign, BarChart, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { useCEODashboardData } from '@/hooks/useCEODashboardData';

const ManageCompanies = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const { dashboardData, isLoading } = useCEODashboardData();
  
  // Sample company data - in a real application, this would come from the CEO dashboard data
  const companyList = [
    {
      id: 1,
      name: "Grand Berna Dairies",
      revenue: 450000000,
      employees: 48,
      inventory: 105,
      profitMargin: 18.5,
      performance: "Good",
      status: "Active"
    },
    {
      id: 2,
      name: "KAJON Coffee Limited",
      revenue: 320000000,
      employees: 35,
      inventory: 82,
      profitMargin: 22.3,
      performance: "Excellent",
      status: "Active"
    },
    {
      id: 3,
      name: "Kyalima Farmers Limited",
      revenue: 280000000,
      employees: 42,
      inventory: 120,
      profitMargin: 14.8,
      performance: "Fair",
      status: "Active"
    }
  ];

  const getPerformanceBadgeColor = (performance) => {
    switch (performance) {
      case "Excellent":
        return "bg-green-100 text-green-800";
      case "Good":
        return "bg-blue-100 text-blue-800";
      case "Fair":
        return "bg-amber-100 text-amber-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleCompanySelect = (companyId) => {
    // Navigate to detailed company view
    navigate(`/company-details/${companyId}`);
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading company data...</div>;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-[#1A1F2C]">Company Management</h1>
          <p className="text-[#8E9196]">Manage and monitor all your companies</p>
        </div>
        <Button 
          variant="outline" 
          className="flex items-center gap-2"
          onClick={() => navigate('/executive-dashboard')}
        >
          <ArrowLeft size={16} />
          Back to Dashboard
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="structure">Structure</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-[#8E9196]">Total Companies</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-end justify-between">
                  <div className="text-3xl font-bold">{companyList.length}</div>
                  <Building className="h-8 w-8 text-[#6E59A5]" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-[#8E9196]">Total Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-end justify-between">
                  <div className="text-3xl font-bold">UGX {(companyList.reduce((acc, company) => acc + company.revenue, 0) / 1000000).toFixed(0)}M</div>
                  <DollarSign className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-[#8E9196]">Total Employees</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-end justify-between">
                  <div className="text-3xl font-bold">{companyList.reduce((acc, company) => acc + company.employees, 0)}</div>
                  <Users className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Company List</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#E5DEFF]">
                      <th className="text-left p-3">Company</th>
                      <th className="text-left p-3">Status</th>
                      <th className="text-left p-3">Revenue</th>
                      <th className="text-left p-3">Employees</th>
                      <th className="text-left p-3">Performance</th>
                      <th className="text-left p-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {companyList.map((company) => (
                      <tr key={company.id} className="border-b border-[#F1F0FB] hover:bg-[#F9F8FF]">
                        <td className="p-3">
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-[#F1F0FB] flex items-center justify-center mr-3">
                              <Building className="h-4 w-4 text-[#6E59A5]" />
                            </div>
                            <span className="font-medium">{company.name}</span>
                          </div>
                        </td>
                        <td className="p-3">
                          <Badge className="bg-green-100 text-green-800">
                            {company.status}
                          </Badge>
                        </td>
                        <td className="p-3">UGX {(company.revenue / 1000000).toFixed(0)}M</td>
                        <td className="p-3">{company.employees}</td>
                        <td className="p-3">
                          <Badge className={getPerformanceBadgeColor(company.performance)}>
                            {company.performance}
                          </Badge>
                        </td>
                        <td className="p-3">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleCompanySelect(company.id)}
                          >
                            View Details
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="structure">
          <Card>
            <CardHeader>
              <CardTitle>Organizational Structure</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] flex items-center justify-center">
                <p>Organizational chart and structure view will be displayed here.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance">
          <Card>
            <CardHeader>
              <CardTitle>Company Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] flex items-center justify-center">
                <p>Performance metrics and KPIs will be displayed here.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Company Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] flex items-center justify-center">
                <p>Company settings and configurations will be displayed here.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ManageCompanies;
