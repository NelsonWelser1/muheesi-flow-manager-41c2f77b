
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Building } from 'lucide-react';

const CompaniesView = () => {
  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
          <Building className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">Companies</h3>
          <p className="text-muted-foreground mt-2">
            Manage your business contacts and company relationships here. Coming soon.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default CompaniesView;
