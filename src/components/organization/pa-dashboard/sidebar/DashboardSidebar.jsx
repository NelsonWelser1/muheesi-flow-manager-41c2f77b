
import React from 'react';
import { Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { 
  List, 
  Plus, 
  BarChart3, 
  Calendar,
  Filter,
  Settings
} from 'lucide-react';

const DashboardSidebar = ({ activeTab, onViewChange, isCollapsed }) => {
  const getTabActions = () => {
    switch (activeTab) {
      case 'tasks':
        return [
          { icon: List, label: 'Task List', action: () => onViewChange('list') },
          { icon: Plus, label: 'Create Task', action: () => onViewChange('form') },
          { icon: Calendar, label: 'Calendar View', action: () => onViewChange('calendar') },
          { icon: BarChart3, label: 'Analytics', action: () => onViewChange('analytics') }
        ];
      case 'crm':
        return [
          { icon: List, label: 'Client List', action: () => onViewChange('list') },
          { icon: Plus, label: 'Add Client', action: () => onViewChange('form') },
          { icon: BarChart3, label: 'Analytics', action: () => onViewChange('analytics') },
          { icon: Filter, label: 'Advanced Filters', action: () => onViewChange('filters') }
        ];
      case 'finance':
        return [
          { icon: List, label: 'Transactions', action: () => onViewChange('transactions') },
          { icon: BarChart3, label: 'Reports', action: () => onViewChange('reports') },
          { icon: Plus, label: 'Add Entry', action: () => onViewChange('form') },
          { icon: Settings, label: 'Settings', action: () => onViewChange('settings') }
        ];
      default:
        return [
          { icon: List, label: 'List View', action: () => onViewChange('list') },
          { icon: Plus, label: 'Add New', action: () => onViewChange('form') },
          { icon: BarChart3, label: 'Analytics', action: () => onViewChange('analytics') }
        ];
    }
  };

  const actions = getTabActions();

  return (
    <Sidebar className="w-64 border-r">
      <SidebarHeader className="p-4">
        <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">
          {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Actions
        </h3>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {actions.map((action, index) => (
            <SidebarMenuItem key={index}>
              <SidebarMenuButton onClick={action.action} className="w-full justify-start">
                <action.icon className="h-4 w-4 mr-2" />
                {!isCollapsed && action.label}
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
};

export default DashboardSidebar;
