
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { showInfoToast } from "@/components/ui/notifications";
import { Download, FileText, Send, BarChart3, RefreshCw, AlertCircle } from 'lucide-react';

const StockActions = () => {
  const { toast } = useToast();
  
  const handleAction = (action) => {
    showInfoToast(toast, `Initiating action: ${action}`);
    // Here you would handle the actual action in a real implementation
  };
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          <Button 
            variant="outline" 
            className="h-auto py-3 flex flex-col items-center justify-center text-left"
            onClick={() => handleAction('Generate Report')}
          >
            <FileText className="h-5 w-5 mb-1" />
            <span className="text-sm font-medium">Generate Report</span>
            <span className="text-xs text-muted-foreground">Comprehensive PDF</span>
          </Button>
          
          <Button 
            variant="outline" 
            className="h-auto py-3 flex flex-col items-center justify-center text-left"
            onClick={() => handleAction('Export Data')}
          >
            <Download className="h-5 w-5 mb-1" />
            <span className="text-sm font-medium">Export Data</span>
            <span className="text-xs text-muted-foreground">CSV or Excel format</span>
          </Button>
          
          <Button 
            variant="outline" 
            className="h-auto py-3 flex flex-col items-center justify-center text-left"
            onClick={() => handleAction('Reorder Stock')}
          >
            <RefreshCw className="h-5 w-5 mb-1" />
            <span className="text-sm font-medium">Reorder Stock</span>
            <span className="text-xs text-muted-foreground">Create purchase orders</span>
          </Button>
          
          <Button 
            variant="outline" 
            className="h-auto py-3 flex flex-col items-center justify-center text-left"
            onClick={() => handleAction('Share Inventory')}
          >
            <Send className="h-5 w-5 mb-1" />
            <span className="text-sm font-medium">Share Inventory</span>
            <span className="text-xs text-muted-foreground">Email to stakeholders</span>
          </Button>
          
          <Button 
            variant="outline" 
            className="h-auto py-3 flex flex-col items-center justify-center text-left"
            onClick={() => handleAction('View Analytics')}
          >
            <BarChart3 className="h-5 w-5 mb-1" />
            <span className="text-sm font-medium">View Analytics</span>
            <span className="text-xs text-muted-foreground">Detailed stock metrics</span>
          </Button>
          
          <Button 
            variant="outline" 
            className="h-auto py-3 flex flex-col items-center justify-center text-left"
            onClick={() => handleAction('Configure Alerts')}
          >
            <AlertCircle className="h-5 w-5 mb-1" />
            <span className="text-sm font-medium">Configure Alerts</span>
            <span className="text-xs text-muted-foreground">Set notification rules</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default StockActions;
