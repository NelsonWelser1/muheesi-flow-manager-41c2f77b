
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const Overview = () => {
  return (
    <Card className="bg-gray-50 border border-gray-200 shadow">
      <CardHeader>
        <CardTitle>Bukomero Dairy Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="py-4">
          <p className="text-gray-600 mb-4">
            Dashboard overview for Bukomero Dairy Farm operations and performance.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card className="bg-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Milk Production</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">457 L</p>
                <p className="text-sm text-gray-500">Daily average</p>
              </CardContent>
            </Card>
            <Card className="bg-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Livestock</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">126</p>
                <p className="text-sm text-gray-500">Total cattle</p>
              </CardContent>
            </Card>
            <Card className="bg-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">UGX 3.2M</p>
                <p className="text-sm text-gray-500">Weekly</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Overview;
