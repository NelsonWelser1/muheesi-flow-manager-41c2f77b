
import React from 'react';
import { Button } from "@/components/ui/button";
import {
  Database,
  LineChart,
  Milk,
  FileSpreadsheet,
  Activity,
  Thermometer,
  Microscope
} from "lucide-react";
import { useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

const DairySidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const basePath = "/manage-inventory/kashari-farm/dairy";
  
  const menuItems = [
    { name: "Overview", icon: <Database className="h-5 w-5" />, path: `${basePath}` },
    { name: "Production", icon: <Milk className="h-5 w-5" />, path: `${basePath}/production` },
    { name: "Reports", icon: <FileSpreadsheet className="h-5 w-5" />, path: `${basePath}/reports` },
    { name: "Health Records", icon: <Activity className="h-5 w-5" />, path: `${basePath}/health` },
    { name: "Growth Metrics", icon: <LineChart className="h-5 w-5" />, path: `${basePath}/growth-metrics` },
    { name: "Quality Control", icon: <Microscope className="h-5 w-5" />, path: `${basePath}/quality` },
    { name: "Equipment", icon: <Thermometer className="h-5 w-5" />, path: `${basePath}/equipment` },
  ];

  const isActive = (path) => {
    return location.pathname === path || 
           (path !== basePath && location.pathname.startsWith(path));
  };

  return (
    <div className="min-w-[200px] bg-white border-r p-4 space-y-2">
      <h2 className="font-semibold text-xl mb-4">Dairy Farm</h2>
      <div className="flex flex-col gap-1">
        {menuItems.map((item, idx) => (
          <Button
            key={idx}
            variant={isActive(item.path) ? "secondary" : "ghost"}
            className={cn(
              "justify-start gap-2",
              isActive(item.path) && "bg-blue-100 text-blue-800 hover:bg-blue-100 hover:text-blue-800"
            )}
            onClick={() => navigate(item.path)}
          >
            {item.icon}
            <span>{item.name}</span>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default DairySidebar;
