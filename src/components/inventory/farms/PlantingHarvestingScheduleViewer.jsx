
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { ArrowLeft, Search, Loader2, Calendar } from "lucide-react";
import { usePlantingHarvestingSchedule } from '@/hooks/usePlantingHarvestingSchedule';
import { useToast } from "@/components/ui/use-toast";
import { showErrorToast } from "@/components/ui/notifications";
import { format, parseISO } from 'date-fns';
import { Badge } from '@/components/ui/badge';

const PlantingHarvestingScheduleViewer = ({ onBack, isKazo }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const { schedules, loading, error, fetchSchedules } = usePlantingHarvestingSchedule();
  const { toast } = useToast();
  
  useEffect(() => {
    const loadSchedules = async () => {
      try {
        await fetchSchedules();
      } catch (error) {
        console.error("Error loading schedules:", error);
        showErrorToast(toast, "Failed to load schedules");
      }
    };
    
    loadSchedules();
  }, []);
  
  const filteredSchedules = schedules.filter(schedule => 
    schedule.farm_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    schedule.activity_type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
      return format(new Date(dateString), 'PPP');
    } catch (error) {
      console.error("Date formatting error:", error);
      return dateString;
    }
  };

  const getActivityBadge = (activityType) => {
    if (activityType === 'planting') {
      return <Badge className="bg-green-100 text-green-800">Planting</Badge>;
    } else if (activityType === 'harvesting') {
      return <Badge className="bg-amber-100 text-amber-800">Harvesting</Badge>;
    }
    return <Badge>{activityType}</Badge>;
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="sm" 
              className="mr-2"
              onClick={onBack}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <CardTitle>Planting & Harvesting Schedule</CardTitle>
          </div>
          <div className="relative w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search schedules..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredSchedules.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Farm Name</TableHead>
                    <TableHead>Activity</TableHead>
                    <TableHead>Scheduled Date</TableHead>
                    <TableHead>Completion Date</TableHead>
                    <TableHead>Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSchedules.map((schedule) => (
                    <TableRow key={schedule.id}>
                      <TableCell className="font-medium">{schedule.farm_name}</TableCell>
                      <TableCell>{getActivityBadge(schedule.activity_type)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3 text-muted-foreground" />
                          {formatDate(schedule.scheduled_date)}
                        </div>
                      </TableCell>
                      <TableCell>
                        {schedule.expected_completion_date ? (
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3 text-muted-foreground" />
                            {formatDate(schedule.expected_completion_date)}
                          </div>
                        ) : '-'}
                      </TableCell>
                      <TableCell className="max-w-xs truncate">{schedule.notes || '-'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-10 text-muted-foreground">
              {searchTerm ? "No schedules match your search criteria" : "No schedules found"}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PlantingHarvestingScheduleViewer;
