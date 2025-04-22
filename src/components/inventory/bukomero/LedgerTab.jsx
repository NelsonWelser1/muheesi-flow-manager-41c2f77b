
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const initialLedger = [
  { id: 1, date: "2025-04-01", type: "Income", reason: "Nakumatt Supermarket - Banana Sales (Ripe)", amount: 325000 },
  { id: 2, date: "2025-04-03", type: "Income", reason: "Carrefour Uganda - Banana Sales (Green)", amount: 375000 },
  { id: 3, date: "2025-04-05", type: "Expense", reason: "Eng. Collins - Plantation Irrigation Repair", amount: 250000 },
  { id: 4, date: "2025-04-07", type: "Income", reason: "Fresh Foods Market - Banana Sales (Ripe)", amount: 260000 },
  { id: 5, date: "2025-04-08", type: "Expense", reason: "Agro Supplies Ltd - Fertilizer Purchase", amount: 180000 },
];

const startingBalance = 29699000;

function formatUGX(amount) {
  return "UGX " + amount.toLocaleString();
}

const LedgerTab = () => {
  const [ledger, setLedger] = useState(initialLedger);
  const [form, setForm] = useState({
    date: "",
    type: "Income",
    reason: "",
    amount: ""
  });
  const [error, setError] = useState("");

  // Calculate closing balance and a running log for balance explanation
  let runningBalance = startingBalance;
  const balanceSteps = [
    { label: "Starting Balance", value: runningBalance }
  ];

  // Sorted ledger entries by date ascending
  const sortedLedger = ledger.slice().sort((a, b) => new Date(a.date) - new Date(b.date));

  sortedLedger.forEach((txn) => {
    const delta = txn.type === "Income" ? txn.amount : -txn.amount;
    runningBalance += delta;
    balanceSteps.push({
      label: `${txn.type === "Income" ? "Plus" : "Less"} ${txn.reason.split('-')[1]?.trim() || txn.reason}`,
      change: `${txn.type === "Income" ? "+" : "-"} ${formatUGX(txn.amount)}`,
      value: runningBalance,
    });
  });

  // Form handler
  const handleChange = e => {
    setForm(f => ({
      ...f,
      [e.target.name]: e.target.value
    }));
    setError("");
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (!form.date || !form.reason || !form.amount || isNaN(Number(form.amount))) {
      setError("All fields are required and amount must be a number.");
      return;
    }
    setLedger([
      ...ledger,
      {
        id: Date.now(),
        date: form.date,
        type: form.type,
        reason: form.reason,
        amount: Number(form.amount)
      }
    ]);
    setForm({ date: "", type: "Income", reason: "", amount: "" });
    setError("");
  };

  // Today's date for summary heading
  const latestDate = sortedLedger.length > 0
    ? new Date(sortedLedger[sortedLedger.length - 1].date)
    : new Date();

  const postedDate = latestDate.toLocaleDateString("en-US", { month: "short", day: "numeric" });

  return (
    <Card className="bg-gray-50 border border-gray-200 shadow flex flex-col gap-6 p-6">
      <CardHeader className="p-0">
        <CardTitle className="text-xl font-bold mb-1">Ledger Update — Post {postedDate}</CardTitle>
        <div className="text-gray-500 text-sm">Summary of financial position</div>
      </CardHeader>
      <CardContent className="p-0 flex flex-col gap-8">
        {/* Data entry form */}
        <form className="flex flex-wrap md:flex-nowrap gap-4 items-end" onSubmit={handleSubmit}>
          <div>
            <Label htmlFor="date">Date</Label>
            <Input id="date" name="date" type="date" value={form.date} onChange={handleChange} required />
          </div>
          <div>
            <Label htmlFor="type">Type</Label>
            <select
              id="type"
              name="type"
              value={form.type}
              onChange={handleChange}
              className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="Income">Income</option>
              <option value="Expense">Expense</option>
            </select>
          </div>
          <div className="min-w-[200px] flex-1">
            <Label htmlFor="reason">Reason</Label>
            <Input id="reason" name="reason" value={form.reason} onChange={handleChange} placeholder="Transaction details" required />
          </div>
          <div>
            <Label htmlFor="amount">Amount (UGX)</Label>
            <Input id="amount" name="amount" type="number" value={form.amount} onChange={handleChange} min={1} placeholder="e.g. 100000" required />
          </div>
          <Button type="submit" className="bg-purple-600 hover:bg-purple-700">Add</Button>
        </form>
        {error && <div className="text-red-600 text-sm">{error}</div>}

        {/* Ledger summary */}
        <div className="bg-white rounded-md border px-6 py-4 shadow-sm">
          <div className="font-medium mb-1">Previous Closing Balance: <span className="font-mono">{formatUGX(startingBalance)}</span></div>
          <div className="mt-4 mb-2 font-semibold text-gray-700">Transaction Entries:</div>
          <ul className="mb-4 pl-4 space-y-1">
            {sortedLedger.map((txn) => (
              <li key={txn.id} className="text-sm flex gap-2 items-center">
                <span className="inline-block w-[105px] font-mono text-gray-600">{txn.date}</span>
                <span>• {txn.reason}</span>
                <span className={txn.type === "Income" ? "text-green-700 font-semibold ml-1" : "text-red-700 font-semibold ml-1"}>
                  {txn.type === "Income" ? "+" : "-"} {formatUGX(txn.amount)}
                </span>
                <span className="ml-2 text-xs bg-gray-50 border px-2 py-0.5 rounded-full">{txn.type}</span>
              </li>
            ))}
          </ul>
          <div className="mb-2 font-semibold text-gray-700">Balance Calculation:</div>
          <div className="pl-3 space-y-1 text-sm">
            {balanceSteps.map((step, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className={step.label.startsWith("Plus") ? "text-green-700 font-medium" : step.label.startsWith("Less") ? "text-red-700 font-medium" : "font-semibold"}>
                  {step.label}:
                </span>
                {step.change && <span className="font-mono">{step.change}</span>}
                <span className="font-mono">{formatUGX(step.value)}</span>
              </div>
            ))}
          </div>
          <div className="font-bold mt-3">
            New Closing Balance: <span className="font-mono text-purple-700">{formatUGX(runningBalance)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LedgerTab;

