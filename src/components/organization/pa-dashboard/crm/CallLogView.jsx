
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Phone } from 'lucide-react';

const CallLogView = () => {
  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
          <Phone className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">Call History</h3>
          <p className="text-muted-foreground mt-2">
            View and manage your contact call history. Coming soon.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default CallLogView;
