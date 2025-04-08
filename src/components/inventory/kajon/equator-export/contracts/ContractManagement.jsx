
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import QuoteManagement from '../../export-business/quotations/QuoteManagement';
import LocalPurchaseOrderManager from './components/purchase-order/LocalPurchaseOrderManager';
import LocalPurchaseAgreementManager from './components/purchase-agreement/LocalPurchaseAgreementManager';

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
          <LocalPurchaseAgreementManager />
        </CardContent>
      </Card>
    </div>
  );
};

export default ContractManagement;
