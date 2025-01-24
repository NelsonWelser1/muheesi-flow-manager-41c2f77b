import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";
import { format, subYears, addYears } from 'date-fns';

const MilkVolumeGraph = ({ data = [], predictedData = [] }) => {
  const [viewMode, setViewMode] = useState('month');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [showCalendar, setShowCalendar] = useState(false);
  const [dateRange, setDateRange] = useState({ from: null, to: null });

  const handleYearChange = (direction) => {
    setSelectedYear(prev => direction === 'prev' ? prev - 1 : prev + 1);
  };

  const getFilteredData = () => {
    if (!Array.isArray(data)) {
      console.log('Data is not an array:', data);
      return [];
    }

    let filteredData = [...data];
    
    if (dateRange.from && dateRange.to) {
      filteredData = data.filter(item => {
        const itemDate = new Date(item.date);
        return itemDate >= dateRange.from && itemDate <= dateRange.to;
      });
    } else {
      filteredData = data.filter(item => {
        const itemDate = new Date(item.date);
        return itemDate.getFullYear() === selectedYear;
      });
    }
    
    return filteredData;
  };

  console.log('MilkVolumeGraph data:', data);
  console.log('MilkVolumeGraph filtered data:', getFilteredData());

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Milk Volume Trends</CardTitle>
          <div className="flex items-center space-x-4">
            <Select value={viewMode} onValueChange={setViewMode}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="View by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="day">Daily</SelectItem>
                <SelectItem value="week">Weekly</SelectItem>
                <SelectItem value="month">Monthly</SelectItem>
                <SelectItem value="year">Yearly</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={() => setShowCalendar(!showCalendar)}>
              <CalendarIcon className="h-4 w-4 mr-2" />
              Select Range
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {showCalendar && (
          <div className="mb-4">
            <Calendar
              mode="range"
              selected={dateRange}
              onSelect={setDateRange}
              className="rounded-md border"
            />
          </div>
        )}
        
        <div className="flex items-center justify-between mb-4">
          <Button variant="ghost" onClick={() => handleYearChange('prev')}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="font-semibold">{selectedYear}</span>
          <Button variant="ghost" onClick={() => handleYearChange('next')}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={getFilteredData()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tickFormatter={(date) => format(new Date(date), 
                  viewMode === 'day' ? 'dd/MM' :
                  viewMode === 'week' ? 'wo week' :
                  viewMode === 'month' ? 'MMM' : 'yyyy'
                )}
              />
              <YAxis />
              <Tooltip 
                labelFormatter={(date) => format(new Date(date), 'PPP')}
                formatter={(value) => [`${value} L`, 'Volume']}
              />
              <Line 
                type="monotone" 
                dataKey="volume" 
                stroke="#8884d8" 
                name="Actual Volume" 
              />
              {selectedYear >= new Date().getFullYear() && (
                <Line 
                  type="monotone" 
                  dataKey="predicted" 
                  stroke="#82ca9d" 
                  strokeDasharray="5 5"
                  name="Predicted Volume" 
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default MilkVolumeGraph;