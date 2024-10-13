import React, { useState } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AccountForm from '../components/AccountForm';

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

  const handleAddAccount = (newAccount) => {
    setAccounts([...accounts, newAccount]);
  };

  const handleRemoveAccount = (index) => {
    const newAccounts = accounts.filter((_, i) => i !== index);
    setAccounts(newAccounts);
  };

  const handleAddResponsibility = (accountIndex, newResponsibility) => {
    const newAccounts = [...accounts];
    newAccounts[accountIndex].responsibilities.push(newResponsibility);
    setAccounts(newAccounts);
  };

  const handleRemoveResponsibility = (accountIndex, respIndex) => {
    const newAccounts = [...accounts];
    newAccounts[accountIndex].responsibilities = newAccounts[accountIndex].responsibilities.filter((_, i) => i !== respIndex);
    setAccounts(newAccounts);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Manage Accounts</h1>
      <Accordion type="single" collapsible className="w-full mb-8">
        {accounts.map((account, index) => (
          <AccordionItem value={`item-${index}`} key={index}>
            <AccordionTrigger>{account.title}</AccordionTrigger>
            <AccordionContent>
              <ul className="list-disc pl-5 mb-4">
                {account.responsibilities.map((responsibility, respIndex) => (
                  <li key={respIndex} className="flex justify-between items-center">
                    {responsibility}
                    <Button onClick={() => handleRemoveResponsibility(index, respIndex)} variant="destructive" size="sm">Remove</Button>
                  </li>
                ))}
              </ul>
              <div className="flex gap-2 mb-4">
                <Input placeholder="New responsibility" id={`new-resp-${index}`} />
                <Button onClick={() => handleAddResponsibility(index, document.getElementById(`new-resp-${index}`).value)}>Add Responsibility</Button>
              </div>
              <Button onClick={() => handleRemoveAccount(index)} variant="destructive">Remove Account</Button>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      <AccountForm onAddAccount={handleAddAccount} />
    </div>
  );
};

export default ManageAccounts;
