
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { Activity, TrendingUp, CircleDollarSign, Map, Calendar } from 'lucide-react';

// Sample data for charts
const monthlyExports = [
  { month: 'Jan', value: 120, arabica: 80, robusta: 40 },
  { month: 'Feb', value: 150, arabica: 90, robusta: 60 },
  { month: 'Mar', value: 180, arabica: 100, robusta: 80 },
  { month: 'Apr', value: 210, arabica: 130, robusta: 80 },
  { month: 'May', value: 250, arabica: 150, robusta: 100 },
  { month: 'Jun', value: 290, arabica: 170, robusta: 120 },
];

const destinationData = [
  { name: 'Europe', value: 35 },
  { name: 'North America', value: 25 },
  { name: 'Asia', value: 20 },
  { name: 'Middle East', value: 15 },
  { name: 'Others', value: 5 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const ExportDashboard = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Export Performance Overview</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>This Quarter</span>
          </Button>
          <Button variant="outline" size="sm">Export Report</Button>
        </div>
      </div>
      
      {/* Charts Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Monthly Export Volumes */}
        <Card className="col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Activity className="h-5 w-5 text-blue-600" />
              Monthly Export Volumes (Metric Tons)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={monthlyExports}
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
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="arabica" name="Arabica" stackId="a" fill="#8884d8" />
                  <Bar dataKey="robusta" name="Robusta" stackId="a" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        {/* Export by Destination */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Map className="h-5 w-5 text-emerald-600" />
              Exports by Destination
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={destinationData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {destinationData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value}%`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        {/* Price Trends */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <TrendingUp className="h-5 w-5 text-amber-600" />
              Coffee Price Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={monthlyExports}
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
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="arabica"
                    name="Arabica ($/kg)"
                    stroke="#8884d8"
                    activeDot={{ r: 8 }}
                  />
                  <Line type="monotone" dataKey="robusta" name="Robusta ($/kg)" stroke="#82ca9d" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Key Performance Indicators */}
      <Card className="bg-gradient-to-r from-blue-50 to-white">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-lg">
            <CircleDollarSign className="h-5 w-5 text-blue-600" />
            Export Business Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg border shadow-sm">
              <div className="text-sm text-gray-500">Average Price per Ton</div>
              <div className="text-2xl font-bold">$3,580</div>
              <div className="text-xs text-green-600 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                +5.2% vs Last Quarter
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg border shadow-sm">
              <div className="text-sm text-gray-500">Customer Retention</div>
              <div className="text-2xl font-bold">92%</div>
              <div className="text-xs text-green-600 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                +2.5% vs Last Year
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg border shadow-sm">
              <div className="text-sm text-gray-500">Quality Premium</div>
              <div className="text-2xl font-bold">+15%</div>
              <div className="text-xs text-green-600 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                +3.1% vs Industry Average
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Shipment Status */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Active Shipments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[
              { id: 'EQ-2453', destination: 'Hamburg, Germany', status: 'In Transit', eta: '2 days', container: '20ft', volume: '18 tons' },
              { id: 'EQ-2455', destination: 'New York, USA', status: 'Loading', eta: '10 days', container: '40ft', volume: '24 tons' },
              { id: 'EQ-2458', destination: 'Tokyo, Japan', status: 'Preparing', eta: '15 days', container: '20ft', volume: '16 tons' },
            ].map((shipment) => (
              <div key={shipment.id} className="flex justify-between items-center p-3 border rounded-lg hover:bg-gray-50">
                <div className="flex gap-3 items-center">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <Ship className="h-5 w-5 text-blue-700" />
                  </div>
                  <div>
                    <div className="font-medium">{shipment.id}</div>
                    <div className="text-sm text-gray-500">{shipment.destination}</div>
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-sm font-medium">{shipment.volume}</div>
                  <div className="text-xs text-gray-500">{shipment.container}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">{shipment.status}</div>
                  <div className="text-xs text-gray-500">ETA: {shipment.eta}</div>
                </div>
              </div>
            ))}
            <Button variant="outline" className="w-full mt-2">View All Shipments</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExportDashboard;
