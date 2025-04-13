
import React, { useState, useEffect } from "react";
import { useLoanData } from "@/hooks/useLoanData";
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
  TableRow,
} from "@/components/ui/table";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
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
  notes: z.string().optional(),
});

const LoanManager = () => {
  const { isLoading, isSubmitting, addLoan, fetchLoans } = useLoanData();
  const [loans, setLoans] = useState([]);
  const [showAddLoanForm, setShowAddLoanForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      loanId: "",
      institution: "",
      startDate: "",
      dueDate: "",
      amount: "",
      interestRate: "",
      paymentFrequency: "monthly",
      purpose: "",
      collateral: "",
      contact: "",
      notes: "",
    },
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

  const filteredLoans = loans.filter((loan) =>
    loan.institution.toLowerCase().includes(searchTerm.toLowerCase()) ||
    loan.loanId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    loan.purpose.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 hover:bg-green-200";
      case "overdue":
        return "bg-red-100 text-red-800 hover:bg-red-200";
      case "completed":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    }
  };

  const exportLoans = () => {
    const csvData = [
      [
        "Loan ID", 
        "Institution", 
        "Start Date", 
        "Due Date", 
        "Amount", 
        "Interest Rate",
        "Payment Frequency",
        "Purpose",
        "Status"
      ],
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
    
    const csvContent = csvData.map(row => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "kyalima_loans.csv");
    link.style.visibility = "hidden";
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="loanId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Loan ID</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <CreditCard className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                            <Input className="pl-8" placeholder="LN-2025-001" {...field} />
                          </div>
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
                        <FormLabel>Lending Institution</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Building className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                            <Input className="pl-8" placeholder="Bank Name" {...field} />
                          </div>
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
                        <FormLabel>Contact Person</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Users className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                            <Input className="pl-8" placeholder="Contact Name" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <FormField
                    control={form.control}
                    name="startDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Start Date</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Calendar className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                            <Input className="pl-8" type="date" {...field} />
                          </div>
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
                        <FormLabel>Due Date</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Calendar className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                            <Input className="pl-8" type="date" {...field} />
                          </div>
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
                        <FormLabel>Loan Amount (UGX)</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <DollarSign className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                            <Input 
                              className="pl-8" 
                              placeholder="5,000,000" 
                              {...field}
                              onChange={(e) => {
                                // Allow only numbers and commas
                                const value = e.target.value.replace(/[^0-9,]/g, '');
                                field.onChange(value);
                              }}
                            />
                          </div>
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
                        <FormLabel>Interest Rate (%)</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Percent className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                            <Input 
                              className="pl-8" 
                              placeholder="15" 
                              {...field}
                              onChange={(e) => {
                                // Allow only numbers and decimal point
                                const value = e.target.value.replace(/[^0-9.]/g, '');
                                field.onChange(value);
                              }}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="paymentFrequency"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Payment Frequency</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <RefreshCw className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                            <select
                              className="w-full h-10 pl-8 pr-4 border border-input bg-background rounded-md"
                              {...field}
                            >
                              <option value="monthly">Monthly</option>
                              <option value="quarterly">Quarterly</option>
                              <option value="biannual">Bi-annual</option>
                              <option value="annual">Annual</option>
                            </select>
                          </div>
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
                        <FormLabel>Loan Purpose</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Briefcase className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                            <Input className="pl-8" placeholder="Equipment Purchase" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="collateral"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Collateral (Optional)</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <FileText className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                          <Input className="pl-8" placeholder="Land Title, Vehicle, etc." {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Additional Notes (Optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Additional information about the loan..."
                          className="min-h-[80px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      form.reset();
                      setShowAddLoanForm(false);
                    }}
                    className="border-gray-200"
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
                        Saving...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Save Loan
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      )}

      <Card className="border-purple-100 shadow-sm overflow-hidden">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <RefreshCw className="h-8 w-8 text-purple-500 animate-spin" />
              <span className="ml-2 text-purple-700">Loading loan data...</span>
            </div>
          ) : loans.length === 0 ? (
            <div className="flex flex-col justify-center items-center h-64 text-center">
              <FileText className="h-16 w-16 text-purple-200 mb-4" />
              <h3 className="text-xl font-medium text-purple-800 mb-2">No loan records found</h3>
              <p className="text-purple-600 mb-4">Add your first loan record.</p>
              {!showAddLoanForm && (
                <Button
                  onClick={toggleAddLoanForm}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Loan
                </Button>
              )}
            </div>
          ) : filteredLoans.length === 0 ? (
            <div className="flex flex-col justify-center items-center h-64 text-center">
              <Search className="h-16 w-16 text-purple-200 mb-4" />
              <h3 className="text-xl font-medium text-purple-800 mb-2">No matching loans</h3>
              <p className="text-purple-600">Try a different search term.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-purple-50">
                    <TableHead className="text-purple-800">Loan ID</TableHead>
                    <TableHead className="text-purple-800">Institution</TableHead>
                    <TableHead className="text-purple-800">Start Date</TableHead>
                    <TableHead className="text-purple-800">Due Date</TableHead>
                    <TableHead className="text-purple-800">Amount</TableHead>
                    <TableHead className="text-purple-800">Status</TableHead>
                    <TableHead className="text-purple-800">Details</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLoans.map((loan) => (
                    <TableRow key={loan.id} className="hover:bg-purple-50/50">
                      <TableCell className="font-medium">{loan.loanId}</TableCell>
                      <TableCell>{loan.institution}</TableCell>
                      <TableCell>{loan.startDate}</TableCell>
                      <TableCell>{loan.dueDate}</TableCell>
                      <TableCell>{loan.amount}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(loan.status)}>
                          {loan.status.charAt(0).toUpperCase() + loan.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Accordion type="single" collapsible className="w-full">
                          <AccordionItem value={loan.id} className="border-none">
                            <AccordionTrigger className="py-0 hover:no-underline">
                              <span className="text-xs text-purple-600 hover:text-purple-800">View Details</span>
                            </AccordionTrigger>
                            <AccordionContent>
                              <div className="grid grid-cols-2 gap-y-2 text-sm pt-2">
                                <div>
                                  <span className="font-medium text-purple-700">Interest Rate:</span> {loan.interestRate}
                                </div>
                                <div>
                                  <span className="font-medium text-purple-700">Payment Frequency:</span> {loan.paymentFrequency}
                                </div>
                                <div>
                                  <span className="font-medium text-purple-700">Next Payment:</span> {loan.nextPayment}
                                </div>
                                <div>
                                  <span className="font-medium text-purple-700">Payment Amount:</span> {loan.nextPaymentAmount}
                                </div>
                                <div>
                                  <span className="font-medium text-purple-700">Remaining Amount:</span> {loan.remainingAmount}
                                </div>
                                <div>
                                  <span className="font-medium text-purple-700">Contact:</span> {loan.contact || "N/A"}
                                </div>
                                <div className="col-span-2">
                                  <span className="font-medium text-purple-700">Purpose:</span> {loan.purpose}
                                </div>
                                {loan.collateral && (
                                  <div className="col-span-2">
                                    <span className="font-medium text-purple-700">Collateral:</span> {loan.collateral}
                                  </div>
                                )}
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default LoanManager;
