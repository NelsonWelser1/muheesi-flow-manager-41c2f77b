
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AssociationMetricsCards from './association-manager/AssociationMetricsCards';
import MemberManagement from './association-manager/MemberManagement';
import CommunityOutreach from './association-manager/CommunityOutreach';
import TrainingPrograms from './association-manager/TrainingPrograms';
import ResourceCoordination from './association-manager/ResourceCoordination';
import PartnershipDevelopment from './association-manager/PartnershipDevelopment';
import { Users, Heart, GraduationCap, Handshake, Package, BookOpen } from 'lucide-react';

const AssociationManagerDashboard = () => {
  const [activeTab, setActiveTab] = useState('members');

  const associationTabs = [
    {
      id: 'members',
      label: 'Member Management',
      icon: Users,
      component: <MemberManagement />
    },
    {
      id: 'outreach',
      label: 'Community Outreach',
      icon: Heart,
      component: <CommunityOutreach />
    },
    {
      id: 'training',
      label: 'Training Programs',
      icon: GraduationCap,
      component: <TrainingPrograms />
    },
    {
      id: 'resources',
      label: 'Resource Coordination',
      icon: Package,
      component: <ResourceCoordination />
    },
    {
      id: 'partnerships',
      label: 'Partnership Development',
      icon: Handshake,
      component: <PartnershipDevelopment />
    },
    {
      id: 'education',
      label: 'Educational Programs',
      icon: BookOpen,
      component: <div>Educational Programs component would be implemented here</div>
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Association Manager Dashboard</h2>
          <p className="text-muted-foreground">
            Manage community associations, member services, and partnership development
          </p>
        </div>
        <Users className="h-8 w-8 text-green-600" />
      </div>

      <AssociationMetricsCards />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          {associationTabs.map((tab) => (
            <TabsTrigger key={tab.id} value={tab.id} className="flex items-center gap-2">
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {associationTabs.map((tab) => (
          <TabsContent key={tab.id} value={tab.id}>
            {tab.component}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default AssociationManagerDashboard;
