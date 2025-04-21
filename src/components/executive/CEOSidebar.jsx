
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
  BarChart,
  ClipboardList,
  Truck,
  ShoppingCart,
  Award
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from 'react-router-dom';

const CEOSidebar = ({ activeTab, onChangeTab }) => {
  const navigate = useNavigate();
  
  const primaryMenuItems = [
    { id: "overview", label: "Executive Overview", icon: BarChart3 },
    { id: "financial", label: "Financial Summary", icon: DollarSign },
    { id: "operations", label: "Operations Monitor", icon: Layers },
    { id: "strategic", label: "Strategic Initiatives", icon: BarChart },
    { id: "activity", label: "Activity Feed", icon: Activity }
  ];
  
  const secondaryMenuItems = [
    { 
      id: "companies", 
      label: "Companies", 
      icon: Building, 
      count: 3,
      action: () => navigate('/manage-companies'),
      description: "Manage all company structures and accounts"
    },
    { 
      id: "personnel", 
      label: "Personnel", 
      icon: Users, 
      count: 125,
      action: () => navigate('/manage-personnel'),
      description: "Overview of all staff across companies" 
    },
    { 
      id: "inventory", 
      label: "Inventory", 
      icon: Package, 
      count: 200,
      action: () => navigate('/manage-inventory'),
      description: "Track and manage inventory across all companies"
    },
    { 
      id: "sales", 
      label: "Sales & Revenue", 
      icon: ShoppingCart, 
      count: 45,
      action: () => navigate('/manage-sales'),
      description: "Monitor sales performance and revenue streams"
    },
    { 
      id: "logistics", 
      label: "Logistics", 
      icon: Truck, 
      count: 18,
      action: () => navigate('/manage-logistics'),
      description: "Oversee transportation and distribution networks"
    },
    { 
      id: "approvals", 
      label: "Approvals", 
      icon: Eye, 
      count: 7,
      action: () => navigate('/approvals'),
      description: "Review and approve pending requests"
    },
    { 
      id: "reports", 
      label: "Reports", 
      icon: FileText, 
      count: 12,
      action: () => navigate('/reports'),
      description: "Access comprehensive business reports"
    },
    { 
      id: "meetings", 
      label: "Meetings", 
      icon: Calendar, 
      count: 3,
      action: () => navigate('/meetings'),
      description: "Schedule and manage important meetings"
    },
    { 
      id: "performance", 
      label: "Performance", 
      icon: Award, 
      count: 5,
      action: () => navigate('/performance'),
      description: "Track KPIs and business performance metrics"
    }
  ];
  
  const quickMenu = [
    { id: "notifications", label: "Notifications", icon: Bell, count: 5 },
    { id: "tasks", label: "My Tasks", icon: Briefcase, count: 4 },
    { id: "settings", label: "Settings", icon: Settings }
  ];

  const handleManagementItemClick = (item) => {
    if (item.action) {
      item.action();
    }
  };

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
            <div key={item.id} className="group relative">
              <Button
                variant="ghost"
                className="w-full justify-start text-[#1A1F2C] hover:bg-[#F1F0FB] hover:text-[#6E59A5]"
                onClick={() => handleManagementItemClick(item)}
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
              {item.description && (
                <div className="absolute left-full ml-2 top-0 z-50 w-48 p-2 bg-white shadow-lg rounded-md text-sm opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity duration-200">
                  {item.description}
                </div>
              )}
            </div>
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
