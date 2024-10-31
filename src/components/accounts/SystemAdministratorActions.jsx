import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { 
  Activity, Database, Shield, RefreshCw, AlertTriangle, 
  Settings, Upload, FileText, Bell 
} from 'lucide-react';

const SystemAdministratorActions = ({ responsibility }) => {
  const { toast } = useToast();

  const handleAction = (action) => {
    toast({
      title: `${action} Initiated`,
      description: "Processing your request...",
    });
    // Implement specific action logic here
  };

  const getActionButtons = () => {
    switch (responsibility) {
      case "System Health":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button onClick={() => handleAction("System Diagnostics")} className="flex items-center gap-2">
              <Activity className="w-4 h-4" />
              Run Diagnostics
            </Button>
            <Button onClick={() => handleAction("Performance Check")} className="flex items-center gap-2">
              <RefreshCw className="w-4 h-4" />
              Check Performance
            </Button>
          </div>
        );
      case "Database Operations":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button onClick={() => handleAction("Database Backup")} className="flex items-center gap-2">
              <Database className="w-4 h-4" />
              Backup Database
            </Button>
            <Button onClick={() => handleAction("Database Optimization")} className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Optimize Database
            </Button>
          </div>
        );
      // Add cases for other responsibilities
      default:
        return (
          <p>Select an action to perform for {responsibility}</p>
        );
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{responsibility}</CardTitle>
      </CardHeader>
      <CardContent>
        {getActionButtons()}
      </CardContent>
    </Card>
  );
};

export default SystemAdministratorActions;