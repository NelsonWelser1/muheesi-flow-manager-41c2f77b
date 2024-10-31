import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import AccountInterface from '../components/accounts/AccountInterface';
import { ScrollArea } from "@/components/ui/scroll-area";

const accounts = [
  {
    title: "System Administrator (SysAdmin)",
    responsibilities: [
      "System Health",
      "System Settings",
      "Database Operations",
      "Data Backups",
      "Security Protocols",
      "Technical Issues",
      "Software Updates",
      "Audit Logs",
      "System Alerts",
      "Manage Accounts"
    ]
  },
  {
    title: "Chief Executive Account CEO H.E. Rtd. Maj. Gen. Muheesi Geoffrey Baraba",
    responsibilities: [
      "Overall company management and strategic decision-making",
      "Review and approve high-level reports and financial statements",
      "Set company goals and objectives",
      "Represent the company in major business dealings and partnerships"
    ]
  },
  {
    title: "General Manager",
    responsibilities: [
      "Oversee day-to-day operations of the company",
      "Implement strategies set by the CEO",
      "Manage department heads and ensure smooth interdepartmental coordination",
      "Report directly to the CEO on company performance and challenges"
    ]
  },
  {
    title: "Operations Manager",
    responsibilities: [
      "Review Reports",
      "Monitor Inventory",
      "Manage Operations",
      "Process Approvals",
      "Resource Allocation",
      "Coordinate with Farm and Warehouse Teams",
      "Quality Control Oversight"
    ]
  },
  {
    title: "Procurement Manager",
    responsibilities: [
      "Manage Product Purchasing",
      "Supplier Relations",
      "Cost Management",
      "Inventory Control",
      "Purchase Documentation",
      "Budget Alignment"
    ]
  },
  {
    title: "Warehouse Supervisor",
    responsibilities: [
      "Daily Warehouse Operations",
      "Stock Movement Tracking",
      "Inventory Accuracy",
      "Storage Management",
      "Stock Synchronization",
      "Capacity Management"
    ]
  },
  {
    title: "Farm Manager",
    responsibilities: [
      "Farm Operations Oversight",
      "Performance Monitoring",
      "Farm Data Management",
      "Activity Monitoring",
      "Seasonal Planning",
      "Resource Management"
    ]
  },
  {
    title: "Farm Supervisors",
    responsibilities: [
      "Farm and Farmer Registration",
      "Coffee Farming Practices",
      "Data Collection",
      "Logistics Coordination",
      "Quality Control",
      "Scheduling",
      "Inventory Tracking",
      "Communication",
      "Health and Safety",
      "Technology Training"
    ]
  },
  {
    title: "Logistics Manager",
    responsibilities: [
      "Transport Planning",
      "Route Optimization",
      "Vehicle Management",
      "Cost Tracking",
      "Partner Relations",
      "Delivery Scheduling"
    ]
  },
  {
    title: "Inventory Manager",
    responsibilities: [
      "Stock Control",
      "Inventory Tracking",
      "Quality Monitoring",
      "Storage Management",
      "Report Generation",
      "Stock Forecasting"
    ]
  },
  {
    title: "Sales & Export Manager",
    responsibilities: [
      "Sales Management",
      "Export Documentation",
      "Client Relations",
      "Order Processing",
      "Payment Tracking",
      "Market Analysis"
    ]
  },
  {
    title: "Compliance & Quality Control Officer",
    responsibilities: [
      "Quality Standards",
      "Regulatory Compliance",
      "Audit Management",
      "Certification Management",
      "Quality Documentation",
      "Training Coordination"
    ]
  },
  {
    title: "Finance Manager",
    responsibilities: [
      "Financial Transactions",
      "Payment Processing",
      "Budget Management",
      "Financial Reporting",
      "Cost Analysis",
      "Revenue Tracking"
    ]
  }
];

const ManageCompanies = () => {
  const [selectedAccount, setSelectedAccount] = useState(null);
  const navigate = useNavigate();

  if (selectedAccount) {
    return <AccountInterface 
      account={selectedAccount} 
      onLogout={() => {
        setSelectedAccount(null);
        navigate('/manage-accounts');
      }}
      onHome={() => setSelectedAccount(null)}
    />;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">System Accounts</h1>
      <ScrollArea className="h-[600px] rounded-md border p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {accounts.map((account, index) => (
            <Card key={index} className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardContent className="p-6" onClick={() => setSelectedAccount(account)}>
                <h2 className="text-xl font-semibold mb-4">{account.title}</h2>
                <p className="text-sm text-gray-600">
                  {account.responsibilities.length} Primary Responsibilities
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default ManageCompanies;