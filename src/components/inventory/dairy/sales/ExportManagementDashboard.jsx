import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from 'react-router-dom';

const ExportManagementDashboard = () => {
  const navigate = useNavigate();

  const roles = [
    {
      title: "Sales Manager",
      description: "Manage quotes, orders, invoices, and shipping documents",
      path: "sales-manager"
    },
    {
      title: "Factory Manager",
      description: "Manage production, quality control, and inventory",
      path: "factory-manager"
    }
  ];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Grand Berna Dairies Sales Management</h1>
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
    </div>
  );
};

export default ExportManagementDashboard;