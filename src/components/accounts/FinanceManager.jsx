import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const FinanceManager = () => {
  const [formData, setFormData] = useState({
    transactionType: '',
    amount: '',
    description: '',
    category: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Financial transaction:", formData);
    // Implement financial transaction submission logic
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Finance Manager</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="transactionType">Transaction Type</Label>
          <Select name="transactionType" onValueChange={(value) => handleInputChange({ target: { name: 'transactionType', value } })} required>
            <SelectTrigger>
              <SelectValue placeholder="Select transaction type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="income">Income</SelectItem>
              <SelectItem value="expense">Expense</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="amount">Amount</Label>
          <Input id="amount" name="amount" type="number" value={formData.amount} onChange={handleInputChange} required />
        </div>
        <div>
          <Label htmlFor="description">Description</Label>
          <Input id="description" name="description" value={formData.description} onChange={handleInputChange} required />
        </div>
        <div>
          <Label htmlFor="category">Category</Label>
          <Input id="category" name="category" value={formData.category} onChange={handleInputChange} required />
        </div>
        <Button type="submit">Record Financial Transaction</Button>
      </form>
    </div>
  );
};

export default FinanceManager;