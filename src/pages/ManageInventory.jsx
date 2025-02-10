
import React, { useState } from 'react';
import UpdateStock from '../components/inventory/UpdateStock';
import ColdRoomDashboard from '../components/inventory/dairy/cold-room/ColdRoomDashboard';
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
  },
  {
    name: "Kashari Mixed Farm",
    description: "Integrated farm in Mbarara managing dairy products, livestock, banana plantation, and scholarship programs.",
    component: "kashari-mixed-farm",
    contact: "+256 782 222993",
    manager: "Asiimwe Daniel",
    location: "Mbarara"
  },
  {
    name: "Bukomero Dairy Farm",
    description: "Specialized dairy farm focusing on milk production, livestock management, silage making, and comprehensive financial tracking.",
    component: "bukomero-dairy",
    manager: "Manager Boaz",
    contact: "+256 772 674060",
    location: "Bukomero, Kyiboga District",
    financials: {
      milkSales: "UGX 3,140,000",
      livestockSales: "UGX 67,900,000",
      expenses: "UGX 2,000,000"
    }
  }
];

const ManageInventory = () => {
  const [selectedCompany, setSelectedCompany] = useState(null);
  const navigate = useNavigate();
  const currentUser = { name: "John Doe", role: "Inventory Manager" };

  const handleCompanyClick = (company) => {
    if (company.component === 'kashari-mixed-farm') {
      navigate('/manage-inventory/kashari-farm');
    } else if (company.component === 'bukomero-dairy') {
      navigate('/manage-inventory/bukomero-dairy');
    } else if (company.component === 'grand-berna') {
      setSelectedCompany({ ...company, showColdRoom: true });
    } else {
      setSelectedCompany(company);
    }
  };

  const handleBackToCompanies = () => {
    setSelectedCompany(null);
  };

  if (selectedCompany?.showColdRoom) {
    return (
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={handleBackToCompanies}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Companies
            </Button>
            <h1 className="text-3xl font-bold">Cold Room Inventory - {selectedCompany.name}</h1>
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

        <ColdRoomDashboard />
      </div>
    );
  }

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
      <div className="flex flex-col space-y-4">
        {companies.map((company) => (
          <Card 
            key={company.name} 
            className="w-full cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => handleCompanyClick(company)}
          >
            <CardHeader>
              <CardTitle className="flex justify-between items-start">
                <span>{company.name}</span>
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-2">{company.description}</p>
              {(company.manager || company.contact || company.location) && (
                <div className="mt-2 text-sm">
                  {company.manager && <p><strong>Manager:</strong> {company.manager}</p>}
                  {company.contact && <p><strong>Contact:</strong> {company.contact}</p>}
                  {company.location && <p><strong>Location:</strong> {company.location}</p>}
                </div>
              )}
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ManageInventory;
