
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import { 
  Truck, 
  PackageCheck, 
  BarChart3, 
  LayoutDashboard 
} from "lucide-react";

const LogisticsDashboard = () => {
  const navigate = useNavigate();

  const modules = [
    {
      title: "Logistics Overview",
      icon: <LayoutDashboard className="h-10 w-10 text-blue-500" />,
      description: "View overall logistics performance and key metrics",
      path: "/manage-inventory/logistics/overview"
    },
    {
      title: "Deliveries",
      icon: <Truck className="h-10 w-10 text-green-500" />,
      description: "Manage delivery records and shipment tracking",
      path: "/manage-inventory/logistics/deliveries"
    },
    {
      title: "Orders",
      icon: <PackageCheck className="h-10 w-10 text-amber-500" />,
      description: "Process and track customer orders",
      path: "/manage-inventory/logistics/orders"
    },
    {
      title: "Performance Analytics",
      icon: <BarChart3 className="h-10 w-10 text-purple-500" />,
      description: "View detailed logistics performance metrics",
      path: "/manage-inventory/logistics/performance"
    }
  ];

  return (
    <div className="container mx-auto p-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Logistics Management</h1>
        <p className="text-gray-500">Manage deliveries, orders, and logistics performance</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {modules.map((module, index) => (
          <Card 
            key={index} 
            className="hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => navigate(module.path)}
          >
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="rounded-full bg-gray-100 p-4 mb-4">
                {module.icon}
              </div>
              <h2 className="text-xl font-semibold mb-2">{module.title}</h2>
              <p className="text-gray-500 text-sm">{module.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default LogisticsDashboard;
