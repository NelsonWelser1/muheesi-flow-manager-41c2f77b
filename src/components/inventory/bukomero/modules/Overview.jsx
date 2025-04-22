
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const Overview = () => {
  return (
    <Card className="bg-white shadow">
      <CardHeader>
        <CardTitle>Farm Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Overview information about Bukomero Dairy Farm will be displayed here.</p>
      </CardContent>
    </Card>
  );
};
