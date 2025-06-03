
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import StatusBadge from './StatusBadge';
import PerformanceRating from './PerformanceRating';
import DossierActionButtons from './DossierActionButtons';

const DossierListCards = ({ 
  paginatedDossiers, 
  onView, 
  onUpload, 
  onSchedule, 
  onDelete, 
  isDeleting 
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {paginatedDossiers.map((dossier) => (
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
              <DossierActionButtons
                dossier={dossier}
                onView={onView}
                onUpload={onUpload}
                onSchedule={onSchedule}
                onDelete={onDelete}
                isDeleting={isDeleting}
                compact
              />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default DossierListCards;
