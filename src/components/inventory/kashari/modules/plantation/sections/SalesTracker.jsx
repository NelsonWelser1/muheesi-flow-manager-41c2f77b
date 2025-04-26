
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import RecordSaleForm from "./RecordSaleForm";
import SalesMetrics from './sales/SalesMetrics';
import SalesTable from './sales/SalesTable';
import { usePlantationData } from '@/hooks/usePlantationData';

const SalesTracker = () => {
  const [showRecordSaleForm, setShowRecordSaleForm] = useState(false);
  const { toast } = useToast();
  const { 
    sales, 
    inventory,
    isLoadingSales, 
    addSaleRecord 
  } = usePlantationData();
  
  const handleShowRecordSaleForm = () => setShowRecordSaleForm(true);
  const handleCancelRecordSale = () => setShowRecordSaleForm(false);

  const handleSubmitRecordSale = async (form) => {
    try {
      const saleRecord = {
        date: new Date().toISOString().split('T')[0],
        product: form.product,
        quantity: Number(form.quantity),
        unit: form.unit,
        unit_price: Number(form.unitPrice),
        total_amount: Number(form.quantity) * Number(form.unitPrice),
        customer: form.customer
      };

      await addSaleRecord.mutateAsync(saleRecord);
      setShowRecordSaleForm(false);
      
      toast({
        title: "Success",
        description: "Sale recorded successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to record sale",
        variant: "destructive",
      });
    }
  };

  const totalSalesAmount = (sales || []).reduce((total, sale) => total + sale.total_amount, 0);
  const totalSalesQuantity = (sales || []).reduce((total, sale) => total + sale.quantity, 0);
  const totalAvailableStock = (inventory || []).reduce((total, item) => total + item.quantity, 0);

  return (
    <div className="space-y-4">
      <SalesMetrics 
        totalSalesAmount={totalSalesAmount}
        totalSalesQuantity={totalSalesQuantity}
        totalAvailableStock={totalAvailableStock}
      />
      
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Sales History</h2>
        {!showRecordSaleForm && (
          <Button onClick={handleShowRecordSaleForm}>
            <Plus className="h-4 w-4 mr-2" />
            Record Sale
          </Button>
        )}
      </div>

      {showRecordSaleForm && (
        <RecordSaleForm
          inventoryData={inventory || []}
          onSubmit={handleSubmitRecordSale}
          onCancel={handleCancelRecordSale}
          isSubmitting={addSaleRecord.isPending}
        />
      )}

      <Card>
        <CardContent className="pt-6">
          <SalesTable 
            salesData={sales || []} 
            isLoading={isLoadingSales}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default SalesTracker;
