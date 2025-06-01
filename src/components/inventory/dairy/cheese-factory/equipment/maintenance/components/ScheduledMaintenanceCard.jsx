
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Check, Clock, AlertTriangle } from "lucide-react";

const ScheduledMaintenanceCard = ({ 
  paginatedMaintenanceData, 
  filteredMaintenanceData, 
  currentPage, 
  totalPages, 
  startIndex, 
  endIndex, 
  totalItems, 
  onPageChange 
}) => {
  const getStatusBadge = (status) => {
    const config = {
      operational: { color: 'bg-green-100 text-green-800', icon: <Check className="h-4 w-4" /> },
      maintenance: { color: 'bg-yellow-100 text-yellow-800', icon: <Clock className="h-4 w-4" /> },
      critical: { color: 'bg-red-100 text-red-800', icon: <AlertTriangle className="h-4 w-4" /> },
      completed: { color: 'bg-blue-100 text-blue-800', icon: <Check className="h-4 w-4" /> }
    };

    const defaultConfig = { color: 'bg-gray-100 text-gray-800', icon: <Clock className="h-4 w-4" /> };
    return config[status] || defaultConfig;
  };

  return (
    <Card className="lg:col-span-1">
      <CardHeader>
        <CardTitle>Scheduled Maintenance</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {paginatedMaintenanceData.map((task) => (
            <div
              key={task.id}
              className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow whitespace-nowrap overflow-hidden"
            >
              <div className="flex-1 min-w-0">
                <h4 className="font-medium truncate">{task.equipment_name}</h4>
                <p className="text-sm text-muted-foreground truncate">
                  {new Date(task.next_maintenance).toLocaleDateString()}
                </p>
                {task.notes && (
                  <p className="text-sm text-muted-foreground mt-1 truncate">
                    {task.notes}
                  </p>
                )}
              </div>
              <Badge className={getStatusBadge(task.status).color}>
                <span className="flex items-center gap-1 whitespace-nowrap">
                  {getStatusBadge(task.status).icon}
                  {task.status}
                </span>
              </Badge>
            </div>
          ))}

          {filteredMaintenanceData.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No maintenance tasks scheduled</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6 flex justify-between items-center">
            <div className="text-sm text-muted-foreground">
              Showing {startIndex + 1} to {Math.min(endIndex, totalItems)} of {totalItems} results
            </div>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                    className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                  />
                </PaginationItem>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      onClick={() => onPageChange(page)}
                      isActive={currentPage === page}
                      className="cursor-pointer"
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                    className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ScheduledMaintenanceCard;
