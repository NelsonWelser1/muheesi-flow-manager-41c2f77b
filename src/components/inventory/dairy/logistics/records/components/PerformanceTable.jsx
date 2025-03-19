
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from 'date-fns';
import { Star, ChevronUp, ChevronDown, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

const PerformanceTable = ({ performance, handleSort, sortConfig }) => {
  // Format date
  const formatDateTime = (dateString) => {
    if (!dateString) return '';
    try {
      return format(new Date(dateString), 'MMM dd, yyyy HH:mm');
    } catch (error) {
      return dateString;
    }
  };

  // Get delay reason badge
  const getDelayReasonBadge = (reason) => {
    if (!reason) return null;
    
    switch (reason) {
      case 'Traffic':
        return <Badge variant="outline" className="bg-orange-100 text-orange-800 border-orange-200">Traffic</Badge>;
      case 'Weather':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">Weather</Badge>;
      case 'Operational':
        return <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-200">Operational</Badge>;
      case 'Other':
        return <Badge variant="outline" className="bg-gray-100 text-gray-800 border-gray-200">Other</Badge>;
      default:
        return <Badge variant="outline">{reason}</Badge>;
    }
  };

  // Render star rating
  const renderRating = (rating) => {
    if (!rating) return '-';
    
    const stars = [];
    const fullStars = Math.floor(rating);
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400 inline" />);
      } else {
        stars.push(<Star key={i} className="h-4 w-4 text-gray-300 inline" />);
      }
    }
    
    return <div className="flex">{stars} <span className="ml-1">({rating})</span></div>;
  };

  // Format delivery time
  const formatDeliveryTime = (minutes) => {
    if (!minutes && minutes !== 0) return '-';
    
    if (minutes < 60) {
      return `${minutes} min`;
    } else {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      return `${hours}h ${remainingMinutes}m`;
    }
  };

  // Render sort icon
  const renderSortIcon = (columnKey) => {
    if (sortConfig.key !== columnKey) return null;
    return sortConfig.direction === 'asc' ? 
      <ChevronUp className="h-4 w-4 inline ml-1" /> : 
      <ChevronDown className="h-4 w-4 inline ml-1" />;
  };

  return (
    <div className="border rounded-md overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead 
              className="cursor-pointer"
              onClick={() => handleSort('delivery_id')}
            >
              Delivery ID
              {renderSortIcon('delivery_id')}
            </TableHead>
            <TableHead 
              className="cursor-pointer"
              onClick={() => handleSort('performance_rating')}
            >
              Rating
              {renderSortIcon('performance_rating')}
            </TableHead>
            <TableHead 
              className="cursor-pointer"
              onClick={() => handleSort('delivery_time')}
            >
              Delivery Time
              {renderSortIcon('delivery_time')}
            </TableHead>
            <TableHead 
              className="cursor-pointer"
              onClick={() => handleSort('deviation_from_average')}
            >
              Deviation
              {renderSortIcon('deviation_from_average')}
            </TableHead>
            <TableHead 
              className="cursor-pointer"
              onClick={() => handleSort('delay_reason')}
            >
              Delay Reason
              {renderSortIcon('delay_reason')}
            </TableHead>
            <TableHead 
              className="cursor-pointer"
              onClick={() => handleSort('action_required')}
            >
              Action Required
              {renderSortIcon('action_required')}
            </TableHead>
            <TableHead 
              className="cursor-pointer"
              onClick={() => handleSort('created_at')}
            >
              Date
              {renderSortIcon('created_at')}
            </TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {performance.map((record) => (
            <TableRow key={record.id} className="hover:bg-muted/50">
              <TableCell className="font-medium">{record.delivery_id}</TableCell>
              <TableCell>{renderRating(record.performance_rating)}</TableCell>
              <TableCell>{formatDeliveryTime(record.delivery_time)}</TableCell>
              <TableCell>
                {record.deviation_from_average ? 
                  <span className={record.deviation_from_average > 0 ? 'text-red-600' : 'text-green-600'}>
                    {record.deviation_from_average > 0 ? '+' : ''}{record.deviation_from_average.toFixed(2)}%
                  </span> : 
                  '-'
                }
              </TableCell>
              <TableCell>{getDelayReasonBadge(record.delay_reason)}</TableCell>
              <TableCell>
                {record.action_required ? 
                  <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">Required</Badge> : 
                  <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">None</Badge>
                }
              </TableCell>
              <TableCell className="text-muted-foreground text-sm">
                {formatDateTime(record.created_at)}
              </TableCell>
              <TableCell>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <ExternalLink className="h-4 w-4" />
                  <span className="sr-only">View details</span>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default PerformanceTable;
