import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Coffee, Globe, Factory, BarChart3, TrendingUp, AlertCircle, Calendar, Ship } from 'lucide-react';
import { cn } from "@/lib/utils";
import { useLocation } from 'react-router-dom';
import StockOperations from './stock-operations/StockOperations';
import ViewCurrentStock from './ViewCurrentStock';
import MakeReports from './MakeReports';
import ManageFarms from './ManageFarms';
import ManageAssociations from './ManageAssociations';
import MakeRequisitions from './MakeRequisitions';
import KazoCoffeeProject from './kajon/KazoCoffeeProject';
import ExecutiveDashboard from './kajon/executive/ExecutiveDashboard';
import CoffeeExportDashboard from './kajon/export-business/CoffeeExportDashboard';
import HullingGrading from './kajon/export-business/HullingGrading';
import EquatorExportManagement from './kajon/equator-export/EquatorExportManagement';
const KAJONCoffeeLimited = () => {
  const {
    toast
  } = useToast();
  const location = useLocation();
  const [selectedInterface, setSelectedInterface] = useState(null);
  const [selectedSystem, setSelectedSystem] = useState(null);

  // Check if there's a pre-selected interface from navigation state
  useEffect(() => {
    if (location.state?.selectedInterface) {
      setSelectedInterface(location.state.selectedInterface);
    }
  }, [location.state]);
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* KAJON Coffee Limited - Executive Management */}
            <div className="group relative overflow-hidden rounded-xl transition-all duration-300 hover:shadow-xl h-[250px]">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-800/90 to-amber-950/95 opacity-90 transition-opacity group-hover:opacity-100"></div>
              <div className="absolute inset-0 bg-[url('/combined-logo.png')] bg-center bg-no-repeat bg-contain opacity-10"></div>
              <Button variant="link" onClick={() => setSelectedInterface('kajon')} className="relative h-full w-full flex flex-col items-center justify-center space-y-4 text-white border-0">
                <div className="rounded-full bg-amber-700/50 p-4 mb-2 backdrop-blur-sm transition-all duration-300 group-hover:bg-amber-600/70">
                  <BarChart3 className="h-12 w-12" />
                </div>
                <span className="text-2xl font-bold tracking-wide">KAJON Coffee Limited</span>
                <p className="text-sm font-light max-w-[80%] text-center text-amber-100 opacity-90">
                  Executive Management Dashboard
                </p>
                <div className="absolute bottom-4 left-4 bg-amber-700/60 text-amber-100 px-2 py-1 rounded-md text-xs">
                  Strategic Level
                </div>
              </Button>
            </div>
            
            {/* Kazo Coffee Development Project - Operational Level */}
            <div className="group relative overflow-hidden rounded-xl transition-all duration-300 hover:shadow-xl h-[250px]">
              <div className="absolute inset-0 bg-gradient-to-br from-green-800/90 to-green-950/95 opacity-90 transition-opacity group-hover:opacity-100"></div>
              <div className="absolute inset-0 bg-[url('/combined-logo.png')] bg-center bg-no-repeat bg-contain opacity-10"></div>
              <Button variant="link" onClick={() => setSelectedInterface('kazo')} className="relative h-full w-full flex flex-col items-center justify-center space-y-4 text-white border-0">
                <div className="rounded-full bg-green-700/50 p-4 mb-2 backdrop-blur-sm transition-all duration-300 group-hover:bg-green-600/70">
                  <Factory className="h-12 w-12" />
                </div>
                <span className="text-2xl font-bold tracking-wide">Kazo Coffee Project</span>
                <p className="text-sm font-light max-w-[80%] text-center text-green-100 opacity-90">
                  Operational Management System
                </p>
                <div className="absolute bottom-4 left-4 bg-green-700/60 text-green-100 px-2 py-1 rounded-md text-xs">
                  Operational Level
                </div>
              </Button>
            </div>
            
            {/* KAJON Equata Coffee Management System - New Tile */}
            <div className="group relative overflow-hidden rounded-xl transition-all duration-300 hover:shadow-xl h-[250px]">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-800/90 to-blue-950/95 opacity-90 transition-opacity group-hover:opacity-100"></div>
              <div className="absolute inset-0 bg-[url('/combined-logo.png')] bg-center bg-no-repeat bg-contain opacity-10"></div>
              <Button variant="link" onClick={() => setSelectedInterface('equator')} className="relative h-full w-full flex flex-col items-center justify-center space-y-4 text-white border-0">
                <div className="rounded-full bg-blue-700/50 p-4 mb-2 backdrop-blur-sm transition-all duration-300 group-hover:bg-blue-600/70">
                  <Ship className="h-12 w-12" />
                </div>
                <span className="text-2xl font-bold tracking-wide">KAJON Equata Coffee</span>
                <p className="text-sm font-light max-w-[80%] text-center text-blue-100 opacity-90">
                  Global Export Management System
                </p>
                <div className="absolute bottom-4 left-4 bg-blue-700/60 text-blue-100 px-2 py-1 rounded-md text-xs">
                  International Trade
                </div>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>;
  }
  if (selectedInterface === 'kajon' && !selectedSystem) {
    return <div className="space-y-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">KAJON Coffee Limited Executive Management</h2>
              <Button variant="ghost" onClick={handleBack} className="p-2">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </div>
            
            <div className="flex justify-center">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
                {/* Coffee Business Insights */}
                <div className="group relative overflow-hidden rounded-xl transition-all duration-300 hover:shadow-xl">
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-800/80 to-amber-950/90 opacity-90 transition-opacity group-hover:opacity-100"></div>
                  <div className="absolute inset-0 bg-[url('/combined-logo.png')] bg-center bg-no-repeat bg-contain opacity-10"></div>
                  <Button variant="link" onClick={() => setSelectedSystem('coffee-insights')} className="relative h-48 w-full flex flex-col items-center justify-center space-y-3 text-white border-0">
                    <div className="rounded-full bg-amber-700/50 p-4 mb-2 backdrop-blur-sm transition-all duration-300 group-hover:bg-amber-600/70">
                      <TrendingUp className="h-12 w-12" />
                    </div>
                    <span className="text-2xl font-bold tracking-wide">KAZO Coffee Insights</span>
                    <p className="text-sm font-light max-w-[80%] text-center text-amber-100 opacity-90">
                      Analytics, KPIs, and Strategic Reporting
                    </p>
                  </Button>
                </div>
                
                {/* Export Business Analytics */}
                <div className="group relative overflow-hidden rounded-xl transition-all duration-300 hover:shadow-xl">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-800/80 to-blue-950/90 opacity-90 transition-opacity group-hover:opacity-100"></div>
                  <div className="absolute inset-0 bg-[url('/combined-logo.png')] bg-center bg-no-repeat bg-contain opacity-10"></div>
                  <Button variant="link" onClick={() => setSelectedSystem('export-analytics')} className="relative h-48 w-full flex flex-col items-center justify-center space-y-3 text-white border-0">
                    <div className="rounded-full bg-blue-700/50 p-4 mb-2 backdrop-blur-sm transition-all duration-300 group-hover:bg-blue-600/70">
                      <Globe className="h-12 w-12" />
                    </div>
                    <span className="text-2xl font-bold tracking-wide">KAJON Exports</span>
                    <p className="text-sm font-light max-w-[80%] text-center text-blue-100 opacity-90">
                      Global Market Insights and Export Performance
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
              {selectedInterface === 'kajon' ? selectedSystem === 'coffee-insights' ? 'KAJON Coffee Business Insights' : selectedSystem === 'export-analytics' ? 'KAJON Export Analytics' : 'KAJON Coffee Factory Management' : selectedInterface === 'kazo' ? 'Kazo Coffee Development Project' : 'KAJON Equata Coffee Management System'}
            </h2>
            <Button variant="ghost" onClick={handleBack} className="p-2">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </div>

          {selectedInterface === 'kajon' ? selectedSystem === 'coffee-insights' ? <ExecutiveDashboard /> : selectedSystem === 'export-analytics' ? <CoffeeExportDashboard viewOnly={true} /> : <HullingGrading viewOnly={true} /> : selectedInterface === 'kazo' ? <KazoCoffeeProject /> : <EquatorExportManagement />}
        </CardContent>
      </Card>
    </div>;
};
export default KAJONCoffeeLimited;