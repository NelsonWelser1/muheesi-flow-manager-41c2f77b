
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { 
  CalendarIcon, 
  FileText, 
  FileSpreadsheet, 
  Share2, 
  Mail, 
  MessageSquare, 
  Users, 
  Download
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/integrations/supabase/supabase';
import { 
  exportToPDF, 
  exportToExcel, 
  exportToCSV 
} from '../../utils/reportExportUtils';
import ShareReportDialog from './ShareReportDialog';

const ReportExportCard = ({ productionData = [], salesData = [] }) => {
  const [reportType, setReportType] = useState("production");
  const [dateRange, setDateRange] = useState("week");
  const [format, setFormat] = useState("pdf");
  const [date, setDate] = useState(new Date());
  const [exportData, setExportData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [shareMethod, setShareMethod] = useState("");
  const { toast } = useToast();

  const reportTypes = [
    { value: "production", label: "Production Report" },
    { value: "sales", label: "Sales Report" },
    { value: "quality", label: "Quality Report" },
    { value: "inventory", label: "Inventory Report" }
  ];

  const dateRanges = [
    { value: "day", label: "Today" },
    { value: "week", label: "This Week" },
    { value: "month", label: "This Month" },
    { value: "quarter", label: "This Quarter" },
    { value: "year", label: "This Year" },
    { value: "custom", label: "Custom Range" }
  ];

  const exportFormats = [
    { value: "pdf", label: "PDF", icon: <FileText className="h-4 w-4 mr-2" /> },
    { value: "excel", label: "Excel", icon: <FileSpreadsheet className="h-4 w-4 mr-2" /> },
    { value: "csv", label: "CSV", icon: <FileText className="h-4 w-4 mr-2" /> }
  ];

  // Fetch data from Supabase based on selected report type and date range
  useEffect(() => {
    fetchReportData();
  }, [reportType, dateRange, date]);

  const fetchReportData = async () => {
    setIsLoading(true);
    try {
      let startDate, endDate;
      const now = new Date();
      
      // Calculate date range based on selection
      switch (dateRange) {
        case "day":
          startDate = new Date(now.setHours(0, 0, 0, 0));
          endDate = new Date(now.setHours(23, 59, 59, 999));
          break;
        case "week":
          startDate = new Date(now);
          startDate.setDate(now.getDate() - now.getDay());
          startDate.setHours(0, 0, 0, 0);
          endDate = new Date(startDate);
          endDate.setDate(startDate.getDate() + 6);
          endDate.setHours(23, 59, 59, 999);
          break;
        case "month":
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
          endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
          break;
        case "quarter":
          const quarter = Math.floor(now.getMonth() / 3);
          startDate = new Date(now.getFullYear(), quarter * 3, 1);
          endDate = new Date(now.getFullYear(), quarter * 3 + 3, 0, 23, 59, 59, 999);
          break;
        case "year":
          startDate = new Date(now.getFullYear(), 0, 1);
          endDate = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);
          break;
        case "custom":
          startDate = new Date(date.setHours(0, 0, 0, 0));
          endDate = new Date(date.setHours(23, 59, 59, 999));
          break;
        default:
          startDate = new Date(now.setDate(now.getDate() - 7));
          endDate = new Date();
      }

      let data;
      // Fetch data based on report type
      switch (reportType) {
        case "production":
          const { data: productionResults, error: productionError } = await supabase
            .from('dairy_production')
            .select('*')
            .gte('created_at', startDate.toISOString())
            .lte('created_at', endDate.toISOString());
            
          if (productionError) throw productionError;
          
          // Try fallback if no results
          if (!productionResults || productionResults.length === 0) {
            const { data: fallbackProduction, error: fallbackError } = await supabase
              .from('production_line_local')
              .select('*')
              .gte('created_at', startDate.toISOString())
              .lte('created_at', endDate.toISOString());
              
            if (!fallbackError && fallbackProduction && fallbackProduction.length > 0) {
              data = fallbackProduction;
            } else {
              data = productionData; // Use provided data as last resort
            }
          } else {
            data = productionResults;
          }
          break;
          
        case "sales":
          const { data: salesResults, error: salesError } = await supabase
            .from('sales_records')
            .select('*')
            .gte('created_at', startDate.toISOString())
            .lte('created_at', endDate.toISOString());
            
          if (salesError) throw salesError;
          
          if (!salesResults || salesResults.length === 0) {
            data = salesData; // Use provided data as fallback
          } else {
            data = salesResults;
          }
          break;
          
        case "quality":
          const { data: qualityResults, error: qualityError } = await supabase
            .from('quality_checks')
            .select('*')
            .gte('created_at', startDate.toISOString())
            .lte('created_at', endDate.toISOString());
            
          if (qualityError) throw qualityError;
          
          if (!qualityResults || qualityResults.length === 0) {
            // Try milk_reception as fallback for quality data
            const { data: receptionData, error: receptionError } = await supabase
              .from('milk_reception')
              .select('*')
              .gte('created_at', startDate.toISOString())
              .lte('created_at', endDate.toISOString());
              
            if (!receptionError && receptionData && receptionData.length > 0) {
              data = receptionData;
            } else {
              data = [];
            }
          } else {
            data = qualityResults;
          }
          break;
          
        case "inventory":
          const { data: inventoryResults, error: inventoryError } = await supabase
            .from('cold_room_inventory')
            .select('*')
            .gte('created_at', startDate.toISOString())
            .lte('created_at', endDate.toISOString());
            
          if (inventoryError) throw inventoryError;
          data = inventoryResults || [];
          break;
          
        default:
          data = [];
      }

      setExportData(data || []);
    } catch (error) {
      console.error(`Error fetching ${reportType} data:`, error);
      toast({
        title: "Error Fetching Data",
        description: `Could not fetch ${reportType} data: ${error.message}`,
        variant: "destructive"
      });
      setExportData([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = () => {
    if (exportData.length === 0) {
      toast({
        title: "No Data to Export",
        description: "There is no data available for the selected criteria.",
        variant: "destructive"
      });
      return;
    }

    const reportTitle = `${getReportTypeLabel(reportType)}_${getDateRangeLabel(dateRange)}`;
    
    try {
      switch (format) {
        case "pdf":
          exportToPDF(exportData, reportTitle, reportType);
          break;
        case "excel":
          exportToExcel(exportData, reportTitle, reportType);
          break;
        case "csv":
          exportToCSV(exportData, reportTitle, reportType);
          break;
      }
      
      toast({
        title: "Report Exported",
        description: `${getReportTypeLabel(reportType)} for ${getDateRangeLabel(dateRange)} has been exported as ${format.toUpperCase()}`,
      });
      
      // Log export to Supabase
      logReportExport(reportType, dateRange, format);
      
    } catch (error) {
      console.error("Export error:", error);
      toast({
        title: "Export Failed",
        description: `Failed to export report: ${error.message}`,
        variant: "destructive"
      });
    }
  };

  const handleShareClick = (method) => {
    setShareMethod(method);
    setIsShareDialogOpen(true);
  };

  // Get display-friendly report type label
  const getReportTypeLabel = (type) => {
    const reportType = reportTypes.find(r => r.value === type);
    return reportType ? reportType.label : type;
  };

  // Get display-friendly date range label
  const getDateRangeLabel = (range) => {
    const rangeType = dateRanges.find(r => r.value === range);
    return rangeType ? rangeType.label : range;
  };

  // Log export to Supabase for analytics
  const logReportExport = async (reportType, dateRange, format) => {
    try {
      await supabase.from('report_exports').insert({
        report_type: reportType,
        date_range: dateRange,
        export_format: format,
        exported_at: new Date().toISOString()
      });
    } catch (error) {
      console.error("Failed to log export:", error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Generate Reports</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Report Type</label>
          <Select value={reportType} onValueChange={setReportType}>
            <SelectTrigger>
              <SelectValue placeholder="Select report type" />
            </SelectTrigger>
            <SelectContent>
              {reportTypes.map(type => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Time Period</label>
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger>
              <SelectValue placeholder="Select time period" />
            </SelectTrigger>
            <SelectContent>
              {dateRanges.map(range => (
                <SelectItem key={range.value} value={range.value}>
                  {range.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {dateRange === "custom" && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Custom Date</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {format(date, "PPP")}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        )}
        
        <div className="space-y-2">
          <div className="flex justify-between">
            <label className="text-sm font-medium">Export Format</label>
            {exportData.length > 0 && (
              <Badge variant="outline">
                {exportData.length} records found
              </Badge>
            )}
          </div>
          <div className="flex space-x-2">
            {exportFormats.map(f => (
              <Button 
                key={f.value}
                variant={format === f.value ? "default" : "outline"}
                className="flex-1"
                onClick={() => setFormat(f.value)}
              >
                {f.icon}
                {f.label}
              </Button>
            ))}
          </div>
        </div>
        
        <div className="flex space-x-2 pt-2">
          <Button 
            className="flex-1" 
            onClick={handleExport}
            disabled={isLoading || exportData.length === 0}
          >
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button 
            variant="outline" 
            className="flex-1"
            onClick={() => setIsShareDialogOpen(true)}
            disabled={isLoading || exportData.length === 0}
          >
            <Share2 className="h-4 w-4 mr-2" />
            Share Report
          </Button>
        </div>
        
        {isShareDialogOpen && (
          <div className="pt-2 space-y-2">
            <label className="text-sm font-medium">Share Via</label>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleShareClick('email')}
                disabled={isLoading}
              >
                <Mail className="h-4 w-4 mr-2" />
                Email
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleShareClick('whatsapp')}
                disabled={isLoading}
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                WhatsApp
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleShareClick('system')}
                disabled={isLoading}
              >
                <Users className="h-4 w-4 mr-2" />
                System Users
              </Button>
            </div>
          </div>
        )}
        
        {isLoading && (
          <div className="text-center text-sm text-muted-foreground py-2">
            Loading data...
          </div>
        )}
      </CardContent>
      
      <ShareReportDialog 
        isOpen={isShareDialogOpen} 
        onClose={() => setIsShareDialogOpen(false)}
        reportType={getReportTypeLabel(reportType)}
        dateRange={getDateRangeLabel(dateRange)}
        shareMethod={shareMethod}
        data={exportData}
      />
    </Card>
  );
};

export default ReportExportCard;
