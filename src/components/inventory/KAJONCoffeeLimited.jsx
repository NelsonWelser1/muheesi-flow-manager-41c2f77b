import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Coffee, Globe, Factory } from 'lucide-react';
import StockOperations from './stock-operations/StockOperations';
import ViewCurrentStock from './ViewCurrentStock';
import MakeReports from './MakeReports';
import ManageFarms from './ManageFarms';
import ManageAssociations from './ManageAssociations';
import MakeRequisitions from './MakeRequisitions';
import KazoCoffeeProject from './kajon/KazoCoffeeProject';
import CoffeeExportDashboard from './kajon/export-business/CoffeeExportDashboard';
import HullingGrading from './kajon/export-business/HullingGrading';
const KAJONCoffeeLimited = () => {
  const {
    toast
  } = useToast();
  const [selectedInterface, setSelectedInterface] = useState(null);
  const [selectedSystem, setSelectedSystem] = useState(null);
  const handleBack = () => {
    if (selectedSystem) {
      setSelectedSystem(null);
    } else {
      setSelectedInterface(null);
    }
  };
  if (!selectedInterface) {
    return <Card>
        <CardContent className="space-y-4 pt-6">
          <Button variant="outline" onClick={() => setSelectedInterface('kajon')} className="w-full justify-start text-left h-auto text-lg font-semibold py-[50px] px-[150px] my-[25px] text-inherit bg-orange-50 mx-0">KAJON Coffee Limited - Export Oriented Business</Button>
          <Button variant="outline" onClick={() => setSelectedInterface('kazo')} className="w-full justify-start text-left h-auto text-lg font-semibold my-[25px] py-[50px] px-[150px] bg-green-50">Kazo Coffee Development Project</Button>
        </CardContent>
      </Card>;
  }
  if (selectedInterface === 'kajon' && !selectedSystem) {
    return <div className="space-y-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">KAJON Coffee Limited Management System</h2>
              <Button variant="ghost" onClick={handleBack} className="p-2">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mx-[145px] my-0 bg-slate-50 py-[45px] px-[200px]">
              <Button variant="outline" className="h-32 flex flex-col items-center justify-center space-y-2" onClick={() => setSelectedSystem('coffee-management')}>
                <Coffee className="h-8 w-8" />
                <span className="text-lg font-semibold">KAJON Coffee Limited Management</span>
              </Button>
              <Button variant="outline" className="h-32 flex flex-col items-center justify-center space-y-2" onClick={() => setSelectedSystem('export-management')}>
                <Globe className="h-8 w-8" />
                <span className="text-lg font-semibold">KAJON Coffee Export Management</span>
              </Button>
              
            </div>
          </CardContent>
        </Card>
      </div>;
  }
  return <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">
              {selectedInterface === 'kajon' ? selectedSystem === 'coffee-management' ? 'KAJON Coffee Limited Management' : selectedSystem === 'export-management' ? 'KAJON Coffee Export Management' : 'KAJON Coffee Factory Management' : 'Kazo Coffee Development Project'}
            </h2>
            <Button variant="ghost" onClick={handleBack} className="p-2">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </div>

          {selectedInterface === 'kajon' ? selectedSystem === 'coffee-management' ? <Tabs defaultValue="update-stock" className="w-full">
                <TabsList className="w-full justify-start overflow-x-auto flex-nowrap md:flex-wrap">
                  <TabsTrigger value="update-stock">Update Stock</TabsTrigger>
                  <TabsTrigger value="view-stock">View Stock</TabsTrigger>
                  <TabsTrigger value="reports">Reports</TabsTrigger>
                  <TabsTrigger value="farms">Farms</TabsTrigger>
                  <TabsTrigger value="associations">Associations</TabsTrigger>
                  <TabsTrigger value="requisitions">Requisitions</TabsTrigger>
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
              </Tabs> : selectedSystem === 'export-management' ? <CoffeeExportDashboard /> : <HullingGrading /> : <KazoCoffeeProject />}
        </CardContent>
      </Card>
    </div>;
};
export default KAJONCoffeeLimited;