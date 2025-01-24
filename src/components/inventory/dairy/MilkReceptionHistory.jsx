import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Download, Search } from "lucide-react";
import { format } from 'date-fns';
import { useToast } from "@/components/ui/use-toast";
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/supabase';

const MilkReceptionHistory = () => {
  const { toast } = useToast();
  const [timeRange, setTimeRange] = useState('day');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Fetch data from Supabase
  const { data: receptionData, isLoading } = useQuery({
    queryKey: ['milkReception', timeRange, startDate, endDate],
    queryFn: async () => {
      console.log('Fetching milk reception data with range:', timeRange);
      let query = supabase
        .from('milk_reception_data')
        .select('*')
        .order('created_at', { ascending: false });

      if (startDate && endDate) {
        query = query.gte('created_at', startDate).lte('created_at', endDate);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  const handleDownload = () => {
    if (!receptionData?.length) {
      toast({
        title: "No data to download",
        description: "There is no data available for the selected period.",
        variant: "destructive",
      });
      return;
    }

    // Convert data to CSV
    const headers = ['Batch ID', 'Date', 'Supplier', 'Volume (L)', 'Temperature (°C)', 'Quality Score'];
    const csvData = receptionData.map(record => [
      record.batch_id,
      format(new Date(record.created_at), 'yyyy-MM-dd HH:mm'),
      record.supplier,
      record.quantity,
      record.temperature,
      record.quality_score,
    ]);

    const csv = [
      headers.join(','),
      ...csvData.map(row => row.join(',')),
    ].join('\n');

    // Create and trigger download
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `milk-reception-data-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    toast({
      title: "Download started",
      description: "Your data export has been initiated.",
    });
  };

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Historical Reception Data</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select time range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="day">Last 24 Hours</SelectItem>
                  <SelectItem value="week">Last Week</SelectItem>
                  <SelectItem value="month">Last Month</SelectItem>
                  <SelectItem value="year">Last Year</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {timeRange === 'custom' && (
              <>
                <div className="flex-1 min-w-[200px]">
                  <Input
                    type="datetime-local"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full"
                  />
                </div>
                <div className="flex-1 min-w-[200px]">
                  <Input
                    type="datetime-local"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full"
                  />
                </div>
              </>
            )}
            
            <Button onClick={handleDownload} className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Download CSV
            </Button>
          </div>

          <div className="relative overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th className="px-6 py-3">Batch ID</th>
                  <th className="px-6 py-3">Date</th>
                  <th className="px-6 py-3">Supplier</th>
                  <th className="px-6 py-3">Volume (L)</th>
                  <th className="px-6 py-3">Temperature (°C)</th>
                  <th className="px-6 py-3">Quality Score</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center">Loading...</td>
                  </tr>
                ) : receptionData?.length ? (
                  receptionData.map((record) => (
                    <tr key={record.id} className="bg-white border-b">
                      <td className="px-6 py-4">{record.batch_id}</td>
                      <td className="px-6 py-4">{format(new Date(record.created_at), 'yyyy-MM-dd HH:mm')}</td>
                      <td className="px-6 py-4">{record.supplier}</td>
                      <td className="px-6 py-4">{record.quantity}</td>
                      <td className="px-6 py-4">{record.temperature}</td>
                      <td className="px-6 py-4">{record.quality_score}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center">No data available</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MilkReceptionHistory;