
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
        .select(`
          *,
          checked_by (
            email
          )
        `);

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

      const { data, error } = await query.order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    },
    refetchOnWindowFocus: false
  });

  const filteredChecks = checks.filter(check =>
    check.batch_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    check.parameter.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRefresh = async () => {
    try {
      await refetch();
      toast({
        title: "Success",
        description: "Data refreshed successfully"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to refresh data",
        variant: "destructive"
      });
    }
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filteredChecks);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Quality Checks");
    XLSX.writeFile(wb, `quality-checks-${timeRange}.xlsx`);
  };

  const exportToCSV = () => {
    const ws = XLSX.utils.json_to_sheet(filteredChecks);
    const csv = XLSX.utils.sheet_to_csv(ws);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `quality-checks-${timeRange}.csv`;
    link.click();
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [['Batch ID', 'Parameter', 'Value', 'Standard', 'Status', 'Date']],
      body: filteredChecks.map(check => [
        check.batch_id,
        check.parameter,
        check.actual_value,
        check.standard_value,
        check.status,
        format(new Date(check.created_at), 'PPp')
      ])
    });
    doc.save(`quality-checks-${timeRange}.pdf`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Quality Check Records</span>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh}
            disabled={isRefetching}
          >
            <RefreshCw className={cn(
              "h-4 w-4 mr-2",
              isRefetching && "animate-spin"
            )} />
            {isRefetching ? "Refreshing..." : "Refresh"}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by batch ID or parameter..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="day">Last 24 Hours</SelectItem>
              <SelectItem value="week">Last Week</SelectItem>
              <SelectItem value="month">Last Month</SelectItem>
              <SelectItem value="year">Last Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={exportToPDF}>
            <FileDown className="h-4 w-4 mr-2" />
            PDF
          </Button>
          <Button variant="outline" onClick={exportToExcel}>
            <FileDown className="h-4 w-4 mr-2" />
            Excel
          </Button>
          <Button variant="outline" onClick={exportToCSV}>
            <FileDown className="h-4 w-4 mr-2" />
            CSV
          </Button>
        </div>

        {isLoading ? (
          <div className="text-center py-4">Loading records...</div>
        ) : filteredChecks.length === 0 ? (
          <div className="text-center py-4">No records found</div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Batch ID</TableHead>
                  <TableHead>Parameter</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>Standard</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Checked By</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredChecks.map((check) => (
                  <TableRow key={`${check.batch_id}-${check.parameter}`}>
                    <TableCell className="font-medium">{check.batch_id}</TableCell>
                    <TableCell>{check.parameter}</TableCell>
                    <TableCell>{check.actual_value}</TableCell>
                    <TableCell>{check.standard_value}</TableCell>
                    <TableCell>
                      <Badge variant={check.status === 'passed' ? 'success' : 'destructive'}>
                        {check.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{check.checked_by?.email}</TableCell>
                    <TableCell>{format(new Date(check.created_at), 'PPp')}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default QualityChecksDisplay;
