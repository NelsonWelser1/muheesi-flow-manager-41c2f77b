
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

const FarmRecordsViewer = ({ onBack, isKazo = false }) => {
  const [farmRecords, setFarmRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [timeRange, setTimeRange] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortConfig, setSortConfig] = useState({ key: 'updated_at', direction: 'desc' });
  const { toast } = useToast();

  useEffect(() => {
    fetchFarmRecords();
  }, [timeRange, statusFilter]);

  const fetchFarmRecords = async () => {
    setIsLoading(true);
    try {
      // First try to get data from the farm_records table
      let { data, error } = await supabase
        .from('farm_records')
        .select('*');

      if (error) {
        throw error;
      }

      if (!data || data.length === 0) {
        // If no data in farm_records, use mock data
        data = getMockFarmData();
        console.info("Using mock farm records data");
      } else {
        console.info("Fetched farm records:", data);
      }

      setFarmRecords(data);
    } catch (err) {
      console.error("Error fetching farm records:", err);
      toast({
        title: "Error Loading Records",
        description: "Could not load farm records. Please try again.",
        variant: "destructive",
      });
      // Set mock data as fallback
      setFarmRecords(getMockFarmData());
    } finally {
      setIsLoading(false);
    }
  };

  const getMockFarmData = () => {
    return [
      {
        id: '1',
        farmName: 'Kanoni Coffee Farm',
        managerName: 'John Doe',
        supervisorName: 'Jane Smith',
        coffeeType: 'Arabica',
        farmSize: '120',
        dailyProduction: '250',
        status: 'active',
        location: 'Kanoni-Mbogo',
        created_at: '2025-01-15T10:00:00Z',
        updated_at: '2025-03-10T14:30:00Z'
      },
      {
        id: '2',
        farmName: 'Engari Coffee Plantation',
        managerName: 'Robert Johnson',
        supervisorName: 'Mary Williams',
        coffeeType: 'Robusta',
        farmSize: '85',
        dailyProduction: '180',
        status: 'inactive',
        location: 'Engari-Kaichumu',
        created_at: '2025-02-01T08:15:00Z',
        updated_at: '2025-03-05T11:20:00Z'
      },
      {
        id: '3',
        farmName: 'Kyampangara Coffee Estate',
        managerName: 'Michael Brown',
        supervisorName: 'Elizabeth Davis',
        coffeeType: 'Arabica',
        farmSize: '210',
        dailyProduction: '320',
        status: 'active',
        location: 'Kyampangara',
        created_at: '2024-12-10T09:45:00Z',
        updated_at: '2025-03-15T16:10:00Z'
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

    return records.filter(record => new Date(record.updated_at || record.created_at) >= timeAgo);
  };

  const handleSort = (key) => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleExportCSV = () => {
    exportToCSV(filteredAndSortedRecords, 'farm_records');
    toast({
      title: "Export Successful",
      description: "Farm records have been exported to CSV",
    });
  };

  const handleExportExcel = () => {
    exportToExcel(filteredAndSortedRecords, 'farm_records');
    toast({
      title: "Export Successful",
      description: "Farm records have been exported to Excel",
    });
  };

  const handleExportPDF = () => {
    exportToPDF(filteredAndSortedRecords, 'farm_records', 'Farm Records');
    toast({
      title: "Export Successful",
      description: "Farm records have been exported to PDF",
    });
  };

  const handleRefresh = () => {
    fetchFarmRecords();
    toast({
      title: "Refreshed",
      description: "Farm records data has been refreshed",
    });
  };

  const filteredAndSortedRecords = React.useMemo(() => {
    let filtered = [...farmRecords];
    
    // Apply time range filter
    filtered = getTimeFilteredRecords(filtered);
    
    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(record => record.status === statusFilter);
    }
    
    // Apply search term
    if (searchTerm) {
      filtered = filtered.filter(record => 
        record.farmName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.managerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.supervisorName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.coffeeType?.toLowerCase().includes(searchTerm.toLowerCase())
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
  }, [farmRecords, searchTerm, statusFilter, timeRange, sortConfig]);

  const getStatusBadgeStyle = (status) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800 hover:bg-green-100';
      case 'inactive':
        return 'bg-amber-100 text-amber-800 hover:bg-amber-100';
      case 'pending':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-100';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-100';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack} className="flex items-center gap-2">
          <ArrowLeft size={16} />
          Back to Farm Details
        </Button>
        <h2 className="text-2xl font-bold">
          {isKazo ? "Kazo Coffee Development Project - Farm Records" : "Farm Records"}
        </h2>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Farm Records</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" onValueChange={setStatusFilter}>
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
              <TabsList>
                <TabsTrigger value="all">All Farms</TabsTrigger>
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="inactive">Inactive</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
              </TabsList>
              
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-grow">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search farms..."
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
            
            <TabsContent value="all">
              {renderFarmTable(filteredAndSortedRecords, isLoading, handleSort, sortConfig, getStatusBadgeStyle)}
            </TabsContent>
            <TabsContent value="active">
              {renderFarmTable(filteredAndSortedRecords, isLoading, handleSort, sortConfig, getStatusBadgeStyle)}
            </TabsContent>
            <TabsContent value="inactive">
              {renderFarmTable(filteredAndSortedRecords, isLoading, handleSort, sortConfig, getStatusBadgeStyle)}
            </TabsContent>
            <TabsContent value="pending">
              {renderFarmTable(filteredAndSortedRecords, isLoading, handleSort, sortConfig, getStatusBadgeStyle)}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

// Helper function to render the farm table
const renderFarmTable = (records, isLoading, handleSort, sortConfig, getStatusBadgeStyle) => {
  if (isLoading) {
    return (
      <div className="py-10 text-center">
        <p>Loading farm records...</p>
      </div>
    );
  }
  
  if (records.length === 0) {
    return (
      <div className="py-10 text-center bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
        <p className="font-medium">No Farm Records Found</p>
        <p className="mt-2">No farm records match your search criteria.</p>
      </div>
    );
  }
  
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="cursor-pointer" onClick={() => handleSort('farmName')}>
              Farm Name
              {sortConfig.key === 'farmName' && (sortConfig.direction === 'asc' ? ' ↑' : ' ↓')}
            </TableHead>
            <TableHead className="cursor-pointer" onClick={() => handleSort('managerName')}>
              Manager
              {sortConfig.key === 'managerName' && (sortConfig.direction === 'asc' ? ' ↑' : ' ↓')}
            </TableHead>
            <TableHead className="cursor-pointer" onClick={() => handleSort('coffeeType')}>
              Coffee Type
              {sortConfig.key === 'coffeeType' && (sortConfig.direction === 'asc' ? ' ↑' : ' ↓')}
            </TableHead>
            <TableHead className="cursor-pointer" onClick={() => handleSort('farmSize')}>
              Farm Size (Acres)
              {sortConfig.key === 'farmSize' && (sortConfig.direction === 'asc' ? ' ↑' : ' ↓')}
            </TableHead>
            <TableHead className="cursor-pointer" onClick={() => handleSort('dailyProduction')}>
              Daily Production (kg)
              {sortConfig.key === 'dailyProduction' && (sortConfig.direction === 'asc' ? ' ↑' : ' ↓')}
            </TableHead>
            <TableHead className="cursor-pointer" onClick={() => handleSort('status')}>
              Status
              {sortConfig.key === 'status' && (sortConfig.direction === 'asc' ? ' ↑' : ' ↓')}
            </TableHead>
            <TableHead className="cursor-pointer" onClick={() => handleSort('updated_at')}>
              Last Updated
              {sortConfig.key === 'updated_at' && (sortConfig.direction === 'asc' ? ' ↑' : ' ↓')}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {records.map((record) => (
            <TableRow key={record.id}>
              <TableCell className="font-medium">{record.farmName}</TableCell>
              <TableCell>{record.managerName}</TableCell>
              <TableCell>{record.coffeeType}</TableCell>
              <TableCell>{record.farmSize}</TableCell>
              <TableCell>{record.dailyProduction}</TableCell>
              <TableCell>
                <Badge className={getStatusBadgeStyle(record.status)}>
                  {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                </Badge>
              </TableCell>
              <TableCell>{new Date(record.updated_at || record.created_at).toLocaleDateString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default FarmRecordsViewer;
