import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DairyCoolers from './dairy/DairyCoolers';
import FactoryStock from './dairy/FactoryStock';
import ColdRoomStock from './dairy/ColdRoomStock';
import SlaughterhouseStock from './dairy/SlaughterhouseStock';
import SalesMarketing from './dairy/SalesMarketing';
import CheeseFactoryDashboard from './dairy/cheese-factory/CheeseFactoryDashboard';
import LogisticsDashboard from './dairy/logistics/LogisticsDashboard';
import PersonnelDashboard from './dairy/personnel/PersonnelDashboard';
import ReportsDashboard from './dairy/reports/ReportsDashboard';
import { Milk, Factory, Snowflake, Beef, TrendingUp, Truck, Users, FileSpreadsheet, Bell } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";

// ... keep existing code (sections array and other constants)

const GrandBernaDairies = () => {
  const [selectedSection, setSelectedSection] = useState(null);
  const { toast } = useToast();

  const sections = [
    { 
      id: 'coolers', 
      title: 'Dairy Coolers', 
      icon: Milk, 
      component: DairyCoolers,
      notifications: 2,
      status: 'operational'
    },
    { 
      id: 'cheese', 
      title: 'Cheese Factory Operations', 
      icon: Factory, 
      component: CheeseFactoryDashboard,
      notifications: 1,
      status: 'maintenance'
    },
    { 
      id: 'factory', 
      title: 'Factory Stock', 
      icon: Factory, 
      component: FactoryStock,
      notifications: 0,
      status: 'operational'
    },
    { 
      id: 'coldroom', 
      title: 'Cold Room', 
      icon: Snowflake, 
      component: ColdRoomStock,
      notifications: 3,
      status: 'attention'
    },
    { 
      id: 'slaughterhouse', 
      title: 'Slaughterhouse', 
      icon: Beef, 
      component: SlaughterhouseStock,
      notifications: 0,
      status: 'operational'
    },
    { 
      id: 'sales', 
      title: 'Sales & Marketing', 
      icon: TrendingUp, 
      component: SalesMarketing,
      notifications: 1,
      status: 'operational'
    },
    { 
      id: 'logistics', 
      title: 'Logistics & Distribution', 
      icon: Truck, 
      component: LogisticsDashboard,
      notifications: 2,
      status: 'operational'
    },
    { 
      id: 'personnel', 
      title: 'Personnel Management', 
      icon: Users, 
      component: PersonnelDashboard,
      notifications: 1,
      status: 'operational'
    },
    { 
      id: 'reports', 
      title: 'Reports & Analytics', 
      icon: FileSpreadsheet, 
      component: ReportsDashboard,
      notifications: 0,
      status: 'operational'
    }
  ];

  const handleSectionClick = (sectionId) => {
    const section = sections.find(s => s.id === sectionId);
    setSelectedSection(sectionId);
    
    if (section.notifications > 0) {
      toast({
        title: `${section.notifications} pending notifications`,
        description: `You have ${section.notifications} unread notifications in ${section.title}`,
        variant: "default",
      });
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'operational':
        return 'bg-green-500';
      case 'maintenance':
        return 'bg-yellow-500';
      case 'attention':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const handleBack = () => {
    setSelectedSection(null);
  };

  if (selectedSection) {
    const section = sections.find(s => s.id === selectedSection);
    const Component = section.component;

    return (
      <div className="max-w-[1200px] mx-auto p-4">
        <button 
          onClick={handleBack}
          className="mb-4 flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
        >
          ← Back to Dashboard
        </button>
        <div className="flex items-center justify-between mb-6 border-b pb-4">
          <h1 className="text-2xl font-bold">{section.title}</h1>
          <div className="flex items-center gap-2">
            <Badge className={getStatusColor(section.status)}>
              {section.status.charAt(0).toUpperCase() + section.status.slice(1)}
            </Badge>
            {section.notifications > 0 && (
              <Badge variant="secondary">
                <Bell className="h-4 w-4 mr-1" />
                {section.notifications} notifications
              </Badge>
            )}
          </div>
        </div>
        <Component />
      </div>
    );
  }

  return (
    <div className="max-w-[1200px] mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 border-b pb-4">Grand Berna Dairies Management</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <Card 
              key={section.id}
              className={`cursor-pointer hover:shadow-lg transition-shadow relative ${
                section.status === 'attention' ? 'border-red-500' : ''
              }`}
              onClick={() => handleSectionClick(section.id)}
            >
              <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                <div className="flex items-center flex-1">
                  <Icon className="h-6 w-6 mr-2" />
                  <CardTitle className="text-xl">{section.title}</CardTitle>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`h-2 w-2 rounded-full ${getStatusColor(section.status)}`} />
                  {section.notifications > 0 && (
                    <Badge variant="secondary" className="ml-2">
                      {section.notifications}
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Click to manage {section.title.toLowerCase()} operations
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default GrandBernaDairies;
