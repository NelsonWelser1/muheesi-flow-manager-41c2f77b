
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useToast } from "@/components/ui/use-toast";
import { CalendarIcon, Plus, Search, Filter, Printer, Download, BarChart, PieChart, DollarSign } from "lucide-react";
import { format, subDays } from 'date-fns';
import { BarChart as ReBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart as RePieChart, Pie, Cell } from 'recharts';
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";

const SalesExpenditure = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  // Mock data for sales records
  const [salesRecords, setSalesRecords] = useState([
    {
      id: 'SL001',
      date: subDays(new Date(), 1),
      product: 'Milk',
      quantity: 450,
      unit: 'Liters',
      unitPrice: 2500,
      total: 1125000,
      customer: 'Kazo Dairy Cooperative',
      paymentMethod: 'Bank Transfer',
      status: 'completed',
      notes: 'Bulk sale, good quality milk'
    },
    {
      id: 'SL002',
      date: subDays(new Date(), 2),
      product: 'Bananas',
      quantity: 60,
      unit: 'Bunches',
      unitPrice: 15000,
      total: 900000,
      customer: 'Kashari Market Vendors',
      paymentMethod: 'Cash',
      status: 'completed',
      notes: 'Premium quality matooke'
    },
    {
      id: 'SL003',
      date: subDays(new Date(), 3),
      product: 'Coffee Beans',
      quantity: 200,
      unit: 'Kilograms',
      unitPrice: 10000,
      total: 2000000,
      customer: 'KAJON Coffee Limited',
      paymentMethod: 'Bank Transfer',
      status: 'completed',
      notes: 'Grade A Arabica beans'
    },
    {
      id: 'SL004',
      date: subDays(new Date(), 5),
      product: 'Milk',
      quantity: 380,
      unit: 'Liters',
      unitPrice: 2500,
      total: 950000,
      customer: 'Local Retailers',
      paymentMethod: 'Mobile Money',
      status: 'completed',
      notes: 'Regular weekly supply'
    },
    {
      id: 'SL005',
      date: subDays(new Date(), 7),
      product: 'Cattle',
      quantity: 2,
      unit: 'Heads',
      unitPrice: 2500000,
      total: 5000000,
      customer: 'Mbogo Ranch',
      paymentMethod: 'Bank Transfer',
      status: 'completed',
      notes: 'Healthy heifer cows, in-calf'
    }
  ]);
  
  // Mock data for expenditures
  const [expenditureRecords, setExpenditureRecords] = useState([
    {
      id: 'EX001',
      date: subDays(new Date(), 2),
      category: 'Farm Supplies',
      description: 'Cattle Feed Purchase',
      amount: 1800000,
      vendor: 'Kazo Agro Supplies',
      paymentMethod: 'Bank Transfer',
      status: 'completed',
      notes: 'Monthly feed supply for dairy cattle'
    },
    {
      id: 'EX002',
      date: subDays(new Date(), 4),
      category: 'Salaries',
      description: 'Staff Monthly Salaries',
      amount: 4500000,
      vendor: 'Farm Employees',
      paymentMethod: 'Bank Transfer',
      status: 'completed',
      notes: 'Monthly salaries for 12 permanent staff'
    },
    {
      id: 'EX003',
      date: subDays(new Date(), 5),
      category: 'Equipment',
      description: 'Milking Equipment Maintenance',
      amount: 750000,
      vendor: 'Farm Tech Solutions',
      paymentMethod: 'Mobile Money',
      status: 'completed',
      notes: 'Quarterly maintenance of milking machines'
    },
    {
      id: 'EX004',
      date: subDays(new Date(), 8),
      category: 'Veterinary',
      description: 'Cattle Vaccination',
      amount: 1200000,
      vendor: 'Kazo Vet Clinic',
      paymentMethod: 'Cash',
      status: 'completed',
      notes: 'Routine vaccination for the cattle herd'
    },
    {
      id: 'EX005',
      date: subDays(new Date(), 10),
      category: 'Utilities',
      description: 'Electricity and Water Bills',
      amount: 650000,
      vendor: 'Utility Companies',
      paymentMethod: 'Bank Transfer',
      status: 'completed',
      notes: 'Monthly utility bills for the farm'
    }
  ]);
  
  // Form states
  const [saleForm, setSaleForm] = useState({
    date: new Date(),
    product: '',
    quantity: '',
    unit: '',
    unitPrice: '',
    customer: '',
    paymentMethod: 'Cash',
    notes: ''
  });
  
  const [expenditureForm, setExpenditureForm] = useState({
    date: new Date(),
    category: '',
    description: '',
    amount: '',
    vendor: '',
    paymentMethod: 'Cash',
    notes: ''
  });
  
  // Calculate statistics
  const totalSales = salesRecords.reduce((sum, record) => sum + record.total, 0);
  const totalExpenditure = expenditureRecords.reduce((sum, record) => sum + record.amount, 0);
  const netIncome = totalSales - totalExpenditure;
  
  const totalSalesToday = salesRecords
    .filter(record => 
      format(record.date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')
    )
    .reduce((sum, record) => sum + record.total, 0);
    
  const totalExpenditureToday = expenditureRecords
    .filter(record => 
      format(record.date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')
    )
    .reduce((sum, record) => sum + record.amount, 0);
  
  // Filter records based on search term
  const filteredSalesRecords = salesRecords.filter(record => 
    record.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.id.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const filteredExpenditureRecords = expenditureRecords.filter(record => 
    record.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.vendor.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.id.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Chart data
  const salesByProductData = salesRecords.reduce((acc, record) => {
    const existingIndex = acc.findIndex(item => item.name === record.product);
    if (existingIndex >= 0) {
      acc[existingIndex].value += record.total;
    } else {
      acc.push({ name: record.product, value: record.total });
    }
    return acc;
  }, []);
  
  const expenditureByCategory = expenditureRecords.reduce((acc, record) => {
    const existingIndex = acc.findIndex(item => item.name === record.category);
    if (existingIndex >= 0) {
      acc[existingIndex].value += record.amount;
    } else {
      acc.push({ name: record.category, value: record.amount });
    }
    return acc;
  }, []);
  
  const monthlyData = [
    { month: 'Jan', sales: 9800000, expenses: 6500000 },
    { month: 'Feb', sales: 10200000, expenses: 6700000 },
    { month: 'Mar', sales: 11500000, expenses: 7100000 },
    { month: 'Apr', sales: 9700000, expenses: 6600000 },
    { month: 'May', sales: 10500000, expenses: 6900000 },
    { month: 'Jun', sales: 11800000, expenses: 7300000 }
  ];
  
  // Chart colors
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];
  
  // Handle form input change
  const handleSaleInputChange = (e) => {
    const { name, value } = e.target;
    setSaleForm(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleExpenditureInputChange = (e) => {
    const { name, value } = e.target;
    setExpenditureForm(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle select change
  const handleSaleSelectChange = (name, value) => {
    setSaleForm(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleExpenditureSelectChange = (name, value) => {
    setExpenditureForm(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle date change
  const handleSaleDateChange = (date) => {
    setSaleForm(prev => ({
      ...prev,
      date: date
    }));
  };
  
  const handleExpenditureDateChange = (date) => {
    setExpenditureForm(prev => ({
      ...prev,
      date: date
    }));
  };
  
  // Submit sale form
  const handleSaleSubmit = (e) => {
    e.preventDefault();
    
    // Validation
    if (!saleForm.product || !saleForm.quantity || !saleForm.unit || !saleForm.unitPrice || !saleForm.customer) {
      toast({
        title: "Missing Fields",
        description: "Please fill all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    const quantity = Number(saleForm.quantity);
    const unitPrice = Number(saleForm.unitPrice);
    const total = quantity * unitPrice;
    
    // Create new sale record
    const newSaleRecord = {
      id: `SL${String(salesRecords.length + 1).padStart(3, '0')}`,
      date: saleForm.date,
      product: saleForm.product,
      quantity: quantity,
      unit: saleForm.unit,
      unitPrice: unitPrice,
      total: total,
      customer: saleForm.customer,
      paymentMethod: saleForm.paymentMethod,
      status: 'completed',
      notes: saleForm.notes
    };
    
    // Add to records
    setSalesRecords(prev => [newSaleRecord, ...prev]);
    
    // Reset form
    setSaleForm({
      date: new Date(),
      product: '',
      quantity: '',
      unit: '',
      unitPrice: '',
      customer: '',
      paymentMethod: 'Cash',
      notes: ''
    });
    
    // Show success message
    toast({
      title: "Success",
      description: "Sale record has been added.",
    });
    
    // Switch to sales tab
    setActiveTab('sales');
  };
  
  // Submit expenditure form
  const handleExpenditureSubmit = (e) => {
    e.preventDefault();
    
    // Validation
    if (!expenditureForm.category || !expenditureForm.description || !expenditureForm.amount || !expenditureForm.vendor) {
      toast({
        title: "Missing Fields",
        description: "Please fill all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    // Create new expenditure record
    const newExpenditureRecord = {
      id: `EX${String(expenditureRecords.length + 1).padStart(3, '0')}`,
      date: expenditureForm.date,
      category: expenditureForm.category,
      description: expenditureForm.description,
      amount: Number(expenditureForm.amount),
      vendor: expenditureForm.vendor,
      paymentMethod: expenditureForm.paymentMethod,
      status: 'completed',
      notes: expenditureForm.notes
    };
    
    // Add to records
    setExpenditureRecords(prev => [newExpenditureRecord, ...prev]);
    
    // Reset form
    setExpenditureForm({
      date: new Date(),
      category: '',
      description: '',
      amount: '',
      vendor: '',
      paymentMethod: 'Cash',
      notes: ''
    });
    
    // Show success message
    toast({
      title: "Success",
      description: "Expenditure record has been added.",
    });
    
    // Switch to expenditures tab
    setActiveTab('expenditures');
  };
  
  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-UG', {
      style: 'currency',
      currency: 'UGX',
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  // Format date
  const formatDate = (date) => {
    return format(new Date(date), 'MMM d, yyyy');
  };
  
  // Get status color
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sales & Expenditure</CardTitle>
        <CardDescription>
          Manage and track farm sales, expenditures, and financial performance
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="sales">Sales</TabsTrigger>
            <TabsTrigger value="expenditures">Expenditures</TabsTrigger>
            <TabsTrigger value="add-sale">Add Sale</TabsTrigger>
            <TabsTrigger value="add-expenditure">Add Expenditure</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between space-x-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">Total Sales</p>
                      <p className="text-2xl font-bold">{formatCurrency(totalSales)}</p>
                      <p className="text-sm text-muted-foreground">Year to date</p>
                    </div>
                    <div className="bg-green-100 p-3 rounded-full">
                      <DollarSign className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between space-x-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">Total Expenditure</p>
                      <p className="text-2xl font-bold">{formatCurrency(totalExpenditure)}</p>
                      <p className="text-sm text-muted-foreground">Year to date</p>
                    </div>
                    <div className="bg-red-100 p-3 rounded-full">
                      <DollarSign className="h-6 w-6 text-red-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between space-x-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">Net Income</p>
                      <p className="text-2xl font-bold">{formatCurrency(netIncome)}</p>
                      <p className="text-sm text-muted-foreground">Year to date</p>
                    </div>
                    <div className={`${netIncome >= 0 ? 'bg-blue-100' : 'bg-amber-100'} p-3 rounded-full`}>
                      <DollarSign className={`h-6 w-6 ${netIncome >= 0 ? 'text-blue-600' : 'text-amber-600'}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Monthly Sales vs Expenditure</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <ReBarChart
                        data={monthlyData}
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
                        <Tooltip formatter={(value) => formatCurrency(value)} />
                        <Legend />
                        <Bar dataKey="sales" fill="#4CAF50" name="Sales" />
                        <Bar dataKey="expenses" fill="#FF5722" name="Expenses" />
                      </ReBarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Sales by Product</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RePieChart>
                        <Pie
                          data={salesByProductData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {salesByProductData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => formatCurrency(value)} />
                      </RePieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Recent Transactions</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>ID</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {[...salesRecords.map(s => ({
                        id: s.id,
                        date: s.date,
                        description: `${s.product} (${s.quantity} ${s.unit}) to ${s.customer}`,
                        type: 'sale',
                        amount: s.total,
                        status: s.status
                      })), ...expenditureRecords.map(e => ({
                        id: e.id,
                        date: e.date,
                        description: `${e.description} (${e.category}) from ${e.vendor}`,
                        type: 'expenditure',
                        amount: e.amount,
                        status: e.status
                      }))].sort((a, b) => b.date - a.date).slice(0, 5).map((transaction) => (
                        <TableRow key={transaction.id}>
                          <TableCell>{formatDate(transaction.date)}</TableCell>
                          <TableCell className="font-medium">{transaction.id}</TableCell>
                          <TableCell>{transaction.description}</TableCell>
                          <TableCell>
                            <span className={`capitalize ${transaction.type === 'sale' ? 'text-green-600' : 'text-red-600'}`}>
                              {transaction.type}
                            </span>
                          </TableCell>
                          <TableCell className={transaction.type === 'sale' ? 'text-green-600' : 'text-red-600'}>
                            {formatCurrency(transaction.amount)}
                          </TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(transaction.status)}`}>
                              {transaction.status}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="sales" className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-4">
              <div className="relative w-full sm:w-auto flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search sales..."
                  className="pl-8 w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Button size="sm" onClick={() => setActiveTab('add-sale')}>
                  <Plus className="h-4 w-4 mr-1" /> Add Sale
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-1" /> Export
                </Button>
                <Button variant="outline" size="sm">
                  <Printer className="h-4 w-4 mr-1" /> Print
                </Button>
              </div>
            </div>
            
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Unit Price</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Payment Method</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSalesRecords.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell>{formatDate(record.date)}</TableCell>
                      <TableCell className="font-medium">{record.product}</TableCell>
                      <TableCell>{record.quantity} {record.unit}</TableCell>
                      <TableCell>{formatCurrency(record.unitPrice)}</TableCell>
                      <TableCell className="font-medium">{formatCurrency(record.total)}</TableCell>
                      <TableCell>{record.customer}</TableCell>
                      <TableCell>{record.paymentMethod}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(record.status)}`}>
                          {record.status}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredSalesRecords.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-4 text-muted-foreground">
                        No sales records found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
          
          <TabsContent value="expenditures" className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-4">
              <div className="relative w-full sm:w-auto flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search expenditures..."
                  className="pl-8 w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Button size="sm" onClick={() => setActiveTab('add-expenditure')}>
                  <Plus className="h-4 w-4 mr-1" /> Add Expenditure
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-1" /> Export
                </Button>
                <Button variant="outline" size="sm">
                  <Printer className="h-4 w-4 mr-1" /> Print
                </Button>
              </div>
            </div>
            
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Vendor</TableHead>
                    <TableHead>Payment Method</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredExpenditureRecords.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell>{formatDate(record.date)}</TableCell>
                      <TableCell>{record.category}</TableCell>
                      <TableCell className="font-medium">{record.description}</TableCell>
                      <TableCell className="font-medium">{formatCurrency(record.amount)}</TableCell>
                      <TableCell>{record.vendor}</TableCell>
                      <TableCell>{record.paymentMethod}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(record.status)}`}>
                          {record.status}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredExpenditureRecords.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-4 text-muted-foreground">
                        No expenditure records found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Expenditure by Category</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RePieChart>
                      <Pie
                        data={expenditureByCategory}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {expenditureByCategory.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => formatCurrency(value)} />
                    </RePieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="add-sale">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Record New Sale</CardTitle>
                <CardDescription>Enter details of a new product sale</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSaleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="date">Sale Date *</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !saleForm.date && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {saleForm.date ? format(saleForm.date, "PPP") : <span>Select date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={saleForm.date}
                            onSelect={handleSaleDateChange}
                            initialFocus
                            className="p-3 pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="product">Product *</Label>
                      <Select
                        value={saleForm.product}
                        onValueChange={(value) => handleSaleSelectChange('product', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select product" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Milk">Milk</SelectItem>
                          <SelectItem value="Bananas">Bananas</SelectItem>
                          <SelectItem value="Coffee Beans">Coffee Beans</SelectItem>
                          <SelectItem value="Cattle">Cattle</SelectItem>
                          <SelectItem value="Poultry">Poultry</SelectItem>
                          <SelectItem value="Eggs">Eggs</SelectItem>
                          <SelectItem value="Vegetables">Vegetables</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="quantity">Quantity *</Label>
                      <Input
                        id="quantity"
                        name="quantity"
                        type="number"
                        value={saleForm.quantity}
                        onChange={handleSaleInputChange}
                        placeholder="Enter quantity"
                        min="0"
                        step="0.01"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="unit">Unit *</Label>
                      <Select
                        value={saleForm.unit}
                        onValueChange={(value) => handleSaleSelectChange('unit', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select unit" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Liters">Liters</SelectItem>
                          <SelectItem value="Kilograms">Kilograms</SelectItem>
                          <SelectItem value="Bunches">Bunches</SelectItem>
                          <SelectItem value="Bags">Bags</SelectItem>
                          <SelectItem value="Boxes">Boxes</SelectItem>
                          <SelectItem value="Trays">Trays</SelectItem>
                          <SelectItem value="Pieces">Pieces</SelectItem>
                          <SelectItem value="Heads">Heads</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="unitPrice">Unit Price (UGX) *</Label>
                      <Input
                        id="unitPrice"
                        name="unitPrice"
                        type="number"
                        value={saleForm.unitPrice}
                        onChange={handleSaleInputChange}
                        placeholder="Enter price per unit"
                        min="0"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="customer">Customer *</Label>
                      <Input
                        id="customer"
                        name="customer"
                        value={saleForm.customer}
                        onChange={handleSaleInputChange}
                        placeholder="Enter customer name"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="paymentMethod">Payment Method *</Label>
                      <Select
                        value={saleForm.paymentMethod}
                        onValueChange={(value) => handleSaleSelectChange('paymentMethod', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select payment method" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Cash">Cash</SelectItem>
                          <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                          <SelectItem value="Mobile Money">Mobile Money</SelectItem>
                          <SelectItem value="Credit">Credit</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea
                      id="notes"
                      name="notes"
                      value={saleForm.notes}
                      onChange={handleSaleInputChange}
                      placeholder="Enter any additional notes"
                      rows={3}
                    />
                  </div>
                  
                  <div className="flex justify-end space-x-2 pt-4">
                    <Button type="button" variant="outline" onClick={() => setActiveTab('sales')}>
                      Cancel
                    </Button>
                    <Button type="submit">
                      Record Sale
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="add-expenditure">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Record New Expenditure</CardTitle>
                <CardDescription>Enter details of a new expense</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleExpenditureSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="date">Expenditure Date *</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !expenditureForm.date && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {expenditureForm.date ? format(expenditureForm.date, "PPP") : <span>Select date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={expenditureForm.date}
                            onSelect={handleExpenditureDateChange}
                            initialFocus
                            className="p-3 pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="category">Category *</Label>
                      <Select
                        value={expenditureForm.category}
                        onValueChange={(value) => handleExpenditureSelectChange('category', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Farm Supplies">Farm Supplies</SelectItem>
                          <SelectItem value="Salaries">Salaries</SelectItem>
                          <SelectItem value="Utilities">Utilities</SelectItem>
                          <SelectItem value="Equipment">Equipment</SelectItem>
                          <SelectItem value="Veterinary">Veterinary</SelectItem>
                          <SelectItem value="Fertilizers">Fertilizers</SelectItem>
                          <SelectItem value="Seeds">Seeds</SelectItem>
                          <SelectItem value="Fuel">Fuel</SelectItem>
                          <SelectItem value="Transport">Transport</SelectItem>
                          <SelectItem value="Maintenance">Maintenance</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="description">Description *</Label>
                      <Input
                        id="description"
                        name="description"
                        value={expenditureForm.description}
                        onChange={handleExpenditureInputChange}
                        placeholder="Enter description"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="amount">Amount (UGX) *</Label>
                      <Input
                        id="amount"
                        name="amount"
                        type="number"
                        value={expenditureForm.amount}
                        onChange={handleExpenditureInputChange}
                        placeholder="Enter amount"
                        min="0"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="vendor">Vendor/Payee *</Label>
                      <Input
                        id="vendor"
                        name="vendor"
                        value={expenditureForm.vendor}
                        onChange={handleExpenditureInputChange}
                        placeholder="Enter vendor/payee name"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="paymentMethod">Payment Method *</Label>
                      <Select
                        value={expenditureForm.paymentMethod}
                        onValueChange={(value) => handleExpenditureSelectChange('paymentMethod', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select payment method" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Cash">Cash</SelectItem>
                          <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                          <SelectItem value="Mobile Money">Mobile Money</SelectItem>
                          <SelectItem value="Credit">Credit</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea
                      id="notes"
                      name="notes"
                      value={expenditureForm.notes}
                      onChange={handleExpenditureInputChange}
                      placeholder="Enter any additional notes"
                      rows={3}
                    />
                  </div>
                  
                  <div className="flex justify-end space-x-2 pt-4">
                    <Button type="button" variant="outline" onClick={() => setActiveTab('expenditures')}>
                      Cancel
                    </Button>
                    <Button type="submit">
                      Record Expenditure
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="reports" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-6 flex flex-col items-center justify-center space-y-4">
                  <BarChart className="h-12 w-12 text-purple-500" />
                  <h3 className="text-lg font-medium">Sales Report</h3>
                  <p className="text-sm text-center text-muted-foreground">
                    Detailed sales analysis by product and customer
                  </p>
                  <Button className="w-full">Generate Report</Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6 flex flex-col items-center justify-center space-y-4">
                  <PieChart className="h-12 w-12 text-blue-500" />
                  <h3 className="text-lg font-medium">Expenditure Report</h3>
                  <p className="text-sm text-center text-muted-foreground">
                    Expense breakdown by categories
                  </p>
                  <Button className="w-full">Generate Report</Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6 flex flex-col items-center justify-center space-y-4">
                  <DollarSign className="h-12 w-12 text-green-500" />
                  <h3 className="text-lg font-medium">Profit & Loss</h3>
                  <p className="text-sm text-center text-muted-foreground">
                    Comprehensive profit and loss statement
                  </p>
                  <Button className="w-full">Generate Report</Button>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Financial Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex flex-col">
                        <p className="text-sm text-muted-foreground">Total Sales</p>
                        <p className="text-2xl font-bold">{formatCurrency(totalSales)}</p>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex flex-col">
                        <p className="text-sm text-muted-foreground">Total Expenses</p>
                        <p className="text-2xl font-bold">{formatCurrency(totalExpenditure)}</p>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex flex-col">
                        <p className="text-sm text-muted-foreground">Net Income</p>
                        <p className="text-2xl font-bold">{formatCurrency(netIncome)}</p>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex flex-col">
                        <p className="text-sm text-muted-foreground">Profit Margin</p>
                        <p className="text-2xl font-bold">
                          {totalSales > 0 ? `${((netIncome / totalSales) * 100).toFixed(1)}%` : '0.0%'}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="flex flex-col md:flex-row gap-4">
                  <Card className="flex-1">
                    <CardHeader>
                      <CardTitle className="text-base">Top Selling Products</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Product</TableHead>
                            <TableHead>Quantity</TableHead>
                            <TableHead>Revenue</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {salesByProductData.sort((a, b) => b.value - a.value).slice(0, 5).map((product, index) => (
                            <TableRow key={index}>
                              <TableCell className="font-medium">{product.name}</TableCell>
                              <TableCell>-</TableCell>
                              <TableCell>{formatCurrency(product.value)}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                  
                  <Card className="flex-1">
                    <CardHeader>
                      <CardTitle className="text-base">Top Expense Categories</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Category</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>% of Total</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {expenditureByCategory.sort((a, b) => b.value - a.value).slice(0, 5).map((category, index) => (
                            <TableRow key={index}>
                              <TableCell className="font-medium">{category.name}</TableCell>
                              <TableCell>{formatCurrency(category.value)}</TableCell>
                              <TableCell>
                                {totalExpenditure > 0
                                  ? `${((category.value / totalExpenditure) * 100).toFixed(1)}%`
                                  : '0.0%'}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
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

export default SalesExpenditure;
