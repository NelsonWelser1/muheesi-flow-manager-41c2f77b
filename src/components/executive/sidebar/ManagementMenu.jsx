
import React, { memo, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  TooltipProvider,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { 
  Building,
  Users,
  Package,
  FileText,
  Eye,
  Calendar,
  ChevronRight
} from "lucide-react";

const managementItems = [
  { 
    id: "companies", 
    label: "Companies", 
    icon: Building, 
    count: 3,
    route: "/manage-companies",
    tooltip: "Oversee company structure, performance metrics, and strategic alignment",
    description: "Manage organizational structure and company operations"
  },
  { 
    id: "personnel", 
    label: "Personnel", 
    icon: Users, 
    count: 125,
    route: "/personnel",
    tooltip: "Manage human resources, roles, and organizational development",
    description: "Workforce planning and talent management"
  },
  { 
    id: "inventory", 
    label: "Inventory", 
    icon: Package, 
    count: 200,
    route: "/inventory",
    tooltip: "Monitor and optimize group-wide inventory management",
    description: "Track and manage company assets and resources"
  },
  { 
    id: "reports", 
    label: "Reports", 
    icon: FileText, 
    count: 12,
    route: "/reports",
    tooltip: "Access detailed business analytics and performance reports",
    description: "Comprehensive business intelligence and analytics"
  },
  { 
    id: "approvals", 
    label: "Approvals", 
    icon: Eye, 
    count: 7,
    route: "/approvals",
    tooltip: "Review and process pending executive approvals",
    description: "Manage decision-making workflow"
  },
  { 
    id: "meetings", 
    label: "Meetings", 
    icon: Calendar, 
    count: 3,
    route: "/meetings",
    tooltip: "Schedule and manage executive meetings and appointments",
    description: "Coordinate executive communications"
  }
];

const ManagementMenu = memo(() => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const handleClick = useCallback((route) => {
    console.log('Navigating to:', route);
    navigate(route);
  }, [navigate]);

  return (
    <div className="p-4 overflow-y-auto flex-grow">
      <h4 className="text-xs uppercase font-semibold text-[#8E9196] mb-3">Management</h4>
      <nav className="space-y-2">
        {managementItems.map(item => {
          const isActive = location.pathname === item.route;
          
          return (
            <TooltipProvider key={item.id} delayDuration={300}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="relative group">
                    <Button
                      variant={isActive ? "subtle" : "ghost"}
                      className={`w-full justify-between group ${
                        isActive 
                          ? "bg-[#E5DEFF] text-[#6E59A5]" 
                          : "text-[#1A1F2C] hover:bg-[#F1F0FB] hover:text-[#6E59A5]"
                      }`}
                      onClick={() => handleClick(item.route)}
                    >
                      <div className="flex items-center">
                        <item.icon className="mr-2 h-4 w-4" />
                        <span>{item.label}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        {item.count && (
                          <Badge 
                            className={`${
                              item.id === 'approvals' 
                                ? 'bg-[#FFDEE2] text-red-500' 
                                : 'bg-[#D6BCFA] text-[#6E59A5]'
                            }`}
                          >
                            {item.count}
                          </Badge>
                        )}
                        <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </Button>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="right" className="max-w-[300px] p-4">
                  <div className="space-y-2">
                    <p className="font-semibold">{item.label}</p>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                    <p className="text-xs text-[#6E59A5]">{item.tooltip}</p>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          );
        })}
      </nav>
    </div>
  );
});

ManagementMenu.displayName = 'ManagementMenu';

export default ManagementMenu;
