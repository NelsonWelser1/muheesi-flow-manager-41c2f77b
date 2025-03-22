
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Search, RefreshCw, Filter } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/supabase";
import CSVExportButton from "../dairy/logistics/records/components/export-buttons/CSVExportButton";
import PDFExportButton from "../dairy/logistics/records/components/export-buttons/PDFExportButton";
import ExcelExportButton from "../dairy/logistics/records/components/export-buttons/ExcelExportButton";
import { exportToCSV, exportToExcel, exportToPDF } from "@/utils/coffee/coffeeExport";

const PlantingHarvestingScheduleViewer = ({ onBack, isKazo = false }) => {
  const [scheduleRecords, setScheduleRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [timeRange, setTimeRange] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortConfig, setSortConfig] = useState({ key: 'scheduled_date', direction: 'desc' });
  const { toast } = useToast();

  useEffect(() => {
    fetchScheduleRecords();
  }, [timeRange, statusFilter]);

  const fetchScheduleRecords = async () => {
    setIsLoading(true);
    try {
      // First try to get data from the planting_harvesting_schedule table
      let { data, error } = await supabase
        .from('planting_harvesting_schedule')
        .select('*');

      if (error) {
        throw error;
      }

      if (!data || data.length === 0) {
        // If no data in planting_harvesting_schedule, use mock data
        data = getMockScheduleData();
        console.info("Using mock planting and harvesting schedule data");
      } else {
        console.info("Fetched planting and harvesting schedule records:", data);
      }

      setScheduleRecords(data);
    } catch (err) {
      console.error("Error fetching planting and harvesting schedule records:", err);
      toast({
        title: "Error Loading Records",
        description: "Could not load planting and harvesting schedule records. Please try again.",
        variant: "destructive",
      });
      // Set mock data as fallback
      setScheduleRecords(getMockScheduleData());
    } finally {
      setIsLoading(false);
    }
  };

  const getMockScheduleData = () => {
    return [
      {
        id: '1',
        farm_id: '1',
        farm_name: 'Kanoni Coffee Farm',
        activity_type: 'planting',
        crop_variety: 'Arabica - SL28',
        plot_area: '15',
        scheduled_date: '2025-06-15T10:00:00Z',
        expected_completion_date: '2025-06-20T18:00:00Z',
        responsible_person: 'John Doe',
        status: 'scheduled',
        notes: 'Plant new coffee seedlings in the eastern section',
        created_at: '2025-01-15T10:00:00Z',
        updated_at: '2025-03-10T14:30:00Z'
      },
      {
        id: '2',
        farm_id: '1',
        farm_name: 'Kanoni Coffee Farm',
        activity_type: 'harvesting',
        crop_variety: 'Arabica - SL28',
        plot_area: '30',
        scheduled_date: '2025-11-10T08:00:00Z',
        expected_completion_date: '2025-11-25T18:00:00Z',
        responsible_person: 'Jane Smith',
        status: 'pending',
        notes: 'Main season harvest of mature cherries',
        created_at: '2025-02-01T08:15:00Z',
        updated_at: '2025-03-05T11:20:00Z'
      },
      {
        id: '3',
        farm_id: '2',
        farm_name: 'Engari Coffee Plantation',
        activity_type: 'planting',
        crop_variety: 'Robusta',
        plot_area: '20',
        scheduled_date: '2025-04-05T09:00:00Z',
        expected_completion_date: '2025-04-15T18:00:00Z',
        responsible_person: 'Robert Johnson',
        status: 'completed',
        notes: 'Replanting in sections damaged by storms',
        created_at: '2025-01-05T09:45:00Z',
        updated_at: '2025-04-16T16:10:00Z'
      },
      {
        id: '4',
        farm_id: '3',
        farm_name: 'Kyampangara Coffee Estate',
        activity_type: 'harvesting',
        crop_variety: 'Arabica - Bourbon',
        plot_area: '45',
        scheduled_date: '2025-10-01T07:00:00Z',
        expected_completion_date: '2025-10-30T18:00:00Z',
        responsible_person: 'Elizabeth Davis',
        status: 'cancelled',
        notes: 'Early harvest due to drought conditions',
        created_at: '2025-01-10T11:30:00Z',
        updated_at: '2025-09-15T12:45:00Z'
      }
    ];
  };

  const getTimeFilteredRecords = (records) => {
    if (timeRange === 'all') return records;

    const now = new Date();
    let timeAgo;

    switch (timeRange) {
      case 'hour':
        timeAgo = new Date(now.setHours(now.getHours() - 1));
        break;
      case 'day':
        timeAgo = new Date(now.setDate(now.getDate() - 1));
        break;
      case 'week':
        timeAgo = new Date(now.setDate(now.getDate() - 7));
        break;
      case 'month':
        timeAgo = new Date(now.setMonth(now.getMonth() - 1));
        break;
      case 'year':
        timeAgo = new Date(now.setFullYear(now.getFullYear() - 1));
        break;
      default:
        return records;
    }

    return records.filter(record => new Date(record.scheduled_date) >= timeAgo);
  };

  const handleSort = (key) => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleExportCSV = () => {
    exportToCSV(filteredAndSortedRecords, 'planting_harvesting_schedule');
    toast({
      title: "Export Successful",
      description: "Planting and harvesting schedule records have been exported to CSV",
    });
  };

  const handleExportExcel = () => {
    exportToExcel(filteredAndSortedRecords, 'planting_harvesting_schedule');
    toast({
      title: "Export Successful",
      description: "Planting and harvesting schedule records have been exported to Excel",
    });
  };

  const handleExportPDF = () => {
    exportToPDF(filteredAndSortedRecords, 'planting_harvesting_schedule', 'Planting and Harvesting Schedule');
    toast({
      title: "Export Successful",
      description: "Planting and harvesting schedule records have been exported to PDF",
    });
  };

  const handleRefresh = () => {
    fetchScheduleRecords();
    toast({
      title: "Refreshed",
      description: "Planting and harvesting schedule data has been refreshed",
    });
  };

  const filteredAndSortedRecords = React.useMemo(() => {
    let filtered = [...scheduleRecords];
    
    // Apply time range filter
    filtered = getTimeFilteredRecords(filtered);
    
    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(record => record.status === statusFilter);
    }
    
    // Apply search term
    if (searchTerm) {
      filtered = filtered.filter(record => 
        record.farm_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.activity_type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.crop_variety?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.responsible_person?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.notes?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply sorting
    if (sortConfig.key) {
      filtered.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    
    return filtered;
  }, [scheduleRecords, searchTerm, statusFilter, timeRange, sortConfig]);

  const getStatusBadgeStyle = (status) => {
    switch (status.toLowerCase()) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-100';
      case 'in_progress':
      case 'in progress':
        return 'bg-purple-100 text-purple-800 hover:bg-purple-100';
      case 'completed':
        return 'bg-green-100 text-green-800 hover:bg-green-100';
      case 'pending':
        return 'bg-amber-100 text-amber-800 hover:bg-amber-100';
      case 'cancelled':
        return 'bg-red-100 text-red-800 hover:bg-red-100';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-100';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack} className="flex items-center gap-2">
          <ArrowLeft size={16} />
          Back to Farm Operations
        </Button>
        <h2 className="text-2xl font-bold">
          {isKazo ? "Kazo Coffee Development Project - Planting & Harvesting Schedule" : "Planting & Harvesting Schedule"}
        </h2>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Schedule Records</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" onValueChange={setStatusFilter}>
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
              <TabsList>
                <TabsTrigger value="all">All Schedules</TabsTrigger>
                <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
                <TabsTrigger value="in_progress">In Progress</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
              </TabsList>
              
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-grow">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search schedules..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <Select onValueChange={setTimeRange} defaultValue="all">
                  <SelectTrigger className="w-[180px]">
                    <Filter className="mr-2 h-4 w-4" />
                    <span>Time Range</span>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Time</SelectItem>
                    <SelectItem value="hour">Last Hour</SelectItem>
                    <SelectItem value="day">Last Day</SelectItem>
                    <SelectItem value="week">Last Week</SelectItem>
                    <SelectItem value="month">Last Month</SelectItem>
                    <SelectItem value="year">Last Year</SelectItem>
                  </SelectContent>
                </Select>
                
                <Button variant="outline" onClick={handleRefresh} className="flex items-center gap-2">
                  <RefreshCw size={16} />
                  Refresh
                </Button>
              </div>
            </div>
            
            <div className="flex justify-end mb-4">
              <div className="flex gap-2">
                <PDFExportButton onClick={handleExportPDF} />
                <ExcelExportButton onClick={handleExportExcel} />
                <CSVExportButton onClick={handleExportCSV} />
              </div>
            </div>
            
            {/* Render the schedules table for all tabs using the same content */}
            <TabsContent value="all">
              {renderScheduleTable(filteredAndSortedRecords, isLoading, handleSort, sortConfig, getStatusBadgeStyle, formatDate)}
            </TabsContent>
            <TabsContent value="scheduled">
              {renderScheduleTable(filteredAndSortedRecords, isLoading, handleSort, sortConfig, getStatusBadgeStyle, formatDate)}
            </TabsContent>
            <TabsContent value="in_progress">
              {renderScheduleTable(filteredAndSortedRecords, isLoading, handleSort, sortConfig, getStatusBadgeStyle, formatDate)}
            </TabsContent>
            <TabsContent value="completed">
              {renderScheduleTable(filteredAndSortedRecords, isLoading, handleSort, sortConfig, getStatusBadgeStyle, formatDate)}
            </TabsContent>
            <TabsContent value="pending">
              {renderScheduleTable(filteredAndSortedRecords, isLoading, handleSort, sortConfig, getStatusBadgeStyle, formatDate)}
            </TabsContent>
            <TabsContent value="cancelled">
              {renderScheduleTable(filteredAndSortedRecords, isLoading, handleSort, sortConfig, getStatusBadgeStyle, formatDate)}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

// Helper function to render the schedule table
const renderScheduleTable = (records, isLoading, handleSort, sortConfig, getStatusBadgeStyle, formatDate) => {
  if (isLoading) {
    return (
      <div className="py-10 text-center">
        <p>Loading schedule records...</p>
      </div>
    );
  }
  
  if (records.length === 0) {
    return (
      <div className="py-10 text-center bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
        <p className="font-medium">No Schedule Records Found</p>
        <p className="mt-2">No planting or harvesting schedule records match your search criteria.</p>
      </div>
    );
  }
  
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="cursor-pointer" onClick={() => handleSort('farm_name')}>
              Farm
              {sortConfig.key === 'farm_name' && (sortConfig.direction === 'asc' ? ' ↑' : ' ↓')}
            </TableHead>
            <TableHead className="cursor-pointer" onClick={() => handleSort('activity_type')}>
              Activity
              {sortConfig.key === 'activity_type' && (sortConfig.direction === 'asc' ? ' ↑' : ' ↓')}
            </TableHead>
            <TableHead className="cursor-pointer" onClick={() => handleSort('crop_variety')}>
              Crop Variety
              {sortConfig.key === 'crop_variety' && (sortConfig.direction === 'asc' ? ' ↑' : ' ↓')}
            </TableHead>
            <TableHead className="cursor-pointer" onClick={() => handleSort('scheduled_date')}>
              Scheduled Date
              {sortConfig.key === 'scheduled_date' && (sortConfig.direction === 'asc' ? ' ↑' : ' ↓')}
            </TableHead>
            <TableHead className="cursor-pointer" onClick={() => handleSort('expected_completion_date')}>
              Expected Completion
              {sortConfig.key === 'expected_completion_date' && (sortConfig.direction === 'asc' ? ' ↑' : ' ↓')}
            </TableHead>
            <TableHead className="cursor-pointer" onClick={() => handleSort('responsible_person')}>
              Responsible Person
              {sortConfig.key === 'responsible_person' && (sortConfig.direction === 'asc' ? ' ↑' : ' ↓')}
            </TableHead>
            <TableHead className="cursor-pointer" onClick={() => handleSort('status')}>
              Status
              {sortConfig.key === 'status' && (sortConfig.direction === 'asc' ? ' ↑' : ' ↓')}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {records.map((record) => (
            <TableRow key={record.id}>
              <TableCell className="font-medium">{record.farm_name}</TableCell>
              <TableCell className="capitalize">
                {record.activity_type}
              </TableCell>
              <TableCell>{record.crop_variety}</TableCell>
              <TableCell>{formatDate(record.scheduled_date)}</TableCell>
              <TableCell>{formatDate(record.expected_completion_date)}</TableCell>
              <TableCell>{record.responsible_person}</TableCell>
              <TableCell>
                <Badge className={getStatusBadgeStyle(record.status)}>
                  {record.status.charAt(0).toUpperCase() + record.status.slice(1).replace('_', ' ')}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default PlantingHarvestingScheduleViewer;
