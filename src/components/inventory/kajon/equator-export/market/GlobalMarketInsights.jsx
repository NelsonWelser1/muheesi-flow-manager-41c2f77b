
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  ComposedChart, Area
} from 'recharts';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Globe, TrendingUp, ArrowUpRight, ArrowDownRight, 
  Calendar, DollarSign, AlertCircle, Info
} from 'lucide-react';

// Sample market data
const marketData = [
  { month: 'Jan', arabica: 4.20, robusta: 2.15, arabicaVolume: 180, robustaVolume: 220 },
  { month: 'Feb', arabica: 4.25, robusta: 2.18, arabicaVolume: 190, robustaVolume: 230 },
  { month: 'Mar', arabica: 4.30, robusta: 2.25, arabicaVolume: 185, robustaVolume: 240 },
  { month: 'Apr', arabica: 4.40, robusta: 2.30, arabicaVolume: 195, robustaVolume: 250 },
  { month: 'May', arabica: 4.50, robusta: 2.35, arabicaVolume: 210, robustaVolume: 255 },
  { month: 'Jun', arabica: 4.65, robusta: 2.40, arabicaVolume: 220, robustaVolume: 260 },
  { month: 'Jul', arabica: 4.75, robusta: 2.42, arabicaVolume: 230, robustaVolume: 265 },
  { month: 'Aug', arabica: 4.85, robusta: 2.45, arabicaVolume: 240, robustaVolume: 270 },
  { month: 'Sep', arabica: 4.90, robusta: 2.50, arabicaVolume: 245, robustaVolume: 275 },
  { month: 'Oct', arabica: 4.95, robusta: 2.55, arabicaVolume: 250, robustaVolume: 280 },
  { month: 'Nov', arabica: 5.05, robusta: 2.60, arabicaVolume: 255, robustaVolume: 285 },
  { month: 'Dec', arabica: 5.15, robusta: 2.65, arabicaVolume: 260, robustaVolume: 290 },
];

// Sample market insights
const marketInsights = [
  {
    region: 'Europe',
    trend: 'up',
    change: '+2.5%',
    comment: 'Increasing demand for specialty Arabica in Northern European markets',
    impact: 'high'
  },
  {
    region: 'North America',
    trend: 'up',
    change: '+1.8%',
    comment: 'Stable growth with preference for organic certified coffee',
    impact: 'medium'
  },
  {
    region: 'Asia',
    trend: 'up',
    change: '+4.2%',
    comment: 'Emerging markets showing strong growth, particularly in China and South Korea',
    impact: 'high'
  },
  {
    region: 'Middle East',
    trend: 'stable',
    change: '+0.5%',
    comment: 'Consistent demand for high-quality Arabica beans',
    impact: 'low'
  },
  {
    region: 'Africa',
    trend: 'down',
    change: '-1.2%',
    comment: 'Internal consumption decreasing due to economic challenges',
    impact: 'low'
  }
];

const GlobalMarketInsights = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div className="flex-1">
          <h2 className="text-xl font-semibold">Global Coffee Market Insights</h2>
          <p className="text-gray-500 text-sm">Monitor trends, prices, and demand patterns</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>Last 12 Months</span>
          </Button>
          <Button variant="outline">Download Report</Button>
        </div>
      </div>
      
      {/* Market Alert */}
      <Card className="border-amber-200 bg-amber-50">
        <CardContent className="pt-6 flex items-center gap-3">
          <AlertCircle className="h-5 w-5 text-amber-600" />
          <span className="text-amber-800">
            Price Alert: Arabica prices increased by 3.2% in the last week due to supply concerns in Brazil
          </span>
          <Button size="sm" variant="outline" className="ml-auto border-amber-300 text-amber-700 hover:bg-amber-100">
            View Analysis
          </Button>
        </CardContent>
      </Card>
      
      {/* Price Trends */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              <span>Global Coffee Price Trends ($/kg)</span>
            </CardTitle>
            <div className="flex gap-2">
              <Badge className="bg-emerald-100 text-emerald-800">Arabica</Badge>
              <Badge className="bg-amber-100 text-amber-800">Robusta</Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={marketData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => `$${value}/kg`} />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="arabica" 
                  name="Arabica"
                  stroke="#047857" 
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
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      {/* Market Volumes */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2">
            <BarChart className="h-5 w-5 text-purple-600" />
            <span>Global Trading Volumes (Metric Tons)</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={marketData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Bar 
                  dataKey="arabicaVolume" 
                  name="Arabica Volume" 
                  stackId="a" 
                  fill="#047857" 
                />
                <Bar 
                  dataKey="robustaVolume" 
                  name="Robusta Volume" 
                  stackId="a" 
                  fill="#d97706" 
                />
                <Line 
                  type="monotone" 
                  dataKey="arabica" 
                  name="Arabica Price ($/kg)" 
                  stroke="#4f46e5"
                  strokeWidth={2}
                  yAxisId="right"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      {/* Regional Insights */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-blue-600" />
            <span>Regional Market Insights</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {marketInsights.map((insight, index) => (
              <div key={index} className="flex items-start gap-4 p-4 rounded-lg border hover:bg-gray-50">
                <div className={`p-2 rounded-full ${
                  insight.trend === 'up' 
                    ? 'bg-green-100' 
                    : insight.trend === 'down' 
                      ? 'bg-red-100' 
                      : 'bg-blue-100'
                }`}>
                  {insight.trend === 'up' ? (
                    <ArrowUpRight className="h-5 w-5 text-green-600" />
                  ) : insight.trend === 'down' ? (
                    <ArrowDownRight className="h-5 w-5 text-red-600" />
                  ) : (
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <h3 className="font-medium">{insight.region}</h3>
                    <Badge className={
                      insight.trend === 'up' 
                        ? 'bg-green-100 text-green-800' 
                        : insight.trend === 'down' 
                          ? 'bg-red-100 text-red-800' 
                          : 'bg-blue-100 text-blue-800'
                    }>
                      {insight.change}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{insight.comment}</p>
                  <div className="mt-2">
                    <Badge variant="outline" className="text-xs">
                      Impact: {insight.impact}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* Market Recommendations */}
      <Card className="bg-gradient-to-r from-blue-50 to-white">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5 text-blue-600" />
            <span>Strategic Recommendations</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-white rounded-lg border shadow-sm">
              <h3 className="font-medium text-blue-800">Pricing Strategy</h3>
              <p className="text-sm text-gray-600 mt-1">
                Consider adjusting pricing for Arabica exports to European markets to capitalize on the 2.5% 
                demand increase. Current market conditions favor a premium positioning strategy.
              </p>
            </div>
            
            <div className="p-4 bg-white rounded-lg border shadow-sm">
              <h3 className="font-medium text-blue-800">Target Markets</h3>
              <p className="text-sm text-gray-600 mt-1">
                Prioritize expansion in Asian markets, especially China and South Korea, which show a 4.2% growth trend. 
                Focus on specialty coffee varieties that align with emerging consumer preferences.
              </p>
            </div>
            
            <div className="p-4 bg-white rounded-lg border shadow-sm">
              <h3 className="font-medium text-blue-800">Product Mix</h3>
              <p className="text-sm text-gray-600 mt-1">
                Maintain the current ratio of Arabica to Robusta production, but consider increasing organic 
                certified options to meet growing demand in North American markets.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GlobalMarketInsights;
