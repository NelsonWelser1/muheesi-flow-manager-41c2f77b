import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart3, LineChart, PieChart, Users, FileText, Settings, Calendar, 
  CheckSquare, Phone, CreditCard, Package, DollarSign, Box, 
  Handshake, FolderArchive, BarChart, TrendingUp, TrendingDown, 
  Globe, Activity
} from 'lucide-react';
import PADashboard from './pa-dashboard/PADashboard';
import { Progress } from "@/components/ui/progress";

const RoleDashboard = ({ role }) => {
  const [activeMetric, setActiveMetric] = useState('revenue');

  // Return the specialized PA Dashboard if the role is CEO's Personal Assistant
  if (role === "CEO's Personal Assistant") {
    return <PADashboard />;
  }

  // Dynamic content based on role for other roles
  const getRoleSpecificContent = () => {
    switch (role) {
      case 'Chief Executive Officer (CEO)':
        return {
          title: 'CEO Strategic Dashboard',
          description: 'Comprehensive overview of all business operations and key performance indicators',
          metrics: [
            { 
              id: 'revenue',
              title: "Total Revenue", 
              value: "UGX 1,245,000,000", 
              change: "+12.5%", 
              trend: "up",
              icon: <BarChart3 className="h-5 w-5 text-muted-foreground" />,
              color: "bg-violet-500"
            },
            { 
              id: 'projects',
              title: "Active Projects", 
              value: "8", 
              change: "+2", 
              trend: "up",
              icon: <FileText className="h-5 w-5 text-muted-foreground" />,
              color: "bg-blue-500"
            },
            { 
              id: 'value',
              title: "Company Value", 
              value: "UGX 3.2B", 
              change: "+5.7%", 
              trend: "up",
              icon: <LineChart className="h-5 w-5 text-muted-foreground" />,
              color: "bg-emerald-500"
            },
            { 
              id: 'employees',
              title: "Total Employees", 
              value: "126", 
              change: "+3", 
              trend: "up",
              icon: <Users className="h-5 w-5 text-muted-foreground" />,
              color: "bg-amber-500"
            },
          ],
          businessUnits: [
            { name: "Grand Berna Dairies", performance: 92, revenue: "UGX 562M", growth: "+8.3%" },
            { name: "KAJON Coffee Limited", performance: 78, revenue: "UGX 421M", growth: "+15.2%" },
            { name: "Kyalima Farmers", performance: 85, revenue: "UGX 262M", growth: "+4.7%" }
          ],
          recentActivities: [
            { type: "approval", title: "Capital Expenditure Approved", time: "Today, 2:30 PM", status: "completed" },
            { type: "meeting", title: "Board Meeting", time: "Tomorrow, 10:00 AM", status: "upcoming" },
            { type: "report", title: "Quarterly Financial Report", time: "Yesterday", status: "completed" },
            { type: "alert", title: "New Export Opportunity", time: "2 days ago", status: "needs-action" }
          ],
          strategicInitiatives: [
            { title: "Market Expansion - Eastern Africa", completion: 65, status: "on-track" },
            { title: "Digital Transformation", completion: 40, status: "at-risk" },
            { title: "Operational Excellence Program", completion: 80, status: "on-track" },
            { title: "Research & Development - New Products", completion: 25, status: "delayed" }
          ]
        };
      case 'System Administrator (SysAdmin)':
        return {
          title: 'System Admin Dashboard',
          metrics: [
            { title: 'System Uptime', value: '99.9%', change: '+0.2%', icon: <Settings className="h-5 w-5 text-muted-foreground" /> },
            { title: 'Active Users', value: '87', change: '+5', icon: <Users className="h-5 w-5 text-muted-foreground" /> },
            { title: 'Pending Tickets', value: '12', change: '-3', icon: <FileText className="h-5 w-5 text-muted-foreground" /> },
            { title: 'System Health', value: 'Good', change: 'Stable', icon: <LineChart className="h-5 w-5 text-muted-foreground" /> },
          ]
        };
      default:
        return {
          title: `${role} Dashboard`,
          metrics: [
            { title: 'Key Performance', value: '94%', change: '+2.5%', icon: <BarChart3 className="h-5 w-5 text-muted-foreground" /> },
            { title: 'Tasks Completed', value: '24', change: '+7', icon: <FileText className="h-5 w-5 text-muted-foreground" /> },
            { title: 'Department Budget', value: 'UGX 45M', change: '-2.3%', icon: <PieChart className="h-5 w-5 text-muted-foreground" /> },
            { title: 'Upcoming Events', value: '3', change: '+1', icon: <Calendar className="h-5 w-5 text-muted-foreground" /> },
          ]
        };
    }
  };

  const roleContent = getRoleSpecificContent();

  // Get the appropriate color for trend indicators
  const getTrendColor = (trend) => {
    return trend === 'up' ? 'text-green-600' : 'text-red-600';
  };

  // Get status indicator for strategic initiatives
  const getStatusIndicator = (status) => {
    switch(status) {
      case 'on-track': return "bg-green-500";
      case 'at-risk': return "bg-amber-500";
      case 'delayed': return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  // Get activity status styling
  const getActivityStatus = (status) => {
    switch(status) {
      case 'completed': return "bg-green-100 text-green-800";
      case 'upcoming': return "bg-blue-100 text-blue-800";
      case 'needs-action': return "bg-amber-100 text-amber-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {role === 'Chief Executive Officer (CEO)' ? (
        <>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">{roleContent.title}</h2>
              <p className="text-muted-foreground">{roleContent.description}</p>
            </div>
            <div className="mt-2 sm:mt-0">
              <span className="text-sm text-muted-foreground">Last updated: Today, 4:30 PM</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {roleContent.metrics.map((metric) => (
              <Card 
                key={metric.id}
                className={`border-l-4 ${metric.id === activeMetric ? "ring-2 ring-violet-200" : ""} ${metric.color ? `border-l-${metric.color.split('-')[1]}` : "border-l-violet-500"}`}
                onClick={() => setActiveMetric(metric.id)}
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {metric.title}
                  </CardTitle>
                  {metric.icon}
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{metric.value}</div>
                  <div className="flex items-center mt-1">
                    {metric.trend === 'up' ? 
                      <TrendingUp className={`h-4 w-4 mr-1 ${getTrendColor(metric.trend)}`} /> : 
                      <TrendingDown className={`h-4 w-4 mr-1 ${getTrendColor(metric.trend)}`} />
                    }
                    <p className={`text-xs ${getTrendColor(metric.trend)}`}>
                      {metric.change} from last quarter
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Business Overview</TabsTrigger>
              <TabsTrigger value="initiatives">Strategic Initiatives</TabsTrigger>
              <TabsTrigger value="operations">Operations</TabsTrigger>
              <TabsTrigger value="reports">Reports & Analytics</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="col-span-1 md:col-span-2 h-[400px]">
                  <CardHeader>
                    <CardTitle>Business Performance</CardTitle>
                    <CardDescription>Revenue by business unit (Last 12 months)</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px] flex items-center justify-center bg-gray-50 rounded-md">
                      <p className="text-muted-foreground">Revenue chart visualization</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="col-span-1 h-[400px] overflow-auto">
                  <CardHeader>
                    <CardTitle>Business Units</CardTitle>
                    <CardDescription>Performance overview</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {roleContent.businessUnits.map((unit, i) => (
                      <div key={i} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <h4 className="font-medium">{unit.name}</h4>
                          <span className="text-sm font-bold">{unit.revenue}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span>Performance Score: {unit.performance}%</span>
                          <span className={unit.growth.startsWith('+') ? 'text-green-600' : 'text-red-600'}>
                            {unit.growth}
                          </span>
                        </div>
                        <Progress value={unit.performance} className="h-2" />
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activities</CardTitle>
                    <CardDescription>Your latest activities and executive actions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {roleContent.recentActivities.map((activity, i) => (
                        <div key={i} className="flex justify-between items-center border-b pb-3">
                          <div className="flex items-start gap-3">
                            <div className={`mt-1 p-1.5 rounded-full ${
                              activity.type === 'approval' ? 'bg-green-100' :
                              activity.type === 'meeting' ? 'bg-blue-100' :
                              activity.type === 'report' ? 'bg-violet-100' : 'bg-amber-100'
                            }`}>
                              {activity.type === 'approval' ? <CheckSquare className="h-4 w-4 text-green-700" /> :
                               activity.type === 'meeting' ? <Calendar className="h-4 w-4 text-blue-700" /> :
                               activity.type === 'report' ? <FileText className="h-4 w-4 text-violet-700" /> :
                               <Activity className="h-4 w-4 text-amber-700" />
                              }
                            </div>
                            <div>
                              <p className="font-medium">{activity.title}</p>
                              <p className="text-sm text-muted-foreground">{activity.time}</p>
                            </div>
                          </div>
                          <span className={`text-xs px-2 py-1 rounded-full ${getActivityStatus(activity.status)}`}>
                            {activity.status.replace('-', ' ')}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Key Financial Insights</CardTitle>
                    <CardDescription>Financial performance at a glance</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <h3 className="text-sm font-medium text-blue-700">Net Profit Margin</h3>
                          <p className="text-2xl font-bold">23.5%</p>
                          <p className="text-xs text-blue-600">+2.3% from last quarter</p>
                        </div>
                        <div className="bg-emerald-50 p-4 rounded-lg">
                          <h3 className="text-sm font-medium text-emerald-700">Operating Margin</h3>
                          <p className="text-2xl font-bold">18.7%</p>
                          <p className="text-xs text-emerald-600">+0.9% from last quarter</p>
                        </div>
                        <div className="bg-amber-50 p-4 rounded-lg">
                          <h3 className="text-sm font-medium text-amber-700">Cash Reserve</h3>
                          <p className="text-2xl font-bold">UGX 435M</p>
                          <p className="text-xs text-amber-600">+UGX 35M from last month</p>
                        </div>
                        <div className="bg-violet-50 p-4 rounded-lg">
                          <h3 className="text-sm font-medium text-violet-700">ROI</h3>
                          <p className="text-2xl font-bold">15.8%</p>
                          <p className="text-xs text-violet-600">+1.2% year-to-date</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="initiatives" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Strategic Initiatives</CardTitle>
                  <CardDescription>Progress on key strategic initiatives</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {roleContent.strategicInitiatives.map((initiative, i) => (
                      <div key={i} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${getStatusIndicator(initiative.status)}`}></div>
                            <h4 className="font-medium">{initiative.title}</h4>
                          </div>
                          <span className="text-sm">{initiative.completion}% complete</span>
                        </div>
                        <Progress value={initiative.completion} className="h-2" />
                        <div className="flex justify-end">
                          <span className="text-xs text-muted-foreground capitalize">{initiative.status.replace('-', ' ')}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Investment Allocation</CardTitle>
                    <CardDescription>Current strategic investment breakdown</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[250px] flex items-center justify-center bg-gray-50 rounded-md">
                      <p className="text-muted-foreground">Investment allocation pie chart</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Resource Allocation</CardTitle>
                    <CardDescription>How resources are allocated across initiatives</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[250px] flex items-center justify-center bg-gray-50 rounded-md">
                      <p className="text-muted-foreground">Resource allocation chart</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="operations" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Operational KPIs</CardTitle>
                    <CardDescription>Key operational metrics across business units</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">Production Efficiency</span>
                          <span className="text-sm font-medium">87%</span>
                        </div>
                        <Progress value={87} className="h-2" />
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">Supply Chain Performance</span>
                          <span className="text-sm font-medium">92%</span>
                        </div>
                        <Progress value={92} className="h-2" />
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">Quality Control</span>
                          <span className="text-sm font-medium">95%</span>
                        </div>
                        <Progress value={95} className="h-2" />
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">Customer Satisfaction</span>
                          <span className="text-sm font-medium">78%</span>
                        </div>
                        <Progress value={78} className="h-2" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Export Market Performance</CardTitle>
                    <CardDescription>Key export markets and performance</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Globe className="h-5 w-5 mr-2 text-muted-foreground" />
                          <span>European Union</span>
                        </div>
                        <div className="flex items-center">
                          <span className="mr-2">UGX 325M</span>
                          <span className="text-green-600 text-xs">+12.5%</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Globe className="h-5 w-5 mr-2 text-muted-foreground" />
                          <span>Middle East</span>
                        </div>
                        <div className="flex items-center">
                          <span className="mr-2">UGX 185M</span>
                          <span className="text-green-600 text-xs">+8.3%</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Globe className="h-5 w-5 mr-2 text-muted-foreground" />
                          <span>East African Region</span>
                        </div>
                        <div className="flex items-center">
                          <span className="mr-2">UGX 142M</span>
                          <span className="text-red-600 text-xs">-2.1%</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Globe className="h-5 w-5 mr-2 text-muted-foreground" />
                          <span>North America</span>
                        </div>
                        <div className="flex items-center">
                          <span className="mr-2">UGX 95M</span>
                          <span className="text-green-600 text-xs">+15.7%</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="reports" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Reports & Analytics</CardTitle>
                  <CardDescription>Access and manage your executive reports</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { title: "Q2 2025 Financial Report", date: "April 15, 2025", type: "Financial", status: "Final" },
                      { title: "KAJON Coffee Market Analysis", date: "April 10, 2025", type: "Market Research", status: "Draft" },
                      { title: "Grand Berna Supply Chain Optimization", date: "April 5, 2025", type: "Operations", status: "Final" },
                      { title: "Kyalima Farmers Annual Performance", date: "March 30, 2025", type: "Performance", status: "Final" },
                      { title: "Executive Board Meeting Minutes", date: "March 25, 2025", type: "Governance", status: "Final" }
                    ].map((report, i) => (
                      <div key={i} className="flex items-center justify-between p-3 border rounded-md hover:bg-gray-50 cursor-pointer">
                        <div className="flex items-center space-x-3">
                          <FileText className="h-5 w-5 text-violet-500" />
                          <div>
                            <p className="font-medium">{report.title}</p>
                            <p className="text-sm text-gray-500">{report.date} • {report.type}</p>
                          </div>
                        </div>
                        <div className={`text-xs px-2 py-1 rounded ${
                          report.status === 'Final' ? 'bg-green-100 text-green-800' : 
                          report.status === 'Draft' ? 'bg-amber-100 text-amber-800' : 
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {report.status}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      ) : (
        <>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <h2 className="text-3xl font-bold tracking-tight">{roleContent.title}</h2>
            <div className="mt-2 sm:mt-0">
              <span className="text-sm text-muted-foreground">Last updated: Today, 4:30 PM</span>
            </div>
          </div>

          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="reports">Reports</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {roleContent.metrics.map((metric, index) => (
                  <Card key={index}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        {metric.title}
                      </CardTitle>
                      {metric.icon}
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{metric.value}</div>
                      <p className="text-xs text-muted-foreground">
                        {metric.change} from last month
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activities</CardTitle>
                    <CardDescription>Your latest activities and notifications</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {[1, 2, 3].map((item) => (
                        <div key={item} className="flex items-center gap-2 border-b pb-2">
                          <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                          <span className="text-sm">Activity {item} - Today at {Math.floor(Math.random() * 12)}:{Math.floor(Math.random() * 60).toString().padStart(2, '0')} PM</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Key Priorities</CardTitle>
                    <CardDescription>Your important tasks and deadlines</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {[1, 2, 3].map((item) => (
                        <div key={item} className="flex justify-between items-center border-b pb-2">
                          <span className="text-sm">Priority Task {item}</span>
                          <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded">
                            Due in {Math.floor(Math.random() * 5) + 1} days
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="analytics" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Analytics Dashboard</CardTitle>
                  <CardDescription>Detailed performance metrics and trends</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] flex items-center justify-center bg-gray-100 rounded-md">
                    <p className="text-gray-500">Analytics visualization will be displayed here</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="reports" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Reports & Documents</CardTitle>
                  <CardDescription>Access and manage your reports</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[1, 2, 3, 4].map((report) => (
                      <div key={report} className="flex items-center justify-between p-3 border rounded-md hover:bg-gray-50 cursor-pointer">
                        <div className="flex items-center space-x-3">
                          <FileText className="h-5 w-5 text-blue-500" />
                          <div>
                            <p className="font-medium">Monthly Report {report}</p>
                            <p className="text-sm text-gray-500">Added on April {report + 10}, 2025</p>
                          </div>
                        </div>
                        <div className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">View</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
};

export default RoleDashboard;
