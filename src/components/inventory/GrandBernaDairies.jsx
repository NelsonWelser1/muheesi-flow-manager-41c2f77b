
import React, { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import DairyMetricsCard from './dairy/dashboard/DairyMetricsCard';
import DairySectionView from './dairy/dashboard/DairySectionView';
import { dairySections } from './dairy/dashboard/DairySections';
import { useDairyNotifications } from '@/hooks/useDairyNotifications';

const GrandBernaDairies = () => {
  console.log('Rendering GrandBernaDairies');
  const [selectedSection, setSelectedSection] = useState(null);
  const { toast } = useToast();
  const { getNotificationCount } = useDairyNotifications();

  const handleSectionClick = (sectionId) => {
    console.log('Section clicked:', sectionId);
    const section = dairySections.find(s => s.id === sectionId);
    const notificationCount = getNotificationCount(sectionId);
    
    setSelectedSection(sectionId);
    
    if (notificationCount > 0) {
      toast({
        title: `${notificationCount} pending notifications`,
        description: `You have ${notificationCount} unread notifications in ${section.title}`,
        variant: "default",
        duration: 4000,
      });
    }
  };

  const handleBack = () => {
    console.log('Navigating back to dashboard');
    setSelectedSection(null);
  };

  if (selectedSection) {
    const section = dairySections.find(s => s.id === selectedSection);
    // Update section with current notification count
    const sectionWithNotifications = {
      ...section,
      notifications: getNotificationCount(selectedSection)
    };
    return <DairySectionView section={sectionWithNotifications} onBack={handleBack} />;
  }

  return (
    <div className="max-w-[1200px] mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 border-b pb-4">Grand Berna Dairies Management</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {dairySections.map((section) => {
          const notificationCount = getNotificationCount(section.id);
          const sectionWithNotifications = {
            ...section,
            notifications: notificationCount
          };
          
          return (
            <DairyMetricsCard
              key={section.id}
              section={sectionWithNotifications}
              icon={section.icon}
              onSectionClick={handleSectionClick}
            />
          );
        })}
      </div>
    </div>
  );
};

export default GrandBernaDairies;
