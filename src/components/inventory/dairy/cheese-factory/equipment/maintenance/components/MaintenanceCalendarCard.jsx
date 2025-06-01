
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";

const MaintenanceCalendarCard = ({ selectedDate, onSelectDate }) => {
  return (
    <Card className="lg:col-span-1">
      <CardHeader>
        <CardTitle>Maintenance Calendar</CardTitle>
      </CardHeader>
      <CardContent>
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={onSelectDate}
          className="rounded-md border shadow"
        />
      </CardContent>
    </Card>
  );
};

export default MaintenanceCalendarCard;
