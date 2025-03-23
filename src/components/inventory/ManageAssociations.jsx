import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import AssociationDetails from './associations/AssociationDetails';
import AssociationOperations from './associations/AssociationOperations';
import AssociationAnalytics from './associations/AssociationAnalytics';
import ImageAnalysis from './farms/ImageAnalysis';
import AssociationMembersManagement from './associations/AssociationMembersManagement';
import AssociationCertifications from './associations/AssociationCertifications';
import AssociationTrainingHub from './associations/AssociationTrainingHub';
const ManageAssociations = ({
  isKazo
}) => {
  const {
    toast
  } = useToast();
  const [selectedAssociation, setSelectedAssociation] = useState(null);
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
          <AssociationDetails isKazo={isKazo} selectedAssociation={selectedAssociation} />
        </TabsContent>

        <TabsContent value="operations">
          <AssociationOperations isKazo={isKazo} selectedAssociation={selectedAssociation} />
        </TabsContent>

        <TabsContent value="analytics">
          <AssociationAnalytics isKazo={isKazo} selectedAssociation={selectedAssociation} />
        </TabsContent>

        <TabsContent value="members">
          <AssociationMembersManagement isKazo={isKazo} selectedAssociation={selectedAssociation} />
        </TabsContent>

        <TabsContent value="certifications">
          <AssociationCertifications isKazo={isKazo} selectedAssociation={selectedAssociation} />
        </TabsContent>

        <TabsContent value="training">
          <AssociationTrainingHub isKazo={isKazo} selectedAssociation={selectedAssociation} />
        </TabsContent>

        <TabsContent value="image-analysis">
          <ImageAnalysis isKazo={isKazo} selectedAssociation={selectedAssociation} />
        </TabsContent>
      </Tabs>
    </div>;
};
export default ManageAssociations;