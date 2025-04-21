
import React from 'react';
import { 
  BarChart3, 
  PieChart, 
  Users, 
  Building, 
  Package, 
  DollarSign, 
  Settings, 
  FileText, 
  Calendar, 
  Bell, 
  Eye, 
  Briefcase,
  LineChart,
  Layers,
  Activity,
  BarChart
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

const CEOSidebar = ({ activeTab, onChangeTab }) => {
  const primaryMenuItems = [
    { id: "overview", label: "Executive Overview", icon: BarChart3 },
    { id: "financial", label: "Financial Summary", icon: DollarSign },
    { id: "operations", label: "Operations Monitor", icon: Layers },
    { id: "strategic", label: "Strategic Initiatives", icon: BarChart },
    { id: "activity", label: "Activity Feed", icon: Activity }
  ];
  
  const secondaryMenuItems = [
    { id: "companies", label: "Companies", icon: Building, count: 4 },
    { id: "personnel", label: "Personnel", icon: Users, count: 156 },
    { id: "inventory", label: "Inventory", icon: Package, count: 243 },
    { id: "reports", label: "Reports", icon: FileText, count: 12 },
    { id: "approvals", label: "Approvals", icon: Eye, count: 7 },
    { id: "meetings", label: "Meetings", icon: Calendar, count: 3 }
  ];
  
  const quickMenu = [
    { id: "notifications", label: "Notifications", icon: Bell, count: 5 },
    { id: "tasks", label: "My Tasks", icon: Briefcase, count: 4 },
    { id: "settings", label: "Settings", icon: Settings }
  ];

  return (
    <div className="w-64 h-screen bg-[#F1F0FB] border-r border-[#E5DEFF] flex flex-col">
      <div className="p-4 flex items-center">
        <div className="w-10 h-10 rounded-full bg-[#9B87F5] flex items-center justify-center text-white font-bold">
          CEO
        </div>
        <div className="ml-3">
          <h3 className="font-medium text-[#1A1F2C]">Executive Office</h3>
          <p className="text-xs text-[#8E9196]">Command Center</p>
        </div>
      </div>
      
      <Separator className="bg-[#E5DEFF]" />
      
      <div className="p-4">
        <h4 className="text-xs uppercase font-semibold text-[#8E9196] mb-3">Dashboard</h4>
        <nav className="space-y-1">
          {primaryMenuItems.map(item => (
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
      
      <Separator className="bg-[#E5DEFF]" />
      
      <div className="p-4 overflow-y-auto flex-grow">
        <h4 className="text-xs uppercase font-semibold text-[#8E9196] mb-3">Management</h4>
        <nav className="space-y-1">
          {secondaryMenuItems.map(item => (
            <Button
              key={item.id}
              variant="ghost"
              className="w-full justify-start text-[#1A1F2C] hover:bg-[#F1F0FB] hover:text-[#6E59A5]"
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center">
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.label}
                </div>
                {item.count && (
                  <Badge className="bg-[#D6BCFA] text-[#6E59A5] hover:bg-[#6E59A5] hover:text-white">
                    {item.count}
                  </Badge>
                )}
              </div>
            </Button>
          ))}
        </nav>
      </div>
      
      <Separator className="bg-[#E5DEFF]" />
      
      <div className="p-4">
        <h4 className="text-xs uppercase font-semibold text-[#8E9196] mb-3">Quick Access</h4>
        <nav className="space-y-1">
          {quickMenu.map(item => (
            <Button
              key={item.id}
              variant="ghost"
              className="w-full justify-start text-[#1A1F2C] hover:bg-[#F1F0FB] hover:text-[#6E59A5]"
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center">
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.label}
                </div>
                {item.count && (
                  <Badge className="bg-[#FFDEE2] text-red-500">
                    {item.count}
                  </Badge>
                )}
              </div>
            </Button>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default CEOSidebar;
