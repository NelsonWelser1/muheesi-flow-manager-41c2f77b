
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const QualityControl = () => {
  return (
    <Card className="bg-gray-50 border border-gray-200 shadow">
      <CardHeader>
        <CardTitle>Quality Control</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="py-4">
          <p className="text-gray-600 mb-4">
            Monitor and maintain milk quality standards and testing results.
          </p>
          <Card className="bg-white p-4 mb-4">
            <p className="font-semibold">Quality Control module under development</p>
            <p className="text-sm text-gray-500">This feature will be implemented soon.</p>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
};

export default QualityControl;
