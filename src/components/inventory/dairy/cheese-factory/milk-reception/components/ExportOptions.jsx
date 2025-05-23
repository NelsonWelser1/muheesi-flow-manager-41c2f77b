
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Calendar, Download, FileSpreadsheet, FileText, Filter } from "lucide-react";
import { format } from 'date-fns';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { exportToPDF, exportToExcel, exportToCSV } from '@/components/inventory/dairy/utils/reportExportUtils';
import { useToast } from "@/components/ui/use-toast";

const ExportOptions = ({ records }) => {
  const { toast } = useToast();
  const [timeRange, setTimeRange] = useState('all');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Filter records based on selected time range
  const getFilteredRecords = () => {
    if (!records || records.length === 0) return [];
    
    let filteredData = [...records];
    const now = new Date();
    let startDateTime = new Date();
    
    switch (timeRange) {
      case 'day':
        startDateTime.setHours(0, 0, 0, 0);
        filteredData = filteredData.filter(record => 
          new Date(record.created_at) >= startDateTime);
        break;
      case 'week':
        startDateTime.setDate(now.getDate() - 7);
        filteredData = filteredData.filter(record => 
          new Date(record.created_at) >= startDateTime);
        break;
      case 'month':
        startDateTime.setMonth(now.getMonth() - 1);
        filteredData = filteredData.filter(record => 
          new Date(record.created_at) >= startDateTime);
        break;
      case 'year':
        startDateTime.setFullYear(now.getFullYear() - 1);
        filteredData = filteredData.filter(record => 
          new Date(record.created_at) >= startDateTime);
        break;
      case 'custom':
        if (startDate && endDate) {
          const endDateTime = new Date(endDate);
          endDateTime.setHours(23, 59, 59, 999);
          
          filteredData = filteredData.filter(record => {
            const recordDate = new Date(record.created_at);
            return recordDate >= startDate && recordDate <= endDateTime;
          });
        }
        break;
      default:
        // 'all' - no filtering needed
        break;
    }
    
    return filteredData;
  };

  const handleExport = (format) => {
    try {
      const filteredRecords = getFilteredRecords();
      
      if (filteredRecords.length === 0) {
        toast({
          title: "No data to export",
          description: "There are no records available for the selected time range.",
          variant: "destructive",
        });
        return;
      }
      
      // Format records for export
      const formattedRecords = filteredRecords.map(record => ({
        'Batch ID': record.batch_id || 'N/A',
        'Supplier': record.supplier_name || 'N/A',
        'Tank': record.tank_number || 'N/A',
        'Volume (L)': record.volume_offloaded ? 
          `-${Math.abs(record.volume_offloaded)}` : 
          record.milk_volume || 'N/A',
        'Temperature (°C)': record.temperature || 'N/A',
        'Fat (%)': record.fat_percentage || 'N/A',
        'Protein (%)': record.protein_percentage || 'N/A',
        'Quality': record.quality_score || 'N/A',
        'Date & Time': record.created_at ? 
          format(new Date(record.created_at), 'dd/MM/yyyy HH:mm') : 'N/A',
        'Type': record.volume_offloaded ? 'Offload' : 'Reception'
      }));
      
      // Generate filename with date range information
      let timeRangeText = '';
      if (timeRange === 'custom' && startDate && endDate) {
        timeRangeText = `_${format(startDate, 'yyyy-MM-dd')}_to_${format(endDate, 'yyyy-MM-dd')}`;
      } else if (timeRange !== 'all') {
        timeRangeText = `_last_${timeRange}`;
      }
      
      const filename = `milk_reception_records${timeRangeText}`;
      
      // Export based on selected format
      switch (format) {
        case 'pdf':
          exportToPDF(formattedRecords, filename, 'inventory');
          break;
        case 'excel':
          exportToExcel(formattedRecords, filename, 'inventory');
          break;
        case 'csv':
          exportToCSV(formattedRecords, filename, 'inventory');
          break;
        default:
          throw new Error(`Unsupported format: ${format}`);
      }
      
      toast({
        title: "Export successful",
        description: `Records exported to ${format.toUpperCase()} successfully.`,
      });
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: "Export failed",
        description: `Could not export data: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="flex items-center gap-2">
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[140px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Time Range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Time</SelectItem>
            <SelectItem value="day">Today</SelectItem>
            <SelectItem value="week">This Week</SelectItem>
            <SelectItem value="month">This Month</SelectItem>
            <SelectItem value="year">This Year</SelectItem>
            <SelectItem value="custom">Custom Range</SelectItem>
          </SelectContent>
        </Select>
        
        {timeRange === 'custom' && (
          <Popover open={showDatePicker} onOpenChange={setShowDatePicker}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="ml-2 flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {startDate && endDate ? (
                  `${format(startDate, 'MMM d')} - ${format(endDate, 'MMM d')}`
                ) : (
                  "Select dates"
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <div className="p-3 space-y-3">
                <h4 className="font-medium">Start Date</h4>
                <CalendarComponent
                  mode="single"
                  selected={startDate}
                  onSelect={(date) => {
                    setStartDate(date);
                    // Set end date to same as start date if not set or if before start date
                    if (!endDate || (date && endDate < date)) {
                      setEndDate(date);
                    }
                  }}
                  initialFocus
                />
                <h4 className="font-medium">End Date</h4>
                <CalendarComponent
                  mode="single"
                  selected={endDate}
                  onSelect={setEndDate}
                  disabled={(date) => startDate && date < startDate}
                  initialFocus
                />
                <div className="flex justify-end">
                  <Button onClick={() => setShowDatePicker(false)}>Apply</Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        )}
      </div>
      
      <div className="flex items-center gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => handleExport('pdf')}
          className="flex items-center gap-2"
        >
          <FileText className="h-4 w-4" />
          PDF
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => handleExport('excel')}
          className="flex items-center gap-2"
        >
          <FileSpreadsheet className="h-4 w-4" />
          Excel
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => handleExport('csv')}
          className="flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
          CSV
        </Button>
      </div>
    </div>
  );
};

export default ExportOptions;
