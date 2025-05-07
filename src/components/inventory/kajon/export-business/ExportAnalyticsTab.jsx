
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { 
  BarChart3, 
  Globe, 
  DollarSign, 
  TrendingUp, 
  ArrowRight,
  Download,
  FileText,
  FileSpreadsheet
} from "lucide-react";
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { format } from 'date-fns';

const ExportAnalyticsTab = () => {
  const [activeTab, setActiveTab] = useState('price-trends');
  const [timeframe, setTimeframe] = useState('quarterly');
  const [exportLoading, setExportLoading] = useState(false);
  const { toast } = useToast();
  
  // Mock data for demonstration purposes
  const tabs = [
    {
      id: 'price-trends',
      name: 'Price Trends',
      icon: <BarChart3 className="h-4 w-4" />,
      data: [
        { period: 'Q1 2023', arabica: 4.25, robusta: 2.15 },
        { period: 'Q2 2023', arabica: 4.52, robusta: 2.35 },
        { period: 'Q3 2023', arabica: 4.87, robusta: 2.42 },
        { period: 'Q4 2023', arabica: 5.12, robusta: 2.58 },
        { period: 'Q1 2024', arabica: 5.45, robusta: 2.72 }
      ]
    },
    {
      id: 'market-distribution',
      name: 'Market Distribution',
      icon: <Globe className="h-4 w-4" />,
      data: [
        { region: 'North America', percentage: 28, volume: '3,500 MT' },
        { region: 'Europe', percentage: 35, volume: '4,200 MT' },
        { region: 'Asia', percentage: 22, volume: '2,700 MT' },
        { region: 'Middle East', percentage: 8, volume: '950 MT' },
        { region: 'Africa', percentage: 7, volume: '850 MT' }
      ]
    },
    {
      id: 'revenue-analysis',
      name: 'Revenue Analysis',
      icon: <DollarSign className="h-4 w-4" />,
      data: [
        { month: 'Jan 2024', domestic: 125000, export: 345000 },
        { month: 'Feb 2024', domestic: 132000, export: 362000 },
        { month: 'Mar 2024', domestic: 141000, export: 388000 },
        { month: 'Apr 2024', domestic: 138000, export: 405000 },
        { month: 'May 2024', domestic: 146000, export: 423000 }
      ]
    },
    {
      id: 'growth-projections',
      name: 'Growth Projections',
      icon: <TrendingUp className="h-4 w-4" />,
      data: [
        { year: '2024', projected: 12, actual: 14 },
        { year: '2025', projected: 15, actual: null },
        { year: '2026', projected: 18, actual: null },
        { year: '2027', projected: 22, actual: null },
        { year: '2028', projected: 26, actual: null }
      ]
    }
  ];
  
  // Get the active tab data
  const activeTabData = tabs.find(tab => tab.id === activeTab)?.data || [];
  
  // Function to format data for export
  const formatDataForExport = (data) => {
    switch (activeTab) {
      case 'price-trends':
        return data.map(item => ({
          'Period': item.period,
          'Arabica (USD/kg)': item.arabica,
          'Robusta (USD/kg)': item.robusta
        }));
      case 'market-distribution':
        return data.map(item => ({
          'Region': item.region,
          'Percentage (%)': item.percentage,
          'Volume': item.volume
        }));
      case 'revenue-analysis':
        return data.map(item => ({
          'Month': item.month,
          'Domestic Revenue (USD)': item.domestic,
          'Export Revenue (USD)': item.export,
          'Total Revenue (USD)': item.domestic + item.export
        }));
      case 'growth-projections':
        return data.map(item => ({
          'Year': item.year,
          'Projected Growth (%)': item.projected,
          'Actual Growth (%)': item.actual || 'Not available'
        }));
      default:
        return data;
    }
  };
  
  // Export functions
  const handleExportToExcel = () => {
    try {
      setExportLoading(true);
      const formattedData = formatDataForExport(activeTabData);
      const tabName = tabs.find(tab => tab.id === activeTab)?.name || 'Export';
      
      const worksheet = XLSX.utils.json_to_sheet(formattedData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Data");
      
      // Generate filename with date
      const fileName = `${tabName.replace(/\s+/g, '_')}_${format(new Date(), 'yyyy-MM-dd')}.xlsx`;
      XLSX.writeFile(workbook, fileName);
      
      toast({
        title: "Export Successful",
        description: `Data exported to Excel as ${fileName}`,
        className: "bg-green-50 border-green-200 text-green-800",
      });
    } catch (error) {
      console.error("Export error:", error);
      toast({
        title: "Export Failed",
        description: "There was an error exporting to Excel. Please try again.",
        variant: "destructive",
      });
    } finally {
      setExportLoading(false);
    }
  };
  
  const handleExportToCSV = () => {
    try {
      setExportLoading(true);
      const formattedData = formatDataForExport(activeTabData);
      const tabName = tabs.find(tab => tab.id === activeTab)?.name || 'Export';
      
      // Convert JSON to CSV
      const headers = Object.keys(formattedData[0]).join(',');
      const rows = formattedData.map(item => 
        Object.values(item)
          .map(val => typeof val === 'string' ? `"${val}"` : val)
          .join(',')
      ).join('\n');
      const csv = `${headers}\n${rows}`;
      
      // Create download link
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      const fileName = `${tabName.replace(/\s+/g, '_')}_${format(new Date(), 'yyyy-MM-dd')}.csv`;
      
      link.setAttribute('href', url);
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Export Successful",
        description: `Data exported to CSV as ${fileName}`,
        className: "bg-green-50 border-green-200 text-green-800",
      });
    } catch (error) {
      console.error("Export error:", error);
      toast({
        title: "Export Failed",
        description: "There was an error exporting to CSV. Please try again.",
        variant: "destructive",
      });
    } finally {
      setExportLoading(false);
    }
  };
  
  const handleExportToPDF = () => {
    try {
      setExportLoading(true);
      const formattedData = formatDataForExport(activeTabData);
      const tabName = tabs.find(tab => tab.id === activeTab)?.name || 'Export';
      
      // Create PDF
      const doc = new jsPDF();
      
      // Add title and date
      doc.setFontSize(16);
      doc.text(`Coffee Exports - ${tabName}`, 14, 20);
      doc.setFontSize(10);
      doc.text(`Generated on: ${format(new Date(), 'MMMM dd, yyyy')}`, 14, 30);
      
      // Create table from data
      const headers = Object.keys(formattedData[0]);
      const rows = formattedData.map(item => Object.values(item));
      
      doc.autoTable({
        head: [headers],
        body: rows,
        startY: 40,
        theme: 'striped',
        styles: { fontSize: 8, cellPadding: 2 },
        headStyles: { fillColor: [76, 126, 93], textColor: 255 }
      });
      
      // Save PDF
      const fileName = `${tabName.replace(/\s+/g, '_')}_${format(new Date(), 'yyyy-MM-dd')}.pdf`;
      doc.save(fileName);
      
      toast({
        title: "Export Successful",
        description: `Data exported to PDF as ${fileName}`,
        className: "bg-green-50 border-green-200 text-green-800",
      });
    } catch (error) {
      console.error("Export error:", error);
      toast({
        title: "Export Failed",
        description: "There was an error exporting to PDF. Please try again.",
        variant: "destructive",
      });
    } finally {
      setExportLoading(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold">Export Analytics</h2>
          <p className="text-muted-foreground">View and analyze coffee export performance metrics</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="quarterly">Quarterly</SelectItem>
              <SelectItem value="yearly">Yearly</SelectItem>
              <SelectItem value="custom">Custom Range</SelectItem>
            </SelectContent>
          </Select>
          
          <div className="flex flex-row space-x-2">
            <Button variant="outline" size="sm" disabled={exportLoading}>
              <Download className="h-4 w-4 mr-2" />
              Export Data
            </Button>
            <div className="flex flex-row space-x-1">
              <Button variant="outline" size="sm" onClick={handleExportToPDF} disabled={exportLoading}>
                <FileText className="h-4 w-4" />
                <span className="sr-only">Export to PDF</span>
              </Button>
              <Button variant="outline" size="sm" onClick={handleExportToExcel} disabled={exportLoading}>
                <FileSpreadsheet className="h-4 w-4" />
                <span className="sr-only">Export to Excel</span>
              </Button>
              <Button variant="outline" size="sm" onClick={handleExportToCSV} disabled={exportLoading}>
                <FileText className="h-4 w-4" />
                <span className="sr-only">Export to CSV</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          {tabs.map(tab => (
            <TabsTrigger key={tab.id} value={tab.id} className="flex items-center gap-2">
              {tab.icon}
              {tab.name}
            </TabsTrigger>
          ))}
        </TabsList>
        
        {tabs.map(tab => (
          <TabsContent key={tab.id} value={tab.id}>
            <Card>
              <CardContent className="pt-6">
                <div className="text-lg font-medium mb-4">{tab.name} Analytics</div>
                
                <div className="border rounded-md p-4">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        {tab.data.length > 0 && Object.keys(tab.data[0]).map((key, index) => (
                          <th key={index} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            {key.charAt(0).toUpperCase() + key.slice(1)}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {tab.data.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                          {Object.values(row).map((value, valueIndex) => (
                            <td key={valueIndex} className="px-6 py-4 whitespace-nowrap text-sm">
                              {value !== null ? value : 'N/A'}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                <div className="flex justify-end mt-4">
                  <Button variant="link" className="text-sm flex items-center gap-1">
                    View Detailed Report <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default ExportAnalyticsTab;
