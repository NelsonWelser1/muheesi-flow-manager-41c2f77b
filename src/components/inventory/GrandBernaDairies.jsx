import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DairyCoolers from './dairy/DairyCoolers';
import DairyFactoryDashboard from './dairy/DairyFactoryDashboard';
import ColdRoomStock from './dairy/ColdRoomStock';
import SlaughterhouseStock from './dairy/SlaughterhouseStock';

const GrandBernaDairies = () => {
  const [selectedSection, setSelectedSection] = React.useState(null);

  const sections = [
    {
      title: "Milk Coolers",
      description: "Manage milk coolers and storage",
      component: <DairyCoolers />
    },
    {
      title: "Dairy Factory",
      description: "Manage factory operations and production",
      component: <DairyFactoryDashboard />
    },
    {
      title: "Cold Room",
      description: "Manage cold room storage and inventory",
      component: <ColdRoomStock />
    },
    {
      title: "Slaughterhouse",
      description: "Manage slaughterhouse operations",
      component: <SlaughterhouseStock />
    }
  ];

  if (selectedSection) {
    return (
      <div className="space-y-4">
        <button
          onClick={() => setSelectedSection(null)}
          className="mb-4 px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900"
        >
          ← Back to Sections
        </button>
        {selectedSection.component}
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Grand Berna Dairies Management</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sections.map((section) => (
          <Card 
            key={section.title}
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => setSelectedSection(section)}
          >
            <CardHeader>
              <CardTitle>{section.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">{section.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default GrandBernaDairies;