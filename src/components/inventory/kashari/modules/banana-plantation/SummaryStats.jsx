
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Bell } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { format, isAfter, isBefore, addDays } from "date-fns";

const SummaryStats = ({ summaryStats }) => {
  // Format date for display
  const formatDate = (date) => {
    if (!date) return 'N/A';
    return format(new Date(date), 'dd MMM yyyy');
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <Card>
        <CardHeader className="py-3">
          <CardTitle className="text-sm font-medium">Total Plantation Area</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{summaryStats.totalArea} acres</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="py-3">
          <CardTitle className="text-sm font-medium">Growth Stage Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm space-y-1">
            {Object.entries(summaryStats.stageCount).map(([stage, count]) => (
              <div key={stage} className="flex justify-between">
                <span>{stage}:</span>
                <span className="font-medium">{count}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="py-3">
          <CardTitle className="text-sm font-medium">Upcoming Treatment Reminders</CardTitle>
        </CardHeader>
        <CardContent>
          {summaryStats.upcomingFertilization.length > 0 ? (
            <div className="space-y-2">
              {summaryStats.upcomingFertilization.map(crop => (
                <Alert key={crop.id} className="py-2">
                  <Bell className="h-4 w-4 text-yellow-500" />
                  <AlertTitle className="text-xs font-medium">Fertilization Due</AlertTitle>
                  <AlertDescription className="text-xs">
                    Area {crop.plantationArea} acres needs fertilization on {formatDate(crop.nextFertilizationDate)}
                  </AlertDescription>
                </Alert>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No upcoming treatments in the next 3 days</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SummaryStats;
