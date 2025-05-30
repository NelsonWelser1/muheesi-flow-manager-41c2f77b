
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
  Package,
  Boxes,
  ClipboardCheck,
  DollarSign,
  BarChart,
  ShoppingCart,
  FileText,
} from 'lucide-react';

const navigationItems = [
  {
    label: 'Inventory Management',
    items: [
      { title: 'Current Inventory', icon: Package, component: 'inventory' },
      { title: 'Stock Levels', icon: Boxes, component: 'stock' },
      // Removed Quality Control menu item here
      { title: 'Sales Tracker', icon: ShoppingCart, component: 'sales' },
      { title: 'Financial Ledger', icon: FileText, component: 'ledger' },
      { title: 'Analytics', icon: BarChart, component: 'analytics' },
    ],
  }
];

const PlantationSidebar = ({ activeComponent, onNavigate }) => {
  return (
    <Sidebar className="hidden md:block">
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

export default PlantationSidebar;

