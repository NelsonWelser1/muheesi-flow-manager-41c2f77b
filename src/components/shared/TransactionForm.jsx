
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const TransactionForm = ({ transaction = null, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    date: transaction?.date || new Date().toISOString().split("T")[0],
    bankAccount: transaction?.bankAccount || "Primary Account",
    type: transaction?.type || "income",
    payee: transaction?.payee || "",
    reason: transaction?.reason || "",
    amount: transaction?.amount || 0
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validatedForm = {
      ...formData,
      amount: Number(formData.amount)
    };
    onSubmit(validatedForm);
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input 
                id="date" 
                name="date" 
                type="date" 
                value={formData.date} 
                onChange={handleChange} 
                required 
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bankAccount">Bank Account</Label>
              <Select 
                name="bankAccount" 
                value={formData.bankAccount} 
                onValueChange={(value) => handleSelectChange("bankAccount", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select account" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Primary Account">Primary Account</SelectItem>
                  <SelectItem value="Secondary Account">Secondary Account</SelectItem>
                  <SelectItem value="Savings Account">Savings Account</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Transaction Type</Label>
              <Select 
                name="type" 
                value={formData.type} 
                onValueChange={(value) => handleSelectChange("type", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="income">Income</SelectItem>
                  <SelectItem value="expense">Expense</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="payee">Payee/Payer</Label>
              <Input 
                id="payee" 
                name="payee" 
                type="text" 
                value={formData.payee} 
                onChange={handleChange} 
                placeholder="Enter payee or payer" 
                required 
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="reason">Description</Label>
              <Input 
                id="reason" 
                name="reason" 
                type="text" 
                value={formData.reason} 
                onChange={handleChange} 
                placeholder="Enter reason for transaction" 
                required 
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Amount (UGX)</Label>
              <Input 
                id="amount" 
                name="amount" 
                type="number" 
                value={formData.amount} 
                onChange={handleChange} 
                min="0" 
                placeholder="Enter amount" 
                required 
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit">
              {transaction ? "Update Transaction" : "Add Transaction"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default TransactionForm;
