
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Temperature, Boxes, ArrowLeftRight } from 'lucide-react';

const MetricsCards = () => {
  return (
    <div className="flex flex-col md:flex-row gap-4">
      <Card className="flex-1">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Current Temperature
          </CardTitle>
          <Temperature className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">4.2°C</div>
          <p className="text-xs text-muted-foreground">
            Last updated: {new Date().toLocaleTimeString()}
          </p>
        </CardContent>
      </Card>
      <Card className="flex-1">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total Inventory
          </CardTitle>
          <Boxes className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">1,234 units</div>
          <p className="text-xs text-muted-foreground">
            Across all cold rooms
          </p>
        </CardContent>
      </Card>
      <Card className="flex-1">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Today's Movements
          </CardTitle>
          <ArrowLeftRight className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">24</div>
          <p className="text-xs text-muted-foreground">
            12 in / 12 out
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default MetricsCards;
