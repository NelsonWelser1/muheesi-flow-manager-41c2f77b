
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Clock, 
  Milk, 
  Thermometer, 
  BellRing, 
  LineChart,
  CalendarRange
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const ProductionDashboard = () => {
  // Mock data for charts
  const productionData = [
    { name: 'Monday', greek: 400, natural: 240, flavored: 320 },
    { name: 'Tuesday', greek: 350, natural: 260, flavored: 290 },
    { name: 'Wednesday', greek: 420, natural: 270, flavored: 310 },
    { name: 'Thursday', greek: 380, natural: 250, flavored: 300 },
    { name: 'Friday', greek: 430, natural: 280, flavored: 330 },
  ];

  const productMix = [
    { name: 'Greek Yogurt', value: 45 },
    { name: 'Natural Yogurt', value: 25 },
    { name: 'Flavored Yogurt', value: 30 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Active Batches"
          value="3"
          icon={Milk}
          trend="+1 from yesterday"
          trendUp={true}
        />
        <MetricCard
          title="Production Efficiency"
          value="92.5%"
          icon={LineChart}
          trend="+2.3% from last week"
          trendUp={true}
        />
        <MetricCard
          title="Quality Score"
          value="95/100"
          icon={Thermometer}
          trend="-2 from last batch"
          trendUp={false}
        />
        <MetricCard
          title="Alerts"
          value="1"
          icon={BellRing}
          trend="Low severity"
          trendUp={null}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Weekly Production (Liters)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={productionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="greek" fill="#0088FE" name="Greek Yogurt" />
                  <Bar dataKey="natural" fill="#00C49F" name="Natural Yogurt" />
                  <Bar dataKey="flavored" fill="#FFBB28" name="Flavored Yogurt" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Production Mix</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={productMix}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {productMix.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Production Schedule</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <ScheduleItem
              time="10:00 AM"
              title="Start New Greek Yogurt Batch"
              type="scheduled"
              assigned="John D."
            />
            <ScheduleItem
              time="11:30 AM"
              title="Quality Check - Strawberry Yogurt"
              type="quality"
              assigned="Maria L."
            />
            <ScheduleItem
              time="01:15 PM"
              title="Packaging - Natural Yogurt"
              type="packaging"
              assigned="Robert S."
            />
            <ScheduleItem
              time="03:00 PM"
              title="Cleaning and Sanitation"
              type="maintenance"
              assigned="Maintenance Team"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const MetricCard = ({ title, value, icon: Icon, trend, trendUp }) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {trend && (
          <p className={`text-xs ${
            trendUp === true ? 'text-green-500' : 
            trendUp === false ? 'text-red-500' : 
            'text-gray-500'
          }`}>
            {trend}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

const ScheduleItem = ({ time, title, type, assigned }) => {
  const getTypeColor = (type) => {
    switch (type) {
      case 'scheduled':
        return 'border-blue-500 bg-blue-50';
      case 'quality':
        return 'border-purple-500 bg-purple-50';
      case 'packaging':
        return 'border-green-500 bg-green-50';
      case 'maintenance':
        return 'border-yellow-500 bg-yellow-50';
      default:
        return 'border-gray-500 bg-gray-50';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'scheduled':
        return <Clock className="h-4 w-4 text-blue-500" />;
      case 'quality':
        return <Thermometer className="h-4 w-4 text-purple-500" />;
      case 'packaging':
        return <Milk className="h-4 w-4 text-green-500" />;
      case 'maintenance':
        return <BellRing className="h-4 w-4 text-yellow-500" />;
      default:
        return <CalendarRange className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className={`p-3 border-l-4 rounded-r-md ${getTypeColor(type)}`}>
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          {getTypeIcon(type)}
          <div>
            <h3 className="font-medium">{title}</h3>
            <p className="text-sm text-gray-500">Assigned to: {assigned}</p>
          </div>
        </div>
        <div className="text-sm font-medium">{time}</div>
      </div>
    </div>
  );
};

export default ProductionDashboard;
