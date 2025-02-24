
import React from 'react';
import { Calendar } from "@/components/ui/calendar";
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/supabase';
import { cn } from "@/lib/utils";

const MaintenanceCalendar = () => {
  const [date, setDate] = React.useState(new Date());

  const { data: maintenanceRecords } = useQuery({
    queryKey: ['maintenance'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('maintenance_records')
        .select('*')
        .order('next_maintenance', { ascending: true });

      if (error) throw error;
      return data || [];
    }
  });

  // Function to get status color for a date
  const getDateStatus = (date) => {
    if (!maintenanceRecords) return null;

    const maintenanceOnDate = maintenanceRecords.find(record => {
      const recordDate = new Date(record.next_maintenance);
      return recordDate.toDateString() === date.toDateString();
    });

    if (!maintenanceOnDate) return null;

    const statusColors = {
      due: 'bg-[#ea384c] text-white',
      upcoming: 'bg-[#F97316] text-white',
      overdue: 'bg-[#8B5CF6] text-white',
      completed: 'bg-[#9b87f5] text-white'
    };

    return statusColors[maintenanceOnDate.status];
  };

  return (
    <Calendar
      mode="single"
      selected={date}
      onSelect={setDate}
      className="rounded-md border shadow"
      modifiers={{
        maintenance: (date) => getDateStatus(date) !== null
      }}
      modifiersStyles={{
        maintenance: (date) => ({
          backgroundColor: getDateStatus(date)?.split(' ')[0].replace('bg-', '') || 'transparent'
        })
      }}
      classNames={{
        day_today: cn(
          "bg-accent text-accent-foreground",
          getDateStatus(new Date()) || ""
        ),
        day_selected: cn(
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
          getDateStatus(date) || ""
        )
      }}
      styles={{
        wrapper: {
          borderRadius: 'calc(0.25 * min(100%, 100vh))'
        }
      }}
    />
  );
};

export default MaintenanceCalendar;
