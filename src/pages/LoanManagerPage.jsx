
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, ArrowLeft, Home } from "lucide-react";
import { useLoanData } from '@/hooks/useLoanData';
import { toast } from 'sonner';

const LoanManagerPage = () => {
  const navigate = useNavigate();
  const { loanId } = useParams();
  const isEditMode = Boolean(loanId);
  
  const [startDate, setStartDate] = useState(new Date());
  const [dueDate, setDueDate] = useState(new Date());
  const [nextPaymentDate, setNextPaymentDate] = useState(new Date());
  
  const { addLoan, updateLoan, loansData, isSubmitting, fetchLoansData } = useLoanData();

  const [formData, setFormData] = useState({
    loan_id: `LOAN-${Date.now().toString().slice(-6)}`,
    institution: '',
    amount: '',
    interest_rate: '',
    payment_frequency: 'monthly',
    next_payment_amount: '',
    purpose: '',
    notes: '',
    status: 'active',
    collateral: ''
  });

  // If in edit mode, fetch the loan data
  useEffect(() => {
    if (isEditMode && loanId) {
      // Find the loan in the already loaded data
      const loanToEdit = loansData.find(loan => loan.displayId === loanId);
      
      if (loanToEdit) {
        console.log('Loading loan data for editing:', loanToEdit);
        
        // Parse currency strings back to numbers
        const amount = loanToEdit.amount.replace('UGX ', '').replace(/,/g, '');
        const nextPaymentAmount = loanToEdit.nextPaymentAmount !== 'N/A' 
          ? loanToEdit.nextPaymentAmount.replace('UGX ', '').replace(/,/g, '')
          : '';
        
        setFormData({
          loan_id: loanToEdit.loan_id,
          institution: loanToEdit.institution,
          amount,
          interest_rate: loanToEdit.interest_rate.toString(),
          payment_frequency: loanToEdit.payment_frequency,
          next_payment_amount: nextPaymentAmount,
          purpose: loanToEdit.purpose || '',
          notes: loanToEdit.notes || '',
          status: loanToEdit.status,
          collateral: loanToEdit.collateral || ''
        });
        
        // Set dates
        if (loanToEdit.start_date) setStartDate(new Date(loanToEdit.start_date));
        if (loanToEdit.due_date) setDueDate(new Date(loanToEdit.due_date));
        if (loanToEdit.next_payment_date) setNextPaymentDate(new Date(loanToEdit.next_payment_date));
      } else {
        // If not found in current data, fetch again
        console.log('Loan not found in current data, fetching again...');
        fetchLoansData().then(data => {
          const refreshedLoan = data.find(loan => loan.displayId === loanId);
          if (refreshedLoan) {
            // Similar logic as above for setting form data
            console.log('Found loan after refresh:', refreshedLoan);
            // Set form data here...
          } else {
            console.error('Loan not found even after refresh:', loanId);
            navigate('/loans');
          }
        });
      }
    }
  }, [isEditMode, loanId, loansData, fetchLoansData, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const requiredFields = [
      { name: 'loan_id', label: 'Loan ID' },
      { name: 'institution', label: 'Institution' },
      { name: 'amount', label: 'Loan Amount' },
      { name: 'interest_rate', label: 'Interest Rate' }
    ];
    
    for (const field of requiredFields) {
      if (!formData[field.name]) {
        toast.error(`${field.label} is required`);
        return false;
      }
    }
    
    // Check if amount is a valid number
    if (isNaN(parseFloat(formData.amount))) {
      toast.error('Loan Amount must be a valid number');
      return false;
    }
    
    // Check if interest rate is a valid number
    if (isNaN(parseFloat(formData.interest_rate))) {
      toast.error('Interest Rate must be a valid number');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    // Prepare the complete loan data with dates
    const loanData = {
      ...formData,
      start_date: startDate.toISOString().split('T')[0],
      due_date: dueDate.toISOString().split('T')[0],
      next_payment_date: nextPaymentDate.toISOString().split('T')[0],
    };
    
    console.log(`${isEditMode ? 'Updating' : 'Submitting'} loan data:`, loanData);
    
    let success;
    try {
      if (isEditMode) {
        success = await updateLoan(loanId, loanData);
      } else {
        success = await addLoan(loanData);
      }
      
      if (success) {
        // Reset form after successful submission (only for add mode)
        if (!isEditMode) {
          setFormData({
            loan_id: `LOAN-${Date.now().toString().slice(-6)}`,
            institution: '',
            amount: '',
            interest_rate: '',
            payment_frequency: 'monthly',
            next_payment_amount: '',
            purpose: '',
            notes: '',
            status: 'active',
            collateral: ''
          });
          setStartDate(new Date());
          setDueDate(new Date());
          setNextPaymentDate(new Date());
        }
        
        // Navigate back to the loans listing page
        toast.success(`Loan ${isEditMode ? 'updated' : 'added'} successfully`);
        navigate('/loans');
      }
    } catch (error) {
      console.error('Error submitting loan:', error);
      toast.error('An error occurred while submitting the loan');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={() => navigate('/loans')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Loans
          </Button>
          <h1 className="text-3xl font-bold">{isEditMode ? 'Edit Loan' : 'Add New Loan'}</h1>
        </div>
        <Button variant="outline" onClick={() => navigate('/home')}>
          <Home className="h-4 w-4 mr-2" />
          Home
        </Button>
      </div>

      <Card className="w-full">
        <CardHeader>
          <CardTitle>Loan Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="loan_id">Loan ID</Label>
                <Input 
                  id="loan_id" 
                  name="loan_id" 
                  value={formData.loan_id} 
                  onChange={handleInputChange}
                  required
                  readOnly={isEditMode} // Don't allow changing the ID in edit mode
                  className={isEditMode ? "bg-gray-100" : ""}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="institution">Institution</Label>
                <Input 
                  id="institution" 
                  name="institution" 
                  value={formData.institution} 
                  onChange={handleInputChange}
                  placeholder="Bank or lender name"
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label>Start Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {format(startDate, "PPP")}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={setStartDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="space-y-2">
                <Label>Due Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {format(dueDate, "PPP")}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={dueDate}
                      onSelect={setDueDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="space-y-2">
                <Label>Next Payment Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {format(nextPaymentDate, "PPP")}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={nextPaymentDate}
                      onSelect={setNextPaymentDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="amount">Loan Amount (UGX)</Label>
                <Input 
                  id="amount" 
                  name="amount" 
                  type="number" 
                  min="0" 
                  step="0.01" 
                  value={formData.amount} 
                  onChange={handleInputChange}
                  placeholder="0.00"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="interest_rate">Interest Rate (%)</Label>
                <Input 
                  id="interest_rate" 
                  name="interest_rate" 
                  type="number" 
                  min="0" 
                  max="100" 
                  step="0.01" 
                  value={formData.interest_rate} 
                  onChange={handleInputChange}
                  placeholder="0.00"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="next_payment_amount">Next Payment Amount (UGX)</Label>
                <Input 
                  id="next_payment_amount" 
                  name="next_payment_amount" 
                  type="number" 
                  min="0" 
                  step="0.01" 
                  value={formData.next_payment_amount} 
                  onChange={handleInputChange}
                  placeholder="0.00"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="payment_frequency">Payment Frequency</Label>
                <Select 
                  value={formData.payment_frequency} 
                  onValueChange={(value) => handleSelectChange('payment_frequency', value)}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="biweekly">Bi-weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="quarterly">Quarterly</SelectItem>
                    <SelectItem value="biannually">Bi-annually</SelectItem>
                    <SelectItem value="annually">Annually</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select 
                  value={formData.status} 
                  onValueChange={(value) => handleSelectChange('status', value)}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="defaulted">Defaulted</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="purpose">Purpose</Label>
              <Input 
                id="purpose" 
                name="purpose" 
                value={formData.purpose} 
                onChange={handleInputChange}
                placeholder="Purpose of the loan"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="collateral">Collateral</Label>
              <Input 
                id="collateral" 
                name="collateral" 
                value={formData.collateral} 
                onChange={handleInputChange}
                placeholder="Assets provided as security"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea 
                id="notes" 
                name="notes" 
                value={formData.notes} 
                onChange={handleInputChange}
                placeholder="Additional notes or details about the loan"
                rows={3}
              />
            </div>
            
            <div className="flex justify-end space-x-4">
              <Button type="button" variant="outline" onClick={() => navigate('/loans')}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : isEditMode ? 'Update Loan' : 'Save Loan'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoanManagerPage;
