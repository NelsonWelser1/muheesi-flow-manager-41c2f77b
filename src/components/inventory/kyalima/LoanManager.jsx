import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
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
  AlertCircle
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { KyalimaPDFExport } from "./utils/KyalimaPDFExport";
import { Progress } from "@/components/ui/progress";
import { useLoanData } from "@/hooks/useLoanData";
import { showSuccessToast, showErrorToast, showInfoToast } from "@/components/ui/notifications";

const LoanManager = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [loansData, setLoansData] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    loanId: '',
    institution: '',
    startDate: '',
    dueDate: '',
    amount: '',
    interestRate: '',
    paymentFrequency: 'monthly',
    purpose: '',
    collateral: '',
    contact: '',
    notes: ''
  });
  const [validationErrors, setValidationErrors] = useState({});
  
  const { isLoading, isSubmitting, addLoan, fetchLoans } = useLoanData();
  
  // Fetch loans on component mount
  useEffect(() => {
    loadLoans();
  }, []);
  
  const loadLoans = async () => {
    const loans = await fetchLoans();
    if (loans && loans.length > 0) {
      setLoansData(loans);
    }
  };
  
  // Filter loans based on search term and status filter
  const filteredLoans = loansData.filter(loan => {
    const matchesSearch = 
      loan.loanId?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      loan.institution?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      loan.purpose?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || loan.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  // Calculate total active loans amount
  const activeLoans = loansData.filter(loan => loan.status === 'active');
  const totalActiveLoansAmount = activeLoans.reduce((total, loan) => {
    // Extract the numerical value from the UGX string
    const amount = parseInt(loan.remainingAmount?.replace(/\D/g, '') || 0);
    return total + amount;
  }, 0);
  
  // Format currency with UGX and commas
  const formatCurrency = (amount) => {
    if (amount === 'N/A') return amount;
    
    if (typeof amount === 'number') {
      return `UGX ${amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
    }
    
    // If already formatted with UGX, return as is
    if (amount && amount.startsWith('UGX')) return amount;
    
    // Otherwise, parse and format
    const value = parseInt(amount?.replace(/\D/g, '') || 0);
    return `UGX ${value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
  };
  
  // Calculate percentage of repayment for a loan
  const calculateRepaymentPercentage = (loan) => {
    if (loan.status === 'completed') return 100;
    
    const totalAmount = parseInt(loan.amount?.replace(/\D/g, '') || 0);
    const remainingAmount = parseInt(loan.remainingAmount?.replace(/\D/g, '') || 0);
    const repaidAmount = totalAmount - remainingAmount;
    
    return Math.round((repaidAmount / totalAmount) * 100);
  };
  
  // Days until next payment
  const getDaysUntilNextPayment = (nextPaymentDate) => {
    if (nextPaymentDate === 'N/A') return 'N/A';
    
    const today = new Date();
    const paymentDate = new Date(nextPaymentDate);
    const diffTime = paymentDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays > 0 ? diffDays : 'Due today';
  };
  
  // Get badge for loan status
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
  
  const handleRefresh = async () => {
    await loadLoans();
    showSuccessToast(toast, "Loan data has been refreshed");
  };
  
  // Handle export to PDF
  const handleExportPDF = () => {
    KyalimaPDFExport.exportTableToPDF('loans-table', 'Kyalima_Loan_Data');
    showSuccessToast(toast, "Your loan data has been exported to PDF");
  };
  
  // Handle print
  const handlePrint = () => {
    KyalimaPDFExport.printTable('loans-table');
    showInfoToast(toast, "Sending loan data to printer...");
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
    
    // Clear validation error for this field if it exists
    if (validationErrors[id]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[id];
        return newErrors;
      });
    }
  };
  
  // Handle select changes
  const handleSelectChange = (value, field) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear validation error for this field if it exists
    if (validationErrors[field]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };
  
  // Validate the form
  const validateForm = () => {
    const errors = {};
    
    if (!formData.loanId) errors.loanId = "Loan ID is required";
    if (!formData.institution) errors.institution = "Institution is required";
    if (!formData.startDate) errors.startDate = "Start date is required";
    if (!formData.dueDate) errors.dueDate = "Due date is required";
    if (!formData.amount) errors.amount = "Amount is required";
    if (!formData.interestRate) errors.interestRate = "Interest rate is required";
    if (!formData.paymentFrequency) errors.paymentFrequency = "Payment frequency is required";
    if (!formData.purpose) errors.purpose = "Purpose is required";
    
    // Validate date logic
    if (formData.startDate && formData.dueDate) {
      const start = new Date(formData.startDate);
      const due = new Date(formData.dueDate);
      if (due <= start) {
        errors.dueDate = "Due date must be after start date";
      }
    }
    
    // Validate numeric fields
    if (formData.amount && isNaN(parseFloat(formData.amount.replace(/[^0-9.]/g, '')))) {
      errors.amount = "Amount must be a number";
    }
    
    if (formData.interestRate && isNaN(parseFloat(formData.interestRate))) {
      errors.interestRate = "Interest rate must be a number";
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // Handle form submit
  const handleSubmit = async () => {
    if (!validateForm()) {
      showErrorToast(toast, "Please correct the errors in the form");
      return;
    }
    
    const result = await addLoan(formData);
    if (result) {
      await loadLoans();
      setDialogOpen(false);
      // Reset form data
      setFormData({
        loanId: '',
        institution: '',
        startDate: '',
        dueDate: '',
        amount: '',
        interestRate: '',
        paymentFrequency: 'monthly',
        purpose: '',
        collateral: '',
        contact: '',
        notes: ''
      });
    }
  };
  
  // Generate a new loan ID
  const generateLoanId = () => {
    const prefix = "KYL-L";
    const randomNum = Math.floor(100 + Math.random() * 900); // 3-digit number
    return `${prefix}${randomNum}`;
  };
  
  // Auto-populate loan ID when dialog opens
  const handleDialogOpen = (open) => {
    setDialogOpen(open);
    
    if (open) {
      setFormData(prev => ({
        ...prev,
        loanId: generateLoanId()
      }));
    }
  };

  return (
    <div className="space-y-4">
      {/* Metrics summary */}
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
                {activeLoans.length > 0 ? activeLoans[0].nextPayment : 'No upcoming payments'}
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

      {/* Search and filters */}
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
          <Button variant="outline" size="icon" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center space-x-2">
          <Dialog open={dialogOpen} onOpenChange={handleDialogOpen}>
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
                    <Label htmlFor="loanId">Loan ID</Label>
                    <Input 
                      id="loanId" 
                      placeholder="KYL-L###" 
                      value={formData.loanId}
                      onChange={handleInputChange}
                      className={validationErrors.loanId ? "border-red-500" : ""}
                    />
                    {validationErrors.loanId && (
                      <p className="text-xs text-red-500">{validationErrors.loanId}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="institution">Financial Institution</Label>
                    <Input 
                      id="institution" 
                      placeholder="Bank name" 
                      value={formData.institution}
                      onChange={handleInputChange}
                      className={validationErrors.institution ? "border-red-500" : ""}
                    />
                    {validationErrors.institution && (
                      <p className="text-xs text-red-500">{validationErrors.institution}</p>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input 
                      id="startDate" 
                      type="date" 
                      value={formData.startDate}
                      onChange={handleInputChange}
                      className={validationErrors.startDate ? "border-red-500" : ""}
                    />
                    {validationErrors.startDate && (
                      <p className="text-xs text-red-500">{validationErrors.startDate}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dueDate">Due Date</Label>
                    <Input 
                      id="dueDate" 
                      type="date" 
                      value={formData.dueDate}
                      onChange={handleInputChange}
                      className={validationErrors.dueDate ? "border-red-500" : ""}
                    />
                    {validationErrors.dueDate && (
                      <p className="text-xs text-red-500">{validationErrors.dueDate}</p>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="amount">Loan Amount (UGX)</Label>
                    <Input 
                      id="amount" 
                      placeholder="e.g. 50000000" 
                      value={formData.amount}
                      onChange={handleInputChange}
                      className={validationErrors.amount ? "border-red-500" : ""}
                    />
                    {validationErrors.amount && (
                      <p className="text-xs text-red-500">{validationErrors.amount}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="interestRate">Interest Rate (%)</Label>
                    <Input 
                      id="interestRate" 
                      type="number" 
                      step="0.1" 
                      placeholder="e.g. 12.5"
                      value={formData.interestRate}
                      onChange={handleInputChange}
                      className={validationErrors.interestRate ? "border-red-500" : ""}
                    />
                    {validationErrors.interestRate && (
                      <p className="text-xs text-red-500">{validationErrors.interestRate}</p>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="paymentFrequency">Payment Frequency</Label>
                    <Select 
                      value={formData.paymentFrequency} 
                      onValueChange={(value) => handleSelectChange(value, 'paymentFrequency')}
                    >
                      <SelectTrigger id="paymentFrequency" className={validationErrors.paymentFrequency ? "border-red-500" : ""}>
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="quarterly">Quarterly</SelectItem>
                        <SelectItem value="biannual">Bi-annual</SelectItem>
                        <SelectItem value="annual">Annual</SelectItem>
                      </SelectContent>
                    </Select>
                    {validationErrors.paymentFrequency && (
                      <p className="text-xs text-red-500">{validationErrors.paymentFrequency}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="purpose">Purpose</Label>
                    <Input 
                      id="purpose" 
                      placeholder="Loan purpose" 
                      value={formData.purpose}
                      onChange={handleInputChange}
                      className={validationErrors.purpose ? "border-red-500" : ""}
                    />
                    {validationErrors.purpose && (
                      <p className="text-xs text-red-500">{validationErrors.purpose}</p>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="collateral">Collateral</Label>
                    <Input 
                      id="collateral" 
                      placeholder="Collateral details" 
                      value={formData.collateral}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact">Contact Person</Label>
                    <Input 
                      id="contact" 
                      placeholder="Bank contact person" 
                      value={formData.contact}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Input 
                    id="notes" 
                    placeholder="Additional notes" 
                    value={formData.notes}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                <Button 
                  type="submit" 
                  onClick={handleSubmit} 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Saving...' : 'Save Loan'}
                </Button>
              </DialogFooter>
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

      {/* Data table */}
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
                      Loading loan data...
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
                    const daysUntilNextPayment = getDaysUntilNextPayment(loan.nextPayment);
                    
                    return (
                      <TableRow key={loan.id}>
                        <TableCell className="font-medium">{loan.loanId}</TableCell>
                        <TableCell>{loan.institution}</TableCell>
                        <TableCell>{loan.startDate}</TableCell>
                        <TableCell>{loan.dueDate}</TableCell>
                        <TableCell>{loan.amount}</TableCell>
                        <TableCell>{loan.remainingAmount}</TableCell>
                        <TableCell>
                          {loan.nextPayment === 'N/A' ? (
                            'N/A'
                          ) : (
                            <div>
                              {loan.nextPayment}
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
                          <Button variant="ghost" size="icon" className="h-8 w-8">
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

      {/* Payment schedule section */}
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
                          <p className="font-medium">{loan.institution} ({loan.loanId})</p>
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
