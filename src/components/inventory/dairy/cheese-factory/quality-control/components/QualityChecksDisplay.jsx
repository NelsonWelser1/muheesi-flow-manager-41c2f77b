
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
        ph: 0,
        moisture: 0,
        fat: 0,
        protein: 0,
        salt: 0,
        count: 0
      };
    }
    acc[date].temperature += Number(check.temperature_actual);
    acc[date].ph += Number(check.ph_level_actual);
    acc[date].moisture += Number(check.moisture_actual);
    acc[date].fat += Number(check.fat_actual);
    acc[date].protein += Number(check.protein_actual);
    acc[date].salt += Number(check.salt_actual);
    acc[date].count += 1;
    return acc;
  }, {});

  const chartData = Object.values(trendData).map(day => ({
    date: day.date,
    temperature: day.temperature / day.count,
    ph: day.ph / day.count,
    moisture: day.moisture / day.count,
    fat: day.fat / day.count,
    protein: day.protein / day.count,
    salt: day.salt / day.count
  }));

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
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Quality Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="temperature" stroke="#8884d8" name="Temperature" />
                <Line type="monotone" dataKey="ph" stroke="#82ca9d" name="pH Level" />
                <Line type="monotone" dataKey="moisture" stroke="#ffc658" name="Moisture" />
                <Line type="monotone" dataKey="fat" stroke="#ff7300" name="Fat" />
                <Line type="monotone" dataKey="protein" stroke="#00C49F" name="Protein" />
                <Line type="monotone" dataKey="salt" stroke="#FFBB28" name="Salt" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

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
                    <TableRow>
                      <TableHead>Time</TableHead>
                      <TableHead>Batch ID</TableHead>
                      <TableHead>Parameter</TableHead>
                      <TableHead>Actual</TableHead>
                      <TableHead>Standard</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Notes</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredChecks.flatMap((check) => [
                      {
                        ...check,
                        parameter: 'Temperature',
                        actual: check.temperature_actual,
                        standard: check.temperature_standard,
                        status: check.temperature_status
                      },
                      {
                        ...check,
                        parameter: 'pH Level',
                        actual: check.ph_level_actual,
                        standard: check.ph_level_standard,
                        status: check.ph_level_status
                      },
                      {
                        ...check,
                        parameter: 'Moisture',
                        actual: check.moisture_actual,
                        standard: check.moisture_standard,
                        status: check.moisture_status
                      },
                      {
                        ...check,
                        parameter: 'Fat',
                        actual: check.fat_actual,
                        standard: check.fat_standard,
                        status: check.fat_status
                      },
                      {
                        ...check,
                        parameter: 'Protein',
                        actual: check.protein_actual,
                        standard: check.protein_standard,
                        status: check.protein_status
                      },
                      {
                        ...check,
                        parameter: 'Salt',
                        actual: check.salt_actual,
                        standard: check.salt_standard,
                        status: check.salt_status
                      }
                    ]).map((row, index) => (
                      <TableRow key={`${row.id}-${row.parameter}`}>
                        {index % 6 === 0 && (
                          <TableCell rowSpan={6} className="align-top">
                            {format(new Date(row.created_at), 'PPp')}
                          </TableCell>
                        )}
                        {index % 6 === 0 && (
                          <TableCell rowSpan={6} className="align-top font-medium">
                            {row.batch_id}
                          </TableCell>
                        )}
                        <TableCell>{row.parameter}</TableCell>
                        <TableCell>{row.actual}</TableCell>
                        <TableCell>{row.standard}</TableCell>
                        <TableCell>{renderStatusBadge(row.status)}</TableCell>
                        {index % 6 === 0 && (
                          <TableCell rowSpan={6} className="align-top">
                            {row.notes}
                          </TableCell>
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QualityChecksDisplay;
