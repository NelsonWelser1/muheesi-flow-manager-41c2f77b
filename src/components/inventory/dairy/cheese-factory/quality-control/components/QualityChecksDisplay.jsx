
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/supabase';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { RefreshCw, Search } from "lucide-react";
import { format, subDays, subWeeks, subMonths, subYears } from 'date-fns';
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

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

  const renderStatusBadge = (status) => (
    <Badge variant={status === 'Passed' ? 'success' : 'destructive'}>
      {status}
    </Badge>
  );

  return (
    <Card className="w-full">
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
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by batch ID..."
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
          </div>

          {isLoading ? (
            <div className="text-center py-4">Loading records...</div>
          ) : filteredChecks.length === 0 ? (
            <div className="text-center py-4">No records found</div>
          ) : (
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="w-[140px]">Time</TableHead>
                    <TableHead className="w-[120px]">Batch ID</TableHead>
                    <TableHead className="w-[100px]">Parameter</TableHead>
                    <TableHead className="w-[80px] text-right">Actual</TableHead>
                    <TableHead className="w-[80px] text-right">Standard</TableHead>
                    <TableHead className="w-[100px]">Status</TableHead>
                    <TableHead>Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredChecks.map((check) => (
                    <TableRow key={check.id} className="hover:bg-muted/50">
                      <TableCell className="font-medium whitespace-nowrap">
                        {format(new Date(check.created_at), 'MM/dd/yyyy HH:mm')}
                      </TableCell>
                      <TableCell className="font-medium">{check.batch_id}</TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="text-xs">Temperature: {check.temperature_actual} | {renderStatusBadge(check.temperature_status)}</div>
                          <div className="text-xs">pH: {check.ph_level_actual} | {renderStatusBadge(check.ph_level_status)}</div>
                          <div className="text-xs">Moisture: {check.moisture_actual} | {renderStatusBadge(check.moisture_status)}</div>
                          <div className="text-xs">Fat: {check.fat_actual} | {renderStatusBadge(check.fat_status)}</div>
                          <div className="text-xs">Protein: {check.protein_actual} | {renderStatusBadge(check.protein_status)}</div>
                          <div className="text-xs">Salt: {check.salt_actual} | {renderStatusBadge(check.salt_status)}</div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="space-y-1 text-xs">
                          <div>{check.temperature_actual}</div>
                          <div>{check.ph_level_actual}</div>
                          <div>{check.moisture_actual}</div>
                          <div>{check.fat_actual}</div>
                          <div>{check.protein_actual}</div>
                          <div>{check.salt_actual}</div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="space-y-1 text-xs">
                          <div>{check.temperature_standard}</div>
                          <div>{check.ph_level_standard}</div>
                          <div>{check.moisture_standard}</div>
                          <div>{check.fat_standard}</div>
                          <div>{check.protein_standard}</div>
                          <div>{check.salt_standard}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {renderStatusBadge(check.status)}
                        </div>
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate">
                        {check.notes}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default QualityChecksDisplay;
