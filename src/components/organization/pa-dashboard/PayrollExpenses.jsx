
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Users, 
  DollarSign, 
  Calendar, 
  TrendingUp,
  FileText,
  Download,
  Search,
  Plus,
  Building,
  Clock
} from 'lucide-react';

const PayrollExpenses = ({ selectedEntity }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const payrollData = [
    {
      id: 1,
      employee: 'John Mukasa',
      company: 'Grand Berna Dairies',
      position: 'Factory Manager',
      department: 'Operations',
      baseSalary: 1500000,
      allowances: 300000,
      deductions: 150000,
      netSalary: 1650000,
      status: 'Paid',
      payDate: '2024-05-31'
    },
    {
      id: 2,
      employee: 'Sarah Namuli',
      company: 'KAJON Coffee Limited',
      position: 'Export Manager',
      department: 'Sales',
      baseSalary: 1200000,
      allowances: 200000,
      deductions: 120000,
      netSalary: 1280000,
      status: 'Pending',
      payDate: '2024-06-01'
    },
    {
      id: 3,
      employee: 'Peter Katende',
      company: 'Kyalima Farmers Limited',
      position: 'Farm Supervisor',
      department: 'Agriculture',
      baseSalary: 800000,
      allowances: 150000,
      deductions: 80000,
      netSalary: 870000,
      status: 'Paid',
      payDate: '2024-05-31'
    },
    {
      id: 4,
      employee: 'Mary Nakato',
      company: 'Grand Berna Dairies',
      position: 'Quality Controller',
      department: 'Quality Assurance',
      baseSalary: 900000,
      allowances: 180000,
      deductions: 90000,
      netSalary: 990000,
      status: 'Processing',
      payDate: '2024-06-02'
    }
  ];

  const expenseData = [
    {
      id: 1,
      category: 'Operational Expenses',
      company: 'Grand Berna Dairies',
      description: 'Monthly utility bills and maintenance',
      amount: 850000,
      date: '2024-05-31',
      status: 'Approved',
      approvedBy: 'Finance Manager'
    },
    {
      id: 2,
      category: 'Marketing & Advertising',
      company: 'KAJON Coffee Limited',
      description: 'Export promotion and trade shows',
      amount: 650000,
      date: '2024-05-28',
      status: 'Pending',
      approvedBy: 'Pending'
    },
    {
      id: 3,
      category: 'Equipment & Supplies',
      company: 'Kyalima Farmers Limited',
      description: 'Farm equipment and agricultural supplies',
      amount: 420000,
      date: '2024-05-25',
      status: 'Approved',
      approvedBy: 'Operations Manager'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Paid': return 'bg-green-500';
      case 'Approved': return 'bg-green-500';
      case 'Pending': return 'bg-yellow-500';
      case 'Processing': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-UG', {
      style: 'currency',
      currency: 'UGX',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const filteredPayroll = payrollData.filter(employee => {
    const matchesSearch = employee.employee.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.position.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || employee.status.toLowerCase() === filterStatus;
    const matchesEntity = selectedEntity === 'all' || employee.company === selectedEntity;
    return matchesSearch && matchesStatus && matchesEntity;
  });

  const filteredExpenses = expenseData.filter(expense => {
    const matchesEntity = selectedEntity === 'all' || expense.company === selectedEntity;
    return matchesEntity;
  });

  const totalPayroll = filteredPayroll.reduce((sum, emp) => sum + emp.netSalary, 0);
  const totalExpenses = filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Payroll & Expense Management</h3>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search employees..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 w-64"
            />
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
            </SelectContent>
          </Select>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Process Payroll
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users className="h-4 w-4" />
              Total Employees
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{filteredPayroll.length}</p>
            <p className="text-xs text-muted-foreground">Across entities</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Total Payroll
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{formatCurrency(totalPayroll)}</p>
            <p className="text-xs text-success">This month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Total Expenses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{formatCurrency(totalExpenses)}</p>
            <p className="text-xs text-primary">Operating costs</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Pending Payments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-warning">
              {filteredPayroll.filter(emp => emp.status === 'Pending').length}
            </p>
            <p className="text-xs text-muted-foreground">Require processing</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="payroll" className="space-y-4">
        <TabsList>
          <TabsTrigger value="payroll">Payroll Management</TabsTrigger>
          <TabsTrigger value="expenses">Expense Reports</TabsTrigger>
          <TabsTrigger value="analytics">Financial Analytics</TabsTrigger>
          <TabsTrigger value="reports">Reports & Compliance</TabsTrigger>
        </TabsList>
        
        <TabsContent value="payroll" className="space-y-4">
          <div className="space-y-3">
            {filteredPayroll.map((employee) => (
              <Card key={employee.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold">{employee.employee}</h4>
                        <Badge variant="outline">{employee.position}</Badge>
                        <Badge className={getStatusColor(employee.status)}>
                          {employee.status}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <Building className="h-3 w-3 text-muted-foreground" />
                          <span>{employee.company}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3 text-muted-foreground" />
                          <span>{employee.department}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-3 w-3 text-muted-foreground" />
                          <span>Base: {formatCurrency(employee.baseSalary)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3 text-muted-foreground" />
                          <span>Pay Date: {new Date(employee.payDate).toLocaleDateString()}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-6 mt-3 text-xs">
                        <span className="text-success">
                          Allowances: {formatCurrency(employee.allowances)}
                        </span>
                        <span className="text-destructive">
                          Deductions: {formatCurrency(employee.deductions)}
                        </span>
                        <span className="font-bold text-primary">
                          Net Salary: {formatCurrency(employee.netSalary)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4" />
                        Payslip
                      </Button>
                      {employee.status === 'Pending' && (
                        <Button size="sm">
                          Process
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="expenses" className="space-y-4">
          <div className="space-y-3">
            {filteredExpenses.map((expense) => (
              <Card key={expense.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold">{expense.category}</h4>
                        <Badge className={getStatusColor(expense.status)}>
                          {expense.status}
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-3">{expense.description}</p>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <Building className="h-3 w-3 text-muted-foreground" />
                          <span>{expense.company}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-3 w-3 text-muted-foreground" />
                          <span>{formatCurrency(expense.amount)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3 text-muted-foreground" />
                          <span>{new Date(expense.date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3 text-muted-foreground" />
                          <span>By: {expense.approvedBy}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        View Details
                      </Button>
                      {expense.status === 'Pending' && (
                        <Button size="sm">
                          Approve
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Payroll Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[200px] flex items-center justify-center bg-gray-100 rounded-md">
                  <TrendingUp className="h-8 w-8 text-muted-foreground" />
                  <span className="ml-2 text-muted-foreground">Payroll Analytics</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Expense Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[200px] flex items-center justify-center bg-gray-100 rounded-md">
                  <FileText className="h-8 w-8 text-muted-foreground" />
                  <span className="ml-2 text-muted-foreground">Expense Analytics</span>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Cost Analysis Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="font-medium">Total Payroll Costs</span>
                  <span className="font-bold text-primary">{formatCurrency(totalPayroll)}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="font-medium">Operating Expenses</span>
                  <span className="font-bold text-accent">{formatCurrency(totalExpenses)}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b bg-muted/10 px-2 rounded">
                  <span className="font-bold">Total Monthly Costs</span>
                  <span className="font-bold text-lg">{formatCurrency(totalPayroll + totalExpenses)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="reports" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { name: 'Monthly Payroll Report', period: 'May 2024', type: 'Payroll' },
              { name: 'Expense Summary Report', period: 'Q2 2024', type: 'Expenses' },
              { name: 'Tax Deduction Report', period: 'May 2024', type: 'Compliance' },
              { name: 'Employee Benefits Report', period: 'Q2 2024', type: 'Benefits' }
            ].map((report, index) => (
              <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FileText className="h-8 w-8 text-primary" />
                      <div>
                        <h4 className="font-medium">{report.name}</h4>
                        <p className="text-sm text-muted-foreground">{report.period}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{report.type}</Badge>
                      <Button size="sm" variant="ghost">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PayrollExpenses;
