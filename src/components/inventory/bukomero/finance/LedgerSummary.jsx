
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCurrencyFormatter } from "@/components/inventory/dairy/accounts/records/components/payroll/hooks/useCurrencyFormatter";

const LedgerSummary = ({ transactions, openingBalance, closingBalance }) => {
  const { formatCurrency } = useCurrencyFormatter();
  const currentMonth = new Date().toLocaleString('default', { month: 'long' });
  const currentDay = new Date().getDate();
  
  // Sort transactions by date
  const sortedTransactions = [...transactions].sort((a, b) => new Date(a.date) - new Date(b.date));

  // Helper function to get running balance after each transaction
  const getRunningBalance = (index) => {
    let balance = openingBalance;
    for (let i = 0; i <= index; i++) {
      const t = sortedTransactions[i];
      if (t.type === 'income') {
        balance += t.amount;
      } else {
        balance -= t.amount;
      }
    }
    return balance;
  };

  return (
    <Card className="bg-slate-50">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">Ledger Update — Post {currentDay}th {currentMonth}</CardTitle>
        <p className="text-sm text-gray-600">Summary of financial position</p>
      </CardHeader>
      <CardContent className="space-y-4 font-mono text-sm">
        <div>
          <p className="font-semibold">Previous Closing Balance: {formatCurrency(openingBalance)}</p>
        </div>
        
        <div className="space-y-1">
          <p className="font-semibold">Transaction Entries:</p>
          <ul className="list-disc pl-6 space-y-1">
            {sortedTransactions.map((t) => (
              <li key={t.id}>
                {new Date(t.date).toISOString().split('T')[0]} - {t.reason} - {t.type === 'income' ? '+' : '-'} {formatCurrency(t.amount)} - {t.type === 'income' ? 'Income' : 'Expense'}
              </li>
            ))}
          </ul>
        </div>
        
        <div className="space-y-1">
          <p className="font-semibold">Balance Calculation:</p>
          <div className="pl-6 space-y-1">
            <p>Starting Balance: {formatCurrency(openingBalance)}</p>
            {sortedTransactions.map((t, index) => (
              <p key={t.id}>
                {t.type === 'income' ? 'Plus' : 'Less'} {t.reason}: {t.type === 'income' ? '+' : '-'} {formatCurrency(t.amount)} → {formatCurrency(getRunningBalance(index))}
              </p>
            ))}
          </div>
        </div>
        
        <div>
          <p className="font-semibold">New Closing Balance: {formatCurrency(closingBalance)}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default LedgerSummary;
