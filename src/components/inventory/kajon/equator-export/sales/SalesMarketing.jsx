
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
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
import { 
  Users, 
  Search, 
  Filter as FilterIcon, 
  Download, 
  Plus, 
  Mail, 
  Phone, 
  Globe, 
  DollarSign, 
  CheckCircle, 
  Clock, 
  AlertCircle 
} from 'lucide-react';

// Sample data for charts and tables
const salesData = [
  { month: 'Jan', revenue: 125000, arabica: 80000, robusta: 45000 },
  { month: 'Feb', revenue: 145000, arabica: 90000, robusta: 55000 },
  { month: 'Mar', revenue: 165000, arabica: 100000, robusta: 65000 },
  { month: 'Apr', revenue: 185000, arabica: 115000, robusta: 70000 },
  { month: 'May', revenue: 210000, arabica: 130000, robusta: 80000 },
  { month: 'Jun', revenue: 240000, arabica: 150000, robusta: 90000 },
];

const customerDistribution = [
  { name: 'Europe', value: 40 },
  { name: 'North America', value: 30 },
  { name: 'Asia', value: 20 },
  { name: 'Others', value: 10 },
];

const customers = [
  { 
    id: 1, 
    name: 'Nordic Coffee Imports', 
    country: 'Finland', 
    contact: 'Elias Virtanen', 
    email: 'elias@nordiccoffee.fi', 
    phone: '+358 40 123 4567', 
    status: 'active', 
    revenue: 450000,
    lastOrder: '2023-05-12' 
  },
  { 
    id: 2, 
    name: 'Boston Bean Co.', 
    country: 'USA', 
    contact: 'Sarah Johnson', 
    email: 'sarah@bostonbean.com', 
    phone: '+1 617 555 1234', 
    status: 'active', 
    revenue: 320000,
    lastOrder: '2023-05-28' 
  },
  { 
    id: 3, 
    name: 'Tokyo Roasters', 
    country: 'Japan', 
    contact: 'Hiroshi Tanaka', 
    email: 'tanaka@tokyoroasters.jp', 
    phone: '+81 3 1234 5678', 
    status: 'active', 
    revenue: 280000,
    lastOrder: '2023-06-05' 
  },
  { 
    id: 4, 
    name: 'Berlin Kaffee GmbH', 
    country: 'Germany', 
    contact: 'Klaus Schmidt', 
    email: 'schmidt@berlinkaffee.de', 
    phone: '+49 30 1234567', 
    status: 'inactive', 
    revenue: 195000,
    lastOrder: '2023-04-18' 
  },
  { 
    id: 5, 
    name: 'Café Parisien', 
    country: 'France', 
    contact: 'Marie Dubois', 
    email: 'marie@cafeparisien.fr', 
    phone: '+33 1 23 45 67 89', 
    status: 'active', 
    revenue: 210000,
    lastOrder: '2023-06-01' 
  },
];

const leads = [
  { 
    id: 1, 
    name: 'Melbourne Coffee House', 
    country: 'Australia', 
    contact: 'James Wilson', 
    email: 'james@melbournecoffee.au', 
    phone: '+61 3 9876 5432', 
    status: 'qualified', 
    potential: 'high',
    lastContact: '2023-06-10' 
  },
  { 
    id: 2, 
    name: 'Dubai Imports LLC', 
    country: 'UAE', 
    contact: 'Ahmed Al-Farsi', 
    email: 'ahmed@dubaiimports.ae', 
    phone: '+971 4 123 4567', 
    status: 'new', 
    potential: 'medium',
    lastContact: '2023-06-15' 
  },
  { 
    id: 3, 
    name: 'Vancouver Brews', 
    country: 'Canada', 
    contact: 'Emma Roberts', 
    email: 'emma@vancouverbrews.ca', 
    phone: '+1 604 555 7890', 
    status: 'negotiating', 
    potential: 'high',
    lastContact: '2023-06-08' 
  },
  { 
    id: 4, 
    name: 'Seoul Coffee Imports', 
    country: 'South Korea', 
    contact: 'Min-Jun Park', 
    email: 'minjun@seoulcoffee.kr', 
    phone: '+82 2 1234 5678', 
    status: 'qualified', 
    potential: 'medium',
    lastContact: '2023-06-12' 
  },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const SalesMarketing = () => {
  const [activeTab, setActiveTab] = useState('customers');
  const [searchTerm, setSearchTerm] = useState('');
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div className="flex-1">
          <h2 className="text-xl font-semibold">Sales & Marketing Dashboard</h2>
          <p className="text-gray-500 text-sm">Manage customers, leads, and monitor sales performance</p>
        </div>
        <div className="flex gap-2">
          <Button>
            <Plus className="h-4 w-4 mr-1" />
            <span>New Customer</span>
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-1" />
            <span>Export</span>
          </Button>
        </div>
      </div>
      
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-blue-50">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-blue-700">Total Revenue</p>
                <p className="text-2xl font-bold text-blue-900">$1,070,000</p>
              </div>
              <div className="bg-blue-100 p-2 rounded-full">
                <DollarSign className="h-5 w-5 text-blue-700" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-emerald-50">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-emerald-700">Active Customers</p>
                <p className="text-2xl font-bold text-emerald-900">28</p>
              </div>
              <div className="bg-emerald-100 p-2 rounded-full">
                <Users className="h-5 w-5 text-emerald-700" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-amber-50">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-amber-700">New Leads</p>
                <p className="text-2xl font-bold text-amber-900">12</p>
              </div>
              <div className="bg-amber-100 p-2 rounded-full">
                <Users className="h-5 w-5 text-amber-700" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-purple-50">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-purple-700">Avg. Order Value</p>
                <p className="text-2xl font-bold text-purple-900">$38,214</p>
              </div>
              <div className="bg-purple-100 p-2 rounded-full">
                <DollarSign className="h-5 w-5 text-purple-700" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Monthly Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={salesData}
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
                  <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                  <Legend />
                  <Bar dataKey="arabica" name="Arabica Revenue" stackId="a" fill="#8884d8" />
                  <Bar dataKey="robusta" name="Robusta Revenue" stackId="a" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Customer Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={customerDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {customerDistribution.map((entry, index) => (
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
      </div>
      
      {/* Customers and Leads Management */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="customers">Customers</TabsTrigger>
          <TabsTrigger value="leads">Leads</TabsTrigger>
        </TabsList>
        
        <TabsContent value="customers" className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4 justify-between">
            <div className="relative md:w-1/3">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search customers..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Select defaultValue="all">
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" className="flex items-center">
                <FilterIcon className="h-4 w-4 mr-1" />
                <span>Filter</span>
              </Button>
            </div>
          </div>
          
          <div className="rounded-md border">
            <div className="overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Customer</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Contact</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Revenue</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Status</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Last Order</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {customers.map((customer) => (
                    <tr key={customer.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div>
                          <div className="font-medium">{customer.name}</div>
                          <div className="text-sm text-gray-500 flex items-center">
                            <Globe className="h-3 w-3 mr-1" /> {customer.country}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div>
                          <div className="font-medium">{customer.contact}</div>
                          <div className="text-sm text-gray-500 flex items-center">
                            <Mail className="h-3 w-3 mr-1" /> {customer.email}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center">
                            <Phone className="h-3 w-3 mr-1" /> {customer.phone}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-medium">${customer.revenue.toLocaleString()}</div>
                      </td>
                      <td className="px-4 py-3">
                        <Badge className={customer.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                          {customer.status === 'active' ? 'Active' : 'Inactive'}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm">{new Date(customer.lastOrder).toLocaleDateString()}</div>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Button variant="ghost" size="sm">View</Button>
                        <Button variant="ghost" size="sm">Edit</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="leads" className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4 justify-between">
            <div className="relative md:w-1/3">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search leads..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Select defaultValue="all">
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="qualified">Qualified</SelectItem>
                  <SelectItem value="negotiating">Negotiating</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" className="flex items-center">
                <FilterIcon className="h-4 w-4 mr-1" />
                <span>Filter</span>
              </Button>
            </div>
          </div>
          
          <div className="rounded-md border">
            <div className="overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Lead</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Contact</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Status</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Potential</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Last Contact</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {leads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div>
                          <div className="font-medium">{lead.name}</div>
                          <div className="text-sm text-gray-500 flex items-center">
                            <Globe className="h-3 w-3 mr-1" /> {lead.country}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div>
                          <div className="font-medium">{lead.contact}</div>
                          <div className="text-sm text-gray-500 flex items-center">
                            <Mail className="h-3 w-3 mr-1" /> {lead.email}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center">
                            <Phone className="h-3 w-3 mr-1" /> {lead.phone}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Badge 
                          className={
                            lead.status === 'new' ? 'bg-blue-100 text-blue-800' : 
                            lead.status === 'qualified' ? 'bg-green-100 text-green-800' : 
                            'bg-amber-100 text-amber-800'
                          }
                        >
                          {lead.status === 'new' ? 'New' : 
                           lead.status === 'qualified' ? 'Qualified' : 
                           'Negotiating'}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <Badge 
                          className={
                            lead.potential === 'high' ? 'bg-emerald-100 text-emerald-800' : 
                            'bg-yellow-100 text-yellow-800'
                          }
                        >
                          {lead.potential === 'high' ? 'High' : 'Medium'}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm">{new Date(lead.lastContact).toLocaleDateString()}</div>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Button variant="ghost" size="sm">View</Button>
                        <Button variant="ghost" size="sm">Edit</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SalesMarketing;
