import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Coffee, Globe } from "lucide-react";
import StockUpdateForm from './kajon/StockUpdateForm';
import StockSummary from './kajon/StockSummary';
import ViewCurrentStock from './ViewCurrentStock';
import MakeReports from './MakeReports';
import ManageFarms from './ManageFarms';
import ManageAssociations from './ManageAssociations';
import MakeRequisitions from './MakeRequisitions';
import KazoCoffeeProject from './kajon/KazoCoffeeProject';
import StockOperations from './stock-operations/StockOperations';
import CoffeeExportDashboard from './kajon/export-business/CoffeeExportDashboard';

const KAJONCoffeeLimited = () => {
  const { toast } = useToast();
  const [selectedInterface, setSelectedInterface] = useState(null);
  const [currentStock, setCurrentStock] = useState(null);
  const [selectedAction, setSelectedAction] = useState(null);
  const [verificationStep, setVerificationStep] = useState(false);
  const [pin, setPin] = useState('');
  const [selectedSystem, setSelectedSystem] = useState(null);
  
  const handleBack = () => {
    if (selectedSystem) {
      setSelectedSystem(null);
    } else {
      setSelectedInterface(null);
      setSelectedAction(null);
      setVerificationStep(false);
      setPin('');
    }
  };

  if (!selectedInterface) {
    return (
      <Card>
        <CardContent className="space-y-4 pt-6">
          <Button 
            variant="outline" 
            className="w-full justify-start text-left h-auto py-4 text-lg font-semibold"
            onClick={() => setSelectedInterface('kajon')}
          >
            Update KAJON Coffee Limited Stock
          </Button>
          <Button 
            variant="outline" 
            className="w-full justify-start text-left h-auto py-4 text-lg font-semibold"
            onClick={() => setSelectedInterface('kazo')}
          >
            Update Kazo Coffee Development Project Stock
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (selectedInterface === 'kajon' && !selectedSystem) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">KAJON Coffee Limited Management System</h2>
              <Button variant="ghost" onClick={handleBack} className="p-2">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button
                variant="outline"
                className="h-32 flex flex-col items-center justify-center space-y-2"
                onClick={() => setSelectedSystem('coffee-management')}
              >
                <Coffee className="h-8 w-8" />
                <span className="text-lg font-semibold">Coffee Management System</span>
              </Button>
              <Button
                variant="outline"
                className="h-32 flex flex-col items-center justify-center space-y-2"
                onClick={() => setSelectedSystem('export-management')}
              >
                <Globe className="h-8 w-8" />
                <span className="text-lg font-semibold">KAJON Coffee Export Management</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">
              {selectedInterface === 'kajon' ? 
                selectedSystem === 'coffee-management' ? 
                  'Coffee Management System' : 
                  'KAJON Coffee Export Management' 
                : 'Kazo Coffee Development Project'}
            </h2>
            <Button variant="ghost" onClick={handleBack} className="p-2">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </div>

          {selectedInterface === 'kajon' ? (
            selectedSystem === 'coffee-management' ? (
              <Tabs defaultValue="update-stock" className="w-full">
                <TabsList className="w-full justify-start overflow-x-auto flex-nowrap md:flex-wrap">
                  <TabsTrigger value="update-stock" className="whitespace-nowrap">Update Stock</TabsTrigger>
                  <TabsTrigger value="view-stock" className="whitespace-nowrap">View Stock</TabsTrigger>
                  <TabsTrigger value="reports" className="whitespace-nowrap">Reports</TabsTrigger>
                  <TabsTrigger value="farms" className="whitespace-nowrap">Farms</TabsTrigger>
                  <TabsTrigger value="associations" className="whitespace-nowrap">Associations</TabsTrigger>
                  <TabsTrigger value="requisitions" className="whitespace-nowrap">Requisitions</TabsTrigger>
                </TabsList>

                <TabsContent value="update-stock">
                  <StockOperations isKazo={false} />
                </TabsContent>

                <TabsContent value="view-stock">
                  <ViewCurrentStock />
                </TabsContent>

                <TabsContent value="reports">
                  <MakeReports />
                </TabsContent>

                <TabsContent value="farms">
                  <ManageFarms />
                </TabsContent>

                <TabsContent value="associations">
                  <ManageAssociations />
                </TabsContent>

                <TabsContent value="requisitions">
                  <MakeRequisitions />
                </TabsContent>
              </Tabs>
            ) : (
              <CoffeeExportDashboard />
            )
          ) : (
            <KazoCoffeeProject />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default KAJONCoffeeLimited;
