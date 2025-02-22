
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Bell, Calendar as CalendarIcon, Wrench, AlertTriangle } from "lucide-react";
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/supabase';

const MaintenanceHub = () => {
  const [date, setDate] = React.useState(new Date());

  const { data: maintenanceData } = useQuery({
    queryKey: ['maintenanceSchedule'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('equipment_maintenance')
        .select('*')
        .order('next_maintenance', { ascending: true });
      
      if (error) throw error;
      return data;
    }
  });

  const urgentTasks = maintenanceData?.filter(task => 
    task.status === 'overdue' || 
    (task.status === 'due' && new Date(task.next_maintenance) <= new Date())
  ) || [];

  return (
    <div className="space-y-6">
      {/* Maintenance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Due Tasks</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {maintenanceData?.filter(task => task.status === 'due').length || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {maintenanceData?.filter(task => task.status === 'upcoming').length || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {maintenanceData?.filter(task => task.status === 'completed').length || 0}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Urgent Tasks */}
      {urgentTasks.length > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader className="flex flex-row items-center space-y-0">
            <AlertTriangle className="h-4 w-4 text-red-500 mr-2" />
            <CardTitle>Urgent Maintenance Required</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {urgentTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm"
                >
                  <div>
                    <h4 className="font-medium">{task.equipment_name}</h4>
                    <p className="text-sm text-muted-foreground">
                      Due: {new Date(task.next_maintenance).toLocaleDateString()}
                    </p>
                  </div>
                  <Button variant="secondary" size="sm">
                    Schedule Now
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Maintenance Calendar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Maintenance Calendar</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border shadow"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Scheduled Maintenance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {maintenanceData?.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div>
                    <h4 className="font-medium">{task.equipment_name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {new Date(task.next_maintenance).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`text-sm font-medium px-2 py-1 rounded ${
                    task.status === 'completed' ? 'bg-green-100 text-green-700' :
                    task.status === 'upcoming' ? 'bg-blue-100 text-blue-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {task.status}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MaintenanceHub;
