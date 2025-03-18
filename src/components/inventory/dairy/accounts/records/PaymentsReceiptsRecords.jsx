
import React, { useState, useEffect } from 'react';
import { usePaymentsReceipts } from '@/integrations/supabase/hooks/accounting/payments/usePaymentsReceipts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from "@/components/ui/table";
import { 
  Select, SelectContent, SelectItem, 
  SelectTrigger, SelectValue 
} from "@/components/ui/select";
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  Dialog, DialogContent, DialogDescription, 
  DialogHeader, DialogTitle, DialogTrigger 
} from "@/components/ui/dialog";
import { 
  Search, FileText, Download, RefreshCw, 
  Calendar, Filter, MoreVertical, ChevronLeft, 
  Mail, Printer, Trash, Edit 
} from "lucide-react";
import { format, subHours, subDays, subWeeks, subMonths, subYears } from 'date-fns';

const PaymentsReceiptsRecords = ({ setActiveView }) => {
  const { 
    payments, 
    isLoading, 
    fetchPaymentsReceipts, 
    deletePayment 
  } = usePaymentsReceipts();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [timeRangeFilter, setTimeRangeFilter] = useState('all');
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  
  // Apply filters and search
  useEffect(() => {
    let filtered = [...payments];
    
    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(payment => payment.status === statusFilter);
    }
    
    // Type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(payment => payment.payment_type === typeFilter);
    }
    
    // Time range filter
    if (timeRangeFilter !== 'all') {
      const now = new Date();
      let cutoffDate;
      
      if (timeRangeFilter === 'hour') cutoffDate = subHours(now, 1);
      else if (timeRangeFilter === 'day') cutoffDate = subDays(now, 1);
      else if (timeRangeFilter === 'week') cutoffDate = subWeeks(now, 1);
      else if (timeRangeFilter === 'month') cutoffDate = subMonths(now, 1);
      else if (timeRangeFilter === 'year') cutoffDate = subYears(now, 1);
      
      filtered = filtered.filter(payment => {
        const paymentDate = new Date(payment.payment_date);
        return paymentDate >= cutoffDate;
      });
    }
    
    // Search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        payment => 
          payment.party_name?.toLowerCase().includes(query) ||
          payment.payment_number?.toLowerCase().includes(query) ||
          payment.reference_number?.toLowerCase().includes(query)
      );
    }
    
    setFilteredPayments(filtered);
  }, [payments, statusFilter, typeFilter, timeRangeFilter, searchQuery]);
  
  const handleRefresh = () => {
    fetchPaymentsReceipts();
  };
  
  const handleExport = (format) => {
    // TODO: Implement export functionality
    console.log(`Exporting in ${format} format`);
    alert(`Export to ${format} is not implemented yet`);
  };
  
  const handleViewDetails = (payment) => {
    setSelectedPayment(payment);
    setShowDetailDialog(true);
  };
  
  const handleGenerateReceipt = (payment) => {
    console.log('Generate receipt for:', payment);
    alert(`Generate receipt for ${payment.payment_number} is not implemented yet`);
  };
  
  const handleEmailReceipt = (payment) => {
    console.log('Email receipt for:', payment);
    alert(`Email receipt for ${payment.payment_number} is not implemented yet`);
  };
  
  const handleDeleteRecord = async (id) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      await deletePayment(id);
    }
  };
  
  const handleEditRecord = (payment) => {
    console.log('Edit record:', payment);
    alert(`Edit for ${payment.payment_number} is not implemented yet`);
  };
  
  const handleBack = () => {
    setActiveView('payments-receipts-form');
  };
  
  if (isLoading && payments.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="animate-spin h-8 w-8 border-2 border-primary rounded-full border-t-transparent mx-auto mb-4"></div>
              <p>Loading records...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={handleBack} className="p-0">
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to Form
        </Button>
        <h2 className="text-2xl font-bold">Payments & Receipts Records</h2>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search records..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex flex-wrap gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Calendar className="mr-2 h-4 w-4" />
                Time Range
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setTimeRangeFilter('all')}>
                All Time
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTimeRangeFilter('hour')}>
                Last Hour
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTimeRangeFilter('day')}>
                Last 24 Hours
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTimeRangeFilter('week')}>
                Last Week
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTimeRangeFilter('month')}>
                Last Month
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTimeRangeFilter('year')}>
                Last Year
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleExport('pdf')}>
                <FileText className="mr-2 h-4 w-4" />
                PDF
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport('excel')}>
                <FileText className="mr-2 h-4 w-4" />
                Excel
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport('csv')}>
                <FileText className="mr-2 h-4 w-4" />
                CSV
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>
      
      <Card>
        <CardContent className="p-0">
          <Tabs defaultValue="all">
            <div className="border-b px-4">
              <TabsList className="h-10">
                <TabsTrigger value="all" onClick={() => setStatusFilter('all')}>
                  All Records
                </TabsTrigger>
                <TabsTrigger value="completed" onClick={() => setStatusFilter('completed')}>
                  Completed
                </TabsTrigger>
                <TabsTrigger value="pending" onClick={() => setStatusFilter('pending')}>
                  Pending
                </TabsTrigger>
                <TabsTrigger value="cancelled" onClick={() => setStatusFilter('cancelled')}>
                  Cancelled
                </TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="all" className="m-0">
              <div className="flex justify-end p-4 border-b">
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-[180px]">
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Filter by Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="received">Receipts</SelectItem>
                    <SelectItem value="paid">Payments</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Payment #</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Party Name</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPayments.length > 0 ? (
                      filteredPayments.map(payment => (
                        <TableRow key={payment.id}>
                          <TableCell
                            className="font-medium cursor-pointer hover:text-blue-600"
                            onClick={() => handleViewDetails(payment)}
                          >
                            {payment.payment_number}
                          </TableCell>
                          <TableCell>
                            <span className={payment.payment_type === 'received' ? 'text-green-600' : 'text-red-600'}>
                              {payment.payment_type === 'received' ? 'Receipt' : 'Payment'}
                            </span>
                          </TableCell>
                          <TableCell>{payment.party_name}</TableCell>
                          <TableCell>{format(new Date(payment.payment_date), 'PP')}</TableCell>
                          <TableCell>
                            {payment.currency} {payment.amount.toLocaleString()}
                          </TableCell>
                          <TableCell>
                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium
                              ${payment.status === 'completed' ? 'bg-green-100 text-green-800' : 
                              payment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                              'bg-red-100 text-red-800'}`
                            }>
                              {payment.status}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <span className="sr-only">Open menu</span>
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleViewDetails(payment)}>
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleGenerateReceipt(payment)}>
                                  Generate Receipt
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleEmailReceipt(payment)}>
                                  Email Receipt
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleExport('pdf')}>
                                  Download PDF
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleEditRecord(payment)}>
                                  <Edit className="mr-2 h-4 w-4" /> Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  className="text-red-600"
                                  onClick={() => handleDeleteRecord(payment.id)}
                                >
                                  <Trash className="mr-2 h-4 w-4" /> Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="h-24 text-center">
                          No records found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            
            {/* The same content gets repeated for other tabs */}
            <TabsContent value="completed" className="m-0">
              {/* Same table structure as above */}
            </TabsContent>
            <TabsContent value="pending" className="m-0">
              {/* Same table structure as above */}
            </TabsContent>
            <TabsContent value="cancelled" className="m-0">
              {/* Same table structure as above */}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      {/* Payment Details Dialog */}
      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Payment Details</DialogTitle>
            <DialogDescription>
              {selectedPayment?.payment_type === 'received' ? 'Receipt' : 'Payment'} Information
            </DialogDescription>
          </DialogHeader>
          
          {selectedPayment && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Payment Number</p>
                  <p className="font-medium">{selectedPayment.payment_number}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Type</p>
                  <p className="font-medium">
                    {selectedPayment.payment_type === 'received' ? 'Receipt' : 'Payment'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Party Name</p>
                  <p className="font-medium">{selectedPayment.party_name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Date</p>
                  <p className="font-medium">
                    {format(new Date(selectedPayment.payment_date), 'PP')}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Amount</p>
                  <p className="font-medium">
                    {selectedPayment.currency} {selectedPayment.amount.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <p className="font-medium">{selectedPayment.status}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Payment Method</p>
                  <p className="font-medium">{selectedPayment.payment_method}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Reference Number</p>
                  <p className="font-medium">{selectedPayment.reference_number || '-'}</p>
                </div>
              </div>
              
              {selectedPayment.notes && (
                <div>
                  <p className="text-sm text-gray-500">Notes</p>
                  <p className="font-medium">{selectedPayment.notes}</p>
                </div>
              )}
              
              <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={() => handleEmailReceipt(selectedPayment)}>
                  <Mail className="mr-2 h-4 w-4" />
                  Email
                </Button>
                <Button variant="outline" onClick={() => handleGenerateReceipt(selectedPayment)}>
                  <Printer className="mr-2 h-4 w-4" />
                  Print
                </Button>
                <Button variant="outline" onClick={() => handleExport('pdf')}>
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PaymentsReceiptsRecords;
