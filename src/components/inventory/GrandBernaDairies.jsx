
import React, { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import DairyMetricsCard from './dairy/dashboard/DairyMetricsCard';
import DairySectionView from './dairy/dashboard/DairySectionView';
import { dairySections } from './dairy/dashboard/DairySections';
import NotificationCenter from '@/components/notifications/NotificationCenter';
import { useOperationalAlerts } from '@/hooks/useOperationalAlerts';

const GrandBernaDairies = () => {
  console.log('Rendering GrandBernaDairies');
  const [selectedSection, setSelectedSection] = useState(null);
  const { toast } = useToast();

  // Enable operational alerts for the entire dairy system
  useOperationalAlerts();

  const handleSectionClick = (sectionId) => {
    console.log('Section clicked:', sectionId);
    const section = dairySections.find(s => s.id === sectionId);
    setSelectedSection(sectionId);
    
    if (section.notifications > 0) {
      toast({
        title: `${section.notifications} pending notifications`,
        description: `You have ${section.notifications} unread notifications in ${section.title}`,
        variant: "default",
      });
    }
  };

  const handleBack = () => {
    console.log('Navigating back to dashboard');
    setSelectedSection(null);
  };

  if (selectedSection) {
    const section = dairySections.find(s => s.id === selectedSection);
    return <DairySectionView section={section} onBack={handleBack} />;
  }

  return (
    <div className="max-w-[1200px] mx-auto p-4">
      <div className="flex items-center justify-between mb-6 border-b pb-4">
        <h1 className="text-2xl font-bold">Grand Berna Dairies Management</h1>
        <NotificationCenter />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {dairySections.map((section) => (
          <DairyMetricsCard
            key={section.id}
            section={section}
            icon={section.icon}
            onSectionClick={handleSectionClick}
          />
        ))}
      </div>
    </div>
  );
};

export default GrandBernaDairies;
