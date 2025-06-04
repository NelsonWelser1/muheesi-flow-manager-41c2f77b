
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FinanceMetricsCards from './finance-manager/FinanceMetricsCards';
import BudgetPlanning from './finance-manager/BudgetPlanning';
import CashFlowManagement from './finance-manager/CashFlowManagement';
import FinancialReporting from './finance-manager/FinancialReporting';
import AccountsPayableReceivable from './finance-manager/AccountsPayableReceivable';
import TaxCompliance from './finance-manager/TaxCompliance';
import FinancialAnalytics from './finance-manager/FinancialAnalytics';
import { DollarSign, TrendingUp, FileText, Calculator, CreditCard, Shield, BarChart3 } from 'lucide-react';

const FinanceManagerDashboard = () => {
  const [activeTab, setActiveTab] = useState('cashflow');

  const financeTabs = [
    {
      id: 'cashflow',
      label: 'Cash Flow',
      icon: DollarSign,
      component: <CashFlowManagement />
    },
    {
      id: 'budget',
      label: 'Budget Planning',
      icon: Calculator,
      component: <BudgetPlanning />
    },
    {
      id: 'accounts',
      label: 'AP/AR',
      icon: CreditCard,
      component: <AccountsPayableReceivable />
    },
    {
      id: 'reports',
      label: 'Reports',
      icon: FileText,
      component: <FinancialReporting />
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: BarChart3,
      component: <FinancialAnalytics />
    },
    {
      id: 'tax',
      label: 'Tax & Compliance',
      icon: Shield,
      component: <TaxCompliance />
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Finance Manager Dashboard</h2>
          <p className="text-muted-foreground">
            Manage financial operations, budgets, and compliance across all business units
          </p>
        </div>
        <DollarSign className="h-8 w-8 text-green-600" />
      </div>

      <FinanceMetricsCards />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          {financeTabs.map((tab) => (
            <TabsTrigger key={tab.id} value={tab.id} className="flex items-center gap-2">
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {financeTabs.map((tab) => (
          <TabsContent key={tab.id} value={tab.id}>
            {tab.component}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default FinanceManagerDashboard;
