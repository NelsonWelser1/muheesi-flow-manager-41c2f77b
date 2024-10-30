import React, { useState } from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Search } from 'lucide-react';
import AccountCard from '@/components/accounts/AccountCard';

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
  const [accounts, setAccounts] = useState(initialAccounts);
  const [expandedAccounts, setExpandedAccounts] = useState(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCompany, setSelectedCompany] = useState('all');

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

  const filteredAccounts = accounts.filter(account => {
    const matchesSearch = account.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         account.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCompany = selectedCompany === 'all' || 
                          account.company.toLowerCase().includes(selectedCompany.toLowerCase());
    return matchesSearch && matchesCompany;
  });

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">System Administrator - Account Management</h1>
      </div>

      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search accounts by title, email, or company..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <Tabs defaultValue="all" onValueChange={setSelectedCompany}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">All Companies</TabsTrigger>
            <TabsTrigger value="grand berna">Grand Berna</TabsTrigger>
            <TabsTrigger value="kajon">KAJON Coffee</TabsTrigger>
            <TabsTrigger value="kyalima">Kyalima Farmers</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-4">
            <ScrollArea className="h-[600px]">
              <div className="space-y-4">
                {filteredAccounts.map((account) => (
                  <AccountCard
                    key={account.title}
                    account={account}
                    isExpanded={expandedAccounts.has(account.title)}
                    onToggleExpand={() => toggleExpand(account.title)}
                  />
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ManageAccounts;