
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const YogurtProcessing = () => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Yogurt Processing</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Current Production</CardTitle>
              </CardHeader>
              <CardContent>
                <p>No active production batches</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Today's Output</CardTitle>
              </CardHeader>
              <CardContent>
                <p>0 units processed</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quality Control</CardTitle>
              </CardHeader>
              <CardContent>
                <p>All parameters within normal range</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default YogurtProcessing;

