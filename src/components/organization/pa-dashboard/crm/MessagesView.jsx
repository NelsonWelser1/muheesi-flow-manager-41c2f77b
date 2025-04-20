
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { MessageSquare } from 'lucide-react';

const MessagesView = () => {
  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
          <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">Message Center</h3>
          <p className="text-muted-foreground mt-2">
            Manage your contact communications here. Coming soon.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default MessagesView;
