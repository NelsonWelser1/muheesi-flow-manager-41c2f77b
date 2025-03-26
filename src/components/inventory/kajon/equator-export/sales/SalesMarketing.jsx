
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { 
  Search, Plus, ShoppingCart, Users, DollarSign, 
  Calendar, BarChart3, ChevronUp, ChevronDown, 
  Phone, Mail, UserPlus, Globe, TrendingUp, HeartHandshake,
  MessageSquare, CheckCircle, Clock, CreditCard
} from 'lucide-react';
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell 
} from 'recharts';

// Sample customers data
const customers = [
  {
    id: 'CUS001',
    name: 'European Coffee Roasters GmbH',
    country: 'Germany',
    type: 'Roaster',
    contactPerson: 'Hans Mueller',
    email: 'hans@europeancoffee.de',
    phone: '+49 30 12345678',
    status: 'active',
    lastOrder: '2023-12-10',
    totalOrders: 15,
    totalValue: 845000
  },
  {
    id: 'CUS002',
    name: 'Artisan Bean Co.',
    country: 'USA',
    type: 'Roaster',
    contactPerson: 'Sarah Johnson',
    email: 'sarah@artisanbean.com',
    phone: '+1 212 555 7890',
    status: 'active',
    lastOrder: '2023-11-25',
    totalOrders: 8,
    totalValue: 560000
  },
  {
    id: 'CUS003',
    name: 'Tokyo Coffee Imports',
    country: 'Japan',
    type: 'Importer',
    contactPerson: 'Takashi Yamamoto',
    email: 'yamamoto@tokyocoffee.jp',
    phone: '+81 3 1234 5678',
    status: 'active',
    lastOrder: '2023-11-18',
    totalOrders: 12,
    totalValue: 725000
  },
  {
    id: 'CUS004',
    name: 'Middle East Coffee Trading LLC',
    country: 'UAE',
    type: 'Trader',
    contactPerson: 'Ahmed Al Mansour',
    email: 'ahmed@mectllc.ae',
    phone: '+971 4 123 4567',
    status: 'active',
    lastOrder: '2023-12-05',
    totalOrders: 6,
    totalValue: 480000
  },
  {
    id: 'CUS005',
    name: 'Nordic Coffee Collective',
    country: 'Sweden',
    type: 'Roaster',
    contactPerson: 'Erik Johansson',
    email: 'erik@nordiccoffee.se',
    phone: '+46 8 123 45 67',
    status: 'inactive',
    lastOrder: '2023-10-12',
    totalOrders: 3,
    totalValue: 185000
  }
];

// Sample leads data
const leads = [
  {
    id: 'LEAD001',
    company: 'Melbourne Coffee Labs',
    country: 'Australia',
    contactPerson: 'James Wilson',
    email: 'james@melbournecoffee.com.au',
    phone: '+61 3 9123 4567',
    status: 'qualified',
    source: 'Trade Show',
    dateAdded: '2023-12-01',
    notes: 'Interested in premium Arabica beans, follow up by January'
  },
  {
    id: 'LEAD002',
    company: 'Paris Café Supplies',
    country: 'France',
    contactPerson: 'Sophie Dupont',
    email: 'sophie@pariscafesupplies.fr',
    phone: '+33 1 23 45 67 89',
    status: 'new',
    source: 'Website Inquiry',
    dateAdded: '2023-12-08',
    notes: 'Looking for organic certified coffee for their new product line'
  },
  {
    id: 'LEAD003',
    company: 'Canadian Coffee Wholesale',
    country: 'Canada',
    contactPerson: 'Michael Thompson',
    email: 'michael@canadiancoffee.ca',
    phone: '+1 416 555 1234',
    status: 'contacted',
    source: 'Email Campaign',
    dateAdded: '2023-12-05',
    notes: 'Sent samples on Dec 10, awaiting feedback'
  },
  {
    id: 'LEAD004',
    company: 'Seoul Bean Importers',
    country: 'South Korea',
    contactPerson: 'Ji-hoon Kim',
    email: 'jihoon@seoulbean.kr',
    phone: '+82 2 1234 5678',
    status: 'negotiation',
    source: 'Referral',
    dateAdded: '2023-11-15',
    notes: 'In discussion for first container order, pricing being negotiated'
  },
  {
    id: 'LEAD005',
    company: 'Cape Town Roasters',
    country: 'South Africa',
    contactPerson: 'David Nkosi',
    email: 'david@capetownroasters.co.za',
    phone: '+27 21 123 4567',
    status: 'lost',
    source: 'LinkedIn',
    dateAdded: '2023-10-18',
    notes: 'Choose another supplier due to shipping logistics issues'
  }
];

// Sample orders data
const orders = [
  {
    id: 'ORD-2023-042',
    customer: 'European Coffee Roasters GmbH',
    customerID: 'CUS001',
    date: '2023-12-10',
    amount: 85000,
    status: 'processing',
    items: [
      { coffee: 'Arabica - AA', quantity: '15 tons', price: 4.8, total: 72000 },
      { coffee: 'Specialty Blend', quantity: '2 tons', price: 6.5, total: 13000 }
    ],
    shipment: 'EQ-2453'
  },
  {
    id: 'ORD-2023-041',
    customer: 'Artisan Bean Co.',
    customerID: 'CUS002',
    date: '2023-11-25',
    amount: 56500,
    status: 'confirmed',
    items: [
      { coffee: 'Arabica - AA', quantity: '8 tons', price: 4.8, total: 38400 },
      { coffee: 'Robusta - Premium', quantity: '5 tons', price: 3.62, total: 18100 }
    ],
    shipment: 'EQ-2455'
  },
  {
    id: 'ORD-2023-040',
    customer: 'Tokyo Coffee Imports',
    customerID: 'CUS003',
    date: '2023-11-18',
    amount: 72300,
    status: 'shipped',
    items: [
      { coffee: 'Arabica - Specialty', quantity: '10 tons', price: 5.2, total: 52000 },
      { coffee: 'Robusta - Premium', quantity: '6 tons', price: 3.38, total: 20300 }
    ],
    shipment: 'EQ-2458'
  },
  {
    id: 'ORD-2023-039',
    customer: 'Middle East Coffee Trading LLC',
    customerID: 'CUS004',
    date: '2023-12-05',
    amount: 92000,
    status: 'delivered',
    items: [
      { coffee: 'Arabica - AA', quantity: '18 tons', price: 4.95, total: 89100 },
      { coffee: 'Arabica - AB', quantity: '1 ton', price: 2.9, total: 2900 }
    ],
    shipment: 'EQ-2451'
  },
  {
    id: 'ORD-2023-038',
    customer: 'Nordic Coffee Collective',
    customerID: 'CUS005',
    date: '2023-10-12',
    amount: 48700,
    status: 'delivered',
    items: [
      { coffee: 'Arabica - Specialty', quantity: '7 tons', price: 5.4, total: 37800 },
      { coffee: 'Arabica - Organic', quantity: '2 tons', price: 5.45, total: 10900 }
    ],
    shipment: 'EQ-2445'
  }
];

// Status colors for various components
const customerStatusColors = {
  'active': "bg-green-100 text-green-800",
  'inactive': "bg-gray-100 text-gray-800"
};

const leadStatusColors = {
  'new': "bg-blue-100 text-blue-800",
  'contacted': "bg-amber-100 text-amber-800",
  'qualified': "bg-purple-100 text-purple-800",
  'negotiation': "bg-emerald-100 text-emerald-800",
  'won': "bg-green-100 text-green-800",
  'lost': "bg-red-100 text-red-800"
};

const orderStatusColors = {
  'confirmed': "bg-blue-100 text-blue-800",
  'processing': "bg-amber-100 text-amber-800",
  'ready': "bg-purple-100 text-purple-800",
  'shipped': "bg-emerald-100 text-emerald-800",
  'delivered': "bg-green-100 text-green-800",
  'cancelled': "bg-red-100 text-red-800"
};

// Sample sales data for charts
const salesData = [
  { month: 'Jan', sales: 320000 },
  { month: 'Feb', sales: 350000 },
  { month: 'Mar', sales: 410000 },
  { month: 'Apr', sales: 450000 },
  { month: 'May', sales: 480000 },
  { month: 'Jun', sales: 520000 },
  { month: 'Jul', sales: 550000 },
  { month: 'Aug', sales: 590000 },
  { month: 'Sep', sales: 620000 },
  { month: 'Oct', sales: 670000 },
  { month: 'Nov', sales: 720000 },
  { month: 'Dec', sales: 790000 }
];

// Coffee types sales distribution
const coffeeTypeData = [
  { name: 'Arabica AA', value: 45 },
  { name: 'Arabica Specialty', value: 25 },
  { name: 'Robusta Premium', value: 20 },
  { name: 'Organic Certified', value: 10 }
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const SalesMarketing = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [expandedOrder, setExpandedOrder] = useState(null);
  
  const toggleOrderExpand = (orderId) => {
    if (expandedOrder === orderId) {
      setExpandedOrder(null);
    } else {
      setExpandedOrder(orderId);
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div className="flex-1">
          <h2 className="text-xl font-semibold">Sales & Marketing</h2>
          <p className="text-gray-500 text-sm">Manage sales, customers, and market development</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>This Quarter</span>
          </Button>
          <Button className="flex items-center gap-1">
            <Plus className="h-4 w-4" />
            <span>New Order</span>
          </Button>
        </div>
      </div>
      
      {/* Sales Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-blue-50">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-blue-700">Total Sales</p>
                <p className="text-2xl font-bold text-blue-900">$5.4M</p>
                <p className="text-xs text-blue-700">Year to Date</p>
              </div>
              <div className="bg-blue-100 p-2 rounded-full">
                <DollarSign className="h-5 w-5 text-blue-700" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-green-50">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-green-700">New Orders</p>
                <p className="text-2xl font-bold text-green-900">24</p>
                <p className="text-xs text-green-700">Last 30 Days</p>
              </div>
              <div className="bg-green-100 p-2 rounded-full">
                <ShoppingCart className="h-5 w-5 text-green-700" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-amber-50">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-amber-700">Active Customers</p>
                <p className="text-2xl font-bold text-amber-900">18</p>
                <p className="text-xs text-amber-700">+3 This Quarter</p>
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
                <p className="text-sm text-purple-700">Pending Leads</p>
                <p className="text-2xl font-bold text-purple-900">12</p>
                <p className="text-xs text-purple-700">4 Qualified</p>
              </div>
              <div className="bg-purple-100 p-2 rounded-full">
                <UserPlus className="h-5 w-5 text-purple-700" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Sales Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-1 md:grid-cols-4 w-full">
          <TabsTrigger value="overview">Dashboard</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
          <TabsTrigger value="leads">Leads & Opportunities</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                <span>Sales Performance</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={salesData}
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
                    <Tooltip formatter={(value) => `$${(value/1000).toFixed(0)}k`} />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="sales"
                      stroke="#3b82f6"
                      activeDot={{ r: 8 }}
                      name="Monthly Sales"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5 text-blue-600" />
                  <span>Recent Orders</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {orders.slice(0, 3).map((order, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50">
                      <div className="flex items-center gap-3">
                        <div className="bg-blue-100 p-2 rounded-full">
                          <CreditCard className="h-4 w-4 text-blue-700" />
                        </div>
                        <div>
                          <div className="font-medium">{order.customer}</div>
                          <div className="text-sm text-gray-500">{order.date} • {order.id}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">${order.amount.toLocaleString()}</div>
                        <Badge className={orderStatusColors[order.status]}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </Badge>
                      </div>
                    </div>
                  ))}
                  
                  <Button variant="outline" className="w-full">View All Orders</Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">
                  <HeartHandshake className="h-5 w-5 text-purple-600" />
                  <span>Product Distribution</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={coffeeTypeData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {coffeeTypeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `${value}%`} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-emerald-600" />
                <span>Market Distribution by Region</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      { region: 'Europe', value: 42 },
                      { region: 'North America', value: 28 },
                      { region: 'Asia', value: 18 },
                      { region: 'Middle East', value: 8 },
                      { region: 'Other', value: 4 },
                    ]}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="region" />
                    <YAxis />
                    <Tooltip formatter={(value) => `${value}%`} />
                    <Bar dataKey="value" fill="#10b981" name="Market Share" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="orders" className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5 text-blue-600" />
                  <span>Orders Management</span>
                </CardTitle>
                <div className="flex items-center gap-3">
                  <div className="flex items-center relative w-64">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                    <Input placeholder="Search orders..." className="pl-8" />
                  </div>
                  <Button variant="outline" className="flex items-center gap-1">
                    <Filter className="h-4 w-4" />
                    <span>Filter</span>
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order.id} className="border rounded-lg overflow-hidden">
                    <div
                      className="flex justify-between items-center p-4 cursor-pointer hover:bg-gray-50"
                      onClick={() => toggleOrderExpand(order.id)}
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <Badge className={orderStatusColors[order.status]}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </Badge>
                          <span className="font-medium">{order.id}</span>
                        </div>
                        <div className="text-sm text-gray-600 mt-1">{order.customer}</div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <div className="font-medium">${order.amount.toLocaleString()}</div>
                          <div className="text-sm text-gray-500">{order.date}</div>
                        </div>
                        <Button variant="ghost" size="icon" className="ml-2">
                          {expandedOrder === order.id ? (
                            <ChevronUp className="h-5 w-5" />
                          ) : (
                            <ChevronDown className="h-5 w-5" />
                          )}
                        </Button>
                      </div>
                    </div>
                    
                    {expandedOrder === order.id && (
                      <div className="p-4 bg-gray-50 border-t">
                        <div className="space-y-4">
                          <div>
                            <h4 className="text-sm font-medium text-gray-500 mb-2">Order Items</h4>
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Product</TableHead>
                                  <TableHead>Quantity</TableHead>
                                  <TableHead>Unit Price ($/kg)</TableHead>
                                  <TableHead className="text-right">Total</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {order.items.map((item, index) => (
                                  <TableRow key={index}>
                                    <TableCell>{item.coffee}</TableCell>
                                    <TableCell>{item.quantity}</TableCell>
                                    <TableCell>${item.price.toFixed(2)}</TableCell>
                                    <TableCell className="text-right">${item.total.toLocaleString()}</TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                          
                          <div className="flex justify-between">
                            <div>
                              <p className="text-sm text-gray-500">Shipment ID</p>
                              <p className="font-medium">{order.shipment}</p>
                            </div>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm">
                                View Details
                              </Button>
                              <Button variant="outline" size="sm">
                                Download Invoice
                              </Button>
                              {(order.status === 'confirmed' || order.status === 'processing') && (
                                <Button size="sm">
                                  Track Order
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="customers" className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-600" />
                  <span>Customer Management</span>
                </CardTitle>
                <div className="flex items-center gap-3">
                  <div className="flex items-center relative w-64">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                    <Input placeholder="Search customers..." className="pl-8" />
                  </div>
                  <Button className="flex items-center gap-1">
                    <UserPlus className="h-4 w-4" />
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
                      <TableHead className="w-[120px]">Customer ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Country</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Total Orders</TableHead>
                      <TableHead>Total Value</TableHead>
                      <TableHead>Status</TableHead>
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
                          <div>{customer.contactPerson}</div>
                          <div className="text-xs text-gray-500">{customer.email}</div>
                        </TableCell>
                        <TableCell>{customer.type}</TableCell>
                        <TableCell>{customer.totalOrders}</TableCell>
                        <TableCell>${(customer.totalValue/1000).toFixed(1)}k</TableCell>
                        <TableCell>
                          <Badge className={customerStatusColors[customer.status]}>
                            {customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon">
                              <MessageSquare className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <CreditCard className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Phone className="h-4 w-4" />
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
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-blue-600" />
                <span>Customer Analytics</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-slate-50">
                  <CardContent className="pt-6">
                    <h3 className="font-medium mb-2">Top Customers</h3>
                    <div className="space-y-2">
                      {customers
                        .sort((a, b) => b.totalValue - a.totalValue)
                        .slice(0, 3)
                        .map((customer, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <div className="text-sm">{customer.name}</div>
                            <div className="text-sm font-medium">${(customer.totalValue/1000).toFixed(1)}k</div>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-slate-50">
                  <CardContent className="pt-6">
                    <h3 className="font-medium mb-2">Customer Retention</h3>
                    <div className="text-2xl font-bold text-blue-800">92%</div>
                    <div className="text-sm text-gray-500">Year-over-year retention rate</div>
                  </CardContent>
                </Card>
                
                <Card className="bg-slate-50">
                  <CardContent className="pt-6">
                    <h3 className="font-medium mb-2">Avg. Order Value</h3>
                    <div className="text-2xl font-bold text-emerald-700">$68,500</div>
                    <div className="text-sm text-gray-500">+7% vs previous quarter</div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="leads" className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2">
                  <UserPlus className="h-5 w-5 text-purple-600" />
                  <span>Leads & Opportunities</span>
                </CardTitle>
                <div className="flex items-center gap-3">
                  <div className="flex items-center relative w-64">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                    <Input placeholder="Search leads..." className="pl-8" />
                  </div>
                  <Button className="flex items-center gap-1">
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
                      <TableHead>Country</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Source</TableHead>
                      <TableHead>Date Added</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {leads.map((lead) => (
                      <TableRow key={lead.id}>
                        <TableCell className="font-medium">{lead.id}</TableCell>
                        <TableCell>{lead.company}</TableCell>
                        <TableCell>{lead.country}</TableCell>
                        <TableCell>
                          <div>{lead.contactPerson}</div>
                          <div className="text-xs text-gray-500">{lead.email}</div>
                        </TableCell>
                        <TableCell>{lead.source}</TableCell>
                        <TableCell>{lead.dateAdded}</TableCell>
                        <TableCell>
                          <Badge className={leadStatusColors[lead.status]}>
                            {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="sm">
                              <Mail className="h-4 w-4 mr-1" />
                              <span>Email</span>
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Phone className="h-4 w-4 mr-1" />
                              <span>Call</span>
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Lead Status Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'New', value: 8 },
                          { name: 'Contacted', value: 12 },
                          { name: 'Qualified', value: 6 },
                          { name: 'Negotiation', value: 4 },
                          { name: 'Won', value: 5 },
                          { name: 'Lost', value: 3 }
                        ]}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {coffeeTypeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `${value} leads`} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Lead Conversion Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                    <div className="text-sm">New Lead</div>
                    <div className="border-t border-dashed flex-grow"></div>
                    <div className="text-sm text-gray-500">Day 1</div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                    <div className="text-sm">Initial Contact</div>
                    <div className="border-t border-dashed flex-grow"></div>
                    <div className="text-sm text-gray-500">Day 2-4</div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                    <div className="text-sm">Sample Shipping</div>
                    <div className="border-t border-dashed flex-grow"></div>
                    <div className="text-sm text-gray-500">Day 5-10</div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <div className="text-sm">Negotiation</div>
                    <div className="border-t border-dashed flex-grow"></div>
                    <div className="text-sm text-gray-500">Day 11-25</div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                    <div className="text-sm">Contract Signed</div>
                    <div className="border-t border-dashed flex-grow"></div>
                    <div className="text-sm text-gray-500">Day 26-35</div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="w-2 h-2 rounded-full bg-blue-700"></div>
                    <div className="text-sm">First Order</div>
                    <div className="border-t border-dashed flex-grow"></div>
                    <div className="text-sm text-gray-500">Day 36-45</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SalesMarketing;
