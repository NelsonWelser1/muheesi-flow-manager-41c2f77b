import React, { useState } from 'react';
import AccountList from './accounts/AccountList';
import AddAccountForm from './accounts/AddAccountForm';
import CompanyAccounts from './accounts/CompanyAccounts';

const initialAccounts = [
  {
    title: "System Administrator (SysAdmin)",
    responsibilities: [
      "Overall system management and oversight.",
      "Configure system settings, database management, and user permissions.",
      "Ensure data backups, security protocols, and system integrity.",
      "Resolve any technical issues with the system and provide IT support.",
      "Maintain and update the system infrastructure, including software upgrades."
    ]
  },
  {
    title: "Chief Executive Account CEO H.E. Rtd. Maj. Gen. Muheesi Geoffrey Baraba",
    responsibilities: [
      "Overall company management and strategic decision-making.",
      "Review and approve high-level reports and financial statements.",
      "Set company goals and objectives.",
      "Represent the company in major business dealings and partnerships."
    ]
  },
  {
    title: "General Manager",
    responsibilities: [
      "Oversee day-to-day operations of the company.",
      "Implement strategies set by the CEO.",
      "Manage department heads and ensure smooth interdepartmental coordination.",
      "Report directly to the CEO on company performance and challenges."
    ]
  }
];

const companyAccounts = [
  { name: "Grand Berna Limited", employees: [] },
  { name: "KAJON Coffee Limited", employees: [] },
  { name: "Kyalima Farmers Limited", employees: [] }
];

const ManageAccounts = () => {
  const [accounts, setAccounts] = useState(initialAccounts);

  const handleAddAccount = (newAccount) => {
    setAccounts([...accounts, newAccount]);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Manage Accounts</h1>
      <AccountList accounts={accounts} setAccounts={setAccounts} />
      <AddAccountForm onAddAccount={handleAddAccount} />
      <CompanyAccounts companyAccounts={companyAccounts} />
    </div>
  );
};

export default ManageAccounts;