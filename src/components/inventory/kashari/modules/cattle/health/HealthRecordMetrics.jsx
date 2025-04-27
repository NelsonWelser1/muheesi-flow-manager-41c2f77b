
import React, { useMemo } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar,
  Syringe, 
  AlertTriangle, 
  Activity,
  PiggyBank
} from "lucide-react";
import { useCattleHealthRecords } from '@/hooks/useCattleHealthRecords';

const HealthRecordMetrics = ({ cattleId = null }) => {
  const { records, isLoading, error } = useCattleHealthRecords(cattleId);
  
  const metrics = useMemo(() => {
    if (!records || isLoading) {
      return {
        totalRecords: 0,
        vaccinationCount: 0,
        overdueCount: 0,
        upcomingCount: 0,
        recentRecords: []
      };
    }
    
    const now = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(now.getDate() - 30);
    
    const overdueRecords = records.filter(r => {
      if (!r.next_due_date) return false;
      const dueDate = new Date(r.next_due_date);
      return dueDate < now;
    });
    
    const upcomingRecords = records.filter(r => {
      if (!r.next_due_date) return false;
      const dueDate = new Date(r.next_due_date);
      const daysDiff = Math.floor((dueDate - now) / (1000 * 60 * 60 * 24));
      return dueDate >= now && daysDiff <= 14; // Due within next 14 days
    });
    
    const recentRecords = records
      .filter(r => {
        const recordDate = new Date(r.record_date);
        return recordDate >= thirtyDaysAgo;
      })
      .sort((a, b) => new Date(b.record_date) - new Date(a.record_date))
      .slice(0, 3);
    
    return {
      totalRecords: records.length,
      vaccinationCount: records.filter(r => r.record_type === 'vaccination').length,
      overdueCount: overdueRecords.length,
      upcomingCount: upcomingRecords.length,
      recentRecords
    };
  }, [records, isLoading]);
  
  // Calculate a health score based on recent records and overdue items
  const calculateHealthScore = () => {
    if (isLoading || !records || records.length === 0) return '—';
    
    // Start with base score
    let score = 95;
    
    // Deduct points for overdue records
    score -= metrics.overdueCount * 5;
    
    // Add points for recent activity
    if (metrics.recentRecords.length > 0) score += 5;
    
    // Ensure score is within range
    return `${Math.max(0, Math.min(100, score))}%`;
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  // Get icon for record type
  const getTypeIcon = (type) => {
    switch (type) {
      case 'vaccination':
        return <Syringe className="h-3.5 w-3.5 text-blue-500" />;
      case 'treatment':
        return <PiggyBank className="h-3.5 w-3.5 text-orange-500" />;
      case 'examination':
        return <Activity className="h-3.5 w-3.5 text-green-500" />;
      case 'deworming':
        return <Syringe className="h-3.5 w-3.5 text-purple-500" />;
      default:
        return <Calendar className="h-3.5 w-3.5 text-gray-500" />;
    }
  };
  
  return (
    <div className="space-y-4">
      {/* Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card className="border-l-4 border-primary">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">Total Records</p>
                <p className="text-2xl font-bold">{isLoading ? '—' : metrics.totalRecords}</p>
              </div>
              <Calendar className="h-8 w-8 text-muted-foreground/30" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-blue-500">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">Vaccinations</p>
                <p className="text-2xl font-bold">{isLoading ? '—' : metrics.vaccinationCount}</p>
              </div>
              <Syringe className="h-8 w-8 text-blue-500/30" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-destructive">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">Overdue</p>
                <p className="text-2xl font-bold">{isLoading ? '—' : metrics.overdueCount}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-destructive/30" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-green-500">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">Health Score</p>
                <p className="text-2xl font-bold">{isLoading ? '—' : calculateHealthScore()}</p>
              </div>
              <Activity className="h-8 w-8 text-green-500/30" />
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Recent Records */}
      {!isLoading && metrics.recentRecords.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <p className="font-medium mb-2">Recent Health Activities</p>
            <div className="space-y-2">
              {metrics.recentRecords.map((record) => (
                <div 
                  key={record.id} 
                  className="flex items-center justify-between border-b pb-2 last:border-0"
                >
                  <div className="flex items-center gap-2">
                    {getTypeIcon(record.record_type)}
                    <div>
                      <p className="text-sm">
                        <span className="capitalize">{record.record_type}</span>
                        <span className="mx-1">·</span>
                        <Badge variant="outline" className="font-normal">
                          {record.cattle_inventory?.tag_number || 'Unknown'}
                        </Badge>
                      </p>
                      <p className="text-xs text-muted-foreground line-clamp-1">
                        {record.description}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {formatDate(record.record_date)}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default HealthRecordMetrics;
