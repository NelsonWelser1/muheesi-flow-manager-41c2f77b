
import React, { useState, useEffect, useRef } from 'react';
import { useForm } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft, FileText, Upload, Loader2, Calendar, Check, X } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useBillsExpenses } from "@/integrations/supabase/hooks/accounting/useBillsExpenses";
import { FormField } from "@/components/inventory/dairy/sales/forms/components/FormField";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const RecurringFrequencies = [
  { value: 'weekly', label: 'Weekly' },
  { value: 'biweekly', label: 'Bi-weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'quarterly', label: 'Quarterly' },
  { value: 'yearly', label: 'Yearly' },
];

const BillsExpensesForm = ({ onBack }) => {
  const [isRecurring, setIsRecurring] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [fileSelected, setFileSelected] = useState(null);
  const [uploadedFileUrl, setUploadedFileUrl] = useState("");
  const fileInputRef = useRef(null);
  
  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm({
    defaultValues: {
      billDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days from now
      status: 'pending',
      paymentMethod: 'bank_transfer',
      currency: 'UGX',
      isRecurring: false,
      recurringFrequency: '',
      recurringEndDate: '',
    }
  });
  
  const { toast } = useToast();
  const { createBillExpense, uploadReceipt, getLatestBillNumber } = useBillsExpenses();
  
  const watchExpenseType = watch("expenseType");
  
  useEffect(() => {
    const loadBillNumber = async () => {
      const billNumber = await getLatestBillNumber();
      setValue("billNumber", billNumber);
    };
    
    loadBillNumber();
  }, [setValue, getLatestBillNumber]);
  
  const onSubmit = async (data) => {
    try {
      console.log("Bill/Expense data:", data);
      
      // Add recurring fields if enabled
      if (isRecurring) {
        data.isRecurring = true;
      } else {
        data.isRecurring = false;
        data.recurringFrequency = null;
        data.recurringEndDate = null;
      }
      
      // If file was uploaded, add the URL
      if (uploadedFileUrl) {
        data.receiptUrl = uploadedFileUrl;
      }
      
      // Submit to Supabase
      const result = await createBillExpense(data);
      
      if (result.success) {
        // Reset the form
        reset({
          billDate: new Date().toISOString().split('T')[0],
          dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          status: 'pending',
          paymentMethod: 'bank_transfer',
          currency: 'UGX',
          isRecurring: false,
          recurringFrequency: '',
          recurringEndDate: '',
        });
        
        // Get a new bill number
        const newBillNumber = await getLatestBillNumber();
        setValue("billNumber", newBillNumber);
        
        // Reset file state
        setFileSelected(null);
        setUploadedFileUrl("");
        
        // Reset recurring
        setIsRecurring(false);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Error",
        description: "Failed to record expense. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileSelected(file);
    }
  };
  
  const handleFileUpload = async () => {
    if (!fileSelected) {
      toast({
        title: "No file selected",
        description: "Please select a file to upload",
        variant: "destructive"
      });
      return;
    }
    
    setIsUploading(true);
    
    try {
      const billNumber = watch("billNumber");
      const result = await uploadReceipt(fileSelected, billNumber);
      
      if (result.success) {
        setUploadedFileUrl(result.url);
        toast({
          title: "Success",
          description: "File uploaded successfully",
        });
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      toast({
        title: "Error",
        description: "Failed to upload file. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };
  
  const handleRecurringToggle = (checked) => {
    setIsRecurring(checked);
    setValue("isRecurring", checked);
  };

  return (
    <div className="space-y-4">
      <Button 
        variant="outline" 
        onClick={onBack}
        className="flex items-center gap-2"
      >
        <ArrowLeft className="h-4 w-4" /> Back
      </Button>
      <Card>
        <CardHeader>
          <CardTitle>Bills & Expenses Form</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Bill Number</Label>
                <Input 
                  {...register("billNumber", { required: "Bill number is required" })}
                  readOnly 
                  className="bg-gray-50"
                />
                {errors.billNumber && (
                  <p className="text-sm text-red-500">{errors.billNumber.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Supplier Name</Label>
                <Input {...register("supplierName", { required: "Supplier name is required" })} />
                {errors.supplierName && (
                  <p className="text-sm text-red-500">{errors.supplierName.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Bill Date</Label>
                <Input type="date" {...register("billDate", { required: "Bill date is required" })} />
                {errors.billDate && (
                  <p className="text-sm text-red-500">{errors.billDate.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Due Date</Label>
                <Input type="date" {...register("dueDate", { required: "Due date is required" })} />
                {errors.dueDate && (
                  <p className="text-sm text-red-500">{errors.dueDate.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Expense Type</Label>
                <Select 
                  onValueChange={(value) => setValue("expenseType", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select expense type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rent">Rent</SelectItem>
                    <SelectItem value="utilities">Utilities</SelectItem>
                    <SelectItem value="raw_materials">Raw Materials</SelectItem>
                    <SelectItem value="salaries">Salaries</SelectItem>
                    <SelectItem value="equipment">Equipment</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <Input type="hidden" {...register("expenseType", { required: "Expense type is required" })} />
                {errors.expenseType && (
                  <p className="text-sm text-red-500">{errors.expenseType.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Expense Details</Label>
                <Textarea 
                  {...register("expenseDetails")} 
                  placeholder="Add details specific to this expense type"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label>Amount</Label>
                <Input 
                  type="number" 
                  step="0.01"
                  {...register("amount", { 
                    required: "Amount is required",
                    min: { value: 0.01, message: "Amount must be greater than 0" }
                  })} 
                />
                {errors.amount && (
                  <p className="text-sm text-red-500">{errors.amount.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Currency</Label>
                <Select 
                  defaultValue="UGX"
                  onValueChange={(value) => setValue("currency", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="UGX">UGX</SelectItem>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="EUR">EUR</SelectItem>
                    <SelectItem value="GBP">GBP</SelectItem>
                    <SelectItem value="JPY">JPY</SelectItem>
                  </SelectContent>
                </Select>
                <Input type="hidden" {...register("currency", { value: "UGX" })} />
              </div>

              <div className="space-y-2">
                <Label>Payment Method</Label>
                <Select 
                  defaultValue="bank_transfer"
                  onValueChange={(value) => setValue("paymentMethod", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                    <SelectItem value="credit">Credit</SelectItem>
                    <SelectItem value="mobile_money">Mobile Money</SelectItem>
                  </SelectContent>
                </Select>
                <Input type="hidden" {...register("paymentMethod")} />
              </div>

              <div className="space-y-2">
                <Label>Status</Label>
                <Select 
                  defaultValue="pending"
                  onValueChange={(value) => setValue("status", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="overdue">Overdue</SelectItem>
                  </SelectContent>
                </Select>
                <Input type="hidden" {...register("status")} />
              </div>
            </div>

            {/* Recurring Settings */}
            <div className="border rounded-md p-4 mt-4 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="recurring" 
                    checked={isRecurring}
                    onCheckedChange={handleRecurringToggle}
                  />
                  <Label htmlFor="recurring" className="cursor-pointer flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Set as Recurring
                  </Label>
                </div>
                
                {isRecurring && (
                  <div className="text-xs text-green-600 flex items-center gap-1">
                    <Check className="h-3 w-3" /> Recurring Enabled
                  </div>
                )}
              </div>
              
              {isRecurring && (
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Frequency</Label>
                    <Select onValueChange={(value) => setValue("recurringFrequency", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        {RecurringFrequencies.map((freq) => (
                          <SelectItem key={freq.value} value={freq.value}>
                            {freq.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input type="hidden" {...register("recurringFrequency")} />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>End Date</Label>
                    <Input 
                      type="date" 
                      {...register("recurringEndDate")}
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label>Notes</Label>
              <Textarea 
                {...register("notes")} 
                placeholder="Additional notes (optional)"
                rows={3}
              />
            </div>

            {/* File Upload Section */}
            <div className="border rounded-md p-4 bg-gray-50">
              <div className="space-y-2">
                <Label className="block mb-2">Attach Invoice/Receipt</Label>
                
                <div className="flex flex-col md:flex-row items-start gap-4">
                  <div className="flex-1">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      className="hidden"
                      accept="image/*,.pdf,.doc,.docx"
                    />
                    
                    <div 
                      className="border-2 border-dashed rounded-md p-4 text-center cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Upload className="h-8 w-8 mx-auto text-gray-400" />
                      <p className="mt-2 text-sm text-gray-600">
                        {fileSelected ? fileSelected.name : "Click to select file"}
                      </p>
                    </div>
                  </div>
                  
                  <Button 
                    type="button"
                    variant="outline" 
                    className="flex items-center gap-2"
                    onClick={handleFileUpload}
                    disabled={!fileSelected || isUploading}
                  >
                    {isUploading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Upload className="h-4 w-4" />
                    )}
                    {isUploading ? "Uploading..." : "Upload File"}
                  </Button>
                </div>
                
                {uploadedFileUrl && (
                  <div className="mt-2 p-2 bg-green-50 text-green-700 rounded-md flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4" />
                      <span className="text-sm">File uploaded successfully</span>
                    </div>
                    <a 
                      href={uploadedFileUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm underline"
                    >
                      View File
                    </a>
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-4">
              <Button type="submit" className="bg-[#0000a0] hover:bg-[#00008b]">Record Expense</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default BillsExpensesForm;
