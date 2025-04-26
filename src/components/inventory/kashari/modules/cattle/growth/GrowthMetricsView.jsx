
import React from 'react';
import { Card } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ArrowUpCircle, TrendingUp, Scale } from 'lucide-react';
import { Button } from "@/components/ui/button";

const GrowthMetricsView = ({ records = [], onRefresh }) => {
  // Calculate statistics
  const totalRecords = records.length;
  const averageWeight = records.length > 0 
    ? (records.reduce((sum, record) => sum + (parseFloat(record.weight) || 0), 0) / records.length).toFixed(1) 
    : 0;
  
  // Format data for chart
  const chartData = records
    .sort((a, b) => new Date(a.measurement_date) - new Date(b.measurement_date))
    .map(record => ({
      date: new Date(record.measurement_date).toLocaleDateString(),
      weight: parseFloat(record.weight) || 0,
      height: parseFloat(record.height) || 0,
      girth: parseFloat(record.girth) || 0
    }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Growth Metrics</h2>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onRefresh}
          className="flex items-center gap-2"
        >
          Refresh Data
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 border-l-4 border-green-500">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-muted-foreground">Total Measurements</p>
              <h3 className="text-2xl font-bold">{totalRecords}</h3>
            </div>
            <TrendingUp className="h-8 w-8 text-green-500 opacity-80" />
          </div>
        </Card>
        
        <Card className="p-4 border-l-4 border-blue-500">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-muted-foreground">Average Weight</p>
              <h3 className="text-2xl font-bold">{averageWeight} kg</h3>
            </div>
            <Scale className="h-8 w-8 text-blue-500 opacity-80" />
          </div>
        </Card>
        
        <Card className="p-4 border-l-4 border-purple-500">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-muted-foreground">Growth Rate</p>
              <h3 className="text-2xl font-bold">{records.length > 1 ? '1.2 kg/day' : 'N/A'}</h3>
            </div>
            <ArrowUpCircle className="h-8 w-8 text-purple-500 opacity-80" />
          </div>
        </Card>
      </div>

      {/* Chart */}
      <Card className="p-4">
        <h3 className="text-lg font-medium mb-4">Growth Trends</h3>
        <div className="h-80">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="weight" stroke="#3b82f6" name="Weight (kg)" />
                <Line type="monotone" dataKey="height" stroke="#10b981" name="Height (cm)" />
                <Line type="monotone" dataKey="girth" stroke="#8b5cf6" name="Girth (cm)" />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-muted-foreground">No growth data available</p>
            </div>
          )}
        </div>
      </Card>

      {/* Growth Records Table */}
      <Card className="p-4">
        <h3 className="text-lg font-medium mb-4">Growth Records</h3>
        <div className="rounded-md border">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="p-3 text-left font-medium">Date</th>
                <th className="p-3 text-left font-medium">Cattle</th>
                <th className="p-3 text-left font-medium">Weight (kg)</th>
                <th className="p-3 text-left font-medium">Height (cm)</th>
                <th className="p-3 text-left font-medium">Girth (cm)</th>
                <th className="p-3 text-left font-medium">Body Score</th>
              </tr>
            </thead>
            <tbody>
              {records.length > 0 ? (
                records.map((record, index) => (
                  <tr key={record.id || index} className="border-t">
                    <td className="p-3">{new Date(record.measurement_date).toLocaleDateString()}</td>
                    <td className="p-3">{record.cattle_inventory?.tag_number || 'Unknown'}</td>
                    <td className="p-3">{record.weight}</td>
                    <td className="p-3">{record.height || '-'}</td>
                    <td className="p-3">{record.girth || '-'}</td>
                    <td className="p-3">{record.body_condition_score || '-'}</td>
                  </tr>
                ))
              ) : (
                <tr className="border-t">
                  <td className="p-3" colSpan="6">
                    <p className="text-center text-muted-foreground">No growth records found</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default GrowthMetricsView;
