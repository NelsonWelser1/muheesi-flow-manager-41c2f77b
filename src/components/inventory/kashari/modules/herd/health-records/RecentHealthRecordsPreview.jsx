
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Calendar, Syringe, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useHealthRecords } from '@/hooks/useHealthRecords';
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";

const RecentHealthRecordsPreview = () => {
  const { healthRecords, isLoading, error } = useHealthRecords();
  const { toast } = useToast();
  const [selectedRecord, setSelectedRecord] = useState(null);

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Get record type icon
  const getTypeIcon = (type) => {
    switch (type) {
      case 'vaccination':
        return <Syringe className="h-4 w-4 text-blue-500" />;
      case 'treatment':
        return <Activity className="h-4 w-4 text-orange-500" />;
      default:
        return <Calendar className="h-4 w-4 text-gray-500" />;
    }
  };

  // Get status badge
  const getStatusBadge = (record) => {
    if (!record.next_due_date) return null;
    
    const now = new Date();
    const dueDate = new Date(record.next_due_date);
    const daysDiff = Math.floor((dueDate - now) / (1000 * 60 * 60 * 24));
    
    if (daysDiff < 0) {
      return <Badge variant="destructive">Overdue</Badge>;
    } else if (daysDiff <= 7) {
      return <Badge variant="warning">Due Soon</Badge>;
    }
    return <Badge variant="success">Upcoming</Badge>;
  };

  if (isLoading) {
    return (
      <Card className="w-full animate-pulse">
        <CardContent className="p-6">
          <div className="h-24 bg-gray-200 rounded-md"></div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full">
        <CardContent className="p-6">
          <div className="text-red-500">Error loading health records</div>
        </CardContent>
      </Card>
    );
  }

  const recentRecords = healthRecords?.slice(0, 3) || [];

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-semibold flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          Recent Health Records
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentRecords.length === 0 ? (
            <div className="text-center py-4 text-gray-500">
              No health records found
            </div>
          ) : (
            recentRecords.map((record) => (
              <div
                key={record.id}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
              >
                <div className="flex gap-4 items-center">
                  {getTypeIcon(record.record_type)}
                  <div>
                    <div className="font-medium">
                      {record.cattle_inventory?.tag_number || 'Unknown Tag'}
                    </div>
                    <div className="text-sm text-gray-500">
                      {record.description}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <div className="text-sm text-gray-500">
                    {formatDate(record.record_date)}
                  </div>
                  {getStatusBadge(record)}
                </div>
              </div>
            ))
          )}
        </div>

        {recentRecords.length > 0 && (
          <div className="mt-4 flex justify-end">
            <Button variant="link" onClick={() => toast({ description: "Viewing all records" })}>
              View all records →
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentHealthRecordsPreview;
