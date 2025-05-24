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
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
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

  // Format records for export
  const formatRecordsForExport = (records) => {
    return records.map(record => ({
      'Reception Date': record.created_at ? 
        format(new Date(record.created_at), 'dd/MM/yyyy HH:mm') : 'N/A',
      'Batch ID': record.batch_id || 'N/A',
      'Supplier': record.supplier_name || 'N/A',
      'Tank': record.tank_number || 'N/A',
      'Volume (L)': record.milk_volume || 0,
      'Temperature (°C)': record.temperature || 'N/A',
      'Fat (%)': record.fat_percentage || 'N/A',
      'Protein (%)': record.protein_percentage || 'N/A',
      'Quality': record.quality_score || 'N/A',
      'Destination': record.destination || 'N/A',
      'Notes': record.notes || 'N/A'
    }));
  };

  // Generate filename with date range information
  const generateFilename = () => {
    let timeRangeText = '';
    if (timeRange === 'custom' && startDate && endDate) {
      timeRangeText = `_${format(startDate, 'yyyy-MM-dd')}_to_${format(endDate, 'yyyy-MM-dd')}`;
    } else if (timeRange !== 'all') {
      timeRangeText = `_last_${timeRange}`;
    }
    
    return `milk_reception_records${timeRangeText}_${format(new Date(), 'yyyy-MM-dd')}`;
  };

  // Export to PDF
  const exportToPDF = () => {
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
      
      const formattedRecords = formatRecordsForExport(filteredRecords);
      const filename = generateFilename();
      
      // Create PDF document
      const doc = new jsPDF({
        orientation: 'landscape', // Use landscape for better table fit
        unit: 'mm',
        format: 'a4'
      });
      
      // Add title
      doc.setFontSize(16);
      doc.text("Milk Reception Records", 14, 15);
      
      // Add date range information
      doc.setFontSize(10);
      doc.text(`Generated on: ${format(new Date(), 'PPP')}`, 14, 22);
      
      // Add time range information
      let rangeText = 'Time Range: All Time';
      if (timeRange === 'day') rangeText = 'Time Range: Today';
      else if (timeRange === 'week') rangeText = 'Time Range: Last 7 Days';
      else if (timeRange === 'month') rangeText = 'Time Range: Last 30 Days';
      else if (timeRange === 'year') rangeText = 'Time Range: Last Year';
      else if (timeRange === 'custom' && startDate && endDate) {
        rangeText = `Time Range: ${format(startDate, 'PP')} - ${format(endDate, 'PP')}`;
      }
      doc.text(rangeText, 14, 27);
      
      // Extract headers and data for table
      const headers = Object.keys(formattedRecords[0]);
      const data = formattedRecords.map(record => headers.map(header => {
        const value = record[header];
        return value !== null && value !== undefined ? String(value) : '';
      }));
      
      // Add table using autoTable
      doc.autoTable({
        head: [headers],
        body: data,
        startY: 32,
        theme: 'grid',
        styles: { 
          fontSize: 8,
          cellPadding: 2,
          overflow: 'linebreak'
        },
        headStyles: { 
          fillColor: [41, 128, 185],
          textColor: [255, 255, 255],
          fontStyle: 'bold'
        },
        columnStyles: {
          0: { cellWidth: 25 }, // Reception Date
          1: { cellWidth: 20 }, // Batch ID
          2: { cellWidth: 25 }, // Supplier
          3: { cellWidth: 15 }, // Tank
          4: { cellWidth: 15 }, // Volume
          5: { cellWidth: 15 }, // Temperature
          6: { cellWidth: 12 }, // Fat
          7: { cellWidth: 12 }, // Protein
          8: { cellWidth: 15 }, // Quality
          9: { cellWidth: 20 }, // Destination
          10: { cellWidth: 'auto' } // Notes
        }
      });
      
      // Save PDF
      doc.save(`${filename}.pdf`);
      
      toast({
        title: "Export successful",
        description: `Records exported to PDF successfully.`,
      });
      
    } catch (error) {
      console.error('PDF export error:', error);
      toast({
        title: "Export failed",
        description: `Could not export to PDF: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  // Export to Excel
  const exportToExcel = () => {
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
      
      const formattedRecords = formatRecordsForExport(filteredRecords);
      const filename = generateFilename();
      
      // Create worksheet
      const worksheet = XLSX.utils.json_to_sheet(formattedRecords);
      
      // Create workbook and add the worksheet
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Milk Reception");
      
      // Generate Excel file
      XLSX.writeFile(workbook, `${filename}.xlsx`);
      
      toast({
        title: "Export successful",
        description: `Records exported to Excel successfully.`,
      });
      
    } catch (error) {
      console.error('Excel export error:', error);
      toast({
        title: "Export failed",
        description: `Could not export to Excel: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  // Export to CSV
  const exportToCSV = () => {
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
      
      const formattedRecords = formatRecordsForExport(filteredRecords);
      const filename = generateFilename();
      
      // Create worksheet
      const worksheet = XLSX.utils.json_to_sheet(formattedRecords);
      
      // Convert to CSV
      const csv = XLSX.utils.sheet_to_csv(worksheet);
      
      // Create blob and trigger download
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `${filename}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Export successful",
        description: `Records exported to CSV successfully.`,
      });
      
    } catch (error) {
      console.error('CSV export error:', error);
      toast({
        title: "Export failed",
        description: `Could not export to CSV: ${error.message}`,
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
          onClick={exportToPDF}
          className="flex items-center gap-2"
        >
          <FileText className="h-4 w-4" />
          PDF
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          onClick={exportToExcel}
          className="flex items-center gap-2"
        >
          <FileSpreadsheet className="h-4 w-4" />
          Excel
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          onClick={exportToCSV}
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
