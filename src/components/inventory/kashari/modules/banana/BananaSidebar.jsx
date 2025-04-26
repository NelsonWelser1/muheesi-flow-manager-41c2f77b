
import React from 'react';
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
import {
  Leaf,
  TrendingUp,
  Receipt,
  DollarSign
} from 'lucide-react';

const navigationItems = [
  {
    label: 'Produce Management',
    items: [
      { title: 'Bananas', icon: Leaf, component: 'bananas' },
      { title: 'Harvest Records', icon: TrendingUp, component: 'harvest-records' },
      { title: 'Expenses', icon: Receipt, component: 'expenses' },
      { title: 'Sales', icon: DollarSign, component: 'sales' },
    ],
  },
];

const BananaSidebar = ({ activeComponent, onNavigate }) => {
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

export default BananaSidebar;
