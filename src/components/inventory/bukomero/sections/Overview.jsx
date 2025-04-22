
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const BukomeroOverview = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Milk Production Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Daily milk production statistics and trends will be displayed here.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Operational Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Key performance indicators for the dairy operations will be shown here.</p>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            <li className="flex justify-between">
              <span>Milk collection completed</span>
              <span className="text-gray-500">Today, 6:30 AM</span>
            </li>
            <li className="flex justify-between">
              <span>Processing batch #BM-2023-056 started</span>
              <span className="text-gray-500">Today, 8:15 AM</span>
            </li>
            <li className="flex justify-between">
              <span>Quality testing completed for morning batch</span>
              <span className="text-gray-500">Today, 9:45 AM</span>
            </li>
            <li className="flex justify-between">
              <span>Delivery scheduled for processed products</span>
              <span className="text-gray-500">Today, 2:00 PM</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default BukomeroOverview;
