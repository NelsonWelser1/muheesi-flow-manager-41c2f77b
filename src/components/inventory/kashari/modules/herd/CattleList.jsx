
import React from 'react';
import { Card } from "@/components/ui/card";
import { useCattleInventory } from '@/hooks/useCattleInventory';
import { Button } from '@/components/ui/button';
import { Edit2, Trash2, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { useToast } from '@/components/ui/use-toast';

const CattleList = () => {
  const {
    cattleList,
    isLoading,
    error,
    deleteCattle,
    updateCattle
  } = useCattleInventory('kashari');
  
  const { toast } = useToast();

  // Calculate age from date of birth
  const calculateAge = dateOfBirth => {
    if (!dateOfBirth) return 'N/A';
    const birthDate = new Date(dateOfBirth);
    const today = new Date();

    // Calculate years
    let years = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    // Adjust years if birth month hasn't occurred yet this year
    if (monthDiff < 0 || monthDiff === 0 && today.getDate() < birthDate.getDate()) {
      years--;
    }
    return years > 0 ? `${years} year${years > 1 ? 's' : ''}` : '< 1 year';
  };

  // Handle health status change
  const handleHealthChange = async (cattleId, newStatus) => {
    try {
      await updateCattle.mutateAsync({
        id: cattleId,
        health_status: newStatus
      });
      
      toast({
        title: "Status Updated",
        description: `Cattle health status updated to ${newStatus}`,
      });
    } catch (error) {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update status",
        variant: "destructive"
      });
    }
  };

  // Get status style based on health status
  const getStatusStyle = (status) => {
    switch(status) {
      case 'good':
        return 'bg-green-100 text-green-800';
      case 'fair':
        return 'bg-blue-100 text-blue-800';
      case 'bad':
        return 'bg-orange-100 text-orange-800';
      case 'sick':
        return 'bg-red-100 text-red-800';
      case 'recovering':
        return 'bg-purple-100 text-purple-800';
      case 'sold':
        return 'bg-indigo-100 text-indigo-800';
      case 'died':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return <Card className="p-6">
        <div className="flex justify-center items-center h-40">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Loading cattle data...</span>
        </div>
      </Card>;
  }
  
  if (error) {
    return <Card className="p-6">
        <div className="text-center p-4 text-red-500">
          <p>Error loading cattle data</p>
          <p className="text-sm">{error.message}</p>
        </div>
      </Card>;
  }
  
  return <Card className="p-6">
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
            {cattleList && cattleList.length > 0 ? cattleList.map(cattle => <tr key={cattle.id} className="border-t hover:bg-muted/30">
                  <td className="p-3">{cattle.tag_number}</td>
                  <td className="p-3">{cattle.name || 'Unnamed'}</td>
                  <td className="p-3">{cattle.type}</td>
                  <td className="p-3">{cattle.breed}</td>
                  <td className="p-3">{calculateAge(cattle.date_of_birth)}</td>
                  <td className="p-3">
                    <Select 
                      defaultValue={cattle.health_status || 'good'}
                      onValueChange={(value) => handleHealthChange(cattle.id, value)}
                    >
                      <SelectTrigger className={`h-8 w-32 ${getStatusStyle(cattle.health_status)}`}>
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="good">Good</SelectItem>
                        <SelectItem value="fair">Fair</SelectItem>
                        <SelectItem value="bad">Bad</SelectItem>
                        <SelectItem value="sick">Sick</SelectItem>
                        <SelectItem value="recovering">Recovering</SelectItem>
                        <SelectItem value="sold">Sold</SelectItem>
                        <SelectItem value="died">Died</SelectItem>
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="p-3 flex gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600">
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    
                  </td>
                </tr>) : <tr className="border-t">
                <td className="p-3" colSpan="7">
                  <p className="text-center text-muted-foreground">No cattle records found</p>
                </td>
              </tr>}
          </tbody>
        </table>
      </div>
      {cattleList && cattleList.length > 0 && <div className="mt-4 text-sm text-muted-foreground">
          Showing {cattleList.length} cattle record{cattleList.length !== 1 ? 's' : ''}
        </div>}
    </Card>;
};
export default CattleList;
