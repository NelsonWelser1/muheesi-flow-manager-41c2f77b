import React from 'react';
import { CheckSquare, Users, FileText, BarChart2, Bell, ClipboardList, Calendar, MessageSquare, Settings, Columns, List, UserPlus, Phone, Mail, Building } from 'lucide-react';
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
const sidebarItems = {
  tasks: [{
    icon: List,
    label: 'Task List',
    value: 'list'
  }, {
    icon: Calendar,
    label: 'Calendar View',
    value: 'calendar'
  }, {
    icon: Columns,
    label: 'Task Board',
    value: 'board'
  }],
  crm: [{
    icon: Users,
    label: 'All Contacts',
    value: 'contacts'
  }, {
    icon: UserPlus,
    label: 'Add Contact',
    value: 'add-contact'
  }, {
    icon: Building,
    label: 'Companies',
    value: 'companies'
  }, {
    icon: MessageSquare,
    label: 'Messages',
    value: 'messages'
  }, {
    icon: Phone,
    label: 'Call Log',
    value: 'calls'
  }, {
    icon: Mail,
    label: 'Email',
    value: 'email'
  }, {
    icon: FileText,
    label: 'Documents',
    value: 'documents'
  }],
  finance: [{
    icon: BarChart2,
    label: 'Overview',
    value: 'overview'
  }, {
    icon: FileText,
    label: 'Reports',
    value: 'reports'
  }, {
    icon: Settings,
    label: 'Settings',
    value: 'settings'
  }]
};
const DashboardSidebar = ({
  activeTab,
  onViewChange,
  isCollapsed
}) => {
  const currentItems = sidebarItems[activeTab] || [];
  return <Sidebar className={`border-r ${isCollapsed ? 'w-16' : 'w-64'} transition-width duration-200`}>
      
    </Sidebar>;
};
export default DashboardSidebar;