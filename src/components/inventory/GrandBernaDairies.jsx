
import React, { useState, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { showErrorToast, showInfoToast } from "@/components/ui/notifications";
import DairyMetricsCard from './dairy/dashboard/DairyMetricsCard';
import DairySectionView from './dairy/dashboard/DairySectionView';
import { supabase } from "@/integrations/supabase/supabase";

const GrandBernaDairies = () => {
  console.log('Rendering GrandBernaDairies');
  const [selectedSection, setSelectedSection] = useState(null);
  const [dairySections, setDairySections] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Fetch dairy sections data from Supabase
  useEffect(() => {
    const fetchDairySections = async () => {
      setIsLoading(true);
      try {
        // Try to fetch from dedicated dairy_sections table
        let { data, error } = await supabase
          .from('dairy_sections')
          .select('*')
          .order('priority', { ascending: true });

        // If table doesn't exist or error, use hardcoded data
        if (error || !data || data.length === 0) {
          console.log('Using default dairy sections data');
          // Import from local file for fallback
          const { dairySections } = await import('./dairy/dashboard/DairySections');
          setDairySections(dairySections);
        } else {
          console.log('Fetched dairy sections from database:', data);
          setDairySections(data);
        }

        // Fetch notifications for each section
        await fetchNotifications();
      } catch (error) {
        console.error('Error fetching dairy sections:', error);
        showErrorToast(toast, 'Failed to load dairy sections data');
        // Fallback to imported data
        const { dairySections } = await import('./dairy/dashboard/DairySections');
        setDairySections(dairySections);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDairySections();
  }, [toast]);

  // Fetch notifications for each section
  const fetchNotifications = async () => {
    try {
      const { data, error } = await supabase
        .from('dairy_notifications')
        .select('section_id, count(*)')
        .eq('is_read', false)
        .group('section_id');

      if (error) throw error;

      // Update sections with notification counts
      setDairySections(prevSections => 
        prevSections.map(section => {
          const notificationData = data.find(n => n.section_id === section.id);
          return {
            ...section,
            notifications: notificationData ? notificationData.count : section.notifications || 0
          };
        })
      );
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const handleSectionClick = (sectionId) => {
    console.log('Section clicked:', sectionId);
    const section = dairySections.find(s => s.id === sectionId);
    setSelectedSection(sectionId);
    
    if (section && section.notifications > 0) {
      showInfoToast(toast, `You have ${section.notifications} unread notifications in ${section.title}`);
      
      // Mark notifications as read in database
      updateNotificationsReadStatus(sectionId);
    }
  };

  const updateNotificationsReadStatus = async (sectionId) => {
    try {
      const { error } = await supabase
        .from('dairy_notifications')
        .update({ is_read: true })
        .eq('section_id', sectionId)
        .eq('is_read', false);

      if (error) throw error;
      
      // Update local state after marking as read
      fetchNotifications();
    } catch (error) {
      console.error('Error updating notification status:', error);
    }
  };

  const handleBack = () => {
    console.log('Navigating back to dashboard');
    setSelectedSection(null);
  };

  if (isLoading) {
    return (
      <div className="max-w-[1200px] mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6 border-b pb-4">Grand Berna Dairies Management</h1>
        <div className="flex items-center justify-center h-64">
          <p>Loading dairy management dashboard...</p>
        </div>
      </div>
    );
  }

  if (selectedSection) {
    const section = dairySections.find(s => s.id === selectedSection);
    return <DairySectionView section={section} onBack={handleBack} />;
  }

  return (
    <div className="max-w-[1200px] mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 border-b pb-4">Grand Berna Dairies Management</h1>
      
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
