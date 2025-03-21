
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, FileSpreadsheet, FileText, Share2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { showReportExportedToast, showReportSharedToast } from "@/components/ui/notifications";

const ReportExportCard = ({ productionData, salesData }) => {
  const [reportType, setReportType] = useState("production");
  const [dateRange, setDateRange] = useState("week");
  const [format, setFormat] = useState("pdf");
  const [date, setDate] = useState(new Date());
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

  const handleExport = () => {
    // Simulate export process
    setTimeout(() => {
      showReportExportedToast(toast, format);
    }, 1000);
  };

  const handleShare = () => {
    // Simulate share process
    setTimeout(() => {
      showReportSharedToast(toast, 3);
    }, 1000);
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
          <label className="text-sm font-medium">Export Format</label>
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
          >
            <FileText className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button 
            variant="outline" 
            className="flex-1"
            onClick={handleShare}
          >
            <Share2 className="h-4 w-4 mr-2" />
            Share Report
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReportExportCard;
