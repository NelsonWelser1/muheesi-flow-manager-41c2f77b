
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const Sales = () => {
  return (
    <Card className="bg-white shadow">
      <CardHeader>
        <CardTitle>Sales</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Sales information and metrics will be displayed here.</p>
      </CardContent>
    </Card>
  );
};
