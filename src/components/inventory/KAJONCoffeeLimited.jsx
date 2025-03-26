
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
            
            <div className="flex justify-center">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
                <div className="group relative overflow-hidden rounded-xl transition-all duration-300 hover:shadow-xl">
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-800/80 to-amber-950/90 opacity-90 transition-opacity group-hover:opacity-100"></div>
                  <div className="absolute inset-0 bg-[url('/combined-logo.png')] bg-center bg-no-repeat bg-contain opacity-10"></div>
                  <Button 
                    variant="link" 
                    onClick={() => setSelectedSystem('coffee-management')}
                    className="relative h-48 w-full flex flex-col items-center justify-center space-y-3 text-white border-0"
                  >
                    <div className="rounded-full bg-amber-700/50 p-4 mb-2 backdrop-blur-sm transition-all duration-300 group-hover:bg-amber-600/70">
                      <Coffee className="h-12 w-12" />
                    </div>
                    <span className="text-2xl font-bold tracking-wide">Coffee Management</span>
                    <p className="text-sm font-light max-w-[80%] text-center text-amber-100 opacity-90">
                      Manage inventory, farms, and associations
                    </p>
                  </Button>
                </div>
                
                <div className="group relative overflow-hidden rounded-xl transition-all duration-300 hover:shadow-xl">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-800/80 to-blue-950/90 opacity-90 transition-opacity group-hover:opacity-100"></div>
                  <div className="absolute inset-0 bg-[url('/combined-logo.png')] bg-center bg-no-repeat bg-contain opacity-10"></div>
                  <Button 
                    variant="link" 
                    onClick={() => setSelectedSystem('export-management')}
                    className="relative h-48 w-full flex flex-col items-center justify-center space-y-3 text-white border-0"
                  >
                    <div className="rounded-full bg-blue-700/50 p-4 mb-2 backdrop-blur-sm transition-all duration-300 group-hover:bg-blue-600/70">
                      <Globe className="h-12 w-12" />
                    </div>
                    <span className="text-2xl font-bold tracking-wide">Export Management</span>
                    <p className="text-sm font-light max-w-[80%] text-center text-blue-100 opacity-90">
                      Manage quotes, orders and shipping
                    </p>
                  </Button>
                </div>
              </div>
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
