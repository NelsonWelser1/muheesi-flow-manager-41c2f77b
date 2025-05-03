
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const LedgerUpdates = () => {
  return (
    <Card className="mt-6">
      <CardHeader className="pb-2">
        <CardTitle>Ledger Update — Post 8th April</CardTitle>
        <p className="text-sm text-muted-foreground">Summary of financial position</p>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-4">
          <div>
            <p className="font-medium">Previous Closing Balance: UGX 29,699,000</p>
          </div>

          <div>
            <p className="font-medium mb-2">Transaction Entries:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>2025-04-01 - Nakumatt Supermarket - Banana Sales (Ripe) - + UGX 325,000 - Income</li>
              <li>2025-04-03 - Carrefour Uganda - Banana Sales (Green) - + UGX 375,000 - Income</li>
              <li>2025-04-05 - Eng. Collins - Plantation Irrigation Repair - - UGX 250,000 - Expense</li>
              <li>2025-04-07 - Fresh Foods Market - Banana Sales (Ripe) - + UGX 260,000 - Income</li>
              <li>2025-04-08 - Agro Supplies Ltd - Fertilizer Purchase - - UGX 180,000 - Expense</li>
            </ul>
          </div>

          <div>
            <p className="font-medium mb-2">Balance Calculation:</p>
            <div className="pl-6 space-y-1 font-mono text-sm">
              <p>Starting Balance: UGX 29,699,000</p>
              <p className="pl-4">Plus Banana Sales (Ripe): + UGX 325,000 → UGX 30,024,000</p>
              <p className="pl-4">Plus Banana Sales (Green): + UGX 375,000 → UGX 30,399,000</p>
              <p className="pl-4">Less Plantation Irrigation Repair: - UGX 250,000 → UGX 30,149,000</p>
              <p className="pl-4">Plus Banana Sales (Ripe): + UGX 260,000 → UGX 30,409,000</p>
              <p className="pl-4">Less Fertilizer Purchase: - UGX 180,000 → UGX 30,229,000</p>
            </div>
          </div>

          <div>
            <p className="font-medium">New Closing Balance: UGX 30,229,000</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LedgerUpdates;
