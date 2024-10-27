import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import AccountInterface from '../components/accounts/AccountInterface';
import { ScrollArea } from "@/components/ui/scroll-area";

const accounts = [
  {
    title: "System Administrator",
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
    title: "Operations Manager",
    responsibilities: [
      "Review Reports",
      "Monitor Inventory",
      "Manage Operations",
      "Process Approvals",
      "Resource Allocation"
    ]
  },
  // ... Add other accounts here
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