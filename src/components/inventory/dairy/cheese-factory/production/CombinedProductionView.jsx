
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/supabase';
import { subDays, subWeeks, subMonths, subYears } from 'date-fns';
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

const CombinedProductionView = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [timeRange, setTimeRange] = useState('all');
  const [sortField, setSortField] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');
  const { toast } = useToast();

  const { data: records, isLoading, error, refetch } = useQuery({
    queryKey: ['combined-production', searchTerm, timeRange, sortField, sortOrder],
    queryFn: async () => {
      let internationalQuery = supabase.from('production_line_international').select('*');
      let localQuery = supabase.from('production_line_local').select('*');

      // Apply search filter
      if (searchTerm) {
        const searchFilter = `batch_id.ilike.%${searchTerm}%,fromager_identifier.ilike.%${searchTerm}%,cheese_type.ilike.%${searchTerm}%`;
        internationalQuery = internationalQuery.or(searchFilter);
        localQuery = localQuery.or(searchFilter);
      }

      // Apply date range filter
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
        
        internationalQuery = internationalQuery
          .gte('created_at', startDate.toISOString())
          .lte('created_at', now.toISOString());
        
        localQuery = localQuery
          .gte('created_at', startDate.toISOString())
          .lte('created_at', now.toISOString());
      }

      // Apply sorting
      internationalQuery = internationalQuery.order(sortField, { ascending: sortOrder === 'asc' });
      localQuery = localQuery.order(sortField, { ascending: sortOrder === 'asc' });

      const [internationalRes, localRes] = await Promise.all([
        internationalQuery,
        localQuery
      ]);

      if (internationalRes.error) throw internationalRes.error;
      if (localRes.error) throw localRes.error;

      // Combine and mark the source
      const combinedRecords = [
        ...internationalRes.data.map(r => ({ ...r, source: 'International' })),
        ...localRes.data.map(r => ({ ...r, source: 'Local' }))
      ];

      // Apply final sort on combined data
      return combinedRecords.sort((a, b) => {
        const aValue = a[sortField];
        const bValue = b[sortField];
        if (sortOrder === 'asc') {
          return aValue > bValue ? 1 : -1;
        }
        return aValue < bValue ? 1 : -1;
      });
    }
  });

  const handleRefresh = async () => {
    try {
      await refetch();
      toast({
        title: "Success",
        description: "Records refreshed successfully",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to refresh records",
        variant: "destructive",
      });
    }
  };

  const handleExport = (format) => {
    if (!records?.length) {
      toast({
        title: "Error",
        description: "No records available to export",
        variant: "destructive",
      });
      return;
    }

    try {
      let content;
      const timestamp = new Date().toISOString().split('T')[0];
      let filename = `combined-production-${timestamp}`;

      switch (format) {
        case 'csv':
          content = records.map(r => Object.values(r).join(',')).join('\n');
          filename += '.csv';
          break;
        case 'excel':
          // Create Excel-compatible CSV
          content = records.map(r => Object.values(r).join('\t')).join('\n');
          filename += '.xls';
          break;
        default:
          throw new Error('Unsupported format');
      }

      const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: "Success",
        description: `Records exported as ${format.toUpperCase()}`,
      });
    } catch (err) {
      toast({
        title: "Error",
        description: `Failed to export as ${format.toUpperCase()}`,
        variant: "destructive",
      });
    }
  };

  if (error) {
    return (
      <Card className="mt-6">
        <CardContent className="pt-6">
          <div className="text-center text-red-600">
            Error loading records: {error.message}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mt-6">
      <CardHeader>
        <div className="flex justify-between items-center flex-wrap gap-4">
          <CardTitle>Combined Production Records</CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleExport('csv')}
            >
              Export CSV
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleExport('excel')}
            >
              Export Excel
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.print()}
            >
              Print
            </Button>
          </div>
        </div>
        <div className="flex gap-4 mt-4 flex-wrap">
          <Input
            placeholder="Search records..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-xs"
          />
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
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
          <Select value={sortField} onValueChange={setSortField}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="batch_id">Batch ID</SelectItem>
              <SelectItem value="fromager_identifier">Fromager</SelectItem>
              <SelectItem value="cheese_type">Cheese Type</SelectItem>
              <SelectItem value="created_at">Date Created</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sortOrder} onValueChange={setSortOrder}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort order" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="asc">Ascending</SelectItem>
              <SelectItem value="desc">Descending</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-4">Loading records...</div>
        ) : !records?.length ? (
          <div className="text-center py-4">No records found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="border p-2 bg-muted">Source</th>
                  <th className="border p-2 bg-muted">Batch ID</th>
                  <th className="border p-2 bg-muted">Fromager</th>
                  <th className="border p-2 bg-muted">Cheese Type</th>
                  <th className="border p-2 bg-muted">Milk Volume (L)</th>
                  <th className="border p-2 bg-muted">Start Time</th>
                  <th className="border p-2 bg-muted">Duration (hrs)</th>
                  <th className="border p-2 bg-muted">Status</th>
                </tr>
              </thead>
              <tbody>
                {records.map((record) => (
                  <tr key={`${record.source}-${record.id}`} className="hover:bg-muted/50">
                    <td className="border p-2">{record.source}</td>
                    <td className="border p-2">{record.batch_id}</td>
                    <td className="border p-2">{record.fromager_identifier}</td>
                    <td className="border p-2">{record.cheese_type}</td>
                    <td className="border p-2">{record.milk_volume}</td>
                    <td className="border p-2">{new Date(record.start_time).toLocaleString()}</td>
                    <td className="border p-2">{record.estimated_duration}</td>
                    <td className="border p-2">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        record.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        record.status === 'completed' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {record.status}
                      </span>
                    </td>
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

export default CombinedProductionView;
