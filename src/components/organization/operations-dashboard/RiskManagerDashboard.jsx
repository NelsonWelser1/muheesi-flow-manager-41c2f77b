
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RiskMetricsCards from './risk-manager/RiskMetricsCards';
import RiskAssessmentMatrix from './risk-manager/RiskAssessmentMatrix';
import ComplianceMonitoring from './risk-manager/ComplianceMonitoring';
import IncidentManagement from './risk-manager/IncidentManagement';
import RiskReporting from './risk-manager/RiskReporting';
import BusinessContinuityPlanning from './risk-manager/BusinessContinuityPlanning';
import RiskPolicyManagement from './risk-manager/RiskPolicyManagement';
import { Shield, AlertTriangle, FileText, Activity, BarChart3, Clipboard, Settings } from 'lucide-react';

const RiskManagerDashboard = () => {
  const [activeTab, setActiveTab] = useState('matrix');

  const riskTabs = [
    {
      id: 'matrix',
      label: 'Risk Matrix',
      icon: Shield,
      component: <RiskAssessmentMatrix />
    },
    {
      id: 'compliance',
      label: 'Compliance',
      icon: Clipboard,
      component: <ComplianceMonitoring />
    },
    {
      id: 'incidents',
      label: 'Incidents',
      icon: AlertTriangle,
      component: <IncidentManagement />
    },
    {
      id: 'continuity',
      label: 'Business Continuity',
      icon: Activity,
      component: <BusinessContinuityPlanning />
    },
    {
      id: 'policies',
      label: 'Risk Policies',
      icon: Settings,
      component: <RiskPolicyManagement />
    },
    {
      id: 'reports',
      label: 'Reports',
      icon: BarChart3,
      component: <RiskReporting />
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Risk Manager Dashboard</h2>
          <p className="text-muted-foreground">
            Monitor and manage organizational risks, compliance, and business continuity
          </p>
        </div>
        <Shield className="h-8 w-8 text-red-600" />
      </div>

      <RiskMetricsCards />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          {riskTabs.map((tab) => (
            <TabsTrigger key={tab.id} value={tab.id} className="flex items-center gap-2">
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {riskTabs.map((tab) => (
          <TabsContent key={tab.id} value={tab.id}>
            {tab.component}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default RiskManagerDashboard;
