
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Search, FileDown, Printer, Calendar } from "lucide-react";
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/supabase';
import { format, subDays, subWeeks, subMonths, subYears } from 'date-fns';

const ProductionLineDataDisplay = ({ productionLine }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [timeRange, setTimeRange] = useState('all');
  const { toast } = useToast();

  const tableName = productionLine.name.toLowerCase().includes('international') 
    ? 'production_line_international' 
    : 'production_line_local';

  const { data: records, isLoading } = useQuery({
    queryKey: [tableName, searchTerm, timeRange],
    queryFn: async () => {
      let query = supabase.from(tableName).select('*');

      if (searchTerm) {
        query = query.or(`batch_id.ilike.%${searchTerm}%,fromager_identifier.ilike.%${searchTerm}%,cheese_type.ilike.%${searchTerm}%`);
      }

      if (timeRange !== 'all') {
        const now = new Date();
        let startDate = new Date();
        
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
        
        query = query.gte('created_at', startDate.toISOString())
                    .lte('created_at', now.toISOString());
      }

      const { data, error } = await query.order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    }
  });

  const handleExport = async (format) => {
    if (!records?.length) return;

    try {
      if (format === 'print') {
        window.print();
        return;
      }

      const timestamp = format(new Date(), 'yyyy-MM-dd-HH-mm');
      const filename = `production-line-${productionLine.name.toLowerCase()}-${timestamp}.csv`;
      
      // Create CSV content
      const headers = Object.keys(records[0]).join(',');
      const rows = records.map(record => Object.values(record).join(',')).join('\n');
      const content = `${headers}\n${rows}`;
      
      // Create and download file
      const blob = new Blob([content], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();

      toast({
        title: "Success",
        description: "Records exported successfully",
      });
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: "Error",
        description: "Failed to export records",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>{productionLine.name} Records</span>
          <div className="flex gap-2">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Select time range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="day">Last 24 Hours</SelectItem>
                <SelectItem value="week">Last Week</SelectItem>
                <SelectItem value="month">Last Month</SelectItem>
                <SelectItem value="year">Last Year</SelectItem>
                <SelectItem value="all">All Time</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardTitle>
        <div className="flex justify-between items-center gap-4 mt-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by batch ID, fromager, or cheese type..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => handleExport('csv')}>
              <FileDown className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
            <Button variant="outline" onClick={() => handleExport('print')}>
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-4">Loading...</div>
        ) : !records?.length ? (
          <div className="text-center py-4">No records found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="px-4 py-2 text-left">Batch ID</th>
                  <th className="px-4 py-2 text-left">Fromager</th>
                  <th className="px-4 py-2 text-left">Cheese Type</th>
                  <th className="px-4 py-2 text-left">Volume (L)</th>
                  <th className="px-4 py-2 text-left">Start Time</th>
                  <th className="px-4 py-2 text-left">Status</th>
                  <th className="px-4 py-2 text-left">Created At</th>
                </tr>
              </thead>
              <tbody>
                {records.map((record) => (
                  <tr key={record.id} className="border-b hover:bg-muted/50">
                    <td className="px-4 py-2">{record.batch_id}</td>
                    <td className="px-4 py-2">{record.fromager_identifier}</td>
                    <td className="px-4 py-2">{record.cheese_type}</td>
                    <td className="px-4 py-2">{record.milk_volume}</td>
                    <td className="px-4 py-2">{format(new Date(record.start_time), 'PPp')}</td>
                    <td className="px-4 py-2">{record.status}</td>
                    <td className="px-4 py-2">{format(new Date(record.created_at), 'PPp')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProductionLineDataDisplay;
