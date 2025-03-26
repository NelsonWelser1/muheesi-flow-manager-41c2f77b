
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { 
  CreditCard, DollarSign, TrendingUp, Plus, ArrowUpRight, ArrowDownRight,
  Search, Download, Calendar, Filter, CreditCard as CreditCardIcon, 
  FileText, BarChart3, PieChart, CheckCircle, Clock
} from 'lucide-react';
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer 
} from 'recharts';

// Sample revenue data for charts
const revenueData = [
  { month: 'Jan', revenue: 125000, expenses: 78000, profit: 47000 },
  { month: 'Feb', revenue: 142000, expenses: 82000, profit: 60000 },
  { month: 'Mar', revenue: 158000, expenses: 91000, profit: 67000 },
  { month: 'Apr', revenue: 175000, expenses: 96000, profit: 79000 },
  { month: 'May', revenue: 190000, expenses: 103000, profit: 87000 },
  { month: 'Jun', revenue: 205000, expenses: 110000, profit: 95000 },
];

// Sample invoices data
const invoices = [
  {
    id: 'INV-2023-001',
    client: 'European Coffee Roasters GmbH',
    amount: 85000,
    currency: 'USD',
    date: '2023-12-10',
    dueDate: '2024-01-10',
    status: 'paid',
    paymentDate: '2023-12-18'
  },
  {
    id: 'INV-2023-002',
    client: 'Artisan Bean Co.',
    amount: 56500,
    currency: 'USD',
    date: '2023-12-15',
    dueDate: '2024-01-15',
    status: 'pending',
    paymentDate: null
  },
  {
    id: 'INV-2023-003',
    client: 'Tokyo Coffee Imports',
    amount: 72300,
    currency: 'USD',
    date: '2023-11-25',
    dueDate: '2023-12-25',
    status: 'overdue',
    paymentDate: null
  },
  {
    id: 'INV-2023-004',
    client: 'Middle East Coffee Trading LLC',
    amount: 92000,
    currency: 'USD',
    date: '2023-12-05',
    dueDate: '2024-01-05',
    status: 'paid',
    paymentDate: '2023-12-15'
  },
  {
    id: 'INV-2023-005',
    client: 'Nordic Coffee Collective',
    amount: 48700,
    currency: 'USD',
    date: '2023-12-20',
    dueDate: '2024-01-20',
    status: 'pending',
    paymentDate: null
  },
];

// Sample payments data
const payments = [
  {
    id: 'PMT-2023-001',
    invoiceId: 'INV-2023-001',
    client: 'European Coffee Roasters GmbH',
    amount: 85000,
    currency: 'USD',
    date: '2023-12-18',
    method: 'wire_transfer',
    reference: 'WT-9876543'
  },
  {
    id: 'PMT-2023-002',
    invoiceId: 'INV-2023-004',
    client: 'Middle East Coffee Trading LLC',
    amount: 92000,
    currency: 'USD',
    date: '2023-12-15',
    method: 'wire_transfer',
    reference: 'WT-9876544'
  },
];

// Status colors
const statusColors = {
  'paid': "bg-green-100 text-green-800",
  'pending': "bg-amber-100 text-amber-800",
  'overdue': "bg-red-100 text-red-800",
  'draft': "bg-gray-100 text-gray-800",
  'voided': "bg-purple-100 text-purple-800"
};

const paymentMethods = {
  'wire_transfer': 'Wire Transfer',
  'credit_card': 'Credit Card',
  'check': 'Check',
  'cash': 'Cash',
  'bank_transfer': 'Bank Transfer'
};

const FinanceManagement = () => {
  const [activeTab, setActiveTab] = useState('overview');
  
  // Calculate totals
  const totalInvoiced = invoices.reduce((total, inv) => total + inv.amount, 0);
  const totalPaid = invoices.filter(inv => inv.status === 'paid').reduce((total, inv) => total + inv.amount, 0);
  const totalPending = invoices.filter(inv => inv.status === 'pending').reduce((total, inv) => total + inv.amount, 0);
  const totalOverdue = invoices.filter(inv => inv.status === 'overdue').reduce((total, inv) => total + inv.amount, 0);
  
  // Calculate payment rate
  const paymentRate = (totalPaid / totalInvoiced) * 100;
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div className="flex-1">
          <h2 className="text-xl font-semibold">Finance Management</h2>
          <p className="text-gray-500 text-sm">Track invoices, payments, and financial performance</p>
        </div>
        <div className="flex gap-2">
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
      
      {/* Financial Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-blue-50">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-blue-700">Total Revenue</p>
                <p className="text-2xl font-bold text-blue-900">${(totalInvoiced/1000).toFixed(1)}k</p>
                <p className="text-xs text-blue-700">Current Quarter</p>
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
                <p className="text-sm text-green-700">Payments Received</p>
                <p className="text-2xl font-bold text-green-900">${(totalPaid/1000).toFixed(1)}k</p>
                <p className="text-xs text-green-700">
                  <span className="inline-flex items-center">
                    <ArrowUpRight className="h-3 w-3 mr-1 text-green-700" />
                    12% vs Last Quarter
                  </span>
                </p>
              </div>
              <div className="bg-green-100 p-2 rounded-full">
                <CheckCircle className="h-5 w-5 text-green-700" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-amber-50">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-amber-700">Pending</p>
                <p className="text-2xl font-bold text-amber-900">${(totalPending/1000).toFixed(1)}k</p>
                <p className="text-xs text-amber-700">{invoices.filter(inv => inv.status === 'pending').length} Invoices</p>
              </div>
              <div className="bg-amber-100 p-2 rounded-full">
                <Clock className="h-5 w-5 text-amber-700" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-red-50">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-red-700">Overdue</p>
                <p className="text-2xl font-bold text-red-900">${(totalOverdue/1000).toFixed(1)}k</p>
                <p className="text-xs text-red-700">{invoices.filter(inv => inv.status === 'overdue').length} Invoices</p>
              </div>
              <div className="bg-red-100 p-2 rounded-full">
                <CreditCardIcon className="h-5 w-5 text-red-700" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Payment Rate Progress */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Payment Collection Rate</span>
              <span className="text-sm font-medium">{paymentRate.toFixed(1)}%</span>
            </div>
            <Progress value={paymentRate} className="h-2" />
            <div className="text-xs text-gray-500">
              ${(totalPaid/1000).toFixed(1)}k received of ${(totalInvoiced/1000).toFixed(1)}k invoiced
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Finance Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-blue-600" />
                <span>Financial Performance</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
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
                    <Bar dataKey="revenue" name="Revenue" fill="#3b82f6" />
                    <Bar dataKey="expenses" name="Expenses" fill="#ef4444" />
                    <Bar dataKey="profit" name="Profit" fill="#10b981" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Recent Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {payments.slice(0, 3).map((payment, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50">
                      <div className="flex items-center gap-3">
                        <div className="bg-green-100 p-2 rounded-full">
                          <ArrowUpRight className="h-4 w-4 text-green-700" />
                        </div>
                        <div>
                          <div className="font-medium">{payment.client}</div>
                          <div className="text-sm text-gray-500">{payment.date}</div>
                        </div>
                      </div>
                      <div className="text-green-700 font-medium">
                        +${payment.amount.toLocaleString()}
                      </div>
                    </div>
                  ))}
                  
                  <Button variant="outline" className="w-full">View All Transactions</Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Upcoming Payments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {invoices.filter(inv => inv.status === 'pending').slice(0, 3).map((invoice, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50">
                      <div className="flex items-center gap-3">
                        <div className="bg-amber-100 p-2 rounded-full">
                          <Clock className="h-4 w-4 text-amber-700" />
                        </div>
                        <div>
                          <div className="font-medium">{invoice.client}</div>
                          <div className="text-sm text-gray-500">Due: {invoice.dueDate}</div>
                        </div>
                      </div>
                      <div className="text-amber-700 font-medium">
                        ${invoice.amount.toLocaleString()}
                      </div>
                    </div>
                  ))}
                  
                  <Button variant="outline" className="w-full">View All Pending</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="invoices" className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-600" />
                  <span>Invoice Management</span>
                </CardTitle>
                <div className="flex items-center gap-3">
                  <div className="flex items-center relative w-64">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                    <Input placeholder="Search invoices..." className="pl-8" />
                  </div>
                  <Select defaultValue="all">
                    <SelectTrigger className="w-[130px]">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="overdue">Overdue</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">Invoice #</TableHead>
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
                        <TableCell>{invoice.client}</TableCell>
                        <TableCell>{invoice.date}</TableCell>
                        <TableCell>{invoice.dueDate}</TableCell>
                        <TableCell>${invoice.amount.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge className={statusColors[invoice.status]}>
                            {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="sm">View</Button>
                            <Button variant="ghost" size="sm">Download</Button>
                            {invoice.status === 'pending' && (
                              <Button variant="ghost" size="sm" className="text-green-700">Mark Paid</Button>
                            )}
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
        
        <TabsContent value="payments" className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <CreditCardIcon className="h-5 w-5 text-blue-600" />
                <span>Payment Transactions</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">Payment ID</TableHead>
                      <TableHead>Invoice #</TableHead>
                      <TableHead>Client</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead>Reference</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {payments.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell className="font-medium">{payment.id}</TableCell>
                        <TableCell>{payment.invoiceId}</TableCell>
                        <TableCell>{payment.client}</TableCell>
                        <TableCell>{payment.date}</TableCell>
                        <TableCell>${payment.amount.toLocaleString()}</TableCell>
                        <TableCell>{paymentMethods[payment.method]}</TableCell>
                        <TableCell>{payment.reference}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="sm">View</Button>
                            <Button variant="ghost" size="sm">Receipt</Button>
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
        
        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-blue-600" />
                <span>Financial Reports</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { title: 'Revenue by Quarter', icon: BarChart3 },
                  { title: 'Payment Collection Report', icon: CreditCardIcon },
                  { title: 'Invoice Aging Analysis', icon: FileText },
                  { title: 'Cash Flow Statement', icon: TrendingUp },
                  { title: 'Profit & Loss Statement', icon: PieChart },
                  { title: 'Client Payment History', icon: FileText }
                ].map((report, i) => {
                  const ReportIcon = report.icon;
                  return (
                    <Card key={i} className="flex items-center gap-4 p-4 hover:bg-gray-50 cursor-pointer">
                      <div className="bg-blue-100 p-2 rounded-full">
                        <ReportIcon className="h-5 w-5 text-blue-700" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">{report.title}</h3>
                        <p className="text-sm text-gray-500">Last generated: Dec 24, 2023</p>
                      </div>
                      <Button variant="outline" size="sm">Generate</Button>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FinanceManagement;
