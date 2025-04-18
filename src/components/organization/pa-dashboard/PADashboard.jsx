import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Calendar, 
  CheckSquare, 
  Phone, 
  CreditCard, 
  Package, 
  DollarSign, 
  Box, 
  Handshake, 
  FolderArchive, 
  BarChart, 
  BellRing 
} from 'lucide-react';
import { SidebarProvider } from "@/components/ui/sidebar";
import DashboardSidebar from './sidebar/DashboardSidebar';
import DashboardOverview from './DashboardOverview';
import TaskManager from './TaskManager';
import EntitySelector from './EntitySelector';
import ClientCRM from './ClientCRM';
import FinanceLedger from './FinanceLedger';
import ProcurementAssets from './ProcurementAssets';
import PayrollExpenses from './PayrollExpenses';
import InventoryProduction from './InventoryProduction';
import LoansRepayments from './LoansRepayments';
import DocumentVault from './DocumentVault';
import ReportsAnalytics from './ReportsAnalytics';
import NotificationsAlerts from './NotificationsAlerts';

const PADashboard = () => {
  const [selectedEntity, setSelectedEntity] = useState('all');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [currentView, setCurrentView] = useState('list');

  const handleTabChange = (value) => {
    setActiveTab(value);
    setCurrentView('list');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h2 className="text-3xl font-bold tracking-tight">PA Dashboard</h2>
        <div className="mt-2 sm:mt-0 flex space-x-2">
          <EntitySelector 
            selectedEntity={selectedEntity} 
            onEntityChange={setSelectedEntity} 
          />
          <NotificationsAlerts />
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
        <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 pb-4">
          <TabsList className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2 w-full">
            <TabsTrigger value="dashboard" className="flex items-center gap-1 text-xs sm:text-sm">
              <Calendar className="w-4 h-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="tasks" className="flex items-center gap-1 text-xs sm:text-sm">
              <CheckSquare className="w-4 h-4" />
              <span className="hidden sm:inline">Tasks</span>
            </TabsTrigger>
            <TabsTrigger value="crm" className="flex items-center gap-1 text-xs sm:text-sm">
              <Phone className="w-4 h-4" />
              <span className="hidden sm:inline">CRM</span>
            </TabsTrigger>
            <TabsTrigger value="finance" className="flex items-center gap-1 text-xs sm:text-sm">
              <CreditCard className="w-4 h-4" />
              <span className="hidden sm:inline">Finance</span>
            </TabsTrigger>
            <TabsTrigger value="procurement" className="flex items-center gap-1 text-xs sm:text-sm">
              <Package className="w-4 h-4" />
              <span className="hidden sm:inline">Procurement</span>
            </TabsTrigger>
            <TabsTrigger value="payroll" className="flex items-center gap-1 text-xs sm:text-sm">
              <DollarSign className="w-4 h-4" />
              <span className="hidden sm:inline">Payroll</span>
            </TabsTrigger>
            <TabsTrigger value="inventory" className="flex items-center gap-1 text-xs sm:text-sm">
              <Box className="w-4 h-4" />
              <span className="hidden sm:inline">Inventory</span>
            </TabsTrigger>
            <TabsTrigger value="loans" className="flex items-center gap-1 text-xs sm:text-sm">
              <Handshake className="w-4 h-4" />
              <span className="hidden sm:inline">Loans</span>
            </TabsTrigger>
            <TabsTrigger value="documents" className="flex items-center gap-1 text-xs sm:text-sm">
              <FolderArchive className="w-4 h-4" />
              <span className="hidden sm:inline">Documents</span>
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center gap-1 text-xs sm:text-sm">
              <BarChart className="w-4 h-4" />
              <span className="hidden sm:inline">Reports</span>
            </TabsTrigger>
          </TabsList>
        </div>
        
        <SidebarProvider>
          <div className="flex min-h-[500px]">
            {activeTab !== 'dashboard' && (
              <DashboardSidebar 
                activeTab={activeTab} 
                onViewChange={setCurrentView}
                isCollapsed={isCollapsed}
              />
            )}
            
            <div className="flex-1 p-4">
              <TabsContent value="dashboard" className="space-y-4">
                <DashboardOverview selectedEntity={selectedEntity} />
              </TabsContent>
              
              <TabsContent value="tasks" className="space-y-4">
                <TaskManager selectedEntity={selectedEntity} view={currentView} />
              </TabsContent>
              
              <TabsContent value="crm" className="space-y-4">
                <ClientCRM selectedEntity={selectedEntity} view={currentView} />
              </TabsContent>
              
              <TabsContent value="finance" className="space-y-4">
                <FinanceLedger selectedEntity={selectedEntity} />
              </TabsContent>
              
              <TabsContent value="procurement" className="space-y-4">
                <ProcurementAssets selectedEntity={selectedEntity} />
              </TabsContent>
              
              <TabsContent value="payroll" className="space-y-4">
                <PayrollExpenses selectedEntity={selectedEntity} />
              </TabsContent>
              
              <TabsContent value="inventory" className="space-y-4">
                <InventoryProduction selectedEntity={selectedEntity} />
              </TabsContent>
              
              <TabsContent value="loans" className="space-y-4">
                <LoansRepayments selectedEntity={selectedEntity} />
              </TabsContent>
              
              <TabsContent value="documents" className="space-y-4">
                <DocumentVault selectedEntity={selectedEntity} />
              </TabsContent>
              
              <TabsContent value="reports" className="space-y-4">
                <ReportsAnalytics selectedEntity={selectedEntity} />
              </TabsContent>
            </div>
          </div>
        </SidebarProvider>
      </Tabs>
    </div>
  );
};

export default PADashboard;
