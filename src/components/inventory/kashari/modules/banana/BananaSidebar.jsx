
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Leaf, Wheat } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

const navigationItems = [
  {
    label: 'Produce Management',
    items: [
      { title: 'Planting Records', icon: Leaf, component: 'planting-records' },
      { title: 'Harvest Records', icon: Wheat, component: 'harvest-records' },
    ],
  },
];

const BananaSidebar = ({ activeComponent, onNavigate }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleSidebar}
        className="absolute -right-3 top-4 z-10 h-6 w-6 rounded-full bg-white border shadow-sm"
      >
        {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
      </Button>

      <Sidebar className={cn(
        "hidden md:block transition-all duration-300 ease-in-out",
        isCollapsed ? "w-16" : "w-64"
      )}>
        <SidebarContent>
          {navigationItems.map((group) => (
            <SidebarGroup key={group.label}>
              {!isCollapsed && <SidebarGroupLabel>{group.label}</SidebarGroupLabel>}
              <SidebarGroupContent>
                <SidebarMenu>
                  {group.items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        onClick={() => onNavigate(item.component)}
                        className={cn(
                          "flex items-center",
                          activeComponent === item.component ? 'bg-accent' : '',
                          isCollapsed ? "justify-center px-2" : "justify-start px-3"
                        )}
                      >
                        <item.icon className={cn(
                          "h-4 w-4",
                          !isCollapsed && "mr-2"
                        )} />
                        {!isCollapsed && <span>{item.title}</span>}
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ))}
        </SidebarContent>
      </Sidebar>
    </div>
  );
};

export default BananaSidebar;
