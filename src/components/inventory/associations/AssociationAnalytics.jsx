import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import { ArrowUp, ArrowDown, Download, Calendar, Filter, RefreshCw } from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import { exportToCSV, exportToExcel, exportToPDF } from './utils/exportUtils';

const AssociationAnalytics = ({ isKazo, selectedAssociation }) => {
  
  const [timeRange, setTimeRange] = useState('year');
  const [associationFilter, setAssociationFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('production');
  const { toast } = useToast();
  
  const productionData = [
    { month: 'Jan', arabica: 25000, robusta: 18000 },
    { month: 'Feb', arabica: 22000, robusta: 15000 },
    { month: 'Mar', arabica: 28000, robusta: 20000 },
    { month: 'Apr', arabica: 32000, robusta: 22000 },
    { month: 'May', arabica: 37000, robusta: 25000 },
    { month: 'Jun', arabica: 30000, robusta: 21000 },
    { month: 'Jul', arabica: 27000, robusta: 19000 },
    { month: 'Aug', arabica: 24000, robusta: 17000 },
    { month: 'Sep', arabica: 32000, robusta: 23000 },
    { month: 'Oct', arabica: 38000, robusta: 26000 },
    { month: 'Nov', arabica: 35000, robusta: 24000 },
    { month: 'Dec', arabica: 33000, robusta: 22000 }
  ];
  
  const membershipData = [
    { month: 'Jan', members: 120 },
    { month: 'Feb', members: 123 },
    { month: 'Mar', members: 128 },
    { month: 'Apr', members: 135 },
    { month: 'May', members: 142 },
    { month: 'Jun', members: 148 },
    { month: 'Jul', members: 155 },
    { month: 'Aug', members: 160 },
    { month: 'Sep', members: 168 },
    { month: 'Oct', members: 172 },
    { month: 'Nov', members: 175 },
    { month: 'Dec', members: 180 }
  ];
  
  const qualityBreakdown = [
    { name: 'AA Grade', value: 30 },
    { name: 'A Grade', value: 45 },
    { name: 'B Grade', value: 20 },
    { name: 'C Grade', value: 5 }
  ];
  
  const QUALITY_COLORS = ['#4ade80', '#a3e635', '#facc15', '#fb923c'];
  
  const revenueData = [
    { month: 'Jan', revenue: 75000000 },
    { month: 'Feb', revenue: 82000000 },
    { month: 'Mar', revenue: 96000000 },
    { month: 'Apr', revenue: 105000000 },
    { month: 'May', revenue: 118000000 },
    { month: 'Jun', revenue: 125000000 },
    { month: 'Jul', revenue: 110000000 },
    { month: 'Aug', revenue: 95000000 },
    { month: 'Sep', revenue: 130000000 },
    { month: 'Oct', revenue: 148000000 },
    { month: 'Nov', revenue: 140000000 },
    { month: 'Dec', revenue: 135000000 }
  ];
  
  const certificationData = [
    { name: 'Organic', members: 120 },
    { name: 'Fair Trade', members: 150 },
    { name: 'Rainforest Alliance', members: 85 },
    { name: 'UTZ', members: 70 }
  ];
  
  const associations = [
    { id: 'all', name: 'All Associations' },
    { id: 'kanoni', name: 'Kanoni Farmers Association' },
    { id: 'engari', name: 'Engari Coffee Cooperative' },
    { id: 'kyampangara', name: 'Kyampangara Farmers Group' }
  ];
  
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-UG', {
      style: 'currency',
      currency: 'UGX',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };
  
  const getPerformanceIndicator = (current, previous) => {
    const percentChange = ((current - previous) / previous) * 100;
    
    if (percentChange > 0) {
      return (
        <div className="flex items-center text-green-600 text-sm">
          <ArrowUp size={16} className="mr-1" />
          <span>{percentChange.toFixed(1)}%</span>
        </div>
      );
    } else if (percentChange < 0) {
      return (
        <div className="flex items-center text-red-600 text-sm">
          <ArrowDown size={16} className="mr-1" />
          <span>{Math.abs(percentChange).toFixed(1)}%</span>
        </div>
      );
    } else {
      return <span className="text-gray-500 text-sm">0.0%</span>;
    }
  };

  const handleExport = (format) => {
    let dataToExport = [];
    let filename = '';
    let title = `${selectedAssociation || 'All Associations'} - ${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Report`;
    
    switch(activeTab) {
      case 'production':
        dataToExport = productionData;
        filename = 'coffee-production-data';
        break;
      case 'members':
        dataToExport = membershipData;
        filename = 'association-membership-data';
        break;
      case 'quality':
        dataToExport = qualityBreakdown;
        filename = 'coffee-quality-data';
        break;
      case 'financial':
        dataToExport = revenueData;
        filename = 'coffee-financial-data';
        break;
      case 'impact':
        dataToExport = [
          { metric: 'Farmer Income', value: 'Increased by 15%' },
          { metric: 'Community Projects', value: '12 completed' },
          { metric: 'Training Sessions', value: '48 sessions' },
          { metric: 'Environmental Impact', value: '20% reduced water usage' }
        ];
        filename = 'coffee-impact-data';
        break;
      default:
        dataToExport = productionData;
        filename = 'coffee-association-data';
    }

    try {
      switch(format) {
        case 'csv':
          exportToCSV(dataToExport, filename);
          break;
        case 'excel':
          exportToExcel(dataToExport, filename);
          break;
        case 'pdf':
          exportToPDF(dataToExport, filename, title);
          break;
      }

      toast({
        title: "Export Successful",
        description: `Report exported to ${format.toUpperCase()} successfully`,
      });
    } catch (error) {
      console.error(`Export error:`, error);
      toast({
        title: "Export Failed",
        description: `Could not export data to ${format.toUpperCase()}. Error: ${error.message}`,
        variant: "destructive"
      });
    }
  };

  const handleRefresh = () => {
    toast({
      title: "Data Refreshed",
      description: "Analytics data has been updated with the latest information",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Association Analytics</CardTitle>
        <CardDescription>
          Comprehensive analytics and insights for coffee farmers associations
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div className="flex gap-2">
            <Select value={associationFilter} onValueChange={setAssociationFilter}>
              <SelectTrigger className="w-[240px]">
                <SelectValue placeholder="Select association" />
              </SelectTrigger>
              <SelectContent>
                {associations.map(assoc => (
                  <SelectItem key={assoc.id} value={assoc.id}>{assoc.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[160px]">
                <Calendar className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Select time range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="quarter">This Quarter</SelectItem>
                <SelectItem value="year">This Year</SelectItem>
                <SelectItem value="custom">Custom Range</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="icon"
              onClick={handleRefresh}
              title="Refresh data"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Export Report
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => handleExport('pdf')}>
                  <Download className="mr-2 h-4 w-4" />
                  Export as PDF
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport('excel')}>
                  <Download className="mr-2 h-4 w-4" />
                  Export as Excel
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport('csv')}>
                  <Download className="mr-2 h-4 w-4" />
                  Export as CSV
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-muted-foreground">Total Production</p>
                  <h3 className="text-2xl font-bold">363,000 kg</h3>
                </div>
                {getPerformanceIndicator(363000, 320000)}
              </div>
              <p className="text-xs text-muted-foreground mt-2">Compared to last year</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-muted-foreground">Member Growth</p>
                  <h3 className="text-2xl font-bold">180</h3>
                </div>
                {getPerformanceIndicator(180, 150)}
              </div>
              <p className="text-xs text-muted-foreground mt-2">From 150 last year</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-muted-foreground">Average Price</p>
                  <h3 className="text-2xl font-bold">{formatCurrency(12500)}/kg</h3>
                </div>
                {getPerformanceIndicator(12500, 11200)}
              </div>
              <p className="text-xs text-muted-foreground mt-2">Compared to last year</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-muted-foreground">Certification Rate</p>
                  <h3 className="text-2xl font-bold">75%</h3>
                </div>
                {getPerformanceIndicator(75, 60)}
              </div>
              <p className="text-xs text-muted-foreground mt-2">Of members certified</p>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="production" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="w-full justify-start overflow-x-auto">
            <TabsTrigger value="production">Production</TabsTrigger>
            <TabsTrigger value="members">Membership</TabsTrigger>
            <TabsTrigger value="quality">Quality</TabsTrigger>
            <TabsTrigger value="financial">Financial</TabsTrigger>
            <TabsTrigger value="impact">Impact</TabsTrigger>
          </TabsList>
          
          <TabsContent value="production" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Coffee Production Trends</CardTitle>
                <CardDescription>Monthly production by coffee type (kg)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={productionData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`${value} kg`, undefined]} />
                      <Legend />
                      <Bar dataKey="arabica" name="Arabica" fill="#4ade80" />
                      <Bar dataKey="robusta" name="Robusta" fill="#a3e635" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Production by Location</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: 'Kanoni', value: 45 },
                            { name: 'Engari', value: 30 },
                            { name: 'Kyampangara', value: 25 }
                          ]}
                          cx="50%"
                          cy="50%"
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                          label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          <Cell fill="#4ade80" />
                          <Cell fill="#a3e635" />
                          <Cell fill="#fcd34d" />
                        </Pie>
                        <Tooltip formatter={(value) => [`${value}%`, undefined]} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Yield Comparison</CardTitle>
                  <CardDescription>Average kg per hectare</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Certified Farms</span>
                        <span className="text-sm font-medium">850 kg/ha</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-green-500 w-[85%]"></div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Non-Certified Farms</span>
                        <span className="text-sm font-medium">640 kg/ha</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-green-300 w-[64%]"></div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Regional Average</span>
                        <span className="text-sm font-medium">580 kg/ha</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-gray-400 w-[58%]"></div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">National Average</span>
                        <span className="text-sm font-medium">520 kg/ha</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-gray-300 w-[52%]"></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-medium mb-2">Production Efficiency</h3>
                  <div className="flex justify-between items-center">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Input to Output Ratio</p>
                      <p className="text-xl font-bold">1:3.8</p>
                    </div>
                    <Badge className="bg-green-100 text-green-800">High</Badge>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-medium mb-2">Harvest Loss</h3>
                  <div className="flex justify-between items-center">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Post-Harvest Loss Rate</p>
                      <p className="text-xl font-bold">4.2%</p>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Low</Badge>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-medium mb-2">Processing Efficiency</h3>
                  <div className="flex justify-between items-center">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Processing Conversion Rate</p>
                      <p className="text-xl font-bold">78%</p>
                    </div>
                    <Badge className="bg-amber-100 text-amber-800">Medium</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="members" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Membership Growth</CardTitle>
                <CardDescription>Number of active members over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={membershipData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Area type="monotone" dataKey="members" name="Members" stroke="#3b82f6" fill="#93c5fd" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Member Demographics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: 'Women', value: 45 },
                            { name: 'Men', value: 40 },
                            { name: 'Youth', value: 15 }
                          ]}
                          cx="50%"
                          cy="50%"
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                          label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          <Cell fill="#ec4899" />
                          <Cell fill="#3b82f6" />
                          <Cell fill="#a855f7" />
                        </Pie>
                        <Tooltip formatter={(value) => [`${value}%`, undefined]} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Certification Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={certificationData} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis dataKey="name" type="category" />
                        <Tooltip />
                        <Bar dataKey="members" name="Members" fill="#4ade80" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Member Performance</CardTitle>
                <CardDescription>Productivity and engagement metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card>
                    <CardContent className="p-4">
                      <h3 className="font-medium mb-2">Farm Size Distribution</h3>
                      <div className="space-y-3">
                        <div className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>&lt; 1 hectare</span>
                            <span>35%</span>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-green-300 w-[35%]"></div>
                          </div>
                        </div>
                        
                        <div className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>1-3 hectares</span>
                            <span>45%</span>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-green-500 w-[45%]"></div>
                          </div>
                        </div>
                        
                        <div className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>3-5 hectares</span>
                            <span>15%</span>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-green-600 w-[15%]"></div>
                          </div>
                        </div>
                        
                        <div className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>&gt; 5 hectares</span>
                            <span>5%</span>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-green-700 w-[5%]"></div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4">
                      <h3 className="font-medium mb-2">Meeting Attendance</h3>
                      <div className="space-y-3">
                        <div className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>Always (&gt;90%)</span>
                            <span>35%</span>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-blue-600 w-[35%]"></div>
                          </div>
                        </div>
                        
                        <div className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>Regular (60-90%)</span>
                            <span>40%</span>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-blue-500 w-[40%]"></div>
                          </div>
                        </div>
                        
                        <div className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>Occasional (30-60%)</span>
                            <span>15%</span>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-blue-400 w-[15%]"></div>
                          </div>
                        </div>
                        
                        <div className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>Rare (&lt;30%)</span>
                            <span>10%</span>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-gray-400 w-[10%]"></div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4">
                      <h3 className="font-medium mb-2">Training Participation</h3>
                      <div className="space-y-3">
                        <div className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>Advanced (&gt;8 trainings)</span>
                            <span>25%</span>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-purple-600 w-[25%]"></div>
                          </div>
                        </div>
                        
                        <div className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>Regular (5-8 trainings)</span>
                            <span>35%</span>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-purple-500 w-[35%]"></div>
                          </div>
                        </div>
                        
                        <div className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>Basic (2-4 trainings)</span>
                            <span>30%</span>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-purple-400 w-[30%]"></div>
                          </div>
                        </div>
                        
                        <div className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>Minimal (&lt;2 trainings)</span>
                            <span>10%</span>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-gray-400 w-[10%]"></div>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground">Only 35% produce premium quality coffee</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="quality" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Coffee Quality Distribution</CardTitle>
                  <CardDescription>Quality grades by percentage</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={qualityBreakdown}
                          cx="50%"
                          cy="50%"
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                          label={({name, value}) => `${name}: ${value}%`}
                        >
                          {qualityBreakdown.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={QUALITY_COLORS[index % QUALITY_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`${value}%`, undefined]} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Quality Improvement Trend</CardTitle>
                  <CardDescription>Percentage of AA & A grade over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={[
                        { year: '2021', quality: 55 },
                        { year: '2022', quality: 62 },
                        { year: '2023', quality: 68 },
                        { year: '2024', quality: 75 },
                        { year: '2025', quality: 75 }
                      ]}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="year" />
                        <YAxis />
                        <Tooltip formatter={(value) => [`${value}%`, 'Premium Coffee']} />
                        <Line type="monotone" dataKey="quality" name="Premium Coffee (AA & A)" stroke="#4ade80" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quality Factors Analysis</CardTitle>
                <CardDescription>Key factors affecting coffee quality</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Processing Method Impact</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>Wet Process</span>
                            <Badge className="bg-green-100 text-green-800">AA Grade</Badge>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-green-500 w-[75%]"></div>
                          </div>
                          <p className="text-xs text-muted-foreground">75% of wet processed coffee achieves AA grade</p>
                        </div>
                        
                        <div className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>Natural Process</span>
                            <Badge className="bg-amber-100 text-amber-800">B Grade</Badge>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-amber-500 w-[60%]"></div>
                          </div>
                          <p className="text-xs text-muted-foreground">60% of natural processed coffee achieves B grade</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Altitude Correlation</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>High (&gt;1800m)</span>
                            <Badge className="bg-green-100 text-green-800">AA Grade</Badge>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-green-500 w-[80%]"></div>
                          </div>
                          <p className="text-xs text-muted-foreground">80% correlation with premium grades</p>
                        </div>
                        
                        <div className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>Medium (1500-1800m)</span>
                            <Badge className="bg-lime-100 text-lime-800">A Grade</Badge>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-lime-500 w-[65%]"></div>
                          </div>
                          <p className="text-xs text-muted-foreground">65% correlation with good grades</p>
                        </div>
                        
                        <div className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>Low (&lt;1500m)</span>
                            <Badge className="bg-amber-100 text-amber-800">B Grade</Badge>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-amber-500 w-[70%]"></div>
                          </div>
                          <p className="text-xs text-muted-foreground">70% correlation with standard grades</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Training Impact</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>Trained Farmers</span>
                            <Badge>AA/A Grade</Badge>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-blue-500 w-[85%]"></div>
                          </div>
                          <p className="text-xs text-muted-foreground">85% produce premium quality coffee</p>
                        </div>
                        
                        <div className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>Untrained Farmers</span>
                            <Badge>AA/A Grade</Badge>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-blue-300 w-[35%]"></div>
                          </div>
                          <p className="text-xs text-muted-foreground">Only 35% produce premium quality coffee</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AssociationAnalytics;
