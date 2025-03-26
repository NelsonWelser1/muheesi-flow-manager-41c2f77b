
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { 
  DollarSign, FileText, Calendar, Download, Filter, CreditCard,
  BarChart3, PieChart as PieChartIcon, ArrowUpRight, ArrowDownRight,
  Plus, Search, Eye, Wallet, Landmark, TrendingUp
} from 'lucide-react';

// Sample finance data
const revenueData = [
  { month: 'Jan', actual: 102500, projected: 95000 },
  { month: 'Feb', actual: 107800, projected: 100000 },
  { month: 'Mar', actual: 121000, projected: 115000 },
  { month: 'Apr', actual: 145000, projected: 130000 },
  { month: 'May', actual: 138700, projected: 145000 },
  { month: 'Jun', actual: 158900, projected: 150000 },
];

const expenseCategories = [
  { name: 'Logistics', value: 35 },
  { name: 'Operations', value: 25 },
  { name: 'Marketing', value: 15 },
  { name: 'Procurement', value: 20 },
  { name: 'Admin', value: 5 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const invoices = [
  { 
    id: 'INV-1001', 
    contract: 'CNT-1001', 
    client: 'European Coffee Roasters GmbH', 
    date: '2023-11-15', 
    amount: '$145,000', 
    status: 'paid', 
    dueDate: '2023-12-15'
  },
  { 
    id: 'INV-1002', 
    contract: 'CNT-1002', 
    client: 'Artisan Bean Co.', 
    date: '2023-11-28', 
    amount: '$92,500', 
    status: 'pending', 
    dueDate: '2023-12-28'
  },
  { 
    id: 'INV-1003', 
    contract: 'CNT-1004', 
    client: 'Middle East Coffee Trading LLC', 
    date: '2023-12-05', 
    amount: '$115,000', 
    status: 'paid', 
    dueDate: '2024-01-05'
  },
  { 
    id: 'INV-1004', 
    contract: 'CNT-1003', 
    client: 'Tokyo Coffee Imports', 
    date: '2023-12-10', 
    amount: '$78,300', 
    status: 'overdue', 
    dueDate: '2023-12-25'
  }
];

const statusColors = {
  paid: "bg-green-100 text-green-800",
  pending: "bg-amber-100 text-amber-800",
  overdue: "bg-red-100 text-red-800",
  draft: "bg-gray-100 text-gray-800"
};

const FinanceManagement = () => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div className="flex-1">
          <h2 className="text-xl font-semibold">Finance Management</h2>
          <p className="text-gray-500 text-sm">Manage payments, invoices, and financial reports</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>Q4 2023</span>
          </Button>
          <Button variant="outline" className="flex items-center gap-1">
            <Download className="h-4 w-4" />
            <span>Export</span>
          </Button>
          <Button className="flex items-center gap-1">
            <Plus className="h-4 w-4" />
            <span>New Invoice</span>
          </Button>
        </div>
      </div>
      
      {/* Finance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-green-50">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-green-700">Total Revenue</p>
                <p className="text-2xl font-bold text-green-900">$773,900</p>
                <div className="text-xs text-green-700 flex items-center">
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                  +8.5% vs Last Quarter
                </div>
              </div>
              <div className="bg-green-100 p-2 rounded-full">
                <DollarSign className="h-5 w-5 text-green-700" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-amber-50">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-amber-700">Outstanding</p>
                <p className="text-2xl font-bold text-amber-900">$170,800</p>
                <div className="text-xs text-amber-700 flex items-center">
                  <ArrowDownRight className="h-3 w-3 mr-1" />
                  -3.2% vs Last Month
                </div>
              </div>
              <div className="bg-amber-100 p-2 rounded-full">
                <Wallet className="h-5 w-5 text-amber-700" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-blue-50">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-blue-700">Expenses</p>
                <p className="text-2xl font-bold text-blue-900">$431,500</p>
                <div className="text-xs text-blue-700 flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +5.1% vs Last Quarter
                </div>
              </div>
              <div className="bg-blue-100 p-2 rounded-full">
                <CreditCard className="h-5 w-5 text-blue-700" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-purple-50">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-purple-700">Profit Margin</p>
                <p className="text-2xl font-bold text-purple-900">44.2%</p>
                <div className="text-xs text-purple-700 flex items-center">
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                  +1.8% vs Last Quarter
                </div>
              </div>
              <div className="bg-purple-100 p-2 rounded-full">
                <Landmark className="h-5 w-5 text-purple-700" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Finance Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Financial Overview</TabsTrigger>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
          <TabsTrigger value="expenses">Expenses</TabsTrigger>
          <TabsTrigger value="reports">Financial Reports</TabsTrigger>
        </TabsList>
        
        {/* Financial Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Revenue Chart */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-blue-600" />
                <span>Revenue Performance (2023)</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={revenueData}
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
                    <Line 
                      type="monotone" 
                      dataKey="actual" 
                      name="Actual Revenue" 
                      stroke="#4f46e5" 
                      activeDot={{ r: 8 }}
                      strokeWidth={2}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="projected" 
                      name="Projected Revenue" 
                      stroke="#94a3b8" 
                      strokeDasharray="5 5"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          {/* Expense Distribution */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <PieChartIcon className="h-5 w-5 text-blue-600" />
                <span>Expense Distribution</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={expenseCategories}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {expenseCategories.map((entry, index) => (
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
        </TabsContent>
        
        {/* Invoices Tab */}
        <TabsContent value="invoices" className="space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-600" />
                  <span>Invoice Management</span>
                </CardTitle>
                <div className="flex items-center relative w-64">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                  <Input placeholder="Search invoices..." className="pl-8" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">Invoice ID</TableHead>
                      <TableHead>Contract</TableHead>
                      <TableHead>Client</TableHead>
                      <TableHead>Issue Date</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {invoices.map((invoice) => (
                      <TableRow key={invoice.id}>
                        <TableCell className="font-medium">{invoice.id}</TableCell>
                        <TableCell>{invoice.contract}</TableCell>
                        <TableCell>{invoice.client}</TableCell>
                        <TableCell>{invoice.date}</TableCell>
                        <TableCell>{invoice.dueDate}</TableCell>
                        <TableCell>{invoice.amount}</TableCell>
                        <TableCell>
                          <Badge className={statusColors[invoice.status]}>
                            {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Download className="h-4 w-4" />
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
        
        {/* Expenses Tab */}
        <TabsContent value="expenses" className="space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Expense Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 border-2 border-dashed rounded-lg">
                <h3 className="text-lg font-medium text-gray-500">Expense Tracking Module</h3>
                <p className="text-gray-400 mt-2">
                  This feature will be implemented in the next update
                </p>
                <Button className="mt-4">Request Early Access</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Financial Reports Tab */}
        <TabsContent value="reports" className="space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-600" />
                <span>Financial Reports</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: 'Q4 2023 Financial Summary', date: 'Dec 31, 2023', type: 'Quarterly Report' },
                  { name: 'November 2023 P&L Statement', date: 'Dec 10, 2023', type: 'Monthly P&L' },
                  { name: 'Q3 2023 Financial Analysis', date: 'Oct 15, 2023', type: 'Quarterly Report' },
                  { name: 'Cash Flow Analysis - 2023', date: 'Dec 1, 2023', type: 'Cash Flow Report' },
                ].map((report, index) => (
                  <div key={index} className="flex justify-between items-center p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex gap-4 items-center">
                      <div className="bg-blue-100 p-2 rounded-full">
                        <FileText className="h-5 w-5 text-blue-700" />
                      </div>
                      <div>
                        <div className="font-medium">{report.name}</div>
                        <div className="text-sm text-gray-500">
                          {report.date} • {report.type}
                        </div>
                      </div>
                    </div>
                    <Button variant="outline" className="flex items-center gap-1">
                      <Download className="h-4 w-4" />
                      <span>Download</span>
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FinanceManagement;
