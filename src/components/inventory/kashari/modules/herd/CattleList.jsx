
import React from 'react';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCattleInventory } from '@/hooks/useCattleInventory';
import { Loader2, RefreshCw, Eye, Pencil, Trash } from 'lucide-react';

const CattleList = () => {
  const { cattleList, isLoading, error, refetch, deleteCattle } = useCattleInventory('kashari');

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this cattle record?")) {
      await deleteCattle.mutateAsync(id);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return format(new Date(dateString), 'dd/MM/yyyy');
    } catch (error) {
      return "Invalid date";
    }
  };

  const getHealthStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'excellent': return 'bg-green-100 text-green-800';
      case 'good': return 'bg-green-50 text-green-600';
      case 'fair': return 'bg-yellow-100 text-yellow-800';
      case 'poor': return 'bg-orange-100 text-orange-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl">Cattle Inventory</CardTitle>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => refetch()}
          disabled={isLoading}
          className="flex items-center gap-1"
        >
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
          {isLoading ? 'Loading...' : 'Refresh'}
        </Button>
      </CardHeader>
      <CardContent>
        {error ? (
          <div className="text-center p-4 text-red-500">
            Error loading cattle inventory: {error.message}
          </div>
        ) : isLoading ? (
          <div className="flex justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : cattleList?.length === 0 ? (
          <div className="text-center p-8 text-muted-foreground">
            No cattle records found. Add your first cattle using the registration form.
          </div>
        ) : (
          <div className="rounded-md border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="p-3 text-left font-medium">Tag #</th>
                    <th className="p-3 text-left font-medium">Name</th>
                    <th className="p-3 text-left font-medium">Type</th>
                    <th className="p-3 text-left font-medium">Breed</th>
                    <th className="p-3 text-left font-medium">Birth Date</th>
                    <th className="p-3 text-left font-medium">Weight (kg)</th>
                    <th className="p-3 text-left font-medium">Health</th>
                    <th className="p-3 text-left font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {cattleList?.map((cattle) => (
                    <tr key={cattle.id} className="border-t hover:bg-muted/50">
                      <td className="p-3 font-medium">{cattle.tag_number}</td>
                      <td className="p-3">{cattle.name || "-"}</td>
                      <td className="p-3">{cattle.type}</td>
                      <td className="p-3">{cattle.breed}</td>
                      <td className="p-3">{formatDate(cattle.date_of_birth)}</td>
                      <td className="p-3">{cattle.weight || "-"}</td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getHealthStatusColor(cattle.health_status)}`}>
                          {cattle.health_status || "Unknown"}
                        </span>
                      </td>
                      <td className="p-3">
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Eye className="h-4 w-4" />
                            <span className="sr-only">View</span>
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Pencil className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
                            onClick={() => handleDelete(cattle.id)}
                            disabled={deleteCattle.isPending}
                          >
                            {deleteCattle.isPending && deleteCattle.variables === cattle.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash className="h-4 w-4" />
                            )}
                            <span className="sr-only">Delete</span>
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CattleList;
