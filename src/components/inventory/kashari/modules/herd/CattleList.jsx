
import React from 'react';
import { Card } from "@/components/ui/card";
import { useCattleInventory } from '@/hooks/useCattleInventory';
import { Button } from '@/components/ui/button';
import { Edit2, Trash2, Loader2 } from 'lucide-react';
import { format } from 'date-fns';

const CattleList = () => {
  const { cattleList, isLoading, error, deleteCattle } = useCattleInventory('kashari');

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

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="flex justify-center items-center h-40">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Loading cattle data...</span>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-6">
        <div className="text-center p-4 text-red-500">
          <p>Error loading cattle data</p>
          <p className="text-sm">{error.message}</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h3 className="text-lg font-medium mb-4">Cattle List</h3>
      <div className="rounded-md border overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="p-3 text-left font-medium">Tag #</th>
              <th className="p-3 text-left font-medium">Name</th>
              <th className="p-3 text-left font-medium">Type</th>
              <th className="p-3 text-left font-medium">Breed</th>
              <th className="p-3 text-left font-medium">Age</th>
              <th className="p-3 text-left font-medium">Status</th>
              <th className="p-3 text-left font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {cattleList && cattleList.length > 0 ? (
              cattleList.map((cattle) => (
                <tr key={cattle.id} className="border-t hover:bg-muted/30">
                  <td className="p-3">{cattle.tag_number}</td>
                  <td className="p-3">{cattle.name || 'Unnamed'}</td>
                  <td className="p-3">{cattle.type}</td>
                  <td className="p-3">{cattle.breed}</td>
                  <td className="p-3">{calculateAge(cattle.date_of_birth)}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      cattle.health_status === 'excellent' ? 'bg-green-100 text-green-800' :
                      cattle.health_status === 'good' ? 'bg-blue-100 text-blue-800' :
                      cattle.health_status === 'fair' ? 'bg-yellow-100 text-yellow-800' :
                      cattle.health_status === 'poor' ? 'bg-orange-100 text-orange-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {cattle.health_status?.charAt(0).toUpperCase() + cattle.health_status?.slice(1) || 'Unknown'}
                    </span>
                  </td>
                  <td className="p-3 flex gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="h-8 w-8 text-blue-600"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="h-8 w-8 text-red-600"
                      onClick={() => deleteCattle.mutate(cattle.id)}
                      disabled={deleteCattle.isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr className="border-t">
                <td className="p-3" colSpan="7">
                  <p className="text-center text-muted-foreground">No cattle records found</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {cattleList && cattleList.length > 0 && (
        <div className="mt-4 text-sm text-muted-foreground">
          Showing {cattleList.length} cattle record{cattleList.length !== 1 ? 's' : ''}
        </div>
      )}
    </Card>
  );
};

export default CattleList;
