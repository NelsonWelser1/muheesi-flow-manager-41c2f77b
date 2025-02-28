
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import SalesMarketingLayout from './sales/SalesMarketingLayout';

const SalesMarketing = ({ onBackToDashboard }) => {
  const [showLayout, setShowLayout] = useState(false);

  if (showLayout) {
    return <SalesMarketingLayout onBack={() => setShowLayout(false)} />;
  }

  return (
    <div className="space-y-4">
      <Button 
        variant="outline" 
        onClick={onBackToDashboard}
        className="flex items-center gap-2"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Dashboard
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Sales & Marketing Dashboard</CardTitle>
          <CardDescription>
            Manage sales records, marketing campaigns, and customer relationships
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card className="cursor-pointer hover:bg-slate-50" onClick={() => setShowLayout(true)}>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Sales & Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Record and track sales transactions and distribution
              </p>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
};

export default SalesMarketing;
