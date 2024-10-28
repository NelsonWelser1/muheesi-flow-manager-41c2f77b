import React, { useState } from 'react';
import AccountList from './accounts/AccountList';
import AddAccountForm from './accounts/AddAccountForm';
import CompanyAccounts from './accounts/CompanyAccounts';
import AccountsChart from './accounts/AccountsChart';

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
    title: "Chief Executive Officer (CEO)",
    status: "Active",
    email: "ceo@muheesi.com",
    company: "All Companies",
    responsibilities: [
      "Strategic planning",
      "Executive decisions",
      "Company oversight",
      "Stakeholder management"
    ]
  },
  {
    title: "Operations Manager",
    status: "Active",
    email: "operations@muheesi.com",
    company: "All Companies",
    responsibilities: [
      "Daily operations",
      "Team management",
      "Process optimization",
      "Performance monitoring"
    ]
  },
  {
    title: "Farm Supervisor",
    status: "Active",
    email: "farm@muheesi.com",
    company: "All Companies",
    responsibilities: [
      "Farm oversight",
      "Crop management",
      "Worker supervision",
      "Production reporting"
    ]
  },
  {
    title: "Warehouse Manager",
    status: "Active",
    email: "warehouse@muheesi.com",
    company: "All Companies",
    responsibilities: [
      "Inventory control",
      "Storage management",
      "Logistics coordination",
      "Stock reporting"
    ]
  },
  {
    title: "Coffee Store Manager",
    status: "Active",
    email: "coffeestore@muheesi.com",
    company: "KAJON Coffee Limited",
    responsibilities: [
      "Store operations",
      "Sales management",
      "Customer service",
      "Inventory management"
    ]
  },
  {
    title: "Logistics Manager",
    status: "Active",
    email: "logistics@muheesi.com",
    company: "All Companies",
    responsibilities: [
      "Transport coordination",
      "Route optimization",
      "Delivery scheduling",
      "Fleet management"
    ]
  },
  {
    title: "Inventory Manager",
    status: "Active",
    email: "inventory@muheesi.com",
    company: "All Companies",
    responsibilities: [
      "Stock management",
      "Inventory tracking",
      "Supply chain optimization",
      "Stock reporting"
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
      "Account reconciliation",
      "Financial reporting"
    ]
  },
  {
    title: "Sales and Marketing Manager",
    status: "Active",
    email: "sales@muheesi.com",
    company: "All Companies",
    responsibilities: [
      "Sales strategy",
      "Marketing campaigns",
      "Client relationships",
      "Market analysis"
    ]
  },
  {
    title: "Coffee Quality Analyst",
    status: "Active",
    email: "quality@kajon.com",
    company: "KAJON Coffee Limited",
    responsibilities: [
      "Quality control",
      "Coffee grading",
      "Sample analysis",
      "Quality reporting"
    ]
  },
  {
    title: "General Data Clerk",
    status: "Active",
    email: "clerk@muheesi.com",
    company: "All Companies",
    responsibilities: [
      "Data entry",
      "Record keeping",
      "Document management",
      "Basic reporting"
    ]
  }
];

const ManageAccounts = () => {
  const [accounts, setAccounts] = useState(initialAccounts);
  const [companyAccounts, setCompanyAccounts] = useState([]);

  const handleAddAccount = (newAccount) => {
    setAccounts([...accounts, newAccount]);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Manage Accounts</h1>
      <AccountList accounts={accounts} setAccounts={setAccounts} />
      <AddAccountForm onAddAccount={handleAddAccount} />
      <AccountsChart companyAccounts={companyAccounts} />
    </div>
  );
};

export default ManageAccounts;