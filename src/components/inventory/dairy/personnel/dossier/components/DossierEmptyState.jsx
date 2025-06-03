
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { FileText } from "lucide-react";
import DossierHeader from './DossierHeader';

const DossierEmptyState = ({ dossiers }) => {
  return (
    <Card>
      <DossierHeader dossiers={dossiers} />
      <CardContent className="p-6 text-center">
        <FileText className="h-12 w-12 mx-auto mb-4 text-gray-400" />
        <h3 className="text-lg font-medium mb-2">No Employee Dossiers</h3>
        <p className="text-gray-500 mb-4">There are no employee dossiers yet. Create your first one!</p>
      </CardContent>
    </Card>
  );
};

export default DossierEmptyState;
