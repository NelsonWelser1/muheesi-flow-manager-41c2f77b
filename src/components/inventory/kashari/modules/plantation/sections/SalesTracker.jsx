import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DollarSign, Plus, Percent, ShoppingCart, Package } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import RecordSaleForm from "./RecordSaleForm";
import SalesMetrics from './sales/SalesMetrics';
import SalesTable from './sales/SalesTable';

const SalesTracker = () => {
  const [salesData, setSalesData] = useState([
    { id: 1, date: '2025-04-01', product: 'Bananas (Ripe)', quantity: 50, unitPrice: 6500, totalAmount: 325000, customer: 'Nakumatt Supermarket', unit: 'Bunches' },
    { id: 2, date: '2025-04-03', product: 'Bananas (Green)', quantity: 75, unitPrice: 5000, totalAmount: 375000, customer: 'Carrefour Uganda', unit: 'Bunches' },
    { id: 3, date: '2025-04-07', product: 'Bananas (Ripe)', quantity: 40, unitPrice: 6500, totalAmount: 260000, customer: 'Fresh Foods Market', unit: 'Bunches' },
  ]);
  
  const [inventoryData, setInventoryData] = useState([
    { id: 1, product: 'Bananas (Ripe)', totalStock: 250, sold: 90, remaining: 160, unit: 'Bunches' },
    { id: 2, product: 'Bananas (Green)', totalStock: 430, sold: 75, remaining: 355, unit: 'Bunches' },
  ]);
  
  const [showRecordSaleForm, setShowRecordSaleForm] = useState(false);
  const [isSubmittingSale, setIsSubmittingSale] = useState(false);
  const { toast } = useToast();
  
  const totalSalesAmount = salesData.reduce((total, sale) => total + sale.totalAmount, 0);
  const totalSalesQuantity = salesData.reduce((total, sale) => total + sale.quantity, 0);
  const totalAvailableStock = inventoryData.reduce((total, item) => total + item.remaining, 0);

  const handleShowRecordSaleForm = () => setShowRecordSaleForm(true);
  const handleCancelRecordSale = () => setShowRecordSaleForm(false);

  const handleSubmitRecordSale = (form) => {
    setIsSubmittingSale(true);

    const quantity = parseInt(form.quantity);
    const unitPrice = parseFloat(form.unitPrice);

    const newSaleEntry = {
      id: salesData.length + 1,
      date: new Date().toISOString().split('T')[0],
      product: form.product,
      quantity,
      unitPrice,
      totalAmount: quantity * unitPrice,
      customer: form.customer,
      unit: form.unit
    };

    setSalesData([...salesData, newSaleEntry]);

    const updatedInventory = inventoryData.map(item => {
      if (item.product === form.product) {
        return {
          ...item,
          sold: item.sold + quantity,
          remaining: item.remaining - quantity
        };
      }
      return item;
    });
    
    setInventoryData(updatedInventory);
    setIsSubmittingSale(false);
    setShowRecordSaleForm(false);

    toast({
      title: "Sale Added",
      description: "The sale has been recorded successfully",
    });
  };

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
          inventoryData={inventoryData}
          onSubmit={handleSubmitRecordSale}
          onCancel={handleCancelRecordSale}
          isSubmitting={isSubmittingSale}
        />
      )}

      <Card>
        <CardContent className="pt-6">
          <SalesTable salesData={salesData} />
        </CardContent>
      </Card>

      <h2 className="text-xl font-semibold mt-8">Inventory Status</h2>
      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Total Stock</TableHead>
                <TableHead>Sold</TableHead>
                <TableHead>Remaining</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inventoryData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.product}</TableCell>
                  <TableCell>{item.totalStock} {item.unit}</TableCell>
                  <TableCell>{item.sold} {item.unit}</TableCell>
                  <TableCell>{item.remaining} {item.unit}</TableCell>
                  <TableCell className={item.remaining > 100 ? "text-green-600" : item.remaining > 50 ? "text-amber-600" : "text-red-600"}>
                    {item.remaining > 100 ? "Optimal" : item.remaining > 50 ? "Moderate" : "Low"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default SalesTracker;
