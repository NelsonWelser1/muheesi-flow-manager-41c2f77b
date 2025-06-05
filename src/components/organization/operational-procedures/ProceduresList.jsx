
import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Eye, Edit, Download, MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const ProceduresList = ({ 
  procedures, 
  onSelectProcedure, 
  getStatusBadge, 
  getPriorityBadge 
}) => {
  if (procedures.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No procedures found matching your criteria.
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Procedure</TableHead>
            <TableHead>Department</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Version</TableHead>
            <TableHead>Compliance</TableHead>
            <TableHead>Last Updated</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {procedures.map((procedure) => (
            <TableRow key={procedure.id}>
              <TableCell>
                <div>
                  <p className="font-medium">{procedure.title}</p>
                  <p className="text-sm text-gray-500">{procedure.description}</p>
                  <p className="text-xs text-gray-400">{procedure.steps} steps</p>
                </div>
              </TableCell>
              <TableCell>{procedure.department}</TableCell>
              <TableCell>{getStatusBadge(procedure.status)}</TableCell>
              <TableCell>{getPriorityBadge(procedure.priority)}</TableCell>
              <TableCell>
                <span className="font-mono text-sm">v{procedure.version}</span>
              </TableCell>
              <TableCell>
                <div className="space-y-1">
                  <Progress value={procedure.compliance} className="w-20" />
                  <span className="text-xs text-gray-500">{procedure.compliance}%</span>
                </div>
              </TableCell>
              <TableCell>
                <div>
                  <p className="text-sm">{procedure.lastUpdated}</p>
                  <p className="text-xs text-gray-500">{procedure.responsible}</p>
                </div>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onSelectProcedure(procedure)}>
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Download className="h-4 w-4 mr-2" />
                      Download PDF
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ProceduresList;
