
import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { format, parseISO, startOfDay, isSameDay } from 'date-fns';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  BarChart, 
  Bar 
} from 'recharts';

const ProductionTrendsChart = ({ milkData, isLoading, dateRange }) => {
  const chartData = useMemo(() => {
    if (!milkData.length) return [];

    // Group data by day
    const productionByDay = {};
    
    milkData.forEach(record => {
      const date = record.date;
      const session = record.session;
      const volume = parseFloat(record.volume) || 0;
      
      if (!productionByDay[date]) {
        productionByDay[date] = {
          date,
          total: 0,
          morning: 0,
          midday: 0,
          evening: 0,
          cows: 0
        };
      }
      
      productionByDay[date].total += volume;
      productionByDay[date][session] += volume;
      
      // Keep track of the max number of cows for any session of the day
      const cows = parseInt(record.milking_cows) || 0;
      if (cows > productionByDay[date].cows) {
        productionByDay[date].cows = cows;
      }
    });
    
    // Convert to array and sort by date
    return Object.values(productionByDay)
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .map(day => ({
        ...day,
        dateFormatted: format(parseISO(day.date), 'MMM d'),
        perCow: day.cows > 0 ? day.total / day.cows : 0
      }));
  }, [milkData]);

  const sessionData = useMemo(() => {
    if (!milkData.length) return [];
    
    // Aggregate data by session
    const sessions = ['morning', 'midday', 'evening'];
    return sessions.map(session => {
      const sessionRecords = milkData.filter(record => record.session === session);
      const totalVolume = sessionRecords.reduce((sum, record) => sum + (parseFloat(record.volume) || 0), 0);
      const avgVolume = sessionRecords.length > 0 ? totalVolume / sessionRecords.length : 0;
      
      return {
        name: session.charAt(0).toUpperCase() + session.slice(1),
        totalVolume,
        avgVolume
      };
    });
  }, [milkData]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Production Trends</CardTitle>
          <CardDescription>Loading data...</CardDescription>
        </CardHeader>
        <CardContent className="h-80 animate-pulse bg-gray-100"></CardContent>
      </Card>
    );
  }

  const dateRangeLabel = {
    'week': 'Last 7 Days',
    'month': 'Last 30 Days',
    'quarter': 'Last 90 Days',
    'year': 'Last 365 Days'
  }[dateRange];

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Daily Milk Production</CardTitle>
          <CardDescription>{dateRangeLabel}</CardDescription>
        </CardHeader>
        <CardContent className="h-80">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="dateFormatted" />
                <YAxis yAxisId="left" orientation="left" label={{ value: 'Volume (Liters)', angle: -90, position: 'insideLeft' }} />
                <YAxis yAxisId="right" orientation="right" label={{ value: 'Cows', angle: 90, position: 'insideRight' }} />
                <Tooltip formatter={(value) => [`${value.toFixed(1)}`, '']} />
                <Legend />
                <Line yAxisId="left" type="monotone" dataKey="total" name="Total (L)" stroke="#8884d8" activeDot={{ r: 8 }} />
                <Line yAxisId="left" type="monotone" dataKey="morning" name="Morning (L)" stroke="#ffc658" strokeDasharray="5 5" />
                <Line yAxisId="left" type="monotone" dataKey="midday" name="Midday (L)" stroke="#ff7300" strokeDasharray="5 5" />
                <Line yAxisId="left" type="monotone" dataKey="evening" name="Evening (L)" stroke="#0088fe" strokeDasharray="5 5" />
                <Line yAxisId="right" type="monotone" dataKey="cows" name="Milking Cows" stroke="#82ca9d" />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center">
              <p className="text-muted-foreground">No production data available for this period</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Milk Production by Session</CardTitle>
          <CardDescription>{dateRangeLabel}</CardDescription>
        </CardHeader>
        <CardContent className="h-80">
          {sessionData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={sessionData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis yAxisId="left" orientation="left" label={{ value: 'Total Volume (L)', angle: -90, position: 'insideLeft' }} />
                <YAxis yAxisId="right" orientation="right" label={{ value: 'Avg Volume (L)', angle: 90, position: 'insideRight' }} />
                <Tooltip formatter={(value) => [`${value.toFixed(1)} L`, '']} />
                <Legend />
                <Bar yAxisId="left" dataKey="totalVolume" name="Total Volume (L)" fill="#8884d8" />
                <Bar yAxisId="right" dataKey="avgVolume" name="Avg Volume per Session (L)" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center">
              <p className="text-muted-foreground">No production data available for this period</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductionTrendsChart;
