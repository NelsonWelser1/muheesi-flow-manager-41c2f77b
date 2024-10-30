import React, { useState } from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Search } from 'lucide-react';
import AccountCard from '@/components/accounts/AccountCard';

const initialAccounts = [
  {
    title: "System Administrator",
    status: "Active",
    email: "admin@muheesi.com",
    company: "All Companies",
    responsibilities: [
      "System management and oversight",
      "User account management",
      "Security protocols",
      "System maintenance"
    ]
  },
  {
    title: "Operations Manager (Farm & Warehouse Manager)",
    responsibilities: [
      "Oversee both farm and warehouse operations across all modules.",
      "Review reports from farm managers and warehouse clerks.",
      "Monitor farm and warehouse inventory, stock movements, and transportation schedules.",
      "Manage procurement and logistics flow between farms, warehouses, and market destinations.",
      "Handle high-level decision-making related to farm and warehouse activities."
    ]
  },
  {
    title: "Procurement Manager",
    responsibilities: [
      "Manage and track the purchasing of products (e.g., coffee, maize, cheese) from suppliers or farmers.",
      "Ensure proper procurement documentation (purchase orders, contracts) is completed.",
      "Review real-time data on procurement costs and ensure budget alignment.",
      "Oversee inventory inflow and balance stock levels to match demand.",
      "Approve and track all procurement-related transactions."
    ]
  },
  {
    title: "Warehouse Supervisor",
    responsibilities: [
      "Manage day-to-day operations within the warehouse.",
      "Track the movement of stock in and out of the warehouse.",
      "Ensure accuracy of inventory data, maintaining proper records of product types, owners, and stock levels.",
      "Ensure synchronization of stock data with the main system.",
      "Handle warehouse storage settings, including capacity, product storage fees, and geo-location."
    ]
  },
  {
    title: "Farm Manager",
    responsibilities: [
      "Oversee farm operations and provide visibility on farm performance.",
      "Manage the registration and updating of farm and farmer data within the system.",
      "Monitor farm activities, harvest estimations, and farming practices.",
      "Sync farm data from the field using mobile devices.",
      "Report on seasonal activities and handle any issues that arise with farm operations."
    ]
  },
  {
    title: "Farm Supervisors",
    responsibilities: [
      "Farm and Farmer Registration",
      "Monitoring Coffee Farming Practices",
      "Data Collection and Reporting",
      "Logistics Coordination",
      "Quality Control",
      "Scheduling and Forecasting",
      "Inventory Tracking",
      "Communication and Feedback",
      "Health, Safety, and Compliance",
      "Technology Use and Training"
    ]
  },
  {
    title: "Logistics Manager",
    responsibilities: [
      "Plan and manage logistics, including transportation of products from farms to warehouses and then to market destinations.",
      "Schedule transport and manage relationships with drivers, loaders, and external logistics partners (rental vans, sea-lines).",
      "Track vehicle usage, transportation costs, and efficiency.",
      "Ensure that logistics processes align with warehouse and farm activities to avoid delays."
    ]
  },
  {
    title: "Inventory Manager",
    responsibilities: [
      "Oversee the inventory control system to ensure all stocks are accurately recorded.",
      "Track inventory turnover rates, stock levels, and storage conditions.",
      "Ensure the quality and quantity of stored products meet required standards.",
      "Generate inventory reports and projections based on current data."
    ]
  },
  {
    title: "Sales & Export Manager",
    responsibilities: [
      "Handle local and international sales, ensuring smooth customer transactions.",
      "Manage export-related documentation (e.g., customs clearances, certificates, and licenses).",
      "Track client orders, invoicing, and payment processing.",
      "Maintain client communication and follow up on after-sales services.",
      "Generate sales reports and handle client feedback."
    ]
  },
  {
    title: "Compliance & Quality Control Officer",
    responsibilities: [
      "Ensure all products meet quality standards (e.g., moisture, protein levels for coffee; milk quality for cheese).",
      "Conduct regular audits to ensure regulatory compliance for both farm and warehouse activities.",
      "Monitor and document product quality at various stages (farm, warehouse, processing, and export).",
      "Ensure proper certification for local and international sales."
    ]
  },
  {
    title: "Finance Manager",
    responsibilities: [
      "Oversee all financial transactions within the system, including procurement costs, payments to farmers, and logistics expenses.",
      "Manage salaries for farm and warehouse staff, ensuring timely payments.",
      "Handle client invoicing and payment processing for both local and export sales.",
      "Generate financial reports on profits, expenses, and budget allocations."
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
        <h1 className="text-3xl font-bold">Manage Accounts</h1>
      </div>

      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search accounts..."
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
