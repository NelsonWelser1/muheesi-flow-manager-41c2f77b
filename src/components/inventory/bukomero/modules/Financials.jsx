
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const Financials = () => {
  return (
    <Card className="bg-white shadow">
      <CardHeader>
        <CardTitle>Financials</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Financial information and reports will be displayed here.</p>
      </CardContent>
    </Card>
  );
};
