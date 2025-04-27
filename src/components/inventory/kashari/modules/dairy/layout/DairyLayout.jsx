
import React from 'react';
import { Card } from "@/components/ui/card";

const DairyLayout = ({ children }) => {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Dairy Management</h2>
      <Card className="p-6">
        {children}
      </Card>
    </div>
  );
};

export default DairyLayout;
