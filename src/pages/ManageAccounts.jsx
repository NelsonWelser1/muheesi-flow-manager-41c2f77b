import React, { useState } from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from 'lucide-react';
import AccountListItem from '@/components/accounts/AccountListItem';
import AccountFilters from '@/components/accounts/AccountFilters';
import CompanySelector from '@/components/accounts/CompanySelector';

const initialAccounts = [
  {
    title: "System Administrator (SysAdmin)",
    status: "Active",
    email: "sysadmin@muheesi.com",
    company: "All Companies",
    responsibilities: [
      "Overall system management and oversight",
      "User account management",
      "Security protocols implementation",
      "System maintenance and updates",
      "Database management and backups"
    ]
  },
  {
    title: "Chief Executive Officer (CEO)",
    status: "Active",
    email: "ceo@muheesi.com",
    company: "All Companies",
    responsibilities: [
      "Strategic leadership and decision making",
      "Company vision and mission oversight",
      "Executive team management",
      "Corporate governance",
      "Stakeholder relations management"
    ]
  },
  {
    title: "Operations Manager",
    status: "Active",
    email: "operations@muheesi.com",
    company: "All Companies",
    responsibilities: [
      "Daily operations oversight",
      "Resource allocation and management",
      "Process optimization",
      "Team coordination",
      "Performance monitoring and reporting"
    ]
  },
  {
    title: "Farm Supervisor",
    status: "Active",
    email: "farm@muheesi.com",
    company: "All Companies",
    responsibilities: [
      "Farm operations management",
      "Crop planning and monitoring",
      "Worker supervision",
      "Quality control",
      "Production reporting"
    ]
  },
  {
    title: "Warehouse Manager",
    status: "Active",
    email: "warehouse@muheesi.com",
    company: "All Companies",
    responsibilities: [
      "Inventory management",
      "Storage optimization",
      "Stock control",
      "Warehouse staff supervision",
      "Logistics coordination"
    ]
  },
  {
    title: "Coffee Store Manager",
    status: "Active",
    email: "coffeestore@muheesi.com",
    company: "KAJON Coffee Limited",
    responsibilities: [
      "Store operations management",
      "Sales oversight",
      "Customer service management",
      "Inventory control",
      "Staff supervision"
    ]
  },
  {
    title: "Logistics Manager",
    status: "Active",
    email: "logistics@muheesi.com",
    company: "All Companies",
    responsibilities: [
      "Transportation planning",
      "Route optimization",
      "Delivery scheduling",
      "Fleet management",
      "Supply chain coordination"
    ]
  },
  {
    title: "Inventory Manager",
    status: "Active",
    email: "inventory@muheesi.com",
    company: "All Companies",
    responsibilities: [
      "Stock level monitoring",
      "Inventory tracking",
      "Supply chain management",
      "Stock reporting",
      "Warehouse coordination"
    ]
  },
  {
    title: "Finance Manager",
    status: "Active",
    email: "finance@muheesi.com",
    company: "All Companies",
    responsibilities: [
      "Financial planning",
      "Budget management",
      "Financial reporting",
      "Cash flow monitoring",
      "Audit preparation"
    ]
  },
  {
    title: "Sales and Marketing Manager",
    status: "Active",
    email: "sales@muheesi.com",
    company: "All Companies",
    responsibilities: [
      "Sales strategy development",
      "Marketing campaign management",
      "Client relationship management",
      "Market analysis",
      "Sales team leadership"
    ]
  },
  {
    title: "Coffee Quality Analyst",
    status: "Active",
    email: "quality@muheesi.com",
    company: "KAJON Coffee Limited",
    responsibilities: [
      "Coffee quality assessment",
      "Quality control procedures",
      "Sample analysis",
      "Quality reporting",
      "Standards compliance"
    ]
  },
  {
    title: "General Data Clerk",
    status: "Active",
    email: "clerk@muheesi.com",
    company: "All Companies",
    responsibilities: [
      "Data entry and management",
      "Record keeping",
      "Document filing",
      "Basic reporting",
      "Administrative support"
    ]
  }
];

const ManageAccounts = () => {
  const [accounts] = useState(initialAccounts);
  const [expandedAccounts, setExpandedAccounts] = useState(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCompany, setSelectedCompany] = useState('');
  const [showCompanySelector, setShowCompanySelector] = useState(true);

  const toggleExpand = (accountTitle) => {
    setExpandedAccounts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(accountTitle)) {
        newSet.delete(accountTitle);
      } else {
        newSet.add(accountTitle);
      }
      return newSet;
    });
  };

  const handleCompanySelect = (companyId) => {
    setSelectedCompany(companyId);
    setShowCompanySelector(false);
  };

  const filteredAccounts = accounts.filter(account => {
    const matchesSearch = 
      account.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCompany = 
      !selectedCompany || 
      account.company.toLowerCase().includes(selectedCompany.toLowerCase());
    return matchesSearch && matchesCompany;
  });

  if (showCompanySelector) {
    return (
      <div className="container mx-auto p-4 space-y-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">System Administrator - Account Management</h1>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Select The Company to Manage</CardTitle>
          </CardHeader>
          <CardContent>
            <CompanySelector onCompanySelect={handleCompanySelect} />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">System Administrator - Account Management</h1>
        <div className="space-x-4">
          <Button variant="outline" onClick={() => setShowCompanySelector(true)}>
            Change Company
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add New Account
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Account Management</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="w-full">
            <AccountFilters 
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              selectedCompany={selectedCompany}
              onCompanyChange={setSelectedCompany}
            />
            
            <ScrollArea className="h-[600px] mt-4">
              <div className="space-y-4">
                {filteredAccounts.map((account) => (
                  <AccountListItem
                    key={account.title}
                    account={account}
                    isExpanded={expandedAccounts.has(account.title)}
                    onToggle={() => toggleExpand(account.title)}
                  />
                ))}
              </div>
            </ScrollArea>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default ManageAccounts;
