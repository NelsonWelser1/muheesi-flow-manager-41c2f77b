
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/supabase';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, Search, FileDown } from "lucide-react";
import { format, subDays, subWeeks, subMonths, subYears } from 'date-fns';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { cn } from "@/lib/utils";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

const QualityChecksDisplay = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [timeRange, setTimeRange] = useState('all');
  const { toast } = useToast();

  const {
    data: checks = [],
    isLoading,
    refetch,
    isRefetching
  } = useQuery({
    queryKey: ['qualityChecks', timeRange],
    queryFn: async () => {
      let query = supabase
        .from('quality_checks')
        .select('*')
        .order('created_at', { ascending: false });

      if (timeRange !== 'all') {
        const now = new Date();
        let startDate;
        switch (timeRange) {
          case 'day':
            startDate = subDays(now, 1);
            break;
          case 'week':
            startDate = subWeeks(now, 1);
            break;
          case 'month':
            startDate = subMonths(now, 1);
            break;
          case 'year':
            startDate = subYears(now, 1);
            break;
        }
        query = query.gte('created_at', startDate.toISOString());
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    },
    refetchOnWindowFocus: false
  });

  const filteredChecks = checks.filter(check =>
    check.batch_id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Prepare data for quality trends chart
  const trendData = checks.reduce((acc, check) => {
    const date = format(new Date(check.created_at), 'MM/dd/yyyy');
    if (!acc[date]) {
      acc[date] = {
        date,
        temperature: 0,
        moisture: 0,
        acidity: 0,
        salt: 0,
        count: 0
      };
    }
    
    acc[date].temperature += parseFloat(check.temperature) || 0;
    acc[date].moisture += parseFloat(check.moisture) || 0;
    acc[date].acidity += parseFloat(check.acidity) || 0;
    acc[date].salt += parseFloat(check.salt) || 0;
    acc[date].count += 1;
    
    return acc;
  }, {});
  
  // Calculate averages for each date
  const chartData = Object.values(trendData).map(item => ({
    date: item.date,
    temperature: item.temperature / item.count,
    moisture: item.moisture / item.count,
    acidity: item.acidity / item.count,
    salt: item.salt / item.count
  })).sort((a, b) => new Date(a.date) - new Date(b.date)).slice(-14); // Last 14 days

  // Handle data export functions
  const exportToExcel = () => {
    const worksheetData = filteredChecks.map(check => ({
      'Batch ID': check.batch_id,
      'Date': format(new Date(check.created_at), 'MMM dd, yyyy HH:mm'),
      'Temperature (°C)': check.temperature,
      'Moisture (%)': check.moisture,
      'Acidity (pH)': check.acidity,
      'Salt (%)': check.salt,
      'Status': check.status
    }));

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Quality Checks");
    XLSX.writeFile(workbook, `Quality_Checks_${format(new Date(), 'yyyy-MM-dd')}.xlsx`);

    toast({
      title: "Export successful",
      description: "Quality checks exported to Excel"
    });
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    
    doc.setFontSize(18);
    doc.text("Quality Check Records", 14, 22);
    doc.setFontSize(11);
    doc.text(`Generated on: ${format(new Date(), 'MMM dd, yyyy HH:mm')}`, 14, 30);
    
    const tableColumn = ["Batch ID", "Date", "Temp (°C)", "Moisture (%)", "Acidity (pH)", "Salt (%)", "Status"];
    const tableRows = filteredChecks.map(check => [
      check.batch_id,
      format(new Date(check.created_at), 'MMM dd, yyyy'),
      check.temperature,
      check.moisture,
      check.acidity,
      check.salt,
      check.status
    ]);

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 40,
      theme: 'grid',
      styles: {
        fontSize: 8
      },
      headStyles: {
        fillColor: [102, 16, 242]
      }
    });
    
    doc.save(`Quality_Checks_${format(new Date(), 'yyyy-MM-dd')}.pdf`);
    
    toast({
      title: "Export successful",
      description: "Quality checks exported to PDF"
    });
  };

  // Helper function for status styling
  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case 'passed':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'warning':
        return 'bg-amber-100 text-amber-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex flex-1 items-center gap-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search by batch ID..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-xs"
          />
        </div>
        <div className="flex items-center gap-2">
          <Select defaultValue={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Last 24 Hours</SelectItem>
              <SelectItem value="week">Last Week</SelectItem>
              <SelectItem value="month">Last Month</SelectItem>
              <SelectItem value="year">Last Year</SelectItem>
              <SelectItem value="all">All Time</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={() => refetch()} disabled={isRefetching}>
            <RefreshCw className={cn("h-4 w-4 mr-1", isRefetching && "animate-spin")} />
            Refresh
          </Button>
          <Button variant="outline" onClick={exportToExcel}>
            <FileDown className="h-4 w-4 mr-1" />
            Excel
          </Button>
          <Button variant="outline" onClick={exportToPDF}>
            <FileDown className="h-4 w-4 mr-1" />
            PDF
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <>
          {chartData.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Quality Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={chartData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="temperature" name="Temperature (°C)" stroke="#8884d8" />
                      <Line type="monotone" dataKey="moisture" name="Moisture (%)" stroke="#82ca9d" />
                      <Line type="monotone" dataKey="acidity" name="Acidity (pH)" stroke="#ffc658" />
                      <Line type="monotone" dataKey="salt" name="Salt (%)" stroke="#ff8042" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Batch ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Temp (°C)</TableHead>
                    <TableHead>Moisture (%)</TableHead>
                    <TableHead>Acidity (pH)</TableHead>
                    <TableHead>Salt (%)</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredChecks.length > 0 ? (
                    filteredChecks.map((check) => (
                      <TableRow key={check.id}>
                        <TableCell className="font-medium">{check.batch_id}</TableCell>
                        <TableCell>
                          {format(new Date(check.created_at), 'MMM dd, yyyy')}
                          <br />
                          <span className="text-xs text-muted-foreground">
                            {format(new Date(check.created_at), 'HH:mm')}
                          </span>
                        </TableCell>
                        <TableCell>{check.temperature}°C</TableCell>
                        <TableCell>{check.moisture}%</TableCell>
                        <TableCell>{check.acidity}</TableCell>
                        <TableCell>{check.salt}%</TableCell>
                        <TableCell>
                          <Badge className={getStatusStyle(check.status)}>
                            {check.status || 'Unknown'}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center">
                        {searchQuery ? 'No matching records found' : 'No quality check records available'}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default QualityChecksDisplay;
