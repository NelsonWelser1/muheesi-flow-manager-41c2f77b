
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTransactions } from '@/hooks/useTransactions';
import { formatDate } from '@/utils/dateUtils';

const LedgerUpdates = () => {
  const { transactions } = useTransactions();
  const [startingBalance, setStartingBalance] = useState(0); // Default to 0 instead of hardcoded value
  const [endingBalance, setEndingBalance] = useState(0);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [balanceSteps, setBalanceSteps] = useState([]);
  const [latestTransactionDate, setLatestTransactionDate] = useState(null);
  const [previousClosingBalance, setPreviousClosingBalance] = useState(0);

  // Fetch and calculate the previous closing balance from transactions
  useEffect(() => {
    if (!transactions || transactions.length === 0) {
      setPreviousClosingBalance(0);
      setStartingBalance(0);
      return;
    }
    
    // Sort transactions by date (oldest to newest)
    const sortedTransactions = [...transactions].sort((a, b) => new Date(a.date) - new Date(b.date));
    
    // Calculate the closing balance before recent transactions
    let calculatedBalance = 0;
    
    // Calculate balance up to transactions that aren't in the most recent 5
    if (sortedTransactions.length > 5) {
      const olderTransactions = sortedTransactions.slice(0, -5);
      
      olderTransactions.forEach(tx => {
        const amount = Number(tx.amount);
        if (tx.type === 'income') {
          calculatedBalance += amount;
        } else if (tx.type === 'expense') {
          calculatedBalance -= amount;
        }
      });
    }
    
    setPreviousClosingBalance(calculatedBalance);
    setStartingBalance(calculatedBalance);
  }, [transactions]);

  // Process transactions when they load
  useEffect(() => {
    if (!transactions || transactions.length === 0) return;
    
    // Get recent transactions (last 5)
    const recent = [...transactions]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5);
    
    // Set the latest transaction date
    if (recent.length > 0) {
      setLatestTransactionDate(recent[0].date);
    }
    
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

  // Format the title dynamically
  const getCardTitle = () => {
    if (!latestTransactionDate) return "Ledger Update";
    return `Ledger Update — Post ${formatDate(latestTransactionDate)}`;
  };

  return (
    <Card className="mt-6">
      <CardHeader className="pb-2">
        <CardTitle>{getCardTitle()}</CardTitle>
        <p className="text-sm text-muted-foreground">Summary of financial position</p>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-4">
          <div>
            <p className="font-medium">Previous Closing Balance: UGX {previousClosingBalance.toLocaleString()}</p>
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
