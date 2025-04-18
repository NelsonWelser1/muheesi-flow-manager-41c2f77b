
import React from 'react';
import { 
  CheckSquare, 
  Users, 
  FileText, 
  BarChart2, 
  Bell, 
  ClipboardList,
  Calendar,
  MessageSquare,
  Settings
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const sidebarItems = {
  tasks: [
    { icon: CheckSquare, label: 'Task List', value: 'list' },
    { icon: Calendar, label: 'Calendar View', value: 'calendar' },
    { icon: ClipboardList, label: 'Task Board', value: 'board' },
  ],
  crm: [
    { icon: Users, label: 'Contacts', value: 'contacts' },
    { icon: MessageSquare, label: 'Messages', value: 'messages' },
    { icon: FileText, label: 'Documents', value: 'documents' },
  ],
  finance: [
    { icon: BarChart2, label: 'Overview', value: 'overview' },
    { icon: FileText, label: 'Reports', value: 'reports' },
    { icon: Settings, label: 'Settings', value: 'settings' },
  ],
};

const DashboardSidebar = ({ activeTab, onViewChange, isCollapsed }) => {
  const currentItems = sidebarItems[activeTab] || [];

  return (
    <Sidebar className={`border-r ${isCollapsed ? 'w-16' : 'w-64'} transition-width duration-200`}>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className={isCollapsed ? 'sr-only' : ''}>
            {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
          </SidebarGroupLabel>
          <SidebarMenu>
            {currentItems.map((item) => (
              <SidebarMenuItem key={item.value}>
                <SidebarMenuButton
                  onClick={() => onViewChange(item.value)}
                  className="w-full flex items-center gap-2"
                >
                  <item.icon className="h-4 w-4" />
                  {!isCollapsed && <span>{item.label}</span>}
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default DashboardSidebar;
