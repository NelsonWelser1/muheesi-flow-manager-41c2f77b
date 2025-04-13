
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { format } from 'date-fns';
import { Search, Filter, Edit, Trash2, Eye, MoreHorizontal } from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

const CattleInventoryTable = ({ cattleData, onViewDetails, onEdit, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  const filteredData = cattleData.filter(cattle => {
    // Filter by search term
    const searchMatch = 
      cattle.tagNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cattle.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cattle.breed?.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filter by type
    const typeMatch = filterType === 'all' || cattle.type === filterType;
    
    return searchMatch && typeMatch;
  });

  const getHealthStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'excellent': return 'bg-green-500';
      case 'good': return 'bg-green-400';
      case 'fair': return 'bg-yellow-400';
      case 'poor': return 'bg-orange-500';
      case 'critical': return 'bg-red-500';
      default: return 'bg-gray-400';
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">Cattle Inventory</CardTitle>
        <div className="flex flex-col sm:flex-row gap-2 mt-2">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by tag, name or breed"
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <select 
              className="border rounded px-2 py-2 text-sm" 
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="all">All Types</option>
              <option value="Dairy Cow">Dairy Cows</option>
              <option value="Bull">Bulls</option>
              <option value="Heifer">Heifers</option>
              <option value="Calf">Calves</option>
              <option value="Steer">Steers</option>
            </select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {filteredData.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tag No.</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Breed</TableHead>
                  <TableHead>Age/DOB</TableHead>
                  <TableHead>Weight (kg)</TableHead>
                  <TableHead>Health</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.map((cattle) => (
                  <TableRow key={cattle.id}>
                    <TableCell className="font-medium">{cattle.tagNumber}</TableCell>
                    <TableCell>{cattle.name || '-'}</TableCell>
                    <TableCell>{cattle.type}</TableCell>
                    <TableCell>{cattle.breed}</TableCell>
                    <TableCell>
                      {cattle.dateOfBirth 
                        ? format(new Date(cattle.dateOfBirth), 'dd/MM/yyyy')
                        : '-'}
                    </TableCell>
                    <TableCell>{cattle.weight || '-'}</TableCell>
                    <TableCell>
                      {cattle.healthStatus && (
                        <Badge 
                          variant="outline" 
                          className={`${getHealthStatusColor(cattle.healthStatus)} text-white`}
                        >
                          {cattle.healthStatus}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => onViewDetails(cattle.id)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onEdit(cattle.id)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onDelete(cattle.id)}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            {searchTerm || filterType !== 'all' 
              ? "No matching cattle records found. Try adjusting your search or filters."
              : "No cattle records found. Start by registering new cattle."}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CattleInventoryTable;
