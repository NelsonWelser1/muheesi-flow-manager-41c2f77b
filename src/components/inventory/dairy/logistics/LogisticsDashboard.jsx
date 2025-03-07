
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { TruckIcon, PackageIcon, BarChart3Icon, LayoutDashboardIcon } from "lucide-react";

const LogisticsDashboard = () => {
  const modules = [
    {
      title: "Overview",
      description: "View logistics system status and key metrics",
      icon: <LayoutDashboardIcon className="h-10 w-10 text-blue-500" />,
      path: "/manage-inventory/logistics/overview",
      color: "bg-blue-50"
    },
    {
      title: "Deliveries",
      description: "Manage and track product deliveries",
      icon: <TruckIcon className="h-10 w-10 text-green-500" />,
      path: "/manage-inventory/logistics/deliveries",
      color: "bg-green-50"
    },
    {
      title: "Orders",
      description: "Process and manage customer orders",
      icon: <PackageIcon className="h-10 w-10 text-purple-500" />,
      path: "/manage-inventory/logistics/orders",
      color: "bg-purple-50"
    },
    {
      title: "Performance",
      description: "Analyze logistics performance metrics",
      icon: <BarChart3Icon className="h-10 w-10 text-orange-500" />,
      path: "/manage-inventory/logistics/performance",
      color: "bg-orange-50"
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Logistics Management</h1>
        <p className="text-gray-500 mt-2">Manage dairy product orders, deliveries, and track performance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {modules.map((module, index) => (
          <Link to={module.path} key={index} className="no-underline text-inherit">
            <Card className="h-full transition-all hover:shadow-md">
              <CardHeader className={`${module.color} rounded-t-lg p-6`}>
                <div className="flex justify-center">
                  {module.icon}
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <CardTitle className="text-xl mb-2 text-center">{module.title}</CardTitle>
                <CardDescription className="text-center">{module.description}</CardDescription>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default LogisticsDashboard;
