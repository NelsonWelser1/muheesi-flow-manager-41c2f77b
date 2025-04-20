
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { File } from 'lucide-react';

const DocumentsView = () => {
  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
          <File className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">Documents</h3>
          <p className="text-muted-foreground mt-2">
            Store and manage contact-related documents here. Coming soon.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default DocumentsView;
