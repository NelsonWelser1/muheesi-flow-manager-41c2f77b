
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const QualityControl = () => {
  return (
    <Card className="bg-white shadow">
      <CardHeader>
        <CardTitle>Quality Control</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Quality control information and metrics will be displayed here.</p>
      </CardContent>
    </Card>
  );
};
