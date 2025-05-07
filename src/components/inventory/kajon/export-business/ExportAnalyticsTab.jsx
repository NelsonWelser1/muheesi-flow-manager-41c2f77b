
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import {
  BarChart3,
  Globe,
  DollarSign,
  TrendingUp,
  ArrowRight,
  Download,
  FilePdf,
  FileSpreadsheet
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { useToast } from "@/components/ui/use-toast";
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

const ExportAnalyticsTab = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('production');
  const [timeRange, setTimeRange] = useState('6months');
  const [isExporting, setIsExporting] = useState(false);

  // Mock data for various tabs
  const productionData = [
    { month: 'Jan', arabica: 2500, robusta: 1800 },
    { month: 'Feb', arabica: 3200, robusta: 2100 },
    { month: 'Mar', arabica: 2800, robusta: 1950 },
    { month: 'Apr', arabica: 3100, robusta: 2400 },
    { month: 'May', arabica: 3800, robusta: 2700 },
    { month: 'Jun', arabica: 4200, robusta: 3000 }
  ];

  const customersData = [
    { month: 'Jan', europe: 12, namerica: 8, asia: 5 },
    { month: 'Feb', europe: 15, namerica: 10, asia: 7 },
    { month: 'Mar', europe: 13, namerica: 12, asia: 8 },
    { month: 'Apr', europe: 18, namerica: 15, asia: 10 },
    { month: 'May', europe: 21, namerica: 18, asia: 12 },
    { month: 'Jun', europe: 25, namerica: 20, asia: 15 }
  ];

  const financialData = [
    { month: 'Jan', revenue: 125000, costs: 80000 },
    { month: 'Feb', revenue: 150000, costs: 90000 },
    { month: 'Mar', revenue: 140000, costs: 85000 },
    { month: 'Apr', revenue: 180000, costs: 100000 },
    { month: 'May', revenue: 210000, costs: 120000 },
    { month: 'Jun', revenue: 250000, costs: 140000 }
  ];

  const qualityData = [
    { name: 'AA Grade', value: 45 },
    { name: 'AB Grade', value: 30 },
    { name: 'PB Grade', value: 15 },
    { name: 'C Grade', value: 10 }
  ];

  const impactData = [
    { metric: 'Farmers Supported', value: '1,240' },
    { metric: 'Training Sessions', value: '32' },
    { metric: 'Sustainable Practices Implemented', value: '18' },
    { metric: 'Community Projects', value: '7' },
    { metric: 'Carbon Footprint Reduction', value: '12%' }
  ];

  const tabs = [
    { id: 'production', label: 'Production Volumes', icon: <BarChart3 className="h-4 w-4" /> },
    { id: 'customers', label: 'Customer Distribution', icon: <Globe className="h-4 w-4" /> },
    { id: 'financial', label: 'Financial Performance', icon: <DollarSign className="h-4 w-4" /> },
    { id: 'quality', label: 'Quality Metrics', icon: <TrendingUp className="h-4 w-4" /> },
    { id: 'impact', label: 'Social Impact', icon: <ArrowRight className="h-4 w-4" /> }
  ];

  const getActiveData = () => {
    switch (activeTab) {
      case 'production':
        return productionData;
      case 'customers':
        return customersData;
      case 'financial':
        return financialData;
      case 'quality':
        return qualityData;
      case 'impact':
        return impactData;
      default:
        return [];
    }
  };

  const getTabTitle = () => {
    const tab = tabs.find(tab => tab.id === activeTab);
    return tab ? tab.label : 'Export Analytics';
  };

  // Process data for export based on analytics tab
  const processDataForExport = (data) => {
    switch (activeTab) {
      case 'production':
        return data.map(item => ({
          'Month': item.month,
          'Arabica (kg)': item.arabica,
          'Robusta (kg)': item.robusta,
          'Total (kg)': (item.arabica || 0) + (item.robusta || 0)
        }));
        
      case 'customers':
        return data.map(item => ({
          'Month': item.month,
          'Europe': item.europe,
          'North America': item.namerica,
          'Asia': item.asia,
          'Total Customers': (item.europe || 0) + (item.namerica || 0) + (item.asia || 0)
        }));
        
      case 'financial':
        return data.map(item => ({
          'Month': item.month,
          'Revenue (USD)': item.revenue,
          'Costs (USD)': item.costs,
          'Profit (USD)': (item.revenue || 0) - (item.costs || 0),
          'Profit Margin (%)': Math.round(((item.revenue - item.costs) / item.revenue) * 100)
        }));
        
      case 'quality':
        return data.map(item => ({
          'Quality Grade': item.name,
          'Percentage': `${item.value}%`
        }));
        
      case 'impact':
        return data.map(item => ({
          'Metric': item.metric,
          'Value': item.value
        }));
        
      default:
        return data;
    }
  };

  const handleExportToCSV = () => {
    try {
      setIsExporting(true);
      
      // Get the data for the active tab
      const data = getActiveData();
      if (!data || data.length === 0) {
        throw new Error('No data available for export');
      }
      
      // Process the data for CSV
      const processedData = processDataForExport(data);
      
      // Create worksheet
      const worksheet = XLSX.utils.json_to_sheet(processedData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, activeTab);
      
      // Generate filename
      const fileName = `coffee_export_${activeTab}_${format(new Date(), 'yyyy-MM-dd')}`;
      
      // Generate and download CSV file
      XLSX.writeFile(workbook, `${fileName}.csv`, { bookType: 'csv' });
      
      toast({
        title: "Export Successful",
        description: `Data exported to CSV successfully.`
      });
    } catch (error) {
      console.error('CSV Export error:', error);
      toast({
        title: "Export Failed",
        description: error.message || "An error occurred during export.",
        variant: "destructive"
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportToExcel = () => {
    try {
      setIsExporting(true);
      
      // Get the data for the active tab
      const data = getActiveData();
      if (!data || data.length === 0) {
        throw new Error('No data available for export');
      }
      
      // Process the data for Excel
      const processedData = processDataForExport(data);
      
      // Create worksheet
      const worksheet = XLSX.utils.json_to_sheet(processedData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, activeTab);
      
      // Generate filename
      const fileName = `coffee_export_${activeTab}_${format(new Date(), 'yyyy-MM-dd')}`;
      
      // Generate and download Excel file
      XLSX.writeFile(workbook, `${fileName}.xlsx`);
      
      toast({
        title: "Export Successful",
        description: `Data exported to Excel successfully.`
      });
    } catch (error) {
      console.error('Excel Export error:', error);
      toast({
        title: "Export Failed",
        description: error.message || "An error occurred during export.",
        variant: "destructive"
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportToPDF = () => {
    try {
      setIsExporting(true);
      
      // Get the data for the active tab
      const data = getActiveData();
      if (!data || data.length === 0) {
        throw new Error('No data available for export');
      }
      
      // Process the data for PDF
      const processedData = processDataForExport(data);
      
      // Create new PDF document
      const doc = new jsPDF();
      
      // Add title
      doc.setFontSize(16);
      doc.text(`Coffee Export Analytics - ${getTabTitle()}`, 14, 20);
      
      // Add export date
      doc.setFontSize(10);
      doc.text(`Generated on: ${format(new Date(), 'PPP')}`, 14, 30);
      
      // Convert data for table
      const headers = Object.keys(processedData[0]);
      const rows = processedData.map(item => headers.map(header => item[header]));
      
      // Add table to PDF
      doc.autoTable({
        head: [headers],
        body: rows,
        startY: 40,
        theme: 'grid',
        styles: { fontSize: 9 },
        headStyles: { fillColor: [71, 85, 119], textColor: 255 },
        alternateRowStyles: { fillColor: [240, 240, 240] }
      });
      
      // Generate filename
      const fileName = `coffee_export_${activeTab}_${format(new Date(), 'yyyy-MM-dd')}`;
      
      // Save the PDF
      doc.save(`${fileName}.pdf`);
      
      toast({
        title: "Export Successful",
        description: `Data exported to PDF successfully.`
      });
    } catch (error) {
      console.error('PDF Export error:', error);
      toast({
        title: "Export Failed",
        description: error.message || "An error occurred during export.",
        variant: "destructive"
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div>
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-xl flex items-center justify-between">
            <div>Export Analytics</div>
            <div className="flex items-center gap-2">
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select time range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30days">Last 30 Days</SelectItem>
                  <SelectItem value="3months">Last 3 Months</SelectItem>
                  <SelectItem value="6months">Last 6 Months</SelectItem>
                  <SelectItem value="1year">Last Year</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex items-center gap-2 ml-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExportToCSV}
                  disabled={isExporting}
                  className="flex items-center gap-1"
                >
                  <FileSpreadsheet className="h-4 w-4" />
                  CSV
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExportToExcel}
                  disabled={isExporting}
                  className="flex items-center gap-1"
                >
                  <FileSpreadsheet className="h-4 w-4" />
                  Excel
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExportToPDF}
                  disabled={isExporting}
                  className="flex items-center gap-1"
                >
                  <FilePdf className="h-4 w-4" />
                  PDF
                </Button>
              </div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="production" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              {tabs.map((tab) => (
                <TabsTrigger key={tab.id} value={tab.id} className="flex items-center gap-2">
                  {tab.icon}
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
            
            {/* Production tab */}
            <TabsContent value="production">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={productionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => `${value} kg`} />
                    <Bar dataKey="arabica" name="Arabica" fill="#8884d8" />
                    <Bar dataKey="robusta" name="Robusta" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 text-sm text-muted-foreground">
                <p>Coffee production volumes showing Arabica and Robusta output over time.</p>
              </div>
            </TabsContent>
            
            {/* Customers tab */}
            <TabsContent value="customers">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={customersData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="europe" name="Europe" fill="#8884d8" />
                    <Bar dataKey="namerica" name="North America" fill="#82ca9d" />
                    <Bar dataKey="asia" name="Asia" fill="#ffc658" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 text-sm text-muted-foreground">
                <p>Customer distribution across major markets over the last 6 months.</p>
              </div>
            </TabsContent>
            
            {/* Financial tab */}
            <TabsContent value="financial">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={financialData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                    <Bar dataKey="revenue" name="Revenue" fill="#82ca9d" />
                    <Bar dataKey="costs" name="Costs" fill="#ff8042" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 text-sm text-muted-foreground">
                <p>Financial performance showing revenue and cost trends over time.</p>
              </div>
            </TabsContent>
            
            {/* Quality tab */}
            <TabsContent value="quality">
              <div className="h-80 grid grid-cols-2 gap-4">
                <div className="border rounded-md p-4">
                  <h3 className="text-lg font-medium mb-4">Coffee Quality Distribution</h3>
                  <div className="space-y-4">
                    {qualityData.map((item) => (
                      <div key={item.name} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span>{item.name}</span>
                          <span className="font-medium">{item.value}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div 
                            className="bg-primary h-2.5 rounded-full" 
                            style={{ width: `${item.value}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="border rounded-md p-4">
                  <h3 className="text-lg font-medium mb-4">Quality Assurance Checks</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Total Samples Tested</span>
                      <span className="font-medium">168</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Quality Assurance Pass Rate</span>
                      <span className="font-medium text-green-600">94%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Average Cupping Score</span>
                      <span className="font-medium">84.5 / 100</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>SCA Grade Average</span>
                      <span className="font-medium">Specialty (83+)</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-4 text-sm text-muted-foreground">
                <p>Quality metrics showing coffee grade distribution and quality control results.</p>
              </div>
            </TabsContent>
            
            {/* Impact tab */}
            <TabsContent value="impact">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border rounded-md p-6 space-y-4">
                  <h3 className="text-lg font-medium mb-4">Social Impact Metrics</h3>
                  {impactData.map((item) => (
                    <div key={item.metric} className="flex justify-between items-center border-b pb-2">
                      <span>{item.metric}</span>
                      <span className="font-medium">{item.value}</span>
                    </div>
                  ))}
                </div>
                <div className="border rounded-md p-6">
                  <h3 className="text-lg font-medium mb-4">Sustainability Initiatives</h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="rounded-full bg-green-100 p-2 mt-0.5">
                        <ArrowRight className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">Sustainable Farming Practices</h4>
                        <p className="text-sm text-muted-foreground">Implemented across 85% of partner farms</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="rounded-full bg-green-100 p-2 mt-0.5">
                        <ArrowRight className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">Water Conservation</h4>
                        <p className="text-sm text-muted-foreground">Reduced water usage by 24% in processing</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="rounded-full bg-green-100 p-2 mt-0.5">
                        <ArrowRight className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">Farmer Training Program</h4>
                        <p className="text-sm text-muted-foreground">32 training sessions conducted with 780+ attendees</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-4 text-sm text-muted-foreground">
                <p>Social impact and sustainability metrics from our coffee export operations.</p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExportAnalyticsTab;
