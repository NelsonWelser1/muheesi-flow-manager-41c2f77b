
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import OperationalProcedures from './OperationalProcedures';
import StaffHandbook from './StaffHandbook';
import QualityStandardsManual from './QualityStandardsManual';
import PolicyMetricsCards from './PolicyMetricsCards';
import { FileText, Users, Shield, Settings, Download, Search } from 'lucide-react';

const CompanyPoliciesDashboard = () => {
  const [activeTab, setActiveTab] = useState('procedures');
  const [searchTerm, setSearchTerm] = useState('');

  const policyTabs = [
    {
      id: 'procedures',
      label: 'Operational Procedures',
      icon: Settings,
      component: <OperationalProcedures searchTerm={searchTerm} />
    },
    {
      id: 'handbook',
      label: 'Staff Handbook',
      icon: Users,
      component: <StaffHandbook searchTerm={searchTerm} />
    },
    {
      id: 'quality',
      label: 'Quality Standards',
      icon: Shield,
      component: <QualityStandardsManual searchTerm={searchTerm} />
    }
  ];

  return (
    <div className="space-y-6 p-4 lg:p-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl lg:text-3xl font-bold tracking-tight">Company Policies & Procedures</h2>
          <p className="text-muted-foreground">
            Comprehensive policy management, staff guidelines, and quality standards
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="relative w-full sm:w-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search policies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border rounded-lg w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <Button variant="outline" size="sm" className="w-full sm:w-auto">
            <Download className="h-4 w-4 mr-2" />
            Export All
          </Button>
        </div>
      </div>

      <PolicyMetricsCards />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:grid-cols-3">
          {policyTabs.map((tab) => (
            <TabsTrigger key={tab.id} value={tab.id} className="flex items-center gap-2 text-xs sm:text-sm">
              <tab.icon className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">{tab.label}</span>
              <span className="sm:hidden">
                {tab.id === 'procedures' ? 'Procedures' : 
                 tab.id === 'handbook' ? 'Handbook' : 'Quality'}
              </span>
            </TabsTrigger>
          ))}
        </TabsList>

        {policyTabs.map((tab) => (
          <TabsContent key={tab.id} value={tab.id}>
            {tab.component}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default CompanyPoliciesDashboard;
