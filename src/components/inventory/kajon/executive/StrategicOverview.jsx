
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Coffee, Package, TrendingUp, MapPin } from 'lucide-react';
import { Badge } from "@/components/ui/badge";

const StrategicOverview = () => {
  // Sample coffee inventory distribution data
  const coffeeDistribution = [
    { name: 'Arabica', value: 62, color: '#8b5a2b' },
    { name: 'Robusta', value: 38, color: '#d4a76a' },
  ];

  // Sample export destination data
  const exportDestinations = [
    { name: 'Europe', value: 45, color: '#3b82f6' },
    { name: 'North America', value: 30, color: '#10b981' },
    { name: 'Asia', value: 20, color: '#f59e0b' },
    { name: 'Others', value: 5, color: '#6b7280' },
  ];

  // Business status indicators
  const statusIndicators = [
    { 
      label: 'Inventory Health', 
      value: 'Good', 
      icon: Package,
      status: 'good'
    },
    { 
      label: 'Quality Assurance', 
      value: 'Excellent', 
      icon: Coffee,
      status: 'excellent'
    },
    { 
      label: 'Market Performance', 
      value: 'Stable', 
      icon: TrendingUp,
      status: 'good'
    },
    { 
      label: 'Supply Chain', 
      value: 'Attention Needed', 
      icon: MapPin,
      status: 'warning'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'excellent': return 'bg-green-100 text-green-800 border-green-200';
      case 'good': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'warning': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Strategic Overview Dashboard</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium mb-3">Business Status</h3>
            <div className="space-y-3">
              {statusIndicators.map((indicator, index) => (
                <div key={index} className="flex items-center justify-between bg-white p-3 rounded-lg border">
                  <div className="flex items-center">
                    <div className={`p-2 rounded-full mr-3 ${getStatusColor(indicator.status)}`}>
                      <indicator.icon className="h-4 w-4" />
                    </div>
                    <span className="text-sm font-medium">{indicator.label}</span>
                  </div>
                  <Badge className={getStatusColor(indicator.status)}>
                    {indicator.value}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="font-medium mb-1">Coffee Portfolio</h3>
            <div className="h-[180px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={coffeeDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={60}
                    fill="#8884d8"
                    dataKey="value"
                    label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {coffeeDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <h3 className="font-medium mb-1 mt-4">Export Markets</h3>
            <div className="h-[180px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={exportDestinations}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={60}
                    fill="#8884d8"
                    dataKey="value"
                    label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {exportDestinations.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StrategicOverview;
