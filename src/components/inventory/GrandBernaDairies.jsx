import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DairyCoolers from './dairy/DairyCoolers';
import FactoryStock from './dairy/FactoryStock';
import ColdRoomStock from './dairy/ColdRoomStock';
import SlaughterhouseStock from './dairy/SlaughterhouseStock';
import SalesMarketing from './dairy/SalesMarketing';
import { Milk, Factory, Snowflake, Beef, TrendingUp } from "lucide-react";

const GrandBernaDairies = () => {
  const [selectedSection, setSelectedSection] = useState(null);

  const sections = [
    { id: 'coolers', title: 'Dairy Coolers', icon: Milk, component: DairyCoolers },
    { id: 'factory', title: 'Factory Stock', icon: Factory, component: FactoryStock },
    { id: 'coldroom', title: 'Cold Room', icon: Snowflake, component: ColdRoomStock },
    { id: 'slaughterhouse', title: 'Slaughterhouse', icon: Beef, component: SlaughterhouseStock },
    { id: 'sales', title: 'Sales & Marketing', icon: TrendingUp, component: SalesMarketing }
  ];

  const handleSectionClick = (sectionId) => {
    setSelectedSection(sectionId);
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
        <h1 className="text-2xl font-bold mb-6 border-b pb-4">{section.title}</h1>
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
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => handleSectionClick(section.id)}
            >
              <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                <Icon className="h-6 w-6 mr-2" />
                <CardTitle className="text-xl">{section.title}</CardTitle>
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