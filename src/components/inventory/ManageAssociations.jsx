
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { FileText } from "lucide-react";
import AssociationDetails from './associations/AssociationDetails';
import AssociationOperations from './associations/AssociationOperations';
import AssociationAnalytics from './associations/AssociationAnalytics';
import ImageAnalysis from './farms/ImageAnalysis';
import AssociationMembersManagement from './associations/AssociationMembersManagement';
import AssociationCertifications from './associations/AssociationCertifications';
import AssociationTrainingHub from './associations/AssociationTrainingHub';
import AssociationsViewer from './associations/AssociationsViewer';

const ManageAssociations = ({
  isKazo
}) => {
  const { toast } = useToast();
  const [selectedAssociation, setSelectedAssociation] = useState(null);
  const [showAssociationRecords, setShowAssociationRecords] = useState(false);

  if (showAssociationRecords) {
    return <AssociationsViewer 
      onBack={() => setShowAssociationRecords(false)} 
      isKazo={isKazo} 
    />;
  }

  return <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-4">
        Manage Associations - {isKazo ? 'Kazo Coffee Development Project' : 'KAJON Coffee Limited'}
      </h2>

      <Tabs defaultValue="details" className="w-full">
        <TabsList className="w-full justify-start overflow-x-auto">
          <TabsTrigger value="details">Association Details</TabsTrigger>
          <TabsTrigger value="operations">Operations</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="members">Members</TabsTrigger>
          <TabsTrigger value="certifications">Certifications</TabsTrigger>
          <TabsTrigger value="training">Training Hub</TabsTrigger>
        </TabsList>

        <TabsContent value="details">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Association Registration Form</h3>
            <Button 
              size="sm" 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={() => setShowAssociationRecords(true)}
            >
              <FileText className="h-4 w-4" />
              View Associations
            </Button>
          </div>
          <AssociationDetails isKazo={isKazo} selectedAssociation={selectedAssociation} />
        </TabsContent>

        <TabsContent value="operations">
          <h3 className="text-lg font-semibold mb-4">Operations Form</h3>
          <AssociationOperations isKazo={isKazo} selectedAssociation={selectedAssociation} />
        </TabsContent>

        <TabsContent value="analytics">
          <h3 className="text-lg font-semibold mb-4">Analytics Dashboard</h3>
          <AssociationAnalytics isKazo={isKazo} selectedAssociation={selectedAssociation} />
        </TabsContent>

        <TabsContent value="members">
          <h3 className="text-lg font-semibold mb-4">Membership Management Form</h3>
          <AssociationMembersManagement isKazo={isKazo} selectedAssociation={selectedAssociation} />
        </TabsContent>

        <TabsContent value="certifications">
          <h3 className="text-lg font-semibold mb-4">Certifications Form</h3>
          <AssociationCertifications isKazo={isKazo} selectedAssociation={selectedAssociation} />
        </TabsContent>

        <TabsContent value="training">
          <h3 className="text-lg font-semibold mb-4">Training Hub Management</h3>
          <AssociationTrainingHub isKazo={isKazo} selectedAssociation={selectedAssociation} />
        </TabsContent>

        <TabsContent value="image-analysis">
          <ImageAnalysis isKazo={isKazo} selectedAssociation={selectedAssociation} />
        </TabsContent>
      </Tabs>
    </div>;
};

export default ManageAssociations;
