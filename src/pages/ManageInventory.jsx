
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import EquatorExportManagement from '../components/inventory/kajon/equator-export/EquatorExportManagement';

const ManageInventory = () => {
  const navigate = useNavigate();
  const [activeApp, setActiveApp] = useState(null);

  const inventoryApps = [
    {
      title: "Kazon Coffee Project",
      description: "Manage Kazon Coffee Project inventory, stock levels, and distribution",
      path: "/manage-inventory/kazon-coffee"
    },
    {
      title: "Dairy Cheese Factory",
      description: "Manage dairy cheese factory inventory, production, and distribution",
      path: "/manage-inventory/dairy-cheese"
    },
    {
      title: "Equator Coffee Export Management System",
      description: "Comprehensive export management system for coffee trading and international sales",
      component: EquatorExportManagement
    }
  ];

  const handleAppSelection = (app, index) => {
    if (app.path) {
      navigate(app.path);
    } else if (app.component) {
      setActiveApp(index);
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold mb-6">Inventory Management</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {inventoryApps.map((app, index) => (
          <Card 
            key={index}
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => handleAppSelection(app, index)}
          >
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-2">{app.title}</h2>
              <p className="text-gray-600 mb-4">{app.description}</p>
              <Button>Open Application</Button>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {activeApp !== null && inventoryApps[activeApp].component && (
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">{inventoryApps[activeApp].title}</h2>
          {React.createElement(inventoryApps[activeApp].component)}
        </div>
      )}
    </div>
  );
};

export default ManageInventory;
