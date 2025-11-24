import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Download, FileText, FileSpreadsheet, File } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { format } from 'date-fns';
import DateRangeFilter from './DateRangeFilter';

const KakyingaExportActions = ({ 
  data, 
  recordType, 
  defaultFileName,
  showDateFilter = true,
  processDataFn,
  exportPdfFn,
  exportExcelFn,
  exportCsvFn
}) => {
  const { toast } = useToast();
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isExporting, setIsExporting] = useState(false);

  const handleDateChange = (start, end) => {
    setStartDate(start);
    setEndDate(end);
  };

  const handleClearDates = () => {
    setStartDate('');
    setEndDate('');
  };

  const getFilteredData = () => {
    if (!startDate && !endDate) return data;

    return data.filter(item => {
      const itemDate = new Date(item.harvest_date || item.sale_date || item.request_date || item.hire_date);
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;

      if (start && end) {
        return itemDate >= start && itemDate <= end;
      } else if (start) {
        return itemDate >= start;
      } else if (end) {
        return itemDate <= end;
      }
      return true;
    });
  };

  const handleExport = async (format) => {
    try {
      setIsExporting(true);

      const filteredData = getFilteredData();

      if (!filteredData || filteredData.length === 0) {
        toast({
          title: "No data to export",
          description: "There are no records to export with the current filters.",
          variant: "destructive"
        });
        return;
      }

      const processedData = processDataFn(filteredData);
      
      // Generate date range string for filename
      let dateRangeStr = '';
      if (startDate && endDate) {
        dateRangeStr = `_${format(new Date(startDate), 'yyyy-MM-dd')}_to_${format(new Date(endDate), 'yyyy-MM-dd')}`;
      } else if (startDate) {
        dateRangeStr = `_from_${format(new Date(startDate), 'yyyy-MM-dd')}`;
      } else if (endDate) {
        dateRangeStr = `_until_${format(new Date(endDate), 'yyyy-MM-dd')}`;
      }

      const timestamp = format(new Date(), 'yyyyMMdd_HHmmss');
      const filename = `${defaultFileName}${dateRangeStr}_${timestamp}`;

      // Generate date range display for PDF
      let dateRangeDisplay = null;
      if (startDate && endDate) {
        dateRangeDisplay = `${format(new Date(startDate), 'MMM dd, yyyy')} to ${format(new Date(endDate), 'MMM dd, yyyy')}`;
      } else if (startDate) {
        dateRangeDisplay = `From ${format(new Date(startDate), 'MMM dd, yyyy')}`;
      } else if (endDate) {
        dateRangeDisplay = `Until ${format(new Date(endDate), 'MMM dd, yyyy')}`;
      }

      switch (format) {
        case 'pdf':
          await exportPdfFn(processedData, filename, dateRangeDisplay);
          break;
        case 'excel':
          await exportExcelFn(processedData, filename);
          break;
        case 'csv':
          await exportCsvFn(processedData, filename);
          break;
      }

      toast({
        title: "Export successful",
        description: `${recordType} exported as ${format.toUpperCase()} (${filteredData.length} records)`
      });

    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: "Export failed",
        description: error.message || "Failed to export data",
        variant: "destructive"
      });
    } finally {
      setIsExporting(false);
    }
  };

  const filteredCount = getFilteredData().length;

  return (
    <div className="flex flex-col gap-3">
      {showDateFilter && (
        <DateRangeFilter
          startDate={startDate}
          endDate={endDate}
          onDateChange={handleDateChange}
          onClear={handleClearDates}
        />
      )}
      
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">
          {filteredCount} record{filteredCount !== 1 ? 's' : ''}
        </span>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="outline" 
              className="gap-2"
              disabled={isExporting || filteredCount === 0}
            >
              <Download className="h-4 w-4" />
              {isExporting ? 'Exporting...' : 'Export'}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleExport('pdf')} className="gap-2">
              <FileText className="h-4 w-4" />
              Export as PDF
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleExport('excel')} className="gap-2">
              <FileSpreadsheet className="h-4 w-4" />
              Export as Excel
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleExport('csv')} className="gap-2">
              <File className="h-4 w-4" />
              Export as CSV
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default KakyingaExportActions;
