
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const Production = () => {
  return (
    <Card className="bg-white shadow">
      <CardHeader>
        <CardTitle>Production</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Production information and metrics will be displayed here.</p>
      </CardContent>
    </Card>
  );
};
