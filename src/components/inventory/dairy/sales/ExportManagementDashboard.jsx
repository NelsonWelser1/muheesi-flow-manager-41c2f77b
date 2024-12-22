import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from 'react-router-dom';

const ExportManagementDashboard = () => {
  const navigate = useNavigate();

  const roles = [
    {
      title: "Sales Manager",
      description: "Manage quotes, orders, invoices, and shipping documents for dairy products",
      path: "sales-manager"
    },
    {
      title: "Factory Manager",
      description: "Manage production, quality control, and inventory for dairy products",
      path: "factory-manager"
    }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Grand Berna Dairies Sales Management</h2>
            <Button variant="ghost" onClick={() => navigate('/manage-inventory')} className="p-2">
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Inventory
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {roles.map((role) => (
              <Card 
                key={role.title}
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => navigate(role.path)}
              >
                <CardHeader>
                  <CardTitle>{role.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{role.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExportManagementDashboard;