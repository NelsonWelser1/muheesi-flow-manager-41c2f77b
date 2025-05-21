
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Search, FileDown, Filter, Calendar } from "lucide-react";
import { supabase } from "@/integrations/supabase/supabase";
import { useToast } from "@/components/ui/use-toast";
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { format } from 'date-fns';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const KAZO_LOCATIONS = [
  "Kanoni-Mbogo",
  "Kanoni-Rwakahaya",
  "Engari-Kaichumu",
  "Engari-Kyengando",
  "Migina",
  "Kagarama",
  "Kyampangara",
  "Nkungu",
  "Buremba",
  "Kazo Town council",
  "Burunga",
  "Rwemikoma"
];

const CoffeeInventoryRecords = ({ onBack, isKazo = false }) => {
  const [inventoryRecords, setInventoryRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortConfig, setSortConfig] = useState({ key: 'updated_at', direction: 'desc' });
  const [reportData, setReportData] = useState(null);
  const [showReport, setShowReport] = useState(false);
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchInventoryRecords = async () => {
      setIsLoading(true);
      try {
        const sources = [
          { table: 'inventory_items', filter: { column: 'item_name', pattern: '%coffee%' } },
          { table: 'inventory_items', filter: { column: 'section', pattern: '%coffee%' } }
        ];
        
        let foundRecords = [];
        
        for (const source of sources) {
          let query = supabase
            .from(source.table)
            .select('*')
            .ilike(source.filter.column, source.filter.pattern)
            .order('updated_at', { ascending: false });
            
          if (isKazo) {
            query = query.or(KAZO_LOCATIONS.map(loc => `location.ilike.%${loc}%,section.ilike.%${loc}%`).join(','));
          }
            
          const { data, error } = await query;
            
          if (!error && data && data.length > 0) {
            foundRecords = transformRecords(data, source.table);
            break;
          }
        }
        
        if (foundRecords.length === 0) {
          let transferQuery = supabase
            .from('coffee_stock_transfers')
            .select('*')
            .order('created_at', { ascending: false });
            
          if (isKazo) {
            transferQuery = transferQuery.or(
              KAZO_LOCATIONS.map(loc => 
                `source_location.ilike.%${loc}%,destination_location.ilike.%${loc}%`
              ).join(',')
            );
          }
            
          const { data: transferData, error: transferError } = await transferQuery;
            
          if (!transferError && transferData && transferData.length > 0) {
            foundRecords = transformTransferRecords(transferData);
          } else {
            toast({
              title: "No Data Found",
              description: isKazo 
                ? "No coffee inventory records were found for Kazo Coffee Development Project."
                : "No coffee inventory records were found in the database.",
              variant: "destructive",
            });
          }
        }
        
        setInventoryRecords(foundRecords);
      } catch (err) {
        console.error("Error fetching inventory records:", err);
        toast({
          title: "Error Loading Records",
          description: err.message,
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchInventoryRecords();
  }, [toast, isKazo]);
  
  const transformRecords = (data, sourceTable) => {
    if (sourceTable === 'inventory_items') {
      return data.map(item => ({
        id: item.id,
        coffeeType: item.item_name || 'Coffee',
        location: item.section || item.location || 'Warehouse',
        quantity: item.quantity || 0,
        unit: item.unit || 'kg',
        status: determineStatus(item),
        date: item.updated_at || item.created_at || new Date().toISOString(),
        notes: item.notes || '',
        sourceTable
      }));
    } else if (sourceTable === 'company_stocks') {
      return data.map(item => ({
        id: item.id,
        coffeeType: item.product || 'Coffee',
        location: isKazo ? 'Kazo Warehouse' : 'KAJON Warehouse',
        quantity: item.quantity || 0,
        unit: 'kg',
        status: 'active',
        date: item.updated_at || new Date().toISOString(),
        notes: `${item.company} stock`,
        sourceTable
      }));
    }
    return [];
  };
  
  const transformTransferRecords = (data) => {
    return data.map(item => ({
      id: item.id,
      coffeeType: item.coffee_type || item.product_type || 'Coffee',
      location: item.destination_location || 'Warehouse',
      quantity: item.quantity || 0,
      unit: item.unit || 'kg',
      status: item.status || 'completed',
      date: item.transfer_date || item.created_at || new Date().toISOString(),
      notes: item.notes || `From: ${item.source_location || 'Unknown'}`,
      sourceTable: 'transfers'
    }));
  };
  
  const determineStatus = (item) => {
    if (item.status) return item.status;
    
    const stockLevel = Number(item.quantity) || 0;
    const maxCapacity = Number(item.max_capacity) || stockLevel * 1.5;
    const ratio = stockLevel / maxCapacity;
    
    if (ratio < 0.3) return 'low';
    if (ratio > 0.9) return 'full';
    return 'active';
  };
  
  const handleSort = (key) => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc'
    }));
  };
  
  const filteredAndSortedRecords = React.useMemo(() => {
    let filtered = [...inventoryRecords];
    
    if (searchTerm) {
      filtered = filtered.filter(record => 
        record.coffeeType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.notes.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(record => record.status === statusFilter);
    }
    
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
  }, [inventoryRecords, searchTerm, statusFilter, sortConfig]);
  
  const getStatusBadgeStyle = (status) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800 hover:bg-green-100';
      case 'low':
        return 'bg-amber-100 text-amber-800 hover:bg-amber-100';
      case 'full':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-100';
      case 'completed':
        return 'bg-green-100 text-green-800 hover:bg-green-100';
      case 'pending':
        return 'bg-amber-100 text-amber-800 hover:bg-amber-100';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-100';
    }
  };

  const generateReport = (type) => {
    if (filteredAndSortedRecords.length === 0) {
      toast({
        title: "No Data",
        description: "No records available to generate report",
        variant: "destructive",
        duration: 5000,
      });
      return;
    }
    
    // Calculate summary data
    const totalQuantity = filteredAndSortedRecords.reduce((sum, record) => sum + Number(record.quantity), 0);
    const averageQuantity = totalQuantity / filteredAndSortedRecords.length;
    
    // Count by status
    const statusCounts = filteredAndSortedRecords.reduce((counts, record) => {
      const status = record.status || 'unknown';
      counts[status] = (counts[status] || 0) + 1;
      return counts;
    }, {});
    
    // Count by location
    const locationCounts = filteredAndSortedRecords.reduce((counts, record) => {
      const location = record.location || 'Unknown';
      counts[location] = (counts[location] || 0) + 1;
      return counts;
    }, {});

    setReportData({
      title: `${type.charAt(0).toUpperCase() + type.slice(1)} Coffee Inventory Report`,
      records: filteredAndSortedRecords,
      summary: {
        totalRecords: filteredAndSortedRecords.length,
        totalQuantity: totalQuantity.toFixed(2),
        averageQuantity: averageQuantity.toFixed(2),
        statusCounts,
        locationCounts,
        reportDate: format(new Date(), 'PPpp')
      }
    });
    
    setShowReport(true);
    
    toast({
      title: "Report Generated",
      description: `${type.charAt(0).toUpperCase() + type.slice(1)} coffee inventory report generated successfully`,
      duration: 3000,
    });
  };

  const downloadReport = (format) => {
    const dataToUse = reportData ? reportData.records : filteredAndSortedRecords;
    const title = reportData ? reportData.title : 'Coffee-Inventory-Records';
    
    switch (format) {
      case 'pdf':
        downloadPDF(dataToUse, title);
        break;
      case 'excel':
        downloadExcel(dataToUse, title);
        break;
      case 'csv':
        downloadCSV(dataToUse, title);
        break;
      default:
        console.error('Unsupported format:', format);
    }
  };

  const downloadPDF = (data, title) => {
    const doc = new jsPDF();
    
    doc.setFontSize(18);
    doc.text(title, 14, 15);
    doc.setFontSize(12);
    doc.text(`Generated on: ${format(new Date(), 'PPp')}`, 14, 25);
    
    if (reportData && reportData.summary) {
      doc.text(`Total Records: ${reportData.summary.totalRecords}`, 14, 35);
      doc.text(`Total Quantity: ${reportData.summary.totalQuantity} kg`, 14, 42);
      doc.text(`Average Quantity: ${reportData.summary.averageQuantity} kg`, 14, 49);
      
      doc.setFontSize(14);
      doc.text("Status Distribution:", 14, 60);
      doc.setFontSize(12);
      let yPos = 67;
      for (const [status, count] of Object.entries(reportData.summary.statusCounts)) {
        doc.text(`${status}: ${count} records`, 14, yPos);
        yPos += 7;
      }
      
      yPos += 7;
      doc.setFontSize(14);
      doc.text("Location Distribution:", 14, yPos);
      yPos += 7;
      doc.setFontSize(12);
      for (const [location, count] of Object.entries(reportData.summary.locationCounts)) {
        doc.text(`${location}: ${count} records`, 14, yPos);
        yPos += 7;
      }
      
      yPos += 7;
    } else {
      yPos = 35;
    }
    
    const tableData = data.map(record => [
      record.coffeeType,
      record.location,
      `${record.quantity} ${record.unit}`,
      record.status.charAt(0).toUpperCase() + record.status.slice(1),
      new Date(record.date).toLocaleDateString(),
      record.notes
    ]);
    
    doc.autoTable({
      head: [["Coffee Type", "Location", "Quantity", "Status", "Date", "Notes"]],
      body: tableData,
      startY: reportData && reportData.summary ? yPos : 35,
      margin: { horizontal: 14 },
      styles: { overflow: 'linebreak' },
      headStyles: { fillColor: [41, 128, 185], textColor: 255 }
    });
    
    doc.save(`${title.replace(/\s+/g, '-')}.pdf`);
  };

  const downloadExcel = (data, title) => {
    // Create summary worksheet if report data exists
    const workbook = XLSX.utils.book_new();
    
    if (reportData && reportData.summary) {
      const summaryData = [
        ["Report Title", title],
        ["Report Date", reportData.summary.reportDate],
        ["Total Records", reportData.summary.totalRecords],
        ["Total Quantity", `${reportData.summary.totalQuantity} kg`],
        ["Average Quantity", `${reportData.summary.averageQuantity} kg`],
        [""],
        ["Status Distribution"],
        ...Object.entries(reportData.summary.statusCounts).map(([status, count]) => 
          [`${status.charAt(0).toUpperCase() + status.slice(1)}`, count]
        ),
        [""],
        ["Location Distribution"],
        ...Object.entries(reportData.summary.locationCounts).map(([location, count]) => 
          [location, count]
        ),
      ];
      
      const summaryWs = XLSX.utils.aoa_to_sheet(summaryData);
      XLSX.utils.book_append_sheet(workbook, summaryWs, "Summary");
    }
    
    // Create data worksheet
    const excelData = data.map(record => ({
      "Coffee Type": record.coffeeType,
      "Location": record.location,
      "Quantity": `${record.quantity} ${record.unit}`,
      "Status": record.status.charAt(0).toUpperCase() + record.status.slice(1),
      "Date": new Date(record.date).toLocaleDateString(),
      "Notes": record.notes
    }));
    
    const dataWs = XLSX.utils.json_to_sheet(excelData);
    XLSX.utils.book_append_sheet(workbook, dataWs, "Data");
    
    XLSX.writeFile(workbook, `${title.replace(/\s+/g, '-')}.xlsx`);
  };

  const downloadCSV = (data, title) => {
    const headers = ["Coffee Type", "Location", "Quantity", "Status", "Date", "Notes"];
    
    let csvContent = "";
    
    // Add summary if report data exists
    if (reportData && reportData.summary) {
      csvContent += `"Report Title","${title}"\r\n`;
      csvContent += `"Report Date","${reportData.summary.reportDate}"\r\n`;
      csvContent += `"Total Records","${reportData.summary.totalRecords}"\r\n`;
      csvContent += `"Total Quantity","${reportData.summary.totalQuantity} kg"\r\n`;
      csvContent += `"Average Quantity","${reportData.summary.averageQuantity} kg"\r\n\r\n`;
      
      csvContent += `"Status Distribution"\r\n`;
      for (const [status, count] of Object.entries(reportData.summary.statusCounts)) {
        csvContent += `"${status.charAt(0).toUpperCase() + status.slice(1)}","${count}"\r\n`;
      }
      
      csvContent += `\r\n"Location Distribution"\r\n`;
      for (const [location, count] of Object.entries(reportData.summary.locationCounts)) {
        csvContent += `"${location}","${count}"\r\n`;
      }
      
      csvContent += `\r\n"Records Data"\r\n`;
    }
    
    // Add headers
    csvContent += headers.map(h => `"${h}"`).join(",") + "\r\n";
    
    // Add data rows
    csvContent += data.map(record => [
      `"${record.coffeeType}"`,
      `"${record.location}"`,
      `"${record.quantity} ${record.unit}"`,
      `"${record.status.charAt(0).toUpperCase() + record.status.slice(1)}"`,
      `"${new Date(record.date).toLocaleDateString()}"`,
      `"${record.notes.replace(/"/g, '""')}"`
    ].join(",")).join("\r\n");
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${title.replace(/\s+/g, '-')}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack} className="flex items-center gap-2">
          <ArrowLeft size={16} />
          Back
        </Button>
        <h2 className="text-2xl font-bold">
          {isKazo ? "Kazo Coffee Development Project - Inventory Records" : "Coffee Inventory Records"}
        </h2>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle>Current Inventory Records</CardTitle>
            <div className="flex flex-wrap gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="flex items-center gap-2">
                    <Calendar size={16} />
                    Generate Report
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => generateReport('daily')}>
                    Daily Report
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => generateReport('weekly')}>
                    Weekly Report
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => generateReport('monthly')}>
                    Monthly Report
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => generateReport('annual')}>
                    Annual Report
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="flex items-center gap-2">
                    <FileDown size={16} />
                    Export
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => downloadReport('pdf')}>
                    Export as PDF
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => downloadReport('excel')}>
                    Export as Excel
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => downloadReport('csv')}>
                    Export as CSV
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="records" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="records">Records</TabsTrigger>
              {showReport && <TabsTrigger value="report">Report</TabsTrigger>}
            </TabsList>
            
            <TabsContent value="records">
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-grow">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by coffee type, location, or notes..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Select onValueChange={setStatusFilter} defaultValue="all">
                  <SelectTrigger className="w-[180px]">
                    <Filter className="mr-2 h-4 w-4" />
                    <span>Filter by Status</span>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="low">Low Stock</SelectItem>
                    <SelectItem value="full">Full Stock</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {isLoading ? (
                <div className="py-10 text-center">
                  <p>Loading inventory records...</p>
                </div>
              ) : filteredAndSortedRecords.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="cursor-pointer" onClick={() => handleSort('coffeeType')}>
                          Coffee Type
                          {sortConfig.key === 'coffeeType' && (sortConfig.direction === 'asc' ? ' ↑' : ' ↓')}
                        </TableHead>
                        <TableHead className="cursor-pointer" onClick={() => handleSort('location')}>
                          Location
                          {sortConfig.key === 'location' && (sortConfig.direction === 'asc' ? ' ↑' : ' ↓')}
                        </TableHead>
                        <TableHead className="cursor-pointer" onClick={() => handleSort('quantity')}>
                          Quantity
                          {sortConfig.key === 'quantity' && (sortConfig.direction === 'asc' ? ' ↑' : ' ↓')}
                        </TableHead>
                        <TableHead className="cursor-pointer" onClick={() => handleSort('status')}>
                          Status
                          {sortConfig.key === 'status' && (sortConfig.direction === 'asc' ? ' ↑' : ' ↓')}
                        </TableHead>
                        <TableHead className="cursor-pointer" onClick={() => handleSort('date')}>
                          Date
                          {sortConfig.key === 'date' && (sortConfig.direction === 'asc' ? ' ↑' : ' ↓')}
                        </TableHead>
                        <TableHead>Notes</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredAndSortedRecords.map((record) => (
                        <TableRow key={`${record.id}-${record.sourceTable}`}>
                          <TableCell className="font-medium">{record.coffeeType}</TableCell>
                          <TableCell>{record.location}</TableCell>
                          <TableCell>
                            {record.quantity} {record.unit}
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusBadgeStyle(record.status)}>
                              {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell>{new Date(record.date).toLocaleDateString()}</TableCell>
                          <TableCell className="max-w-[200px] truncate">{record.notes}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="py-10 text-center bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
                  <p className="font-medium">No Inventory Records Found</p>
                  <p className="mt-2">No coffee inventory records match your search criteria.</p>
                </div>
              )}
            </TabsContent>
            
            {showReport && (
              <TabsContent value="report">
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                    <div>
                      <h3 className="text-lg font-bold mb-1">{reportData.title}</h3>
                      <p className="text-sm text-muted-foreground">Generated on {format(new Date(), 'PPp')}</p>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-4 sm:mt-0"
                      onClick={() => downloadReport('excel')}
                    >
                      <FileDown size={16} className="mr-2" />
                      Export Report
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-sm text-muted-foreground mb-1">Total Records</div>
                        <div className="text-2xl font-bold">{reportData.summary.totalRecords}</div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-sm text-muted-foreground mb-1">Total Quantity</div>
                        <div className="text-2xl font-bold">{reportData.summary.totalQuantity} kg</div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-sm text-muted-foreground mb-1">Average Quantity</div>
                        <div className="text-2xl font-bold">{reportData.summary.averageQuantity} kg</div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Status Distribution</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {Object.entries(reportData.summary.statusCounts).map(([status, count]) => (
                            <div key={status} className="flex justify-between items-center">
                              <Badge className={getStatusBadgeStyle(status)}>
                                {status.charAt(0).toUpperCase() + status.slice(1)}
                              </Badge>
                              <span className="font-medium">{count} records</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Location Distribution</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {Object.entries(reportData.summary.locationCounts).map(([location, count]) => (
                            <div key={location} className="flex justify-between items-center">
                              <span className="truncate max-w-[300px]">{location}</span>
                              <span className="font-medium">{count} records</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Detailed Records</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Coffee Type</TableHead>
                              <TableHead>Location</TableHead>
                              <TableHead>Quantity</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead>Date</TableHead>
                              <TableHead>Notes</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {reportData.records.map((record) => (
                              <TableRow key={`report-${record.id}-${record.sourceTable}`}>
                                <TableCell className="font-medium">{record.coffeeType}</TableCell>
                                <TableCell>{record.location}</TableCell>
                                <TableCell>
                                  {record.quantity} {record.unit}
                                </TableCell>
                                <TableCell>
                                  <Badge className={getStatusBadgeStyle(record.status)}>
                                    {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                                  </Badge>
                                </TableCell>
                                <TableCell>{new Date(record.date).toLocaleDateString()}</TableCell>
                                <TableCell className="max-w-[200px] truncate">{record.notes}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            )}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default CoffeeInventoryRecords;
