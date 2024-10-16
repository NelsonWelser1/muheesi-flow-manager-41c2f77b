import React, { useState } from 'react';
import AccountList from './accounts/AccountList';
import AddAccountForm from './accounts/AddAccountForm';
import CompanyAccounts from './accounts/CompanyAccounts';
import AccountsChart from './accounts/AccountsChart';

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

const initialCompanyAccounts = [
  {
    name: "Grand Berna Limited",
    employees: [
      { title: "Operations Manager", responsibilities: [] },
      { title: "Procurement Manager", responsibilities: [] },
      { title: "Warehouse Supervisor", responsibilities: [] },
      { title: "Farm Manager", responsibilities: [] },
      { title: "Logistics Manager", responsibilities: [] },
      { title: "Inventory Manager", responsibilities: [] },
      { title: "Sales & Export Manager", responsibilities: [] },
      { title: "Compliance & Quality Control Officer", responsibilities: [] },
      { title: "Finance Manager", responsibilities: [] }
    ]
  },
  {
    name: "KAJON Coffee Limited",
    employees: [
      { title: "Operations Manager", responsibilities: [] },
      { title: "Procurement Manager", responsibilities: [] },
      { title: "Warehouse Supervisor", responsibilities: [] },
      { title: "Farm Manager", responsibilities: [] },
      { title: "Logistics Manager", responsibilities: [] },
      { title: "Inventory Manager", responsibilities: [] },
      { title: "Sales & Export Manager", responsibilities: [] },
      { title: "Compliance & Quality Control Officer", responsibilities: [] },
      { title: "Finance Manager", responsibilities: [] }
    ]
  },
  {
    name: "Kyalima Farmers Limited",
    employees: [
      { title: "Operations Manager", responsibilities: [] },
      { title: "Procurement Manager", responsibilities: [] },
      { title: "Warehouse Supervisor", responsibilities: [] },
      { title: "Farm Manager", responsibilities: [] },
      { title: "Logistics Manager", responsibilities: [] },
      { title: "Inventory Manager", responsibilities: [] },
      { title: "Sales & Export Manager", responsibilities: [] },
      { title: "Compliance & Quality Control Officer", responsibilities: [] },
      { title: "Finance Manager", responsibilities: [] }
    ]
  }
];

const ManageAccounts = () => {
  const [accounts, setAccounts] = useState(initialAccounts);
  const [companyAccounts, setCompanyAccounts] = useState(initialCompanyAccounts);

  const handleAddAccount = (newAccount) => {
    setAccounts([...accounts, newAccount]);
  };

  const handleAddCompanyEmployee = (companyIndex, newEmployee) => {
    const updatedCompanyAccounts = [...companyAccounts];
    updatedCompanyAccounts[companyIndex].employees.push(newEmployee);
    setCompanyAccounts(updatedCompanyAccounts);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Manage Accounts</h1>
      <AccountList accounts={accounts} setAccounts={setAccounts} />
      <AddAccountForm onAddAccount={handleAddAccount} />
      <CompanyAccounts 
        companyAccounts={companyAccounts} 
        setCompanyAccounts={setCompanyAccounts}
        onAddEmployee={handleAddCompanyEmployee}
      />
      <AccountsChart companyAccounts={companyAccounts} />
    </div>
  );
};

export default ManageAccounts;