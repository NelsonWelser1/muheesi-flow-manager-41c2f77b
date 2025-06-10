import React, { useState, useEffect } from 'react';
import { useLoanData } from '@/hooks/useLoanData';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  CreditCard,
  Calendar,
  DollarSign,
  Percent,
  Users,
  FileText,
  Briefcase,
  Building,
  CheckCircle,
  RefreshCw,
  PlusCircle,
  Search,
  ChevronDown,
  ChevronUp,
  FileDown
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
  loanId: z.string().min(1, "Loan ID is required"),
  institution: z.string().min(1, "Institution name is required"),
  startDate: z.string().min(1, "Start date is required"),
  dueDate: z.string().min(1, "Due date is required"),
  amount: z.string().min(1, "Amount is required"),
  interestRate: z.string().min(1, "Interest rate is required"),
  paymentFrequency: z.string().min(1, "Payment frequency is required"),
  purpose: z.string().min(1, "Loan purpose is required"),
  collateral: z.string().optional(),
  contact: z.string().optional(),
  notes: z.string().optional()
});

const LoanManager = () => {
  const { isLoading, isSubmitting, addLoan, fetchLoans } = useLoanData();
  const [loans, setLoans] = useState([]);
  const [showAddLoanForm, setShowAddLoanForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
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
    }
  });

  const loadLoans = async () => {
    const data = await fetchLoans();
    setLoans(data);
  };

  useEffect(() => {
    loadLoans();
  }, []);

  const onSubmit = async (data) => {
    const result = await addLoan(data);
    if (result) {
      form.reset();
      setShowAddLoanForm(false);
      loadLoans();
    }
  };

  const toggleAddLoanForm = () => {
    setShowAddLoanForm(!showAddLoanForm);
    if (!showAddLoanForm) {
      form.reset();
    }
  };

  const filteredLoans = loans.filter(loan =>
    loan.institution.toLowerCase().includes(searchTerm.toLowerCase()) ||
    loan.loanId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    loan.purpose.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 hover:bg-green-200';
      case 'overdue':
        return 'bg-red-100 text-red-800 hover:bg-red-200';
      case 'completed':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
  };

  const exportLoans = () => {
    const csvData = [
      ['Loan ID', 'Institution', 'Start Date', 'Due Date', 'Amount', 'Interest Rate', 'Payment Frequency', 'Purpose', 'Status'],
      ...loans.map(loan => [
        loan.loanId,
        loan.institution,
        loan.startDate,
        loan.dueDate,
        loan.amount,
        loan.interestRate,
        loan.paymentFrequency,
        loan.purpose,
        loan.status
      ])
    ];

    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'kyalima_loans.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-bold text-purple-800">Loan Management</h2>
          <Badge className="bg-purple-100 text-purple-800">
            {loans.length} Loans
          </Badge>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search loans..."
              className="pl-8 w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button
            onClick={exportLoans}
            variant="outline"
            className="border-purple-200 text-purple-700 hover:bg-purple-50"
          >
            <FileDown className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button
            onClick={toggleAddLoanForm}
            className="bg-purple-600 hover:bg-purple-700"
          >
            {showAddLoanForm ? (
              <>
                <ChevronUp className="mr-2 h-4 w-4" />
                Hide Form
              </>
            ) : (
              <>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Loan
              </>
            )}
          </Button>
        </div>
      </div>

      {showAddLoanForm && (
        <Card className="border-purple-100 shadow-sm overflow-hidden mb-6 animate-fade-in">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-purple-800 mb-4">Add New Loan</h3>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="loanId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2 text-purple-700">
                          <CreditCard className="h-4 w-4" />
                          Loan ID *
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="Enter loan ID" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="institution"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2 text-purple-700">
                          <Building className="h-4 w-4" />
                          Institution *
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="Bank or lender name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2 text-purple-700">
                          <DollarSign className="h-4 w-4" />
                          Amount *
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="UGX 1,000,000" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="startDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2 text-purple-700">
                          <Calendar className="h-4 w-4" />
                          Start Date *
                        </FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="dueDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2 text-purple-700">
                          <Calendar className="h-4 w-4" />
                          Due Date *
                        </FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="interestRate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2 text-purple-700">
                          <Percent className="h-4 w-4" />
                          Interest Rate *
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="15.5" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="paymentFrequency"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2 text-purple-700">
                          <RefreshCw className="h-4 w-4" />
                          Payment Frequency *
                        </FormLabel>
                        <FormControl>
                          <select className="w-full p-2 border rounded-md" {...field}>
                            <option value="monthly">Monthly</option>
                            <option value="quarterly">Quarterly</option>
                            <option value="biannual">Biannual</option>
                            <option value="annual">Annual</option>
                          </select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="purpose"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2 text-purple-700">
                          <Briefcase className="h-4 w-4" />
                          Purpose *
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="Farm equipment, expansion, etc." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="collateral"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2 text-purple-700">
                          <FileText className="h-4 w-4" />
                          Collateral
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="Land title, equipment, etc." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="contact"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2 text-purple-700">
                          <Users className="h-4 w-4" />
                          Contact Person
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="Contact person name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2 text-purple-700">
                        <FileText className="h-4 w-4" />
                        Additional Notes
                      </FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Additional information about the loan..." 
                          rows={3}
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end space-x-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={toggleAddLoanForm}
                    className="border-purple-200 text-purple-700 hover:bg-purple-50"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    {isSubmitting ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Adding...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Add Loan
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      )}

      {/* Loans List */}
      <div className="bg-white rounded-lg border border-purple-100 shadow-sm overflow-hidden">
        <div className="p-4 bg-gradient-to-r from-purple-50 to-transparent border-b border-purple-100">
          <h3 className="text-lg font-semibold text-purple-800">Current Loans</h3>
          <p className="text-sm text-purple-600 mt-1">
            {filteredLoans.length} of {loans.length} loans
          </p>
        </div>

        {filteredLoans.length === 0 ? (
          <div className="p-8 text-center">
            <CreditCard className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No loans found</h3>
            <p className="text-gray-500">
              {searchTerm ? 'Try adjusting your search terms' : 'Add your first loan to get started'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-purple-50/50">
                  <TableHead className="text-purple-700">Loan ID</TableHead>
                  <TableHead className="text-purple-700">Institution</TableHead>
                  <TableHead className="text-purple-700">Amount</TableHead>
                  <TableHead className="text-purple-700">Interest Rate</TableHead>
                  <TableHead className="text-purple-700">Next Payment</TableHead>
                  <TableHead className="text-purple-700">Status</TableHead>
                  <TableHead className="text-purple-700">Purpose</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLoans.map((loan) => (
                  <TableRow key={loan.id} className="hover:bg-purple-50/30">
                    <TableCell className="font-medium">{loan.loanId}</TableCell>
                    <TableCell>{loan.institution}</TableCell>
                    <TableCell className="font-mono">{loan.amount}</TableCell>
                    <TableCell>{loan.interestRate}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="text-sm font-medium">{loan.nextPayment}</div>
                        <div className="text-xs text-gray-500">{loan.nextPaymentAmount}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(loan.status)}>
                        {loan.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">{loan.purpose}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoanManager;
