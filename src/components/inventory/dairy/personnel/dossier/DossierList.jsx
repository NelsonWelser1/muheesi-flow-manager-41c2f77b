
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Upload, Calendar, FileText, Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { showSuccessToast, showErrorToast } from "@/components/ui/notifications";
import { useEmployeeDossiers } from './hooks/useEmployeeDossiers';

const DossierList = ({ dossiers, viewMode, onView, onUpload, onSchedule }) => {
  const { toast } = useToast();
  const { deleteDossier, isDeleting } = useEmployeeDossiers();

  const handleDelete = (id, employeeId) => {
    if (window.confirm(`Are you sure you want to delete the dossier for ${employeeId}?`)) {
      deleteDossier(id);
    }
  };

  if (dossiers.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <FileText className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-medium mb-2">No Employee Dossiers</h3>
          <p className="text-gray-500 mb-4">There are no employee dossiers yet. Create your first one!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {viewMode === 'list' ? (
        <div className="overflow-hidden rounded-md border">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="font-medium p-3 text-left">Employee</th>
                <th className="font-medium p-3 text-left hidden md:table-cell">Job Title</th>
                <th className="font-medium p-3 text-left hidden md:table-cell">Department</th>
                <th className="font-medium p-3 text-left hidden lg:table-cell">Status</th>
                <th className="font-medium p-3 text-left hidden lg:table-cell">Performance</th>
                <th className="font-medium p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {dossiers.map((dossier) => (
                <tr key={dossier.id} className="border-t hover:bg-muted/50">
                  <td className="p-3 font-medium">{dossier.employee_id}</td>
                  <td className="p-3 hidden md:table-cell">{dossier.job_title || '-'}</td>
                  <td className="p-3 hidden md:table-cell">{dossier.department || '-'}</td>
                  <td className="p-3 hidden lg:table-cell">
                    <StatusBadge status={dossier.status} />
                  </td>
                  <td className="p-3 hidden lg:table-cell">
                    <PerformanceRating rating={dossier.performance_rating} />
                  </td>
                  <td className="p-3">
                    <div className="flex items-center justify-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onView(dossier)}
                        title="View details"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onUpload(dossier)}
                        title="Upload documents"
                      >
                        <Upload className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onSchedule(dossier)}
                        title="Schedule task"
                      >
                        <Calendar className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(dossier.id, dossier.employee_id)}
                        title="Delete dossier"
                        disabled={isDeleting}
                        className="text-red-500 hover:text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {dossiers.map((dossier) => (
            <Card key={dossier.id} className="overflow-hidden hover:shadow-md transition-shadow">
              <CardContent className="p-0">
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium truncate">{dossier.employee_id}</h3>
                    <StatusBadge status={dossier.status} />
                  </div>
                  <div className="text-sm text-gray-500 mb-4">
                    <p>{dossier.job_title || 'No Title'}</p>
                    <p>{dossier.department || 'No Department'}</p>
                  </div>
                  <PerformanceRating rating={dossier.performance_rating} showText />
                </div>
                <div className="border-t p-2 flex items-center justify-between bg-gray-50">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onView(dossier)}
                    className="flex items-center gap-1"
                  >
                    <Eye className="h-3.5 w-3.5" /> View
                  </Button>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onUpload(dossier)}
                      title="Upload documents"
                    >
                      <Upload className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onSchedule(dossier)}
                      title="Schedule task"
                    >
                      <Calendar className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(dossier.id, dossier.employee_id)}
                      title="Delete dossier"
                      disabled={isDeleting}
                      className="text-red-500 hover:text-red-600"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

const StatusBadge = ({ status }) => {
  const getVariant = (status) => {
    switch (status) {
      case 'Active':
        return 'success';
      case 'Onboarding':
        return 'info';
      case 'On Leave':
        return 'warning';
      case 'Terminated':
        return 'destructive';
      case 'Retired':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  if (!status) return <Badge variant="outline">Unknown</Badge>;
  
  return <Badge variant={getVariant(status)}>{status}</Badge>;
};

const PerformanceRating = ({ rating, showText = false }) => {
  const getRatingColor = (rating) => {
    if (!rating) return 'bg-gray-200';
    if (rating >= 4) return 'bg-green-500';
    if (rating >= 3) return 'bg-blue-500';
    if (rating >= 2) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  if (!rating) return <span className="text-gray-400">Not rated</span>;

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <div 
            key={star} 
            className={`h-2 w-2 rounded-full ${star <= rating ? getRatingColor(rating) : 'bg-gray-200'}`} 
          />
        ))}
      </div>
      {showText && <span className="text-sm text-gray-600">{rating}/5</span>}
    </div>
  );
};

export default DossierList;
