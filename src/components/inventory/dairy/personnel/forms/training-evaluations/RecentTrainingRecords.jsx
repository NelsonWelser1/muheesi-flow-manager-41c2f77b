import React from 'react';
import { format } from 'date-fns';
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
const RecentTrainingRecords = ({
  records,
  isLoading
}) => {
  // Handle empty state
  if (isLoading) {
    return <Card>
        <CardHeader>
          <CardTitle>Recent Training Records</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-8">
            <p className="text-muted-foreground">Loading records...</p>
          </div>
        </CardContent>
      </Card>;
  }

  // Handle no records state
  if (!records || records.length === 0) {
    return;
  }
  const getRatingColor = rating => {
    if (rating >= 4) return "success";
    if (rating >= 3) return "warning";
    return "destructive";
  };
  return;
};
export default RecentTrainingRecords;