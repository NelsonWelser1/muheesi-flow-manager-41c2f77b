
import React, { useState } from 'react';
import CRMRouter from './crm/CRMRouter';
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BluetoothProvider } from '@/contexts/BluetoothContext';
import { Bluetooth, Building, FileText, Mail, MessageSquare, Phone, User } from 'lucide-react';

const ClientCRM = ({ selectedEntity, view = 'contacts' }) => {
  const [activeView, setActiveView] = useState(view);

  const handleViewChange = (value) => {
    setActiveView(value);
  };

  return (
    <BluetoothProvider>
      <div className="space-y-4">
        <Tabs value={activeView} onValueChange={handleViewChange} className="w-full">
          <TabsList className="w-full grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7">
            <TabsTrigger value="contacts" className="flex items-center gap-1 text-xs sm:text-sm">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Contacts</span>
            </TabsTrigger>
            <TabsTrigger value="companies" className="flex items-center gap-1 text-xs sm:text-sm">
              <Building className="h-4 w-4" />
              <span className="hidden sm:inline">Companies</span>
            </TabsTrigger>
            <TabsTrigger value="messages" className="flex items-center gap-1 text-xs sm:text-sm">
              <MessageSquare className="h-4 w-4" />
              <span className="hidden sm:inline">Messages</span>
            </TabsTrigger>
            <TabsTrigger value="calls" className="flex items-center gap-1 text-xs sm:text-sm">
              <Phone className="h-4 w-4" />
              <span className="hidden sm:inline">Calls</span>
            </TabsTrigger>
            <TabsTrigger value="email" className="flex items-center gap-1 text-xs sm:text-sm">
              <Mail className="h-4 w-4" />
              <span className="hidden sm:inline">Email</span>
            </TabsTrigger>
            <TabsTrigger value="documents" className="flex items-center gap-1 text-xs sm:text-sm">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Documents</span>
            </TabsTrigger>
            <TabsTrigger value="bluetooth" className="flex items-center gap-1 text-xs sm:text-sm">
              <Bluetooth className="h-4 w-4" />
              <span className="hidden sm:inline">Bluetooth</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <Card className="p-0 overflow-hidden">
          <CRMRouter view={activeView} />
        </Card>
      </div>
    </BluetoothProvider>
  );
};

export default ClientCRM;
