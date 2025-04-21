
import React from 'react';
import { Button } from "@/components/ui/button";
import { 
  BarChart3, 
  DollarSign, 
  Layers, 
  BarChart,
  Activity 
} from "lucide-react";

const DashboardMenu = ({ activeTab, onChangeTab }) => {
  const menuItems = [
    { id: "overview", label: "Executive Overview", icon: BarChart3 },
    { id: "financial", label: "Financial Summary", icon: DollarSign },
    { id: "operations", label: "Operations Monitor", icon: Layers },
    { id: "strategic", label: "Strategic Initiatives", icon: BarChart },
    { id: "activity", label: "Activity Feed", icon: Activity }
  ];

  return (
    <div className="p-4">
      <h4 className="text-xs uppercase font-semibold text-[#8E9196] mb-3">Dashboard</h4>
      <nav className="space-y-1">
        {menuItems.map(item => (
          <Button
            key={item.id}
            variant={activeTab === item.id ? "subtle" : "ghost"}
            className={`w-full justify-start ${
              activeTab === item.id 
                ? "bg-[#E5DEFF] text-[#6E59A5] hover:bg-[#D6BCFA]" 
                : "text-[#1A1F2C] hover:bg-[#F1F0FB] hover:text-[#6E59A5]"
            }`}
            onClick={() => onChangeTab(item.id)}
          >
            <item.icon className="mr-2 h-4 w-4" />
            {item.label}
          </Button>
        ))}
      </nav>
    </div>
  );
};

export default DashboardMenu;
