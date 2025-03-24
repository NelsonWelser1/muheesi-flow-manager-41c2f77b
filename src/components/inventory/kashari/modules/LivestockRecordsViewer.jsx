
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, RefreshCw, Search, FileDown, Pencil, Trash2 } from "lucide-react";
import { useLivestockManagement } from '@/hooks/useLivestockManagement';
import { format } from 'date-fns';
import { useToast } from "@/components/ui/use-toast";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { showInfoToast, showErrorToast, showSuccessToast } from "@/components/ui/notifications";

const LivestockRecordsViewer = ({ onBack, isKazo, associationId }) => {
  const { toast } = useToast();
  const {
    livestockRecords,
    loading,
    error,
    filterStatus,
    searchTerm,
    setFilterStatus,
    setSearchTerm,
    fetchAllLivestockRecords,
    deleteLivestockRecord
  } = useLivestockManagement(associationId);

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState(null);
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  // Handle refresh
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchAllLivestockRecords({
      status: filterStatus,
      searchTerm: searchTerm
    });
    setIsRefreshing(false);
    
    showInfoToast(toast, "Livestock records have been refreshed");
  };

  // Handle delete confirmation
  const confirmDelete = (record) => {
    setRecordToDelete(record);
    setIsAlertOpen(true);
  };

  // Handle actual deletion
  const handleDelete = async () => {
    if (!recordToDelete) return;
    
    try {
      const result = await deleteLivestockRecord(recordToDelete.id);
      
      if (result.success) {
        showSuccessToast(toast, result.message || "Record deleted successfully");
      } else {
        showErrorToast(toast, result.message || "Failed to delete record");
      }
    } catch (err) {
      console.error('Error deleting record:', err);
      showErrorToast(toast, err.message || "Failed to delete record");
    } finally {
      setIsAlertOpen(false);
      setRecordToDelete(null);
    }
  };

  // Handle export to CSV
  const handleExportCSV = () => {
    if (livestockRecords.length === 0) {
      showErrorToast(toast, "There are no records to export");
      return;
    }

    try {
      // Prepare CSV header
      const headers = [
        'ID',
        'Association',
        'Livestock Type',
        'Quantity',
        'Health Status',
        'Feeding Schedule',
        'Breeding Program',
        'Vaccination Date',
        'Notes',
        'Status',
        'Created',
        'Updated'
      ].join(',');

      // Prepare CSV rows
      const rows = livestockRecords.map(record => [
        record.id,
        associationId,
        record.livestock_type || '',
        record.quantity || 0,
        `"${record.health_status || ''}"`,
        `"${record.feeding_schedule || ''}"`,
        `"${record.breeding_program || ''}"`,
        record.vaccination_date ? format(new Date(record.vaccination_date), 'yyyy-MM-dd') : '',
        `"${record.notes || ''}"`,
        record.status || 'active',
        record.created_at ? format(new Date(record.created_at), 'yyyy-MM-dd HH:mm') : '',
        record.updated_at ? format(new Date(record.updated_at), 'yyyy-MM-dd HH:mm') : ''
      ].join(','));

      // Combine header and rows
      const csv = [headers, ...rows].join('\n');

      // Create a blob and download
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `livestock_export_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      showInfoToast(toast, "Livestock data exported as CSV");
    } catch (error) {
      console.error('Error exporting to CSV:', error);
      showErrorToast(toast, "Failed to export livestock data");
    }
  };

  // Format livestock type for display
  const formatLivestockType = (type) => {
    if (!type) return '-';
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  // Get appropriate badge class based on health status
  const getHealthStatusBadgeClass = (status) => {
    if (!status) return 'bg-gray-100 text-gray-800';
    
    switch (status) {
      case 'excellent':
        return 'bg-green-100 text-green-800';
      case 'good':
        return 'bg-blue-100 text-blue-800';
      case 'fair':
        return 'bg-yellow-100 text-yellow-800';
      case 'poor':
        return 'bg-orange-100 text-orange-800';
      case 'critical':
        return 'bg-red-100 text-red-800';
      case 'under_treatment':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Format health status for display
  const formatHealthStatus = (status) => {
    if (!status) return '-';
    return status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-6">
          <div className="flex justify-between items-center mb-4">
            <Button 
              variant="outline" 
              onClick={onBack}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <h3 className="text-lg font-semibold">Livestock Records</h3>
            <div className="flex items-center gap-2">
              <Button 
                size="sm" 
                variant="outline" 
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="flex items-center gap-2"
              >
                <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={handleExportCSV}
                className="flex items-center gap-2"
              >
                <FileDown className="h-4 w-4" />
                Export CSV
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <Select 
                value={filterStatus} 
                onValueChange={setFilterStatus}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="sold">Sold</SelectItem>
                  <SelectItem value="deceased">Deceased</SelectItem>
                  <SelectItem value="transferred">Transferred</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="relative">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search livestock..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Loading livestock records...</p>
            </div>
          ) : livestockRecords.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-md">
              <p className="text-gray-500">No livestock records found</p>
              <p className="text-gray-400 text-sm mt-1">
                {searchTerm || filterStatus !== 'all' 
                  ? "Try adjusting your filters" 
                  : "Add a livestock record to see it here"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b">
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Health</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Feeding</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Breeding</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vaccination</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {livestockRecords.map((record) => (
                    <tr key={record.id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-2">{formatLivestockType(record.livestock_type)}</td>
                      <td className="px-4 py-2">{record.quantity || 0}</td>
                      <td className="px-4 py-2">
                        <span className={`px-2 py-1 text-xs rounded-full ${getHealthStatusBadgeClass(record.health_status)}`}>
                          {formatHealthStatus(record.health_status) || '-'}
                        </span>
                      </td>
                      <td className="px-4 py-2">{record.feeding_schedule || '-'}</td>
                      <td className="px-4 py-2">{record.breeding_program || '-'}</td>
                      <td className="px-4 py-2">
                        {record.vaccination_date 
                          ? format(new Date(record.vaccination_date), 'yyyy-MM-dd') 
                          : '-'}
                      </td>
                      <td className="px-4 py-2">
                        <div className="flex space-x-2">
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="h-8 w-8 p-0"
                            onClick={() => confirmDelete(record)}
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </CardContent>

      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the livestock record and cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};

export default LivestockRecordsViewer;
