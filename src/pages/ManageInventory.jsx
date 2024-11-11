import React, { useState } from 'react';
import UpdateStock from '../components/inventory/UpdateStock';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home, LogOut, Clock } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

const companies = [
  {
    name: "Grand Berna Dairies",
    description: "Raw Milk, Processed Milk, Cheese, Yogurt, Packed Meat of Beef, Pork, and Goat. Factories in Kyiboga and Mbarara with various outlets.",
    component: "grand-berna"
  },
  {
    name: "KAJON Coffee Limited",
    description: "Robusta and Arabica Coffee, Kakyinga Coffee Farm, Kakyinga Factory, JBER, and additional stores and projects.",
    component: "kajon-coffee"
  },
  {
    name: "Kyalima Farmers Limited",
    description: "Assets and Cooperations, Agri-Business.",
    component: "kyalima-farmers"
  }
];

const ManageInventory = () => {
  const [selectedCompany, setSelectedCompany] = useState(null);
  const navigate = useNavigate();
  const currentUser = { name: "John Doe", role: "Inventory Manager" };

  const handleCompanyClick = (company) => {
    setSelectedCompany(company);
  };

  const handleBackToCompanies = () => {
    setSelectedCompany(null);
  };

  if (selectedCompany) {
    return (
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={handleBackToCompanies}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Companies
            </Button>
            <h1 className="text-3xl font-bold">{selectedCompany.name}</h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-600">
              <div>{currentUser.name}</div>
              <div>{currentUser.role}</div>
            </div>
            <div className="text-sm text-gray-600">
              <Clock className="inline mr-2" />
              {format(new Date(), 'PPpp')}
            </div>
            <Button variant="outline" onClick={() => navigate('/home')}>
              <Home className="h-4 w-4 mr-2" />
              Home
            </Button>
            <Button variant="outline" onClick={() => navigate('/logout')}>
              <LogOut className="h-4 w-4 mr-2" />
              Log Out
            </Button>
          </div>
        </div>

        <Card className="w-full">
          <CardContent className="p-6">
            <UpdateStock defaultTab={selectedCompany.component} />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Inventory</h1>
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-600">
            <Clock className="inline mr-2" />
            {format(new Date(), 'PPpp')}
          </div>
          <Button variant="outline" onClick={() => navigate('/home')}>
            <Home className="h-4 w-4 mr-2" />
            Home
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {companies.map((company) => (
          <Card 
            key={company.name} 
            className="w-full cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => handleCompanyClick(company)}
          >
            <CardHeader>
              <CardTitle>{company.name}</CardTitle>
              <p className="text-sm text-muted-foreground mt-2">{company.description}</p>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ManageInventory;
