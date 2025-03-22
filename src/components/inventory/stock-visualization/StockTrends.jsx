
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ResponsiveContainer, LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const StockTrends = ({ historicalData }) => {
  const [timeRange, setTimeRange] = useState('3months');
  const [stockType, setStockType] = useState('all');
  
  // Mock data generation based on filters
  const generateChartData = () => {
    let months = [];
    
    if (timeRange === '1month') {
      months = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
    } else if (timeRange === '3months') {
      months = ['Mar', 'Apr', 'May'];
    } else if (timeRange === '6months') {
      months = ['Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May'];
    } else {
      months = ['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May'];
    }
    
    // Generate data based on selected coffee type
    return months.map((month, index) => {
      if (stockType === 'all') {
        return {
          month,
          arabica: 150 + Math.round(Math.random() * 50) + index * 10,
          robusta: 100 + Math.round(Math.random() * 30) + index * 5,
          mixed: 50 + Math.round(Math.random() * 20) + index * 2
        };
      } else if (stockType === 'arabica') {
        return {
          month,
          arabica: 150 + Math.round(Math.random() * 50) + index * 10
        };
      } else if (stockType === 'robusta') {
        return {
          month,
          robusta: 100 + Math.round(Math.random() * 30) + index * 5
        };
      } else {
        return {
          month,
          mixed: 50 + Math.round(Math.random() * 20) + index * 2
        };
      }
    });
  };
  
  const chartData = generateChartData();
  
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-medium">Stock Level Trends</h3>
          <div className="flex space-x-2">
            <Select defaultValue={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Time Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1month">1 Month</SelectItem>
                <SelectItem value="3months">3 Months</SelectItem>
                <SelectItem value="6months">6 Months</SelectItem>
                <SelectItem value="1year">1 Year</SelectItem>
              </SelectContent>
            </Select>
            
            <Select defaultValue={stockType} onValueChange={setStockType}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Coffee Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="arabica">Arabica</SelectItem>
                <SelectItem value="robusta">Robusta</SelectItem>
                <SelectItem value="mixed">Mixed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <Tabs defaultValue="line">
          <TabsList className="mb-4">
            <TabsTrigger value="line">Line Chart</TabsTrigger>
            <TabsTrigger value="bar">Bar Chart</TabsTrigger>
          </TabsList>
          
          <TabsContent value="line" className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                {stockType === 'all' || stockType === 'arabica' ? 
                  <Line type="monotone" dataKey="arabica" stroke="#8884d8" activeDot={{ r: 8 }} name="Arabica" /> 
                  : null
                }
                {stockType === 'all' || stockType === 'robusta' ? 
                  <Line type="monotone" dataKey="robusta" stroke="#82ca9d" name="Robusta" /> 
                  : null
                }
                {stockType === 'all' || stockType === 'mixed' ? 
                  <Line type="monotone" dataKey="mixed" stroke="#ffc658" name="Mixed" /> 
                  : null
                }
              </LineChart>
            </ResponsiveContainer>
          </TabsContent>
          
          <TabsContent value="bar" className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                {stockType === 'all' || stockType === 'arabica' ? 
                  <Bar dataKey="arabica" fill="#8884d8" name="Arabica" /> 
                  : null
                }
                {stockType === 'all' || stockType === 'robusta' ? 
                  <Bar dataKey="robusta" fill="#82ca9d" name="Robusta" /> 
                  : null
                }
                {stockType === 'all' || stockType === 'mixed' ? 
                  <Bar dataKey="mixed" fill="#ffc658" name="Mixed" /> 
                  : null
                }
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>
        </Tabs>
        
        <div className="mt-4 text-sm text-muted-foreground">
          <p>
            {timeRange === '1month' 
              ? 'Showing weekly stock levels for the past month' 
              : timeRange === '3months' 
                ? 'Showing monthly stock levels for the past quarter'
                : timeRange === '6months'
                  ? 'Showing monthly stock levels for the past 6 months'
                  : 'Showing monthly stock levels for the past year'
            }
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default StockTrends;
