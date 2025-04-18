
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";

const CallLogView = () => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-center h-[calc(100vh-280px)]">
          <div className="text-center">
            <h3 className="text-lg font-medium">Call Log</h3>
            <p className="text-muted-foreground mt-2">Call log functionality is coming soon.</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CallLogView;
