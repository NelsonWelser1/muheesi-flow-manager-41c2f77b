
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { 
  ArrowLeft, 
  Search, 
  RefreshCw, 
  Calendar 
} from "lucide-react";

// Import export components
import CSVExportButton from "../dairy/logistics/records/components/export-buttons/CSVExportButton";
import ExcelExportButton from "../dairy/logistics/records/components/export-buttons/ExcelExportButton";
import PDFExportButton from "../dairy/logistics/records/components/export-buttons/PDFExportButton";

// Fetch functions would normally connect to real data
import { supabase } from '@/integrations/supabase/supabase';
import { 
  exportToCSV, 
  exportToExcel, 
  exportToPDF 
} from '@/utils/coffee/coffeeExport';

const MOCK_REPORTS = [
  {
    id: '1',
    title: 'Monthly Coffee Production Summary',
    report_type: 'Monthly Analysis',
    created_at: '2023-11-15T10:30:00Z',
    recipient_name: 'John Doe',
    status: 'sent',
    content: 'Detailed analysis of coffee production for October 2023. Total production increased by 15% compared to previous month.',
    location: 'Kazo Town Council'
  },
  {
    id: '2',
    title: 'Weekly Inventory Stock Report',
    report_type: 'Weekly Inventory Report',
    created_at: '2023-11-10T14:20:00Z',
    recipient_name: 'Jane Smith',
    status: 'draft',
    content: 'Current inventory levels across all Kazo locations. Robusta stock is running low in Burunga location.',
    location: 'Burunga'
  },
  {
    id: '3',
    title: 'Quality Control Assessment',
    report_type: 'Quality Control Report',
    created_at: '2023-11-05T09:15:00Z',
    recipient_name: 'Robert Johnson',
    status: 'sent',
    content: 'Quality assessment of recent coffee batches. Arabica samples from Migina showed excellent cupping scores.',
    location: 'Migina'
  },
  {
    id: '4',
    title: 'Stock Movement Analysis',
    report_type: 'Stock Movement Report',
    created_at: '2023-10-28T16:45:00Z',
    recipient_name: 'Sarah Williams',
    status: 'sent',
    content: 'Analysis of coffee stock movements between different Kazo locations. Transfer efficiency has improved by 10%.',
    location: 'Kazo Town Council'
  },
  {
    id: '5',
    title: 'Daily Production Summary',
    report_type: 'Daily Stock Summary',
    created_at: '2023-11-14T17:30:00Z',
    recipient_name: 'Michael Brown',
    status: 'draft',
    content: 'Summary of daily production across all processing units in Kazo region. Rwemikoma unit exceeded daily targets.',
    location: 'Rwemikoma'
  }
];

const KazoReportsViewer = ({ onBack }) => {
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [timeRange, setTimeRange] = useState('all');
  const [sortConfig, setSortConfig] = useState({ key: 'created_at', direction: 'desc' });
  const { toast } = useToast();

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    setIsLoading(true);
    try {
      // Try to fetch from maintenance_reports table first
      let { data: reportData, error } = await supabase
        .from('maintenance_reports')
        .select('*')
        .order('created_at', { ascending: false });

      // If no data is found or there's an error, try report_configurations
      if (error || !reportData || reportData.length === 0) {
        const { data: configData, error: configError } = await supabase
          .from('report_configurations')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (!configError && configData && configData.length > 0) {
          reportData = configData.map(config => ({
            id: config.id,
            title: `${config.report_type} (${new Date(config.start_date).toLocaleDateString()} - ${new Date(config.end_date).toLocaleDateString()})`,
            report_type: config.report_type,
            created_at: config.created_at,
            status: 'generated',
            content: `Report covering period from ${new Date(config.start_date).toLocaleDateString()} to ${new Date(config.end_date).toLocaleDateString()}.`,
            location: 'Kazo Project',
            recipient_name: 'System Generated'
          }));
        } else {
          // Fallback to mock data if no data is found in either table
          console.log("Using mock reports data");
          reportData = MOCK_REPORTS;
        }
      }
      
      setReports(reportData);
    } catch (err) {
      console.error("Error fetching reports:", err);
      setReports(MOCK_REPORTS); // Fallback to mock data
      toast({
        title: "Error Loading Reports",
        description: "Could not load report data. Using sample data instead.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportCSV = () => {
    try {
      const filteredData = getFilteredReports();
      exportToCSV(filteredData, 'kazo_coffee_reports');
      toast({
        title: "Export Successful",
        description: "Reports exported to CSV successfully"
      });
    } catch (error) {
      console.error("CSV export error:", error);
      toast({
        title: "Export Failed",
        description: "Failed to export reports to CSV",
        variant: "destructive"
      });
    }
  };

  const handleExportExcel = () => {
    try {
      const filteredData = getFilteredReports();
      exportToExcel(filteredData, 'kazo_coffee_reports');
      toast({
        title: "Export Successful",
        description: "Reports exported to Excel successfully"
      });
    } catch (error) {
      console.error("Excel export error:", error);
      toast({
        title: "Export Failed",
        description: "Failed to export reports to Excel",
        variant: "destructive"
      });
    }
  };

  const handleExportPDF = () => {
    try {
      const filteredData = getFilteredReports();
      exportToPDF(filteredData, 'kazo_coffee_reports', 'Kazo Coffee Development Project Reports');
      toast({
        title: "Export Successful",
        description: "Reports exported to PDF successfully"
      });
    } catch (error) {
      console.error("PDF export error:", error);
      toast({
        title: "Export Failed",
        description: "Failed to export reports to PDF",
        variant: "destructive"
      });
    }
  };

  const handleRefresh = () => {
    fetchReports();
    toast({
      title: "Data Refreshed",
      description: "Report data has been refreshed"
    });
  };

  const handleSort = (key) => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const filterByTimeRange = (data) => {
    if (timeRange === 'all') return data;
    
    const now = new Date();
    let cutoff = new Date();
    
    switch (timeRange) {
      case 'hour':
        cutoff.setHours(now.getHours() - 1);
        break;
      case 'today':
        cutoff.setHours(0, 0, 0, 0);
        break;
      case 'week':
        cutoff.setDate(now.getDate() - 7);
        break;
      case 'month':
        cutoff.setMonth(now.getMonth() - 1);
        break;
      case 'year':
        cutoff.setFullYear(now.getFullYear() - 1);
        break;
      default:
        return data;
    }
    
    return data.filter(report => new Date(report.created_at) >= cutoff);
  };

  const getFilteredReports = () => {
    let filtered = [...reports];
    
    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(report => 
        report.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.recipient_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.report_type?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(report => report.status === statusFilter);
    }
    
    // Filter by time range
    filtered = filterByTimeRange(filtered);
    
    // Sort reports
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
  };

  const getStatusBadgeStyle = (status) => {
    switch (status?.toLowerCase()) {
      case 'sent':
        return 'bg-green-100 text-green-800 hover:bg-green-100';
      case 'draft':
        return 'bg-amber-100 text-amber-800 hover:bg-amber-100';
      case 'generated':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-100';
      case 'scheduled':
        return 'bg-purple-100 text-purple-800 hover:bg-purple-100';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-100';
    }
  };

  const filteredReports = getFilteredReports();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack} className="flex items-center gap-2">
          <ArrowLeft size={16} />
          Back
        </Button>
        <h2 className="text-2xl font-bold">Kazo Coffee Development Project Reports</h2>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Report Records</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="w-full" onValueChange={setStatusFilter}>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="sent">Sent</TabsTrigger>
                <TabsTrigger value="draft">Draft</TabsTrigger>
                <TabsTrigger value="generated">Generated</TabsTrigger>
                <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
              </TabsList>
              
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" onClick={handleRefresh} className="flex items-center gap-1">
                  <RefreshCw className="h-4 w-4" />
                  Refresh
                </Button>
                <CSVExportButton onClick={handleExportCSV} />
                <ExcelExportButton onClick={handleExportExcel} />
                <PDFExportButton onClick={handleExportPDF} />
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-grow">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search reports..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select onValueChange={setTimeRange} defaultValue="all">
                <SelectTrigger className="w-[180px]">
                  <Calendar className="mr-2 h-4 w-4" />
                  <span>Time Range</span>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="hour">Last Hour</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">Past Week</SelectItem>
                  <SelectItem value="month">Past Month</SelectItem>
                  <SelectItem value="year">Past Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <TabsContent value="all" className="mt-0">
              {renderReportsTable(filteredReports, isLoading)}
            </TabsContent>
            <TabsContent value="sent" className="mt-0">
              {renderReportsTable(filteredReports, isLoading)}
            </TabsContent>
            <TabsContent value="draft" className="mt-0">
              {renderReportsTable(filteredReports, isLoading)}
            </TabsContent>
            <TabsContent value="generated" className="mt-0">
              {renderReportsTable(filteredReports, isLoading)}
            </TabsContent>
            <TabsContent value="scheduled" className="mt-0">
              {renderReportsTable(filteredReports, isLoading)}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );

  function renderReportsTable(reports, isLoading) {
    if (isLoading) {
      return (
        <div className="py-10 text-center">
          <p>Loading reports...</p>
        </div>
      );
    }
    
    if (reports.length === 0) {
      return (
        <div className="py-10 text-center bg-gray-50 border border-gray-200 rounded-md">
          <p className="text-gray-500">No reports found matching your criteria.</p>
          <Button 
            variant="outline" 
            className="mt-2"
            onClick={() => {
              setSearchTerm('');
              setStatusFilter('all');
              setTimeRange('all');
            }}
          >
            Clear Filters
          </Button>
        </div>
      );
    }
    
    return (
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="cursor-pointer w-1/4" onClick={() => handleSort('title')}>
                Report Title
                {sortConfig.key === 'title' && (sortConfig.direction === 'asc' ? ' ↑' : ' ↓')}
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort('report_type')}>
                Type
                {sortConfig.key === 'report_type' && (sortConfig.direction === 'asc' ? ' ↑' : ' ↓')}
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort('recipient_name')}>
                Recipient
                {sortConfig.key === 'recipient_name' && (sortConfig.direction === 'asc' ? ' ↑' : ' ↓')}
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort('created_at')}>
                Date Created
                {sortConfig.key === 'created_at' && (sortConfig.direction === 'asc' ? ' ↑' : ' ↓')}
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort('status')}>
                Status
                {sortConfig.key === 'status' && (sortConfig.direction === 'asc' ? ' ↑' : ' ↓')}
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort('location')}>
                Location
                {sortConfig.key === 'location' && (sortConfig.direction === 'asc' ? ' ↑' : ' ↓')}
              </TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reports.map((report) => (
              <TableRow key={report.id}>
                <TableCell className="font-medium">{report.title}</TableCell>
                <TableCell>{report.report_type}</TableCell>
                <TableCell>{report.recipient_name}</TableCell>
                <TableCell>{new Date(report.created_at).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Badge className={getStatusBadgeStyle(report.status)}>
                    {report.status ? (report.status.charAt(0).toUpperCase() + report.status.slice(1)) : 'Unknown'}
                  </Badge>
                </TableCell>
                <TableCell>{report.location}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">View</Button>
                    <Button variant="outline" size="sm">Export</Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }
};

export default KazoReportsViewer;
