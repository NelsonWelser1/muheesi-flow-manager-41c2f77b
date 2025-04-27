
import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import CattleInventoryTable from './CattleInventoryTable';
import AddCattleDialog from './AddCattleDialog';
import EditCattleDialog from './EditCattleDialog';
import ImportCattleDialog from './ImportCattleDialog';
import ViewCattleDetailsDialog from './ViewCattleDetailsDialog';

const HerdManagement = () => {
  const [selectedTab, setSelectedTab] = useState("inventory");
  const [selectedCattleId, setSelectedCattleId] = useState(null);
  const [isViewDetailsOpen, setIsViewDetailsOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  
  const handleViewCattle = (cattleId) => {
    setSelectedCattleId(cattleId);
    setIsViewDetailsOpen(true);
  };
  
  const handleEditCattle = (cattleId) => {
    setSelectedCattleId(cattleId);
    setIsEditDialogOpen(true);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Herd Management</h1>
          <p className="text-muted-foreground">
            Manage your cattle inventory and track herd performance
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <AddCattleDialog />
          <ImportCattleDialog />
        </div>
      </div>
      
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className="grid grid-cols-1 md:grid-cols-2 h-auto mb-4">
          <TabsTrigger 
            value="inventory" 
            className="flex items-center gap-2 h-12 data-[state=active]:bg-white data-[state=active]:shadow-md transition-all duration-200"
          >
            Cattle Inventory
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="inventory" className="mt-0">
          <Card>
            <CardContent className="p-0 sm:p-6">
              <CattleInventoryTable 
                onViewCattle={handleViewCattle}
                onEditCattle={handleEditCattle}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Dialogs */}
      {selectedCattleId && (
        <>
          <ViewCattleDetailsDialog 
            open={isViewDetailsOpen}
            onOpenChange={setIsViewDetailsOpen}
            cattleId={selectedCattleId} 
          />
          
          <EditCattleDialog 
            open={isEditDialogOpen}
            onOpenChange={setIsEditDialogOpen}
            cattleId={selectedCattleId} 
          />
        </>
      )}
    </div>
  );
};

export default HerdManagement;
