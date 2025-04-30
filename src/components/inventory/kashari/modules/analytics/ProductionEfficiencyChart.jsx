import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { format, parseISO } from 'date-fns';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  ScatterChart, 
  Scatter, 
  ZAxis, 
  BarChart, 
  Bar 
} from 'recharts';

const ProductionEfficiencyChart = ({ milkData, isLoading, dateRange }) => {
  const efficiencyData = useMemo(() => {
    if (!milkData.length) return [];

    // Calculate efficiency metrics by day
    const efficiencyByDay = {};
    
    milkData.forEach(record => {
      const date = record.date;
      const volume = parseFloat(record.volume) || 0;
      const cows = parseInt(record.milking_cows) || 0;
      
      if (!efficiencyByDay[date]) {
        efficiencyByDay[date] = {
          date,
          totalVolume: 0,
          totalCows: 0,
          sessions: 0
        };
      }
      
      efficiencyByDay[date].totalVolume += volume;
      efficiencyByDay[date].totalCows += cows;
      efficiencyByDay[date].sessions += 1;
    });
    
    // Calculate metrics and convert to array
    return Object.values(efficiencyByDay)
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .map(day => ({
        date: day.date,
        dateFormatted: format(parseISO(day.date), 'MMM d'),
        volumePerCow: day.totalCows > 0 ? day.totalVolume / (day.totalCows / day.sessions) : 0,
        volumePerSession: day.sessions > 0 ? day.totalVolume / day.sessions : 0,
        cowsPerSession: day.sessions > 0 ? day.totalCows / day.sessions : 0
      }));
  }, [milkData]);

  const scatterData = useMemo(() => {
    if (!milkData.length) return [];
    
    // Prepare data for scatter plot
    return milkData.map(record => ({
      x: parseInt(record.milking_cows) || 0,
      y: parseFloat(record.volume) || 0,
      z: 1,
      session: record.session,
      date: format(parseISO(record.date), 'MMM d')
    }));
  }, [milkData]);

  const cowEfficiencyData = useMemo(() => {
    if (!milkData.length) return [];
    
    // Group by number of cows to see efficiency
    const byCows = {};
    
    milkData.forEach(record => {
      const cows = parseInt(record.milking_cows) || 0;
      if (cows === 0) return;
      
      const volume = parseFloat(record.volume) || 0;
      
      if (!byCows[cows]) {
        byCows[cows] = {
          cows,
          totalVolume: 0,
          count: 0
        };
      }
      
      byCows[cows].totalVolume += volume;
      byCows[cows].count += 1;
    });
    
    return Object.values(byCows)
      .filter(group => group.count >= 2)  // Only include groups with sufficient data
      .sort((a, b) => a.cows - b.cows)
      .map(group => ({
        cows: group.cows,
        avgVolume: group.totalVolume / group.count,
        volumePerCow: group.totalVolume / (group.cows * group.count),
        sessions: group.count
      }));
  }, [milkData]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Production Efficiency</CardTitle>
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
          <CardTitle>Daily Production Efficiency</CardTitle>
          <CardDescription>{dateRangeLabel}</CardDescription>
        </CardHeader>
        <CardContent className="h-80">
          {efficiencyData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={efficiencyData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="dateFormatted" />
                <YAxis yAxisId="left" orientation="left" label={{ value: 'Liters per Cow', angle: -90, position: 'insideLeft' }} />
                <YAxis yAxisId="right" orientation="right" label={{ value: 'Volume per Session (L)', angle: 90, position: 'insideRight' }} />
                <Tooltip formatter={(value) => [`${value.toFixed(2)}`, '']} />
                <Legend />
                <Line yAxisId="left" type="monotone" dataKey="volumePerCow" name="Liters per Cow" stroke="#8884d8" activeDot={{ r: 8 }} />
                <Line yAxisId="right" type="monotone" dataKey="volumePerSession" name="Volume per Session" stroke="#82ca9d" />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center">
              <p className="text-muted-foreground">No production data available for this period</p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Milk Production vs. Number of Cows</CardTitle>
            <CardDescription>Scatter plot showing correlation</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            {scatterData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart
                  margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    type="number" 
                    dataKey="x" 
                    name="Milking Cows" 
                    label={{ value: 'Number of Cows', position: 'bottom' }}
                  />
                  <YAxis 
                    type="number" 
                    dataKey="y" 
                    name="Volume" 
                    label={{ value: 'Milk Volume (L)', angle: -90, position: 'insideLeft' }}
                  />
                  <ZAxis type="number" dataKey="z" range={[50, 500]} />
                  <Tooltip 
                    cursor={{ strokeDasharray: '3 3' }}
                    formatter={(value, name, props) => {
                      if (name === 'x') return [`${value} cows`, 'Milking Cows'];
                      if (name === 'y') return [`${value.toFixed(1)} L`, 'Milk Volume'];
                      return [value, name];
                    }}
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-white p-2 border rounded shadow-sm text-xs">
                            <p>{payload[0].payload.date} - {payload[0].payload.session}</p>
                            <p className="font-semibold">{payload[0].value} cows</p>
                            <p className="font-semibold">{payload[1].value.toFixed(1)} liters</p>
                            <p>Efficiency: {(payload[1].value / payload[0].value).toFixed(2)} L/cow</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Legend />
                  <Scatter 
                    name="Morning" 
                    data={scatterData.filter(d => d.session === 'morning')} 
                    fill="#ffc658"
                  />
                  <Scatter 
                    name="Midday" 
                    data={scatterData.filter(d => d.session === 'midday')} 
                    fill="#ff7300"
                  />
                  <Scatter 
                    name="Evening" 
                    data={scatterData.filter(d => d.session === 'evening')} 
                    fill="#0088fe"
                  />
                </ScatterChart>
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
            <CardTitle>Efficiency by Herd Size</CardTitle>
            <CardDescription>Production per cow based on herd size</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            {cowEfficiencyData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={cowEfficiencyData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="cows" label={{ value: 'Number of Cows', position: 'bottom' }} />
                  <YAxis label={{ value: 'Liters per Cow', angle: -90, position: 'insideLeft' }} />
                  <Tooltip 
                    formatter={(value, name, props) => {
                      if (name === 'volumePerCow') return [`${value.toFixed(2)} L`, 'Liters per Cow'];
                      return [value, name];
                    }}
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-white p-2 border rounded shadow-sm text-xs">
                            <p className="font-semibold">{payload[0].payload.cows} cows</p>
                            <p>Avg Volume: {payload[0].payload.avgVolume.toFixed(1)} L</p>
                            <p>Per Cow: {payload[0].payload.volumePerCow.toFixed(2)} L</p>
                            <p>Based on {payload[0].payload.sessions} sessions</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Legend />
                  <Bar dataKey="volumePerCow" name="Liters per Cow" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center">
                <p className="text-muted-foreground">Not enough data to analyze efficiency by herd size</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProductionEfficiencyChart;
