
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
  Leaf,
  Calendar,
  LineChart,
  ClipboardList,
  Users,
  Droplets,
  Warehouse,
  Activity,
  Settings,
  Coffee,
  Bean,
  Wheat,
  DollarSign,
  FileText,
  PieChart,
  BarChart,
  Tractor,
  Store,
  Map,
} from 'lucide-react';

const navigationItems = [
  {
    label: 'Plantation Overview',
    items: [
      { title: 'Crop Planning', icon: Leaf, component: 'planning' },
      { title: 'Harvest Schedule', icon: Calendar, component: 'schedule' },
      { title: 'Growth Analytics', icon: LineChart, component: 'analytics' },
      { title: 'Farm Map', icon: Map, component: 'farm-map' },
    ],
  },
  {
    label: 'Produce Management',
    items: [
      { title: 'Bananas', icon: Leaf, component: 'bananas' },
      { title: 'Coffee', icon: Coffee, component: 'coffee' },
      { title: 'Maize', icon: Wheat, component: 'maize' },
      { title: 'Beans', icon: Bean, component: 'beans' },
    ],
  },
  {
    label: 'Operations',
    items: [
      { title: 'Planting Records', icon: FileText, component: 'planting-records' },
      { title: 'Harvest Records', icon: ClipboardList, component: 'harvest-records' },
      { title: 'Worker Management', icon: Users, component: 'workers' },
      { title: 'Expenses', icon: DollarSign, component: 'expenses' },
      { title: 'Equipment', icon: Tractor, component: 'equipment' },
    ],
  },
  {
    label: 'Resources',
    items: [
      { title: 'Inventory', icon: Warehouse, component: 'inventory' },
      { title: 'Irrigation Control', icon: Droplets, component: 'irrigation' },
      { title: 'Monitoring', icon: Activity, component: 'monitoring' },
      { title: 'Market Prices', icon: Store, component: 'market-prices' },
      { title: 'Settings', icon: Settings, component: 'settings' },
    ],
  },
  {
    label: 'Reports',
    items: [
      { title: 'Production Reports', icon: BarChart, component: 'production-reports' },
      { title: 'Financial Reports', icon: PieChart, component: 'financial-reports' },
    ],
  },
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
