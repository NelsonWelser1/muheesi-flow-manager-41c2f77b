
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

/**
 * AddLedgerTransactionForm - Inline form for adding transactions to the ledger.
 */
const transactionTypes = [
  { value: "", label: "Select type" },
  { value: "income", label: "Income" },
  { value: "expense", label: "Expense" },
  { value: "transfer", label: "Transfer" },
];

const AddLedgerTransactionForm = ({
  onSubmit,
  onCancel,
  isSubmitting = false,
  style = {},
}) => {
  const [form, setForm] = useState({
    type: "",
    amount: "",
    date: new Date().toISOString().split("T")[0],
    description: "",
  });
  const [errors, setErrors] = useState({});
  const { toast } = useToast();

  const validate = () => {
    let err = {};
    if (!form.type) err.type = "Type is required";
    if (!form.amount) err.amount = "Amount is required";
    if (form.amount && isNaN(Number(form.amount))) err.amount = "Enter a valid number";
    if (!form.date) err.date = "Date is required";
    if (!form.description) err.description = "Description is required";
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) {
      toast({
        title: "Please check the form",
        description: "One or more fields have errors.",
        variant: "destructive",
      });
      return;
    }
    onSubmit?.(form);
  };

  return (
    <Card className="w-full max-w-xl mx-auto mb-4 shadow-lg border-2 border-primary/30" style={style}>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="type">Transaction Type</Label>
              <select
                id="type"
                name="type"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm
                  ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary
                  focus-visible:ring-offset-2"
                value={form.type}
                onChange={handleChange}
                required
              >
                {transactionTypes.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
              {errors.type && <span className="text-red-600 text-xs">{errors.type}</span>}
            </div>
            <div>
              <Label htmlFor="amount">Amount (UGX)</Label>
              <Input
                id="amount"
                name="amount"
                type="number"
                min="0"
                placeholder="e.g. 100000"
                value={form.amount}
                onChange={handleChange}
                autoComplete="off"
                required
              />
              {errors.amount && <span className="text-red-600 text-xs">{errors.amount}</span>}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                name="date"
                type="date"
                value={form.date}
                onChange={handleChange}
                required
              />
              {errors.date && <span className="text-red-600 text-xs">{errors.date}</span>}
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                name="description"
                type="text"
                placeholder="Brief note (eg. Sold bananas to market)"
                value={form.description}
                onChange={handleChange}
                autoComplete="off"
                required
              />
              {errors.description && <span className="text-red-600 text-xs">{errors.description}</span>}
            </div>
          </div>
          <div className="flex gap-2 pt-2">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Add Transaction"}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddLedgerTransactionForm;
