
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
  Calendar
} from "lucide-react";

// Management menu items with complete configuration
const managementItems = [
  { 
    id: "companies", 
    label: "Companies", 
    icon: Building, 
    count: 3,
    route: "/manage-companies",
    tooltip: "Manage company structure, subsidiaries, and organizational hierarchy"
  },
  { 
    id: "personnel", 
    label: "Personnel", 
    icon: Users, 
    count: 125,
    route: "/personnel",
    tooltip: "Oversee workforce management and organizational structure" 
  },
  { 
    id: "inventory", 
    label: "Inventory", 
    icon: Package, 
    count: 200,
    route: "/inventory",
    tooltip: "Monitor group-wide inventory and resource allocation"
  },
  { 
    id: "reports", 
    label: "Reports", 
    icon: FileText, 
    count: 12,
    route: "/reports",
    tooltip: "Access comprehensive business reports and analytics"
  },
  { 
    id: "approvals", 
    label: "Approvals", 
    icon: Eye, 
    count: 7,
    route: "/approvals",
    tooltip: "Review and manage pending executive approvals"
  },
  { 
    id: "meetings", 
    label: "Meetings", 
    icon: Calendar, 
    count: 3,
    route: "/meetings",
    tooltip: "Schedule and manage executive meetings and appointments"
  }
];

// Memoized ManagementMenu component to prevent unnecessary re-renders
const ManagementMenu = memo(() => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Memoized click handler to prevent recreation on re-renders
  const handleClick = useCallback((route) => {
    console.log('Navigating to:', route);
    navigate(route);
  }, [navigate]);

  return (
    <div className="p-4 overflow-y-auto flex-grow">
      <h4 className="text-xs uppercase font-semibold text-[#8E9196] mb-3">Management</h4>
      <nav className="space-y-1">
        {managementItems.map(item => {
          const isActive = location.pathname === item.route;
          
          return (
            <TooltipProvider key={item.id} delayDuration={300}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={isActive ? "subtle" : "ghost"}
                    className={`w-full justify-start ${
                      isActive 
                        ? "bg-[#E5DEFF] text-[#6E59A5]" 
                        : "text-[#1A1F2C] hover:bg-[#F1F0FB] hover:text-[#6E59A5]"
                    }`}
                    onClick={() => handleClick(item.route)}
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center">
                        <item.icon className="mr-2 h-4 w-4" />
                        {item.label}
                      </div>
                      {item.count && (
                        <Badge 
                          className={`${
                            item.id === 'approvals' 
                              ? 'bg-[#FFDEE2] text-red-500' 
                              : 'bg-[#D6BCFA] text-[#6E59A5] hover:bg-[#6E59A5] hover:text-white'
                          }`}
                        >
                          {item.count}
                        </Badge>
                      )}
                    </div>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right" className="max-w-[200px]">
                  <p>{item.tooltip}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          );
        })}
      </nav>
    </div>
  );
});

// Add display name for easier debugging
ManagementMenu.displayName = 'ManagementMenu';

export default ManagementMenu;
