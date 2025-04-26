
import React, { useState } from 'react';
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableHead, 
  TableRow, 
  TableCell 
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Edit, Trash2, MoreHorizontal, Search } from "lucide-react";
import { useCattleInventory } from '@/hooks/useCattleInventory';
import { useToast } from "@/components/ui/use-toast";

const CattleTable = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { cattleList, isLoading, deleteCattle } = useCattleInventory('kashari');
  const { toast } = useToast();

  // Calculate age from date of birth
  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return 'N/A';
    
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    
    // Calculate years
    let years = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    // Adjust years if birth month hasn't occurred yet this year
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      years--;
    }
    
    return years > 0 ? `${years} year${years > 1 ? 's' : ''}` : '< 1 year';
  };

  // Filter cattle list based on search term
  const filteredCattle = cattleList?.filter(cattle => 
    cattle.tag_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cattle.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cattle.breed?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cattle.type?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  // Handle delete cattle
  const handleDelete = async (id) => {
    try {
      await deleteCattle.mutateAsync(id);
      toast({
        title: "Success",
        description: "Cattle deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting cattle:", error);
      toast({
        title: "Error",
        description: "Failed to delete cattle",
        variant: "destructive",
      });
    }
  };

  // Health status badge color
  const getHealthStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'excellent': return 'bg-green-500 hover:bg-green-600';
      case 'good': return 'bg-blue-500 hover:bg-blue-600';
      case 'fair': return 'bg-yellow-500 hover:bg-yellow-600';
      case 'poor': return 'bg-orange-500 hover:bg-orange-600';
      case 'critical': return 'bg-red-500 hover:bg-red-600';
      default: return 'bg-gray-500 hover:bg-gray-600';
    }
  };

  return (
    <div className="bg-white rounded-md shadow">
      <div className="p-4 flex items-center justify-between">
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search cattle..." 
            className="pl-9 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div>
          <span className="text-sm text-muted-foreground">
            Total: <strong>{filteredCattle.length}</strong> cattle
          </span>
        </div>
      </div>
      
      <div className="border-t overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tag Number</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Breed</TableHead>
              <TableHead>Age</TableHead>
              <TableHead>Weight (kg)</TableHead>
              <TableHead>Health Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  Loading cattle data...
                </TableCell>
              </TableRow>
            ) : filteredCattle.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  {searchTerm ? "No cattle matching your search" : "No cattle records found"}
                </TableCell>
              </TableRow>
            ) : (
              filteredCattle.map((cattle) => (
                <TableRow key={cattle.id}>
                  <TableCell className="font-medium">{cattle.tag_number}</TableCell>
                  <TableCell>{cattle.name || '-'}</TableCell>
                  <TableCell>{cattle.type}</TableCell>
                  <TableCell>{cattle.breed}</TableCell>
                  <TableCell>{calculateAge(cattle.date_of_birth)}</TableCell>
                  <TableCell>{cattle.weight || '-'}</TableCell>
                  <TableCell>
                    <Badge className={`${getHealthStatusColor(cattle.health_status)} text-white`}>
                      {cattle.health_status?.charAt(0).toUpperCase() + cattle.health_status?.slice(1) || 'Unknown'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="cursor-pointer">
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="cursor-pointer text-red-600 focus:text-red-600" 
                          onClick={() => handleDelete(cattle.id)}
                          disabled={deleteCattle.isPending}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default CattleTable;
