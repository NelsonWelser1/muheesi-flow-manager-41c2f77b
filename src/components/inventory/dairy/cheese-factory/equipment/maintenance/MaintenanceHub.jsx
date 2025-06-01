
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Bell, Calendar as CalendarIcon, Wrench, AlertTriangle, Check, Clock } from "lucide-react";
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/supabase';
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import MaintenanceEntryForm from '../../MaintenanceEntryForm';

const MaintenanceHub = () => {
  const [selectedDate, setSelectedDate] = React.useState(new Date());
  const [view, setView] = useState('calendar'); // 'calendar' or 'list'
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const { data: maintenanceData, isLoading } = useQuery({
    queryKey: ['maintenanceSchedule'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('equipment_maintenance')
        .select('*')
        .order('created_at', { ascending: false }); // Sort by most recent first
      
      if (error) {
        console.error('Error fetching maintenance data:', error);
        throw error;
      }
      console.log('Fetched maintenance data:', data);
      return data;
    }
  });

  const handleScheduleMaintenance = async (taskId) => {
    try {
      const { error } = await supabase
        .from('equipment_maintenance')
        .update({ status: 'scheduled' })
        .eq('id', taskId);

      if (error) throw error;
      toast.success('Maintenance scheduled successfully');
    } catch (error) {
      console.error('Error scheduling maintenance:', error);
      toast.error('Failed to schedule maintenance');
    }
  };

  const urgentTasks = maintenanceData?.filter(task => 
    task.status === 'critical' || 
    (new Date(task.next_maintenance) <= new Date())
  ) || [];

  const getMaintenanceStats = () => {
    if (!maintenanceData) return { due: 0, upcoming: 0, completed: 0 };
    return {
      due: maintenanceData.filter(task => task.status === 'maintenance').length,
      upcoming: maintenanceData.filter(task => task.status === 'operational').length,
      completed: maintenanceData.filter(task => task.status === 'completed').length
    };
  };

  const stats = getMaintenanceStats();

  const getStatusBadge = (status) => {
    const config = {
      operational: { color: 'bg-green-100 text-green-800', icon: <Check className="h-4 w-4" /> },
      maintenance: { color: 'bg-yellow-100 text-yellow-800', icon: <Clock className="h-4 w-4" /> },
      critical: { color: 'bg-red-100 text-red-800', icon: <AlertTriangle className="h-4 w-4" /> },
      completed: { color: 'bg-blue-100 text-blue-800', icon: <Check className="h-4 w-4" /> }
    };

    const defaultConfig = { color: 'bg-gray-100 text-gray-800', icon: <Clock className="h-4 w-4" /> };
    return config[status] || defaultConfig;
  };

  // Pagination logic for scheduled maintenance
  const filteredMaintenanceData = maintenanceData?.filter(task => {
    if (view === 'calendar') {
      const taskDate = new Date(task.next_maintenance);
      return (
        taskDate.getDate() === selectedDate.getDate() &&
        taskDate.getMonth() === selectedDate.getMonth() &&
        taskDate.getFullYear() === selectedDate.getFullYear()
      );
    }
    return true;
  }) || [];

  const totalItems = filteredMaintenanceData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedMaintenanceData = filteredMaintenanceData.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Reset to first page when view or date changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [view, selectedDate]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-[200px]"></div>
          <div className="grid grid-cols-3 gap-4">
            <div className="h-24 bg-gray-200 rounded col-span-1"></div>
            <div className="h-24 bg-gray-200 rounded col-span-1"></div>
            <div className="h-24 bg-gray-200 rounded col-span-1"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Due Tasks</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.due}</div>
            <p className="text-xs text-muted-foreground">Requiring attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.upcoming}</div>
            <p className="text-xs text-muted-foreground">Scheduled maintenance</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completed}</div>
            <p className="text-xs text-muted-foreground">This month</p>
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
                  <Button 
                    variant="secondary" 
                    size="sm"
                    onClick={() => handleScheduleMaintenance(task.id)}
                  >
                    Schedule Now
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Maintenance Entry Form */}
      <MaintenanceEntryForm />

      {/* Calendar and Scheduled Maintenance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Maintenance Calendar</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border shadow"
            />
          </CardContent>
        </Card>

        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Scheduled Maintenance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {paginatedMaintenanceData.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow whitespace-nowrap overflow-hidden"
                >
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium truncate">{task.equipment_name}</h4>
                    <p className="text-sm text-muted-foreground truncate">
                      {new Date(task.next_maintenance).toLocaleDateString()}
                    </p>
                    {task.notes && (
                      <p className="text-sm text-muted-foreground mt-1 truncate">
                        {task.notes}
                      </p>
                    )}
                  </div>
                  <Badge className={getStatusBadge(task.status).color}>
                    <span className="flex items-center gap-1 whitespace-nowrap">
                      {getStatusBadge(task.status).icon}
                      {task.status}
                    </span>
                  </Badge>
                </div>
              ))}

              {filteredMaintenanceData.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No maintenance tasks scheduled</p>
                </div>
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-6 flex justify-between items-center">
                <div className="text-sm text-muted-foreground">
                  Showing {startIndex + 1} to {Math.min(endIndex, totalItems)} of {totalItems} results
                </div>
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                        className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                      />
                    </PaginationItem>
                    
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <PaginationItem key={page}>
                        <PaginationLink
                          onClick={() => handlePageChange(page)}
                          isActive={currentPage === page}
                          className="cursor-pointer"
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    
                    <PaginationItem>
                      <PaginationNext 
                        onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                        className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MaintenanceHub;
