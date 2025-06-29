import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SystemAdminDashboard from './SystemAdminDashboard';
import CEODashboard from './CEODashboard';
import BoardOfDirectorsDashboard from './BoardOfDirectorsDashboard';
import PADashboard from './pa-dashboard/PADashboard';
import ComplianceQualityDashboard from './compliance-dashboard/ComplianceQualityDashboard';
import HRDashboard from './hr-dashboard/HRDashboard';
import OperationsManagerDashboard from './operations-dashboard/OperationsManagerDashboard';
import ProcurementManagerDashboard from './operations-dashboard/ProcurementManagerDashboard';
import FactoryManagerDashboard from './operations-dashboard/FactoryManagerDashboard';
import RiskManagerDashboard from './operations-dashboard/RiskManagerDashboard';
import FinanceManagerDashboard from './finance-dashboard/FinanceManagerDashboard';
import SalesExportManagerDashboard from './sales-export-dashboard/SalesExportManagerDashboard';
import LogisticsManagerDashboard from './operations-dashboard/LogisticsManagerDashboard';
import InventoryManagerDashboard from './operations-dashboard/InventoryManagerDashboard';
import MarketingManagerDashboard from './operations-dashboard/MarketingManagerDashboard';
import ITManagerDashboard from './operations-dashboard/ITManagerDashboard';
import ProductDevelopmentManagerDashboard from './operations-dashboard/ProductDevelopmentManagerDashboard';
import WarehouseSupervisorDashboard from './operations-dashboard/WarehouseSupervisorDashboard';
import AssociationManagerDashboard from './operations-dashboard/AssociationManagerDashboard';
import FarmManagerDashboard from './operations-dashboard/FarmManagerDashboard';
const RoleDashboard = ({
  role
}) => {
  const renderRoleContent = () => {
    switch (role) {
      case 'System Administrator (SysAdmin)':
        return <SystemAdminDashboard />;
      case 'Chief Executive Officer (CEO)':
        return <CEODashboard />;
      case 'Board of Directors':
        return <BoardOfDirectorsDashboard />;
      case "CEO's Personal Assistant":
        return <PADashboard />;
      case 'Compliance & Quality Control Officer':
        return <ComplianceQualityDashboard />;
      case 'Human Resource Manager':
        return <HRDashboard />;
      case 'Operations Manager':
        return <OperationsManagerDashboard />;
      case 'Procurement Manager':
        return <ProcurementManagerDashboard />;
      case 'Factory Manager':
        return <FactoryManagerDashboard />;
      case 'Risk Manager':
        return <RiskManagerDashboard />;
      case 'Finance Manager':
        return <FinanceManagerDashboard />;
      case 'Sales & Export Manager':
        return <SalesExportManagerDashboard />;
      case 'Logistics Manager':
        return <LogisticsManagerDashboard />;
      case 'Inventory Manager':
        return <InventoryManagerDashboard />;
      case 'Marketing Manager':
        return <MarketingManagerDashboard />;
      case 'IT Manager':
        return <ITManagerDashboard />;
      case 'Product Development Manager':
        return <ProductDevelopmentManagerDashboard />;
      case 'Warehouse Supervisor':
        return <WarehouseSupervisorDashboard />;
      case 'Association Manager':
        return <AssociationManagerDashboard />;
      case 'Farm Manager':
        return <FarmManagerDashboard />;
      default:
        return <Card>
            <CardHeader>
              <CardTitle>{role} Dashboard</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Dashboard content for {role} will be implemented here.</p>
            </CardContent>
          </Card>;
    }
  };
  return <div className="space-y-6">
      <div className="flex items-center mb-6">
        
      </div>
      {renderRoleContent()}
    </div>;
};
export default RoleDashboard;