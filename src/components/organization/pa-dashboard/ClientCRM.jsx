
import React, { useState } from 'react';
import CRMRouter from './crm/CRMRouter';
import { Card } from "@/components/ui/card";
import { Bluetooth, Building, FileText, Mail, MessageSquare, Phone, User } from 'lucide-react';
import { BluetoothProvider } from '@/contexts/BluetoothContext';
import { 
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton 
} from "@/components/ui/sidebar";

const menuItems = [
  { id: 'contacts', icon: User, label: 'Contacts' },
  { id: 'companies', icon: Building, label: 'Companies' },
  { id: 'messages', icon: MessageSquare, label: 'Messages' },
  { id: 'calls', icon: Phone, label: 'Calls' },
  { id: 'email', icon: Mail, label: 'Email' },
  { id: 'documents', icon: FileText, label: 'Documents' },
  { id: 'bluetooth', icon: Bluetooth, label: 'Bluetooth' }
];

const ClientCRM = ({ selectedEntity, view = 'contacts' }) => {
  const [activeView, setActiveView] = useState(view);

  const handleViewChange = (value) => {
    setActiveView(value);
  };

  return (
    <BluetoothProvider>
      <div className="flex h-[calc(100vh-200px)]">
        <Sidebar>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  {menuItems.map((item) => (
                    <SidebarMenuItem key={item.id}>
                      <SidebarMenuButton
                        onClick={() => handleViewChange(item.id)}
                        className={`w-full justify-start gap-2 ${
                          activeView === item.id ? 'bg-accent' : ''
                        }`}
                      >
                        <item.icon className="h-4 w-4" />
                        <span>{item.label}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>

        <div className="flex-1 p-4">
          <Card className="h-full overflow-hidden">
            <CRMRouter view={activeView} />
          </Card>
        </div>
      </div>
    </BluetoothProvider>
  );
};

export default ClientCRM;
