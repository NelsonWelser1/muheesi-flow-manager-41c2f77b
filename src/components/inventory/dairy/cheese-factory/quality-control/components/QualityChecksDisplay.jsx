
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/supabase';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { RefreshCw } from "lucide-react";
import { format, subDays, subWeeks, subMonths, subYears } from 'date-fns';
import { cn } from "@/lib/utils";
import QualityTrendsChart from './QualityTrendsChart';
import QualityRecordsTable from './QualityRecordsTable';
import QualityRecordsControls from './QualityRecordsControls';

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

  return (
    <div className="space-y-6">
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
            <QualityRecordsControls
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              timeRange={timeRange}
              setTimeRange={setTimeRange}
            />

            {isLoading ? (
              <div className="text-center py-4">Loading records...</div>
            ) : filteredChecks.length === 0 ? (
              <div className="text-center py-4">No records found</div>
            ) : (
              <QualityRecordsTable checks={filteredChecks} />
            )}
          </div>
        </CardContent>
      </Card>

      <QualityTrendsChart chartData={chartData} />
    </div>
  );
};

export default QualityChecksDisplay;
