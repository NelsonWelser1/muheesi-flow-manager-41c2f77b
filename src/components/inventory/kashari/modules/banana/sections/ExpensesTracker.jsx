
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ExpensesTracker = () => {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Expenses Tracker</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Banana plantation expenses tracking tools will be available here.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExpensesTracker;
