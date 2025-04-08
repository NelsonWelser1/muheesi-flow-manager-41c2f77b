import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import QuoteManagement from '../../export-business/quotations/QuoteManagement';
import LocalPurchaseOrderManager from './components/purchase-order/LocalPurchaseOrderManager';

const ContractManagement = () => {
  const { toast } = useToast();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Quotations</CardTitle>
        </CardHeader>
        <CardContent>
          <QuoteManagement />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Local Purchase Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <LocalPurchaseOrderManager />
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Local Purchase Agreements</CardTitle>
        </CardHeader>
        <CardContent>
          <Button 
            variant="outline" 
            className="flex items-center gap-1"
            onClick={() => toast({
              title: "Feature unavailable",
              description: "Local Purchase functionality is currently unavailable.",
              variant: "destructive",
            })}
          >
            <Plus className="h-4 w-4" />
            Local Purchase
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContractManagement;
