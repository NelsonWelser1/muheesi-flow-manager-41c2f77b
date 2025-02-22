
import React from 'react';
import { Calendar } from "@/components/ui/calendar";

const MaintenanceCalendar = () => {
  const [date, setDate] = React.useState(new Date());

  return (
    <Calendar
      mode="single"
      selected={date}
      onSelect={setDate}
      className="rounded-md border shadow"
    />
  );
};

export default MaintenanceCalendar;
