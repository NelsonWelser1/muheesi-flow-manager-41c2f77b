
import React from 'react';
import {
  BarChart2,
  Users,
  FileText,
  Bell,
  Calendar,
  Settings,
  PieChart,
  TrendingUp
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const CEOSidebar = ({ activeSection, setActiveSection, isCollapsed }) => {
  const menuItems = [
    {
      id: 'overview',
      label: 'Executive Overview',
      icon: <PieChart className="h-5 w-5" />
    },
    {
      id: 'performance',
      label: 'Performance Metrics',
      icon: <BarChart2 className="h-5 w-5" />
    },
    {
      id: 'operations',
      label: 'Operations Monitor',
      icon: <TrendingUp className="h-5 w-5" />
    },
    {
      id: 'workforce',
      label: 'Workforce Analytics',
      icon: <Users className="h-5 w-5" />
    },
    {
      id: 'calendar',
      label: 'Strategic Calendar',
      icon: <Calendar className="h-5 w-5" />
    },
    {
      id: 'reports',
      label: 'Executive Reports',
      icon: <FileText className="h-5 w-5" />
    },
    {
      id: 'alerts',
      label: 'Critical Alerts',
      icon: <Bell className="h-5 w-5" />
    },
    {
      id: 'settings',
      label: 'Dashboard Settings',
      icon: <Settings className="h-5 w-5" />
    }
  ];

  return (
    <div className="min-h-screen bg-white border-r border-gray-200 w-[280px] p-4 flex flex-col">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-[#403E43] px-4">CEO Dashboard</h2>
        <p className="text-sm text-gray-500 px-4">Strategic Control Center</p>
      </div>

      <div className="space-y-1">
        {menuItems.map((item) => (
          <Button
            key={item.id}
            variant="ghost"
            className={cn(
              "w-full justify-start gap-3 px-4",
              activeSection === item.id 
                ? "bg-[#9b87f5] text-white hover:bg-[#7E69AB]" 
                : "text-gray-600 hover:bg-gray-100"
            )}
            onClick={() => setActiveSection(item.id)}
          >
            {item.icon}
            {!isCollapsed && (
              <span className="text-sm font-medium">{item.label}</span>
            )}
          </Button>
        ))}
      </div>

      <div className="mt-auto pt-6 border-t">
        <div className="px-4 py-2">
          <p className="text-xs text-gray-500 uppercase font-semibold">Last Updated</p>
          <p className="text-sm text-gray-600">{new Date().toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
};

export default CEOSidebar;
