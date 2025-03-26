
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, PieChart, 
  Pie, Cell, LineChart, Line
} from 'recharts';
import { 
  ShoppingCart, Users, Globe, Search, Plus, 
  Filter, Download, Phone, Mail, ArrowUpRight, 
  MessageSquare, BarChart3, ArrowRight, Building,
  Calendar, MapPin, Settings
} from 'lucide-react';

// Sample sales data
const salesByMarket = [
  { name: 'Europe', value: 42 },
  { name: 'North America', value: 28 },
  { name: 'Asia', value: 18 },
  { name: 'Middle East', value: 8 },
  { name: 'Other', value: 4 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const salesTrends = [
  { month: 'Jul', sales: 105400, leads: 28 },
  { month: 'Aug', sales: 115800, leads: 32 },
  { month: 'Sep', sales: 125300, leads: 35 },
  { month: 'Oct', sales: 145700, leads: 42 },
  { month: 'Nov', sales: 160900, leads: 45 },
  { month: 'Dec', sales: 178500, leads: 48 },
];

const customers = [
  {
    id: 'CUS-1001',
    name: 'European Coffee Roasters GmbH',
    country: 'Germany',
    contact: 'Hans Schmidt',
    email: 'h.schmidt@ecr-coffee.de',
    phone: '+49 30 1234567',
    status: 'active',
    lastOrder: '2023-12-05',
    value: '$145,000'
  },
  {
    id: 'CUS-1002',
    name: 'Artisan Bean Co.',
    country: 'USA',
    contact: 'Sarah Johnson',
    email: 'sarah@artisanbean.co',
    phone: '+1 415 555 7890',
    status: 'active',
    lastOrder: '2023-11-28',
    value: '$92,500'
  },
  {
    id: 'CUS-1003',
    name: 'Tokyo Coffee Imports',
    country: 'Japan',
    contact: 'Takeshi Yamamoto',
    email: 't.yamamoto@tokyocoffee.jp',
    phone: '+81 3 1234 5678',
    status: 'inactive',
    lastOrder: '2023-10-15',
    value: '$78,300'
  },
  {
    id: 'CUS-1004',
    name: 'Middle East Coffee Trading LLC',
    country: 'UAE',
    contact: 'Ahmed Al-Farsi',
    email: 'ahmed@mect.ae',
    phone: '+971 4 123 4567',
    status: 'active',
    lastOrder: '2023-12-05',
    value: '$115,000'
  },
  {
    id: 'CUS-1005',
    name: 'Nordic Coffee Collective',
    country: 'Sweden',
    contact: 'Elsa Lindberg',
    email: 'elsa@nordiccoffee.se',
    phone: '+46 8 123 45 67',
    status: 'prospect',
    lastOrder: 'N/A',
    value: '$0'
  }
];

const leads = [
  {
    id: 'LEAD-1001',
    company: 'Swiss Alpine Coffee',
    country: 'Switzerland',
    contact: 'Marco Bernasconi',
    email: 'marco@swissalpine.ch',
    phone: '+41 44 123 45 67',
    status: 'qualified',
    source: 'Trade Show',
    created: '2023-11-05',
    value: '$80,000'
  },
  {
    id: 'LEAD-1002',
    company: 'Melbourne Roasters',
    country: 'Australia',
    contact: 'Emma Wilson',
    email: 'emma@melbourneroasters.com.au',
    phone: '+61 3 9876 5432',
    status: 'new',
    source: 'Website',
    created: '2023-12-10',
    value: '$45,000'
  },
  {
    id: 'LEAD-1003',
    company: 'Cape Town Coffee Company',
    country: 'South Africa',
    contact: 'David Nkosi',
    email: 'david@capetowncoffee.co.za',
    phone: '+27 21 123 4567',
    status: 'nurturing',
    source: 'Referral',
    created: '2023-11-22',
    value: '$65,000'
  }
];

const campaigns = [
  {
    name: 'Trade Show - Coffee Expo Berlin',
    type: 'Event',
    status: 'active',
    startDate: '2024-01-15',
    endDate: '2024-01-18',
    budget: '$25,000',
    leads: 15
  },
  {
    name: 'Q1 2024 Email Campaign',
    type: 'Email',
    status: 'planning',
    startDate: '2024-01-05',
    endDate: '2024-03-31',
    budget: '$5,000',
    leads: 0
  },
  {
    name: 'Specialty Coffee Association Sponsorship',
    type: 'Sponsorship',
    status: 'active',
    startDate: '2023-10-01',
    endDate: '2024-09-30',
    budget: '$50,000',
    leads: 22
  }
];

const statusColors = {
  active: "bg-green-100 text-green-800",
  inactive: "bg-gray-100 text-gray-800",
  prospect: "bg-purple-100 text-purple-800",
  qualified: "bg-blue-100 text-blue-800",
  new: "bg-emerald-100 text-emerald-800",
  nurturing: "bg-amber-100 text-amber-800",
  planning: "bg-indigo-100 text-indigo-800"
};

const SalesMarketing = () => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div className="flex-1">
          <h2 className="text-xl font-semibold">Sales & Marketing</h2>
          <p className="text-gray-500 text-sm">Manage customers, leads, and marketing campaigns</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>Q1 2024</span>
          </Button>
          <Button variant="outline" className="flex items-center gap-1">
            <Filter className="h-4 w-4" />
            <span>Filter</span>
          </Button>
          <Button className="flex items-center gap-1">
            <Plus className="h-4 w-4" />
            <span>New Lead</span>
          </Button>
        </div>
      </div>
      
      {/* Sales Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-blue-50">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-blue-700">Sales Pipeline</p>
                <p className="text-2xl font-bold text-blue-900">$3.2M</p>
                <div className="text-xs text-blue-700 flex items-center">
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                  +12% vs Last Quarter
                </div>
              </div>
              <div className="bg-blue-100 p-2 rounded-full">
                <ShoppingCart className="h-5 w-5 text-blue-700" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-purple-50">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-purple-700">Active Customers</p>
                <p className="text-2xl font-bold text-purple-900">42</p>
                <div className="text-xs text-purple-700 flex items-center">
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                  +3 New This Month
                </div>
              </div>
              <div className="bg-purple-100 p-2 rounded-full">
                <Building className="h-5 w-5 text-purple-700" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-green-50">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-green-700">New Leads</p>
                <p className="text-2xl font-bold text-green-900">18</p>
                <div className="text-xs text-green-700 flex items-center">
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                  +5 vs Last Month
                </div>
              </div>
              <div className="bg-green-100 p-2 rounded-full">
                <Users className="h-5 w-5 text-green-700" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Sales & Marketing Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
          <TabsTrigger value="leads">Leads</TabsTrigger>
          <TabsTrigger value="campaigns">Marketing Campaigns</TabsTrigger>
        </TabsList>
        
        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Sales Trend Chart */}
            <Card className="md:col-span-2">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-blue-600" />
                  <span>Sales & Leads (Last 6 Months)</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={salesTrends}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis yAxisId="left" orientation="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip />
                      <Legend />
                      <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="sales"
                        name="Sales ($)"
                        stroke="#4f46e5"
                        strokeWidth={2}
                        activeDot={{ r: 8 }}
                      />
                      <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="leads"
                        name="New Leads"
                        stroke="#10b981"
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            {/* Sales by Market */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-blue-600" />
                  <span>Sales by Market</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={salesByMarket}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {salesByMarket.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `${value}%`} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            {/* Top Customers */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5 text-blue-600" />
                  <span>Top Customers</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {customers.slice(0, 3).map((customer) => (
                    <div key={customer.id} className="flex justify-between items-center border-b pb-3 last:border-0 last:pb-0">
                      <div>
                        <div className="font-medium">{customer.name}</div>
                        <div className="text-sm text-gray-500">{customer.country}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{customer.value}</div>
                        <div className="text-sm text-gray-500">Last order: {customer.lastOrder}</div>
                      </div>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full mt-2 flex items-center justify-center gap-1">
                    <span>View All Customers</span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Customers Tab */}
        <TabsContent value="customers" className="space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5 text-blue-600" />
                  <span>Customer Directory</span>
                </CardTitle>
                <div className="flex items-center gap-2">
                  <div className="relative w-64">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                    <Input placeholder="Search customers..." className="pl-8" />
                  </div>
                  <Button size="sm" className="flex items-center gap-1">
                    <Plus className="h-4 w-4" />
                    <span>Add Customer</span>
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">Customer ID</TableHead>
                      <TableHead>Company</TableHead>
                      <TableHead>Country</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Last Order</TableHead>
                      <TableHead>Value</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {customers.map((customer) => (
                      <TableRow key={customer.id}>
                        <TableCell className="font-medium">{customer.id}</TableCell>
                        <TableCell>{customer.name}</TableCell>
                        <TableCell>{customer.country}</TableCell>
                        <TableCell>
                          <div>{customer.contact}</div>
                          <div className="text-xs text-gray-500 flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {customer.email}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={statusColors[customer.status]}>
                            {customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>{customer.lastOrder}</TableCell>
                        <TableCell>{customer.value}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Phone className="h-4 w-4 text-gray-700" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Mail className="h-4 w-4 text-gray-700" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Settings className="h-4 w-4 text-gray-700" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Leads Tab */}
        <TabsContent value="leads" className="space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-600" />
                  <span>Lead Management</span>
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                  <Button size="sm" className="flex items-center gap-1">
                    <Plus className="h-4 w-4" />
                    <span>Add Lead</span>
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">Lead ID</TableHead>
                      <TableHead>Company</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Source</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Est. Value</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {leads.map((lead) => (
                      <TableRow key={lead.id}>
                        <TableCell className="font-medium">{lead.id}</TableCell>
                        <TableCell>
                          <div>{lead.company}</div>
                          <div className="text-xs text-gray-500">{lead.country}</div>
                        </TableCell>
                        <TableCell>
                          <div>{lead.contact}</div>
                          <div className="text-xs text-gray-500 flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {lead.email}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={statusColors[lead.status]}>
                            {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>{lead.source}</TableCell>
                        <TableCell>{lead.created}</TableCell>
                        <TableCell>{lead.value}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Phone className="h-4 w-4 text-gray-700" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Mail className="h-4 w-4 text-gray-700" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MessageSquare className="h-4 w-4 text-gray-700" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Marketing Campaigns Tab */}
        <TabsContent value="campaigns" className="space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-blue-600" />
                <span>Marketing Campaigns</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {campaigns.map((campaign, index) => (
                  <div key={index} className="border rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-medium text-lg">{campaign.name}</h3>
                        <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {campaign.startDate} to {campaign.endDate}
                          </span>
                          <Badge className={statusColors[campaign.status]}>
                            {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                          </Badge>
                        </div>
                      </div>
                      <Badge variant="outline">{campaign.type}</Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                      <div className="bg-blue-50 p-3 rounded-md">
                        <div className="text-sm text-blue-700">Budget</div>
                        <div className="text-xl font-bold text-blue-900">{campaign.budget}</div>
                      </div>
                      
                      <div className="bg-green-50 p-3 rounded-md">
                        <div className="text-sm text-green-700">Leads Generated</div>
                        <div className="text-xl font-bold text-green-900">{campaign.leads}</div>
                      </div>
                      
                      <div className="bg-purple-50 p-3 rounded-md">
                        <div className="text-sm text-purple-700">Cost per Lead</div>
                        <div className="text-xl font-bold text-purple-900">
                          {campaign.leads > 0 
                            ? `$${Math.round(parseInt(campaign.budget.replace(/\$|,/g, '')) / campaign.leads)}` 
                            : 'N/A'}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-end mt-4">
                      <Button variant="outline" size="sm" className="mr-2">View Details</Button>
                      <Button size="sm">Edit Campaign</Button>
                    </div>
                  </div>
                ))}
                
                <Button className="w-full" variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Campaign
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SalesMarketing;
