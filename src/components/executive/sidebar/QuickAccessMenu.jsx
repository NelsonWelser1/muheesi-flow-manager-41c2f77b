
import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, Briefcase, Settings } from "lucide-react";

const QuickAccessMenu = () => {
  const quickMenu = [
    { id: "notifications", label: "Notifications", icon: Bell, count: 5 },
    { id: "tasks", label: "My Tasks", icon: Briefcase, count: 4 },
    { id: "settings", label: "Settings", icon: Settings }
  ];

  return (
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
  );
};

export default QuickAccessMenu;
