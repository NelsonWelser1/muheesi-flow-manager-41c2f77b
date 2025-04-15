
import React from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  Leaf,  // Replaced 'Plant' with 'Leaf'
  Calendar,
  LineChart,
  ClipboardList,
  Users,
  Droplets,
  Warehouse,
  Activity,
  Settings,
} from 'lucide-react';

const navigationItems = [
  {
    label: 'Plantation Overview',
    items: [
      { title: 'Crop Planning', icon: Leaf, component: 'planning' },
      { title: 'Harvest Schedule', icon: Calendar, component: 'schedule' },
      { title: 'Growth Analytics', icon: LineChart, component: 'analytics' },
    ],
  },
  {
    label: 'Operations',
    items: [
      { title: 'Task Management', icon: ClipboardList, component: 'tasks' },
      { title: 'Worker Management', icon: Users, component: 'workers' },
      { title: 'Irrigation Control', icon: Droplets, component: 'irrigation' },
    ],
  },
  {
    label: 'Resources',
    items: [
      { title: 'Inventory', icon: Warehouse, component: 'inventory' },
      { title: 'Monitoring', icon: Activity, component: 'monitoring' },
      { title: 'Settings', icon: Settings, component: 'settings' },
    ],
  },
];

const BananaSidebar = ({ activeComponent, onNavigate }) => {
  return (
    <Sidebar>
      <SidebarContent>
        {navigationItems.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      onClick={() => onNavigate(item.component)}
                      className={activeComponent === item.component ? 'bg-accent' : ''}
                    >
                      <item.icon className="h-4 w-4 mr-2" />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  );
};

export default BananaSidebar;
