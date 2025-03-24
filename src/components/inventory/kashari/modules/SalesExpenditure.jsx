
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { 
  DollarSign, BarChart2, ArrowDownCircle, ArrowUpCircle, Download, 
  Filter, Plus, PieChart, FileText, Printer, Clock
} from "lucide-react";

const SalesExpenditure = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [date, setDate] = useState(new Date());

  // Mock data for demonstration
  const salesData = [
    { id: 1, date: '2023-07-12', product: 'Fresh Milk', quantity: '120 L', amount: 'UGX 360,000', customer: 'Mbarara Dairy Shop', status: 'Paid' },
    { id: 2, date: '2023-07-11', product: 'Cheese', quantity: '15 kg', amount: 'UGX 225,000', customer: 'Hotel Africana', status: 'Paid' },
    { id: 3, date: '2023-07-10', product: 'Bananas', quantity: '45 bunches', amount: 'UGX 675,000', customer: 'Nakasero Market', status: 'Paid' },
    { id: 4, date: '2023-07-09', product: 'Yogurt', quantity: '80 units', amount: 'UGX 400,000', customer: 'City Supermarket', status: 'Pending' },
    { id: 5, date: '2023-07-08', product: 'Fresh Milk', quantity: '100 L', amount: 'UGX 300,000', customer: 'Local Retailers', status: 'Paid' },
  ];
  
  const expenseData = [
    { id: 1, date: '2023-07-11', category: 'Feed', amount: 'UGX 1,200,000', payee: 'Kasese Feed Suppliers', status: 'Paid' },
    { id: 2, date: '2023-07-09', category: 'Farm Supplies', amount: 'UGX 350,000', payee: 'Agri Supplies Ltd', status: 'Paid' },
    { id: 3, date: '2023-07-07', category: 'Wages', amount: 'UGX 1,800,000', payee: 'Farm Workers', status: 'Paid' },
    { id: 4, date: '2023-07-05', category: 'Veterinary Services', amount: 'UGX 450,000', payee: 'Dr. Kawuma Clinic', status: 'Pending' },
    { id: 5, date: '2023-07-01', category: 'Utilities', amount: 'UGX 320,000', payee: 'Various Utilities', status: 'Paid' },
  ];
  
  // Summary statistics
  const summaryStats = {
    totalSales: 'UGX 8,750,000',
    totalExpenses: 'UGX 6,120,000',
    netProfit: 'UGX 2,630,000',
    salesChange: '+12.5%',
    expenseChange: '+5.2%',
    profitChange: '+18.9%'
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <DollarSign className="mr-2 h-5 w-5" /> Sales & Expenditure Management
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">
              <BarChart2 className="mr-2 h-4 w-4" /> Overview
            </TabsTrigger>
            <TabsTrigger value="sales">
              <ArrowUpCircle className="mr-2 h-4 w-4" /> Sales
            </TabsTrigger>
            <TabsTrigger value="expenses">
              <ArrowDownCircle className="mr-2 h-4 w-4" /> Expenses
            </TabsTrigger>
            <TabsTrigger value="reports">
              <FileText className="mr-2 h-4 w-4" /> Reports
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col space-y-2">
                    <span className="text-sm font-medium text-muted-foreground">Total Sales (This Month)</span>
                    <div className="flex items-center">
                      <span className="text-3xl font-bold">{summaryStats.totalSales}</span>
                      <span className="ml-2 text-sm text-green-600">{summaryStats.salesChange}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col space-y-2">
                    <span className="text-sm font-medium text-muted-foreground">Total Expenses (This Month)</span>
                    <div className="flex items-center">
                      <span className="text-3xl font-bold">{summaryStats.totalExpenses}</span>
                      <span className="ml-2 text-sm text-red-600">{summaryStats.expenseChange}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col space-y-2">
                    <span className="text-sm font-medium text-muted-foreground">Net Profit (This Month)</span>
                    <div className="flex items-center">
                      <span className="text-3xl font-bold">{summaryStats.netProfit}</span>
                      <span className="ml-2 text-sm text-green-600">{summaryStats.profitChange}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Recent Transactions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-md">
                      <div className="flex items-center">
                        <ArrowUpCircle className="h-5 w-5 text-green-600 mr-3" />
                        <div>
                          <p className="font-medium">Fresh Milk Sales</p>
                          <p className="text-sm text-muted-foreground">UGX 360,000 • July 12, 2023</p>
                        </div>
                      </div>
                      <span className="text-sm font-medium text-green-600">+UGX 360,000</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-md">
                      <div className="flex items-center">
                        <ArrowDownCircle className="h-5 w-5 text-red-600 mr-3" />
                        <div>
                          <p className="font-medium">Feed Purchase</p>
                          <p className="text-sm text-muted-foreground">UGX 1,200,000 • July 11, 2023</p>
                        </div>
                      </div>
                      <span className="text-sm font-medium text-red-600">-UGX 1,200,000</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-md">
                      <div className="flex items-center">
                        <ArrowUpCircle className="h-5 w-5 text-green-600 mr-3" />
                        <div>
                          <p className="font-medium">Cheese Sales</p>
                          <p className="text-sm text-muted-foreground">UGX 225,000 • July 11, 2023</p>
                        </div>
                      </div>
                      <span className="text-sm font-medium text-green-600">+UGX 225,000</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-md">
                      <div className="flex items-center">
                        <ArrowUpCircle className="h-5 w-5 text-green-600 mr-3" />
                        <div>
                          <p className="font-medium">Banana Sales</p>
                          <p className="text-sm text-muted-foreground">UGX 675,000 • July 10, 2023</p>
                        </div>
                      </div>
                      <span className="text-sm font-medium text-green-600">+UGX 675,000</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-md">
                      <div className="flex items-center">
                        <ArrowDownCircle className="h-5 w-5 text-red-600 mr-3" />
                        <div>
                          <p className="font-medium">Farm Supplies</p>
                          <p className="text-sm text-muted-foreground">UGX 350,000 • July 9, 2023</p>
                        </div>
                      </div>
                      <span className="text-sm font-medium text-red-600">-UGX 350,000</span>
                    </div>
                  </div>
                  
                  <Button variant="outline" className="w-full mt-4">
                    View All Transactions
                  </Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-lg">Revenue Breakdown</CardTitle>
                  <PieChart className="h-5 w-5 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex flex-col space-y-1">
                      <div className="flex justify-between">
                        <span className="font-medium">Dairy Products</span>
                        <span>UGX 4,850,000</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: "55%" }}></div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col space-y-1">
                      <div className="flex justify-between">
                        <span className="font-medium">Banana Sales</span>
                        <span>UGX 2,450,000</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-green-600 h-2.5 rounded-full" style={{ width: "28%" }}></div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col space-y-1">
                      <div className="flex justify-between">
                        <span className="font-medium">Livestock</span>
                        <span>UGX 1,200,000</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-purple-600 h-2.5 rounded-full" style={{ width: "14%" }}></div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col space-y-1">
                      <div className="flex justify-between">
                        <span className="font-medium">Other Income</span>
                        <span>UGX 250,000</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-amber-600 h-2.5 rounded-full" style={{ width: "3%" }}></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 space-y-4">
                    <h4 className="text-sm font-medium">Expense Breakdown</h4>
                    
                    <div className="flex flex-col space-y-1">
                      <div className="flex justify-between">
                        <span className="font-medium">Feed & Supplies</span>
                        <span>UGX 2,850,000</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-red-600 h-2.5 rounded-full" style={{ width: "47%" }}></div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col space-y-1">
                      <div className="flex justify-between">
                        <span className="font-medium">Wages & Salaries</span>
                        <span>UGX 1,800,000</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-orange-600 h-2.5 rounded-full" style={{ width: "29%" }}></div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col space-y-1">
                      <div className="flex justify-between">
                        <span className="font-medium">Maintenance</span>
                        <span>UGX 850,000</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-yellow-600 h-2.5 rounded-full" style={{ width: "14%" }}></div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col space-y-1">
                      <div className="flex justify-between">
                        <span className="font-medium">Utilities & Others</span>
                        <span>UGX 620,000</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-teal-600 h-2.5 rounded-full" style={{ width: "10%" }}></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="sales" className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  <Filter className="mr-2 h-4 w-4" /> Filter
                </Button>
                <Select defaultValue="month">
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Select period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="week">This Week</SelectItem>
                    <SelectItem value="month">This Month</SelectItem>
                    <SelectItem value="quarter">This Quarter</SelectItem>
                    <SelectItem value="year">This Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" /> Export
                </Button>
                <Button>
                  <Plus className="mr-2 h-4 w-4" /> Record Sale
                </Button>
              </div>
            </div>
            
            <Card>
              <CardContent className="p-6">
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Product</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {salesData.map((sale) => (
                        <TableRow key={sale.id}>
                          <TableCell>{sale.date}</TableCell>
                          <TableCell>{sale.product}</TableCell>
                          <TableCell>{sale.quantity}</TableCell>
                          <TableCell>{sale.amount}</TableCell>
                          <TableCell>{sale.customer}</TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              sale.status === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                            }`}>
                              {sale.status}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button variant="outline" size="sm">View</Button>
                              <Button variant="outline" size="sm">Edit</Button>
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
                <CardHeader>
                  <CardTitle className="text-lg">Record New Sale</CardTitle>
                </CardHeader>
                <CardContent>
                  <form className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Product Category</label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="dairy">Dairy Products</SelectItem>
                            <SelectItem value="bananas">Bananas</SelectItem>
                            <SelectItem value="livestock">Livestock</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Product</label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select product" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="fresh_milk">Fresh Milk</SelectItem>
                            <SelectItem value="yogurt">Yogurt</SelectItem>
                            <SelectItem value="cheese">Cheese</SelectItem>
                            <SelectItem value="bananas">Bananas</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Quantity</label>
                        <Input type="number" placeholder="Enter quantity" />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Unit</label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select unit" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="liters">Liters</SelectItem>
                            <SelectItem value="kilograms">Kilograms</SelectItem>
                            <SelectItem value="bunches">Bunches</SelectItem>
                            <SelectItem value="units">Units</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Price per Unit (UGX)</label>
                        <Input type="number" placeholder="Enter price" />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Date</label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full justify-start text-left font-normal"
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {date ? format(date, "PPP") : "Select date"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={date}
                              onSelect={setDate}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Customer</label>
                      <Input placeholder="Enter customer name" />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Payment Status</label>
                      <Select defaultValue="paid">
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="paid">Paid</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <Button type="submit" className="w-full">Save Sale</Button>
                  </form>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Sales Trends</CardTitle>
                </CardHeader>
                <CardContent className="p-6 min-h-[300px] flex items-center justify-center">
                  <div className="text-center text-muted-foreground">
                    <p>Sales trend chart will be displayed here</p>
                    <p className="text-sm">(Charts coming soon)</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="expenses" className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  <Filter className="mr-2 h-4 w-4" /> Filter
                </Button>
                <Select defaultValue="month">
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Select period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="week">This Week</SelectItem>
                    <SelectItem value="month">This Month</SelectItem>
                    <SelectItem value="quarter">This Quarter</SelectItem>
                    <SelectItem value="year">This Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" /> Export
                </Button>
                <Button>
                  <Plus className="mr-2 h-4 w-4" /> Record Expense
                </Button>
              </div>
            </div>
            
            <Card>
              <CardContent className="p-6">
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Payee</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {expenseData.map((expense) => (
                        <TableRow key={expense.id}>
                          <TableCell>{expense.date}</TableCell>
                          <TableCell>{expense.category}</TableCell>
                          <TableCell>{expense.amount}</TableCell>
                          <TableCell>{expense.payee}</TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              expense.status === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                            }`}>
                              {expense.status}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button variant="outline" size="sm">View</Button>
                              <Button variant="outline" size="sm">Edit</Button>
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
                <CardHeader>
                  <CardTitle className="text-lg">Record New Expense</CardTitle>
                </CardHeader>
                <CardContent>
                  <form className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Expense Category</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="feed">Feed</SelectItem>
                          <SelectItem value="supplies">Farm Supplies</SelectItem>
                          <SelectItem value="wages">Wages & Salaries</SelectItem>
                          <SelectItem value="veterinary">Veterinary Services</SelectItem>
                          <SelectItem value="maintenance">Maintenance</SelectItem>
                          <SelectItem value="utilities">Utilities</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Amount (UGX)</label>
                        <Input type="number" placeholder="Enter amount" />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Date</label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full justify-start text-left font-normal"
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {date ? format(date, "PPP") : "Select date"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={date}
                              onSelect={setDate}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Payee</label>
                      <Input placeholder="Enter payee/vendor name" />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Description</label>
                      <Input placeholder="Enter expense description" />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Payment Status</label>
                      <Select defaultValue="paid">
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="paid">Paid</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <Button type="submit" className="w-full">Save Expense</Button>
                  </form>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Monthly Breakdown</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <h4 className="text-sm font-medium">Top Expense Categories</h4>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span>Feed</span>
                        <span>UGX 1,200,000</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-red-600 h-2.5 rounded-full" style={{ width: "42%" }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span>Wages & Salaries</span>
                        <span>UGX 1,800,000</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: "63%" }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span>Farm Supplies</span>
                        <span>UGX 350,000</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-green-600 h-2.5 rounded-full" style={{ width: "12%" }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span>Veterinary Services</span>
                        <span>UGX 450,000</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-purple-600 h-2.5 rounded-full" style={{ width: "16%" }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span>Utilities</span>
                        <span>UGX 320,000</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-yellow-600 h-2.5 rounded-full" style={{ width: "11%" }}></div>
                      </div>
                    </div>
                    
                    <div className="pt-4">
                      <Button variant="outline" className="w-full">
                        <PieChart className="mr-2 h-4 w-4" /> View Detailed Analysis
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="reports" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="flex flex-col">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="mr-2 h-5 w-5" /> Monthly Financial Report
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1">
                  <p className="text-sm text-muted-foreground mb-4">
                    Comprehensive monthly report with income statement, cash flow, and key metrics.
                  </p>
                  <div className="flex space-x-2 mt-auto">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Download className="mr-2 h-4 w-4" /> Download
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Printer className="mr-2 h-4 w-4" /> Print
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="flex flex-col">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="mr-2 h-5 w-5" /> Sales Analysis Report
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1">
                  <p className="text-sm text-muted-foreground mb-4">
                    Detailed analysis of sales by product category, customer, and time period.
                  </p>
                  <div className="flex space-x-2 mt-auto">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Download className="mr-2 h-4 w-4" /> Download
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Printer className="mr-2 h-4 w-4" /> Print
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="flex flex-col">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="mr-2 h-5 w-5" /> Expense Breakdown Report
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1">
                  <p className="text-sm text-muted-foreground mb-4">
                    Detailed breakdown of all expenses by category, trend analysis and recommendations.
                  </p>
                  <div className="flex space-x-2 mt-auto">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Download className="mr-2 h-4 w-4" /> Download
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Printer className="mr-2 h-4 w-4" /> Print
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Generate Custom Report</CardTitle>
                </CardHeader>
                <CardContent>
                  <form className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Report Type</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select report type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="financial">Financial Summary</SelectItem>
                          <SelectItem value="sales">Sales Report</SelectItem>
                          <SelectItem value="expenses">Expense Report</SelectItem>
                          <SelectItem value="profit">Profit & Loss</SelectItem>
                          <SelectItem value="custom">Custom Report</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Start Date</label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full justify-start text-left font-normal"
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              Select start date
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium">End Date</label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full justify-start text-left font-normal"
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              Select end date
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Include Categories</label>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" id="dairy" className="rounded border-gray-300" />
                          <label htmlFor="dairy">Dairy Products</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" id="bananas" className="rounded border-gray-300" />
                          <label htmlFor="bananas">Bananas</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" id="livestock" className="rounded border-gray-300" />
                          <label htmlFor="livestock">Livestock</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" id="other" className="rounded border-gray-300" />
                          <label htmlFor="other">Other</label>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Format</label>
                      <div className="flex space-x-4">
                        <div className="flex items-center space-x-2">
                          <input type="radio" id="pdf" name="format" className="rounded border-gray-300" />
                          <label htmlFor="pdf">PDF</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input type="radio" id="excel" name="format" className="rounded border-gray-300" />
                          <label htmlFor="excel">Excel</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input type="radio" id="csv" name="format" className="rounded border-gray-300" />
                          <label htmlFor="csv">CSV</label>
                        </div>
                      </div>
                    </div>
                    
                    <Button type="submit" className="w-full">Generate Report</Button>
                  </form>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Scheduled Reports</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md border">
                      <div>
                        <p className="font-medium">Monthly Financial Summary</p>
                        <p className="text-sm text-muted-foreground">
                          <Clock className="inline-block h-3 w-3 mr-1" /> First day of month • Email delivery
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">Edit</Button>
                        <Button variant="outline" size="sm" className="text-red-500">Delete</Button>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md border">
                      <div>
                        <p className="font-medium">Weekly Sales Report</p>
                        <p className="text-sm text-muted-foreground">
                          <Clock className="inline-block h-3 w-3 mr-1" /> Every Monday • Email delivery
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">Edit</Button>
                        <Button variant="outline" size="sm" className="text-red-500">Delete</Button>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md border">
                      <div>
                        <p className="font-medium">Quarterly Profit & Loss</p>
                        <p className="text-sm text-muted-foreground">
                          <Clock className="inline-block h-3 w-3 mr-1" /> First day of quarter • Email delivery
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">Edit</Button>
                        <Button variant="outline" size="sm" className="text-red-500">Delete</Button>
                      </div>
                    </div>
                    
                    <Button className="w-full">
                      <Plus className="mr-2 h-4 w-4" /> Schedule New Report
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default SalesExpenditure;
