
import React from 'react';
import { 
  Beef, 
  Stethoscope, 
  LineChart,
  Droplet,
  BarChart2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const DairySidebar = ({ activeSection, setActiveSection, isCollapsed }) => {
  const menuItems = [
    {
      id: 'cattleInventory',
      label: 'Cattle Inventory',
      icon: <Beef className="h-5 w-5" />
    },
    {
      id: 'healthRecords',
      label: 'Health Records',
      icon: <Stethoscope className="h-5 w-5" />
    },
    {
      id: 'growthMetrics',
      label: 'Growth Metrics',
      icon: <LineChart className="h-5 w-5" />
    },
    {
      id: 'milkProduction',
      label: 'Milk Production',
      icon: <Droplet className="h-5 w-5" />
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: <BarChart2 className="h-5 w-5" />
    }
  ];

  return (
    <div className="h-full bg-gray-50 border-r p-3">
      <div className="space-y-2">
        {menuItems.map((item) => (
          <Button
            key={item.id}
            variant="ghost"
            className={cn(
              "w-full justify-start",
              activeSection === item.id && "bg-gray-100",
              isCollapsed ? "px-2" : "px-4"
            )}
            onClick={() => setActiveSection(item.id)}
          >
            {item.icon}
            {!isCollapsed && <span className="ml-2">{item.label}</span>}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default DairySidebar;
