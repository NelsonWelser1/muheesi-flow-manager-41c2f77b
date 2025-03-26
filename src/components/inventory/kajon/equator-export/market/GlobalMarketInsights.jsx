
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { 
  Globe, 
  TrendingUp, 
  BarChart3, 
  CircleDollarSign, 
  Calendar, 
  Download,
  Info,
  Lightbulb
} from 'lucide-react';

const GlobalMarketInsights = () => {
  const [timePeriod, setTimePeriod] = useState('6m');
  
  // Sample data for price trends
  const priceData = {
    '1m': [
      { date: 'Week 1', arabica: 4.12, robusta: 2.05, benchmark: 3.80 },
      { date: 'Week 2', arabica: 4.18, robusta: 2.10, benchmark: 3.82 },
      { date: 'Week 3', arabica: 4.25, robusta: 2.18, benchmark: 3.85 },
      { date: 'Week 4', arabica: 4.30, robusta: 2.22, benchmark: 3.88 }
    ],
    '3m': [
      { date: 'Jan', arabica: 4.05, robusta: 2.00, benchmark: 3.75 },
      { date: 'Feb', arabica: 4.15, robusta: 2.10, benchmark: 3.80 },
      { date: 'Mar', arabica: 4.30, robusta: 2.22, benchmark: 3.88 }
    ],
    '6m': [
      { date: 'Jul', arabica: 3.85, robusta: 1.90, benchmark: 3.60 },
      { date: 'Aug', arabica: 3.92, robusta: 1.95, benchmark: 3.65 },
      { date: 'Sep', arabica: 4.00, robusta: 1.98, benchmark: 3.70 },
      { date: 'Oct', arabica: 4.05, robusta: 2.00, benchmark: 3.75 },
      { date: 'Nov', arabica: 4.15, robusta: 2.10, benchmark: 3.80 },
      { date: 'Dec', arabica: 4.30, robusta: 2.22, benchmark: 3.88 }
    ],
    '1y': [
      { date: 'Jan', arabica: 3.75, robusta: 1.80, benchmark: 3.50 },
      { date: 'Feb', arabica: 3.80, robusta: 1.85, benchmark: 3.55 },
      { date: 'Mar', arabica: 3.78, robusta: 1.82, benchmark: 3.52 },
      { date: 'Apr', arabica: 3.82, robusta: 1.88, benchmark: 3.58 },
      { date: 'May', arabica: 3.85, robusta: 1.90, benchmark: 3.60 },
      { date: 'Jun', arabica: 3.88, robusta: 1.92, benchmark: 3.62 },
      { date: 'Jul', arabica: 3.85, robusta: 1.90, benchmark: 3.60 },
      { date: 'Aug', arabica: 3.92, robusta: 1.95, benchmark: 3.65 },
      { date: 'Sep', arabica: 4.00, robusta: 1.98, benchmark: 3.70 },
      { date: 'Oct', arabica: 4.05, robusta: 2.00, benchmark: 3.75 },
      { date: 'Nov', arabica: 4.15, robusta: 2.10, benchmark: 3.80 },
      { date: 'Dec', arabica: 4.30, robusta: 2.22, benchmark: 3.88 }
    ]
  };
  
  // Market distribution data
  const marketDistribution = [
    { name: 'Europe', value: 35 },
    { name: 'North America', value: 25 },
    { name: 'Asia', value: 20 },
    { name: 'Middle East', value: 15 },
    { name: 'Africa', value: 5 }
  ];
  
  // Coffee quality premium data
  const qualityPremiumData = [
    { grade: 'Standard', premium: 0 },
    { grade: 'Premium', premium: 10 },
    { grade: 'Specialty', premium: 25 },
    { grade: 'Single Origin', premium: 35 },
    { grade: 'Organic Certified', premium: 45 }
  ];
  
  // Market Intelligence reports
  const marketReports = [
    {
      title: 'Global Coffee Market Outlook 2024',
      date: '2023-12-01',
      summary: 'Comprehensive analysis of global coffee market trends, pricing forecasts, and demand projections for 2024.',
      tags: ['Market Analysis', 'Forecast']
    },
    {
      title: 'European Coffee Import Regulations Update',
      date: '2023-11-15',
      summary: 'Latest updates on regulatory changes affecting coffee imports into European Union countries.',
      tags: ['Regulations', 'Europe']
    },
    {
      title: 'Specialty Coffee Trends in North America',
      date: '2023-10-30',
      summary: 'Emerging trends in specialty coffee consumption across North American markets and premium pricing opportunities.',
      tags: ['Specialty', 'North America']
    },
    {
      title: 'Climate Impact on Coffee Production Regions',
      date: '2023-10-15',
      summary: 'Analysis of climate change effects on major coffee producing regions and potential supply chain disruptions.',
      tags: ['Climate', 'Production']
    }
  ];
  
  // Market insights and recommendations
  const marketInsights = [
    {
      insight: 'Premium for Organic Certification Rising',
      action: 'Increase organic certified production capacity',
      impact: 'high'
    },
    {
      insight: 'Asian Markets Showing 15% Growth in Specialty Coffee',
      action: 'Develop targeted marketing for Asian buyers',
      impact: 'medium'
    },
    {
      insight: 'European Sustainability Requirements Tightening',
      action: 'Update compliance documentation for EU exports',
      impact: 'high'
    },
    {
      insight: 'Price Volatility Expected Q1 2024',
      action: 'Consider hedging strategies for Q1 contracts',
      impact: 'medium'
    }
  ];
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Global Market Intelligence</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>This Quarter</span>
          </Button>
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <Download className="h-4 w-4" />
            <span>Export Data</span>
          </Button>
        </div>
      </div>
      
      {/* Price Trends Chart */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2 text-lg">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              Coffee Price Trends ($/kg)
            </CardTitle>
            <div className="flex space-x-1">
              {['1m', '3m', '6m', '1y'].map((period) => (
                <Button 
                  key={period} 
                  variant={timePeriod === period ? "default" : "outline"} 
                  size="sm" 
                  className="text-xs h-7"
                  onClick={() => setTimePeriod(period)}
                >
                  {period}
                </Button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={priceData[timePeriod]}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 10,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={(value) => `$${value.toFixed(2)}/kg`} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="arabica"
                  name="Arabica Premium"
                  stroke="#8884d8"
                  activeDot={{ r: 8 }}
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="robusta"
                  name="Robusta"
                  stroke="#82ca9d"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="benchmark"
                  name="Global Benchmark"
                  stroke="#ff7300"
                  strokeDasharray="5 5"
                  strokeWidth={1.5}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      {/* Market Analysis Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Market Distribution */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Globe className="h-5 w-5 text-emerald-600" />
              Market Distribution by Region
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={marketDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {marketDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value}%`} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        {/* Quality Premium */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <CircleDollarSign className="h-5 w-5 text-amber-600" />
              Quality Premium Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={qualityPremiumData}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 10,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="grade" />
                  <YAxis />
                  <Tooltip formatter={(value) => `+${value}%`} />
                  <Bar dataKey="premium" name="Price Premium" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Market Intelligence Reports */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Info className="h-5 w-5 text-blue-600" />
            Market Intelligence Reports
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {marketReports.map((report, index) => (
              <div 
                key={index} 
                className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium">{report.title}</h3>
                  <span className="text-sm text-gray-500">{report.date}</span>
                </div>
                <p className="text-sm text-gray-600 mb-3">{report.summary}</p>
                <div className="flex flex-wrap gap-2">
                  {report.tags.map((tag, tagIndex) => (
                    <Badge key={tagIndex} variant="outline" className="bg-blue-50">{tag}</Badge>
                  ))}
                </div>
                <Button size="sm" variant="outline" className="mt-3">
                  Download Report
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* Strategic Insights */}
      <Card className="bg-gradient-to-r from-purple-50 to-white">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Lightbulb className="h-5 w-5 text-purple-600" />
            Strategic Market Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {marketInsights.map((item, index) => (
              <div key={index} className="bg-white p-4 rounded-lg border shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="bg-purple-100 p-2 rounded-full">
                    <Lightbulb className="h-5 w-5 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <h3 className="font-medium">{item.insight}</h3>
                      <Badge className={
                        item.impact === 'high' 
                          ? 'bg-red-100 text-red-800' 
                          : 'bg-amber-100 text-amber-800'
                      }>
                        {item.impact.toUpperCase()} IMPACT
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">
                      <strong>Recommended Action:</strong> {item.action}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GlobalMarketInsights;
