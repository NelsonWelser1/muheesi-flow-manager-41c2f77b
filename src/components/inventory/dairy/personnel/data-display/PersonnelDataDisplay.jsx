
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePersonnelData } from './hooks/usePersonnelData';
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { 
  ArrowUpDown, 
  FileText, 
  FileSpreadsheet, 
  Download, 
  RefreshCcw, 
  Filter
} from "lucide-react";
import SearchToolbar from './components/SearchToolbar';
import DataTable from './components/DataTable';
import { format } from 'date-fns';

const PersonnelDataDisplay = ({ tableName, title }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [timeRange, setTimeRange] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date-desc');
  const { toast } = useToast();
  
  const { data, isLoading, refetch } = usePersonnelData(tableName, searchTerm, timeRange);

  // Filter data based on status
  const filteredData = data?.filter(record => {
    if (statusFilter === 'all') return true;
    if (statusFilter === 'active') return record.status === 'active';
    if (statusFilter === 'inactive') return record.status === 'inactive';
    if (statusFilter === 'pending') return record.status === 'pending';
    return true;
  });

  // Sort data based on sortBy value
  const sortedData = [...(filteredData || [])].sort((a, b) => {
    switch (sortBy) {
      case 'name-asc':
        return a.employee_id.localeCompare(b.employee_id);
      case 'name-desc':
        return b.employee_id.localeCompare(a.employee_id);
      case 'date-asc':
        return new Date(a.created_at) - new Date(b.created_at);
      case 'date-desc':
      default:
        return new Date(b.created_at) - new Date(a.created_at);
    }
  });

  const handleRefresh = () => {
    refetch();
    toast({
      title: "Refreshed",
      description: "Employee records have been refreshed",
    });
  };

  const handleExport = (format) => {
    if (!filteredData?.length) {
      toast({
        title: "Error",
        description: "No data to export",
        variant: "destructive",
      });
      return;
    }

    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = `employee-records-${timestamp}`;
      
      if (format === 'csv') {
        const headers = Object.keys(filteredData[0]).join(',');
        const rows = filteredData.map(row => 
          Object.values(row).map(val => 
            typeof val === 'string' ? `"${val.replace(/"/g, '""')}"` : val
          ).join(',')
        ).join('\n');
        const csv = `${headers}\n${rows}`;
        
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `${filename}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else if (format === 'excel') {
        toast({
          title: "Excel Export",
          description: "Excel export functionality is in development",
        });
      } else if (format === 'pdf') {
        toast({
          title: "PDF Export",
          description: "PDF export functionality is in development",
        });
      }
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: "Export Failed",
        description: "Failed to export employee records",
        variant: "destructive",
      });
    }
  };

  const handleSortChange = () => {
    const sortOptions = ['date-desc', 'date-asc', 'name-asc', 'name-desc'];
    const currentIndex = sortOptions.indexOf(sortBy);
    const nextIndex = (currentIndex + 1) % sortOptions.length;
    setSortBy(sortOptions[nextIndex]);
  };

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>{title} Records</span>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleSortChange}
              title={`Current sort: ${sortBy}`}
            >
              <ArrowUpDown className="h-4 w-4 mr-1" />
              Sort
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              title="Refresh records"
            >
              <RefreshCcw className="h-4 w-4" />
            </Button>
          </div>
        </CardTitle>
        <SearchToolbar 
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          timeRange={timeRange}
          setTimeRange={setTimeRange}
        />
        <div className="flex justify-end mt-4 space-x-2">
          <Button variant="outline" size="sm" onClick={() => handleExport('pdf')}>
            <FileText className="h-4 w-4 mr-1" />
            PDF
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleExport('excel')}>
            <FileSpreadsheet className="h-4 w-4 mr-1" />
            Excel
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleExport('csv')}>
            <Download className="h-4 w-4 mr-1" />
            CSV
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" onValueChange={setStatusFilter}>
          <TabsList className="grid grid-cols-4 mb-4 w-full">
            <TabsTrigger value="all">All Records</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="inactive">Inactive</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all">
            <DataTable data={sortedData} isLoading={isLoading} />
          </TabsContent>
          <TabsContent value="active">
            <DataTable data={sortedData} isLoading={isLoading} />
          </TabsContent>
          <TabsContent value="pending">
            <DataTable data={sortedData} isLoading={isLoading} />
          </TabsContent>
          <TabsContent value="inactive">
            <DataTable data={sortedData} isLoading={isLoading} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default PersonnelDataDisplay;
