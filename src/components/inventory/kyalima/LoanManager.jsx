import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Search, 
  RefreshCw, 
  FileDown, 
  Plus, 
  Printer, 
  Calendar,
  ArrowUpRight,
  DollarSign,
  Pencil,
  Trash2,
  AlertCircle,
  Loader2
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { KyalimaPDFExport } from "./utils/KyalimaPDFExport";
import { Progress } from "@/components/ui/progress";
import { format } from 'date-fns';
import { useLoanData } from '@/hooks/useLoanData';

const LoanManager = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [addLoanDialog, setAddLoanDialog] = useState(false);
  
  const {
    loansData,
    isLoading,
    isSubmitting,
    error,
    fetchLoansData,
    addLoan,
    deleteLoan
  } = useLoanData();
  
  const [newLoan, setNewLoan] = useState({
    loan_id: '',
    institution: '',
    start_date: format(new Date(), 'yyyy-MM-dd'),
    due_date: '',
    amount: '',
    interest_rate: '',
    payment_frequency: 'monthly',
    purpose: '',
    collateral: '',
    contact: '',
    notes: ''
  });
  
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setNewLoan(prev => ({
      ...prev,
      [id]: value
    }));
  };
  
  const handleSelectChange = (field, value) => {
    setNewLoan(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const clearForm = () => {
    setNewLoan({
      loan_id: '',
      institution: '',
      start_date: format(new Date(), 'yyyy-MM-dd'),
      due_date: '',
      amount: '',
      interest_rate: '',
      payment_frequency: 'monthly',
      purpose: '',
      collateral: '',
      contact: '',
      notes: ''
    });
  };
  
  const handleSubmit = async () => {
    const success = await addLoan(newLoan);
    if (success) {
      setAddLoanDialog(false);
      clearForm();
    }
  };
  
  const filteredLoans = loansData.filter(loan => {
    const matchesSearch = 
      loan.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
      loan.institution.toLowerCase().includes(searchTerm.toLowerCase()) || 
      (loan.purpose && loan.purpose.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = filterStatus === 'all' || loan.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const activeLoans = loansData.filter(loan => loan.status === 'active');
  const totalActiveLoansAmount = activeLoans.reduce((total, loan) => {
    const amount = typeof loan.remainingAmount === 'string'
      ? parseInt(loan.remainingAmount.replace(/\D/g, ''))
      : (loan.remaining_amount || 0);
    return total + amount;
  }, 0);
  
  const formatCurrency = (amount) => {
    if (amount === 'N/A') return amount;
    
    if (typeof amount === 'number') {
      return `UGX ${amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
    }
    
    if (amount && typeof amount === 'string' && amount.startsWith('UGX')) return amount;
    
    const value = parseInt(amount?.replace(/\D/g, '') || 0);
    return `UGX ${value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
  };
  
  const calculateRepaymentPercentage = (loan) => {
    if (loan.status === 'completed') return 100;
    
    let totalAmount, remainingAmount;
    
    if (typeof loan.amount === 'string' && loan.amount.startsWith('UGX')) {
      totalAmount = parseInt(loan.amount.replace(/\D/g, ''));
    } else {
      totalAmount = parseFloat(loan.amount || 0);
    }
    
    if (typeof loan.remainingAmount === 'string' && loan.remainingAmount.startsWith('UGX')) {
      remainingAmount = parseInt(loan.remainingAmount.replace(/\D/g, ''));
    } else {
      remainingAmount = parseFloat(loan.remaining_amount || 0);
    }
    
    if (totalAmount === 0) return 0;
    
    const repaidAmount = totalAmount - remainingAmount;
    return Math.round((repaidAmount / totalAmount) * 100);
  };
  
  const getDaysUntilNextPayment = (nextPaymentDate) => {
    if (!nextPaymentDate || nextPaymentDate === 'N/A') return 'N/A';
    
    const today = new Date();
    const paymentDate = new Date(nextPaymentDate);
    const diffTime = paymentDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays > 0 ? diffDays : 'Due today';
  };
  
  const getStatusBadge = (status) => {
    switch(status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case 'completed':
        return <Badge className="bg-blue-100 text-blue-800">Completed</Badge>;
      case 'overdue':
        return <Badge className="bg-red-100 text-red-800">Overdue</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>;
    }
  };
  
  const handleRefresh = () => {
    fetchLoansData();
    toast({
      title: "Data Refreshed",
      description: "Loan data has been refreshed from the database.",
    });
  };
  
  const handleExportPDF = () => {
    KyalimaPDFExport.exportTableToPDF('loans-table', 'Kyalima_Loan_Data');
    toast({
      title: "Export Complete",
      description: "Your loan data has been exported to PDF.",
    });
  };
  
  const handlePrint = () => {
    KyalimaPDFExport.printTable('loans-table');
    toast({
      title: "Print Prepared",
      description: "Sending loan data to printer...",
    });
  };

  const handleDeleteLoan = async (loanId) => {
    const confirmed = window.confirm("Are you sure you want to delete this loan? This action cannot be undone.");
    if (confirmed) {
      await deleteLoan(loanId);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Loans</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeLoans.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Current loans</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Outstanding</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(totalActiveLoansAmount)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Remaining balance</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Next Payment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {activeLoans.length > 0 ? formatCurrency(activeLoans[0].nextPaymentAmount) : 'N/A'}
            </div>
            <div className="flex items-center mt-1">
              <Calendar className="h-3 w-3 text-muted-foreground mr-1" />
              <p className="text-xs text-muted-foreground">
                {activeLoans.length > 0 ? (activeLoans[0].next_payment || 'No date set') : 'No upcoming payments'}
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Repayment Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Overall</span>
                <span className="font-medium">35%</span>
              </div>
              <Progress value={35} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex flex-1 items-center space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by ID, bank, or purpose..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Filter status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="overdue">Overdue</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon" onClick={handleRefresh} disabled={isLoading}>
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
          </Button>
        </div>
        <div className="flex items-center space-x-2">
          <Dialog open={addLoanDialog} onOpenChange={setAddLoanDialog}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                <span>Add Loan</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Add New Loan</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="loan_id">Loan ID</Label>
                    <Input 
                      id="loan_id" 
                      placeholder="KYL-L###" 
                      value={newLoan.loan_id}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="institution">Financial Institution</Label>
                    <Input 
                      id="institution" 
                      placeholder="Bank name" 
                      value={newLoan.institution}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="start_date">Start Date</Label>
                    <Input 
                      id="start_date" 
                      type="date" 
                      value={newLoan.start_date}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="due_date">Due Date</Label>
                    <Input 
                      id="due_date" 
                      type="date" 
                      value={newLoan.due_date}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="amount">Loan Amount</Label>
                    <Input 
                      id="amount" 
                      placeholder="UGX amount" 
                      type="number"
                      value={newLoan.amount}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="interest_rate">Interest Rate (%)</Label>
                    <Input 
                      id="interest_rate" 
                      type="number" 
                      step="0.1" 
                      value={newLoan.interest_rate}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="payment_frequency">Payment Frequency</Label>
                    <Select 
                      value={newLoan.payment_frequency} 
                      onValueChange={(value) => handleSelectChange('payment_frequency', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="quarterly">Quarterly</SelectItem>
                        <SelectItem value="biannual">Bi-annual</SelectItem>
                        <SelectItem value="annual">Annual</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="purpose">Purpose</Label>
                    <Input 
                      id="purpose" 
                      placeholder="Loan purpose" 
                      value={newLoan.purpose}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="collateral">Collateral</Label>
                    <Input 
                      id="collateral" 
                      placeholder="Collateral details" 
                      value={newLoan.collateral}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact">Contact Person</Label>
                    <Input 
                      id="contact" 
                      placeholder="Bank contact person" 
                      value={newLoan.contact}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Input 
                    id="notes" 
                    placeholder="Additional notes" 
                    value={newLoan.notes}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="flex justify-end space-x-2 pt-2">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      clearForm();
                      setAddLoanDialog(false);
                    }}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      'Save Loan'
                    )}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          <Button variant="outline" size="icon" onClick={handlePrint}>
            <Printer className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={handleExportPDF}>
            <FileDown className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table id="loans-table">
              <TableHeader>
                <TableRow>
                  <TableHead>Loan ID</TableHead>
                  <TableHead>Institution</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Remaining</TableHead>
                  <TableHead>Next Payment</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={10} className="text-center py-10">
                      <div className="flex flex-col items-center justify-center">
                        <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
                        <span>Loading loan data...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : error ? (
                  <TableRow>
                    <TableCell colSpan={10} className="text-center py-10 text-red-500">
                      <AlertCircle className="h-8 w-8 mx-auto mb-2" />
                      <p>{error}</p>
                    </TableCell>
                  </TableRow>
                ) : filteredLoans.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={10} className="text-center py-10">
                      No loan records found. Add your first loan record.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredLoans.map((loan) => {
                    const repaymentPercentage = calculateRepaymentPercentage(loan);
                    const daysUntilNextPayment = getDaysUntilNextPayment(loan.next_payment);
                    
                    return (
                      <TableRow key={loan.id}>
                        <TableCell className="font-medium">{loan.id}</TableCell>
                        <TableCell>{loan.institution}</TableCell>
                        <TableCell>{loan.start_date}</TableCell>
                        <TableCell>{loan.due_date}</TableCell>
                        <TableCell>{loan.amount}</TableCell>
                        <TableCell>{loan.remainingAmount}</TableCell>
                        <TableCell>
                          {loan.next_payment === 'N/A' || !loan.next_payment ? (
                            'N/A'
                          ) : (
                            <div>
                              {loan.next_payment}
                              <div className="text-xs text-muted-foreground">
                                {daysUntilNextPayment !== 'N/A' && (
                                  <span className={daysUntilNextPayment < 5 ? 'text-red-500 font-medium' : ''}>
                                    {typeof daysUntilNextPayment === 'number' ? `${daysUntilNextPayment} days left` : daysUntilNextPayment}
                                  </span>
                                )}
                              </div>
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="w-[140px]">
                          <div className="flex items-center gap-2">
                            <div className="w-full bg-slate-100 h-2 rounded-full">
                              <div 
                                className="bg-primary h-2 rounded-full" 
                                style={{ width: `${repaymentPercentage}%` }} 
                              />
                            </div>
                            <span className="text-xs">{repaymentPercentage}%</span>
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(loan.status)}</TableCell>
                        <TableCell className="text-right space-x-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8"
                            onClick={() => handleDeleteLoan(loan.id)}
                            disabled={isSubmitting}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <div className="mt-8">
        <h3 className="text-lg font-medium mb-4">Payment Schedule & Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Upcoming Payments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {loansData
                  .filter(loan => loan.status === 'active')
                  .sort((a, b) => new Date(a.nextPayment) - new Date(b.nextPayment))
                  .slice(0, 3)
                  .map((loan, idx) => {
                    const daysUntilNextPayment = getDaysUntilNextPayment(loan.nextPayment);
                    return (
                      <div key={idx} className="flex items-center justify-between border-b pb-2 last:border-0">
                        <div>
                          <p className="font-medium">{loan.institution} ({loan.id})</p>
                          <p className="text-sm text-muted-foreground">{loan.nextPayment}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{loan.nextPaymentAmount}</p>
                          {typeof daysUntilNextPayment === 'number' && daysUntilNextPayment < 5 && (
                            <div className="flex items-center text-xs text-red-500">
                              <AlertCircle className="h-3 w-3 mr-1" />
                              <span>{daysUntilNextPayment === 0 ? 'Due today' : `${daysUntilNextPayment} days left`}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  }
                )}
                
                {loansData.filter(loan => loan.status === 'active').length === 0 && (
                  <div className="text-center py-4 text-muted-foreground">
                    No upcoming payments scheduled.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Financial Health</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Debt-Service Ratio</span>
                    <span className="font-medium">15%</span>
                  </div>
                  <Progress value={15} className="h-2" />
                  <p className="text-xs text-muted-foreground">Monthly loan payments as a percentage of monthly income</p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Loan-to-Value Ratio</span>
                    <span className="font-medium">42%</span>
                  </div>
                  <Progress value={42} className="h-2" />
                  <p className="text-xs text-muted-foreground">Total loans as a percentage of business assets value</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LoanManager;
