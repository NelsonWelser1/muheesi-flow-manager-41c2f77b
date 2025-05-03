
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTransactions } from '@/hooks/useTransactions';
import { formatDate } from '@/utils/dateUtils';

const LedgerUpdates = () => {
  const { transactions } = useTransactions();
  const [startingBalance, setStartingBalance] = useState(29699000);
  const [endingBalance, setEndingBalance] = useState(0);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [balanceSteps, setBalanceSteps] = useState([]);

  // Process transactions when they load
  useEffect(() => {
    if (!transactions || transactions.length === 0) return;
    
    // Get recent transactions (last 5)
    const recent = [...transactions]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5);
    
    setRecentTransactions(recent);
    
    // Calculate balance steps
    let currentBalance = startingBalance;
    const steps = [];
    
    recent.forEach(tx => {
      const amount = Number(tx.amount);
      if (tx.type === 'income') {
        currentBalance += amount;
        steps.push({
          description: `Plus ${tx.reason}: + UGX ${amount.toLocaleString()} → UGX ${currentBalance.toLocaleString()}`,
          balance: currentBalance
        });
      } else if (tx.type === 'expense') {
        currentBalance -= amount;
        steps.push({
          description: `Less ${tx.reason}: - UGX ${amount.toLocaleString()} → UGX ${currentBalance.toLocaleString()}`,
          balance: currentBalance
        });
      }
    });
    
    setBalanceSteps(steps);
    setEndingBalance(currentBalance);
  }, [transactions, startingBalance]);

  return (
    <Card className="mt-6">
      <CardHeader className="pb-2">
        <CardTitle>Ledger Update — Post 8th April</CardTitle>
        <p className="text-sm text-muted-foreground">Summary of financial position</p>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-4">
          <div>
            <p className="font-medium">Previous Closing Balance: UGX {startingBalance.toLocaleString()}</p>
          </div>

          {recentTransactions.length > 0 && (
            <div>
              <p className="font-medium mb-2">Transaction Entries:</p>
              <ul className="list-disc pl-6 space-y-1">
                {recentTransactions.map((tx, index) => (
                  <li key={index}>
                    {formatDate(tx.date)} - {tx.payee} - {tx.reason} - 
                    {tx.type === 'income' 
                      ? ` + UGX ${Number(tx.amount).toLocaleString()}`
                      : ` - UGX ${Number(tx.amount).toLocaleString()}`
                    } - {tx.type.charAt(0).toUpperCase() + tx.type.slice(1)}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {balanceSteps.length > 0 && (
            <div>
              <p className="font-medium mb-2">Balance Calculation:</p>
              <div className="pl-6 space-y-1 font-mono text-sm">
                <p>Starting Balance: UGX {startingBalance.toLocaleString()}</p>
                {balanceSteps.map((step, index) => (
                  <p key={index} className="pl-4">{step.description}</p>
                ))}
              </div>
            </div>
          )}

          <div>
            <p className="font-medium">New Closing Balance: UGX {endingBalance.toLocaleString()}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LedgerUpdates;
