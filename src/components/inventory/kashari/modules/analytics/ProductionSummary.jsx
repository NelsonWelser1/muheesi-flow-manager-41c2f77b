import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Droplet, Users, TrendingUp, CalendarDays } from "lucide-react";
import { format, parseISO } from 'date-fns';

const ProductionSummary = ({ milkData, isLoading, dateRange }) => {
  const summaryData = useMemo(() => {
    if (!milkData.length) return {
      totalVolume: 0,
      averageVolume: 0,
      averageCows: 0,
      productionPerCow: 0,
      recentTrend: 0,
      mostProductiveDay: null,
      totalRecords: 0,
    };

    // Calculate total volume
    const totalVolume = milkData.reduce((sum, record) => sum + (parseFloat(record.volume) || 0), 0);
    
    // Calculate average volume per day
    const uniqueDates = [...new Set(milkData.map(record => record.date))];
    const averageVolume = uniqueDates.length > 0 ? totalVolume / uniqueDates.length : 0;
    
    // Calculate average number of milking cows
    const totalCows = milkData.reduce((sum, record) => sum + (parseInt(record.milking_cows) || 0), 0);
    const averageCows = milkData.length > 0 ? totalCows / milkData.length : 0;
    
    // Calculate production per cow
    const productionPerCow = averageCows > 0 ? totalVolume / averageCows : 0;
    
    // Determine most productive day
    const productionByDay = {};
    milkData.forEach(record => {
      const day = record.date;
      if (!productionByDay[day]) productionByDay[day] = 0;
      productionByDay[day] += parseFloat(record.volume) || 0;
    });
    
    let mostProductiveDay = null;
    let maxProduction = 0;
    
    Object.entries(productionByDay).forEach(([day, production]) => {
      if (production > maxProduction) {
        maxProduction = production;
        mostProductiveDay = { date: day, volume: production };
      }
    });
    
    // Calculate recent trend (comparing first half with second half)
    let recentTrend = 0;
    if (milkData.length >= 4) {
      const midpoint = Math.floor(milkData.length / 2);
      const firstHalf = milkData.slice(0, midpoint);
      const secondHalf = milkData.slice(midpoint);
      
      const firstHalfTotal = firstHalf.reduce((sum, record) => sum + (parseFloat(record.volume) || 0), 0);
      const secondHalfTotal = secondHalf.reduce((sum, record) => sum + (parseFloat(record.volume) || 0), 0);
      
      if (firstHalfTotal > 0) {
        recentTrend = ((secondHalfTotal - firstHalfTotal) / firstHalfTotal) * 100;
      }
    }
    
    return {
      totalVolume,
      averageVolume,
      averageCows,
      productionPerCow,
      recentTrend,
      mostProductiveDay,
      totalRecords: milkData.length,
    };
  }, [milkData]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array(4).fill(0).map((_, index) => (
          <Card key={index} className="animate-pulse">
            <CardHeader className="pb-2">
              <div className="h-6 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Droplet className="h-4 w-4 text-blue-500" />
              Total Milk Production
            </CardTitle>
            <CardDescription>{dateRangeLabel}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summaryData.totalVolume.toFixed(1)} L</div>
            <p className="text-xs text-muted-foreground">
              From {summaryData.totalRecords} milking records
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-green-500" />
              Average Daily Production
            </CardTitle>
            <CardDescription>{dateRangeLabel}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summaryData.averageVolume.toFixed(1)} L</div>
            <p className="text-xs text-muted-foreground">
              Daily average across all milking sessions
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users className="h-4 w-4 text-orange-500" />
              Average Production per Cow
            </CardTitle>
            <CardDescription>{dateRangeLabel}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summaryData.productionPerCow.toFixed(1)} L</div>
            <p className="text-xs text-muted-foreground">
              Avg {summaryData.averageCows.toFixed(1)} milking cows per session
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-purple-500" />
              Production Trend
            </CardTitle>
            <CardDescription>{dateRangeLabel}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${summaryData.recentTrend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {summaryData.recentTrend > 0 ? '↑' : summaryData.recentTrend < 0 ? '↓' : ''}
              {Math.abs(summaryData.recentTrend).toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">
              {summaryData.recentTrend >= 0 ? 'Increase' : 'Decrease'} compared to previous period
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Most Productive Day</CardTitle>
            <CardDescription>Highest milk production in a single day</CardDescription>
          </CardHeader>
          <CardContent>
            {summaryData.mostProductiveDay ? (
              <div className="space-y-2">
                <div className="text-2xl font-bold">{summaryData.mostProductiveDay.volume.toFixed(1)} L</div>
                <p className="text-sm">
                  on {format(parseISO(summaryData.mostProductiveDay.date), 'EEEE, MMMM d, yyyy')}
                </p>
              </div>
            ) : (
              <p className="text-muted-foreground">No production data available</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Session Distribution</CardTitle>
            <CardDescription>Milk production by milking session</CardDescription>
          </CardHeader>
          <CardContent>
            {milkData.length > 0 ? (
              <div className="space-y-4">
                {['morning', 'midday', 'evening'].map(session => {
                  const sessionData = milkData.filter(record => record.session === session);
                  const sessionTotal = sessionData.reduce((sum, record) => sum + (parseFloat(record.volume) || 0), 0);
                  const sessionPercentage = summaryData.totalVolume > 0 
                    ? (sessionTotal / summaryData.totalVolume) * 100 
                    : 0;
                  
                  return (
                    <div key={session} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="capitalize">{session}</span>
                        <span>{sessionTotal.toFixed(1)} L ({sessionPercentage.toFixed(1)}%)</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className={`h-2.5 rounded-full ${
                            session === 'morning' ? 'bg-yellow-400' : 
                            session === 'midday' ? 'bg-orange-500' : 'bg-blue-600'
                          }`}
                          style={{ width: `${sessionPercentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-muted-foreground">No production data available</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProductionSummary;
