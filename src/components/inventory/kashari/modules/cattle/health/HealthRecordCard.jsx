
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Syringe, Pill, HeartPulse, AlertTriangle, Trash2, Edit, Eye } from "lucide-react";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useCattleHealthRecords } from '@/hooks/useCattleHealthRecords';
import { useToast } from "@/components/ui/use-toast";

const HealthRecordCard = ({ record, onEdit, onView }) => {
  const { deleteHealthRecord } = useCattleHealthRecords();
  const { toast } = useToast();

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Get type icon
  const getTypeIcon = () => {
    switch (record.record_type) {
      case 'vaccination':
        return <Syringe className="h-5 w-5 text-blue-500" />;
      case 'treatment':
        return <Pill className="h-5 w-5 text-orange-500" />;
      case 'examination':
        return <HeartPulse className="h-5 w-5 text-green-500" />;
      case 'deworming':
        return <Pill className="h-5 w-5 text-purple-500" />;
      default:
        return <Calendar className="h-5 w-5 text-gray-500" />;
    }
  };

  // Get status badge based on next due date
  const getStatusBadge = () => {
    if (!record.next_due_date) return null;
    
    const now = new Date();
    const dueDate = new Date(record.next_due_date);
    const daysDiff = Math.floor((dueDate - now) / (1000 * 60 * 60 * 24));
    
    if (daysDiff < 0) {
      return <Badge variant="destructive" className="flex items-center gap-1">
        <AlertTriangle className="h-3.5 w-3.5" />
        Overdue {Math.abs(daysDiff)} days
      </Badge>;
    } else if (daysDiff <= 7) {
      return <Badge variant="warning" className="bg-amber-500 text-white">Due soon</Badge>;
    } else {
      return <Badge variant="outline" className="text-muted-foreground">Upcoming</Badge>;
    }
  };

  // Handle delete confirmation
  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this health record? This action cannot be undone.")) {
      try {
        await deleteHealthRecord.mutateAsync(record.id);
      } catch (error) {
        console.error('Delete error:', error);
        toast({
          title: 'Error',
          description: 'Failed to delete health record',
          variant: 'destructive',
        });
      }
    }
  };

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <CardHeader className="pb-2 pt-3">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            {getTypeIcon()}
            <CardTitle className="text-lg capitalize">{record.record_type}</CardTitle>
          </div>
          <div className="flex gap-1">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => onView(record)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>View details</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => onEdit(record)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Edit record</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 hover:text-destructive"
                    onClick={handleDelete}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Delete record</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pb-3">
        <div className="space-y-2">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-1 text-muted-foreground text-sm">
              <Calendar className="h-3.5 w-3.5" />
              <span>{formatDate(record.record_date)}</span>
            </div>
            {record.next_due_date && getStatusBadge()}
          </div>
          
          <div>
            <p className="font-medium text-sm">Cattle:</p>
            <div className="flex items-center gap-2">
              <Badge variant="outline">
                {record.cattle_inventory?.tag_number || 'Unknown'}
              </Badge>
              <span className="text-sm">{record.cattle_inventory?.name || 'Unnamed'}</span>
            </div>
          </div>
          
          <div className="mt-2">
            <p className="font-medium text-sm">Description:</p>
            <p className="text-sm line-clamp-2">{record.description}</p>
          </div>
          
          {record.treatment && (
            <div>
              <p className="font-medium text-sm">Treatment:</p>
              <p className="text-sm line-clamp-1">{record.treatment}</p>
            </div>
          )}
          
          {record.administered_by && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-2">
              <span>By:</span>
              <span>{record.administered_by}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default HealthRecordCard;
