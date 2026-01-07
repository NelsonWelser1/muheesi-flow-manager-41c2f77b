import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useInvoices } from '@/hooks/useInvoices';
import { Loader2, FileText, Trash2 } from 'lucide-react';

const FinancialManagement = () => {
  const { invoices, isLoading, createInvoice, deleteInvoice } = useInvoices();
  const [formData, setFormData] = useState({
    selling_price: '',
    currency: 'USD',
    processing_cost: '',
    shipping_cost: '',
    invoice_number: '',
    payment_terms: '',
    customer_name: '',
    quantity_kg: ''
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const generateInvoiceNumber = () => {
    const date = new Date();
    return `INV-${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
  };

  const calculateTotal = () => {
    const price = parseFloat(formData.selling_price) || 0;
    const quantity = parseFloat(formData.quantity_kg) || 0;
    const processing = parseFloat(formData.processing_cost) || 0;
    const shipping = parseFloat(formData.shipping_cost) || 0;
    return (price * quantity) - processing - shipping;
  };

  const handleSubmit = async () => {
    if (!formData.customer_name || !formData.selling_price) {
      return;
    }

    setIsSaving(true);
    try {
      const invoiceNumber = formData.invoice_number || generateInvoiceNumber();
      const total = calculateTotal();
      
      await createInvoice({
        id: invoiceNumber,
        customer_name: formData.customer_name,
        invoice_date: new Date().toISOString().split('T')[0],
        due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        total_amount: total,
        payment_status: 'pending',
        payment_terms: formData.payment_terms,
        items: JSON.stringify([{
          description: 'Coffee Export',
          quantity: parseFloat(formData.quantity_kg) || 1,
          unit_price: parseFloat(formData.selling_price) || 0,
          currency: formData.currency,
          processing_cost: parseFloat(formData.processing_cost) || 0,
          shipping_cost: parseFloat(formData.shipping_cost) || 0
        }])
      });
      
      setFormData({
        selling_price: '',
        currency: 'USD',
        processing_cost: '',
        shipping_cost: '',
        invoice_number: '',
        payment_terms: '',
        customer_name: '',
        quantity_kg: ''
      });
    } finally {
      setIsSaving(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'paid': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      case 'overdue': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Revenue & Costs</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label>Customer Name</Label>
            <Input 
              placeholder="Enter customer name"
              value={formData.customer_name}
              onChange={(e) => handleChange('customer_name', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Quantity (kg)</Label>
            <Input 
              type="number"
              placeholder="Enter quantity"
              value={formData.quantity_kg}
              onChange={(e) => handleChange('quantity_kg', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Selling Price (per kg)</Label>
            <Input 
              type="number" 
              step="0.01"
              placeholder="e.g., 4.50"
              value={formData.selling_price}
              onChange={(e) => handleChange('selling_price', e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label>Currency</Label>
            <Select value={formData.currency} onValueChange={(v) => handleChange('currency', v)}>
              <SelectTrigger>
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USD">USD</SelectItem>
                <SelectItem value="EUR">EUR</SelectItem>
                <SelectItem value="CNY">CNY</SelectItem>
                <SelectItem value="UGX">UGX</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Processing Cost</Label>
            <Input 
              type="number" 
              step="0.01"
              placeholder="e.g., 500"
              value={formData.processing_cost}
              onChange={(e) => handleChange('processing_cost', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Shipping Cost</Label>
            <Input 
              type="number" 
              step="0.01"
              placeholder="e.g., 2000"
              value={formData.shipping_cost}
              onChange={(e) => handleChange('shipping_cost', e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Invoice Generation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Invoice Number (optional)</Label>
              <Input 
                placeholder="Auto-generated if empty"
                value={formData.invoice_number}
                onChange={(e) => handleChange('invoice_number', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Payment Terms</Label>
              <Select value={formData.payment_terms} onValueChange={(v) => handleChange('payment_terms', v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select terms" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="advance">Advance Payment</SelectItem>
                  <SelectItem value="lc">Letter of Credit</SelectItem>
                  <SelectItem value="tt">T/T After Shipment</SelectItem>
                  <SelectItem value="net30">Net 30</SelectItem>
                  <SelectItem value="net60">Net 60</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {formData.selling_price && formData.quantity_kg && (
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">Estimated Total</p>
              <p className="text-2xl font-bold">{formData.currency} {calculateTotal().toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
            </div>
          )}
          
          <Button onClick={handleSubmit} disabled={isSaving} className="w-full">
            {isSaving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...</> : <><FileText className="mr-2 h-4 w-4" /> Generate Invoice</>}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Invoice History</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : invoices.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No invoices yet. Generate your first invoice above.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice #</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell className="font-medium">{invoice.id}</TableCell>
                    <TableCell>{invoice.customer_name}</TableCell>
                    <TableCell>{invoice.invoice_date}</TableCell>
                    <TableCell>{invoice.due_date}</TableCell>
                    <TableCell>${invoice.total_amount?.toLocaleString(undefined, { minimumFractionDigits: 2 })}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(invoice.payment_status)}>{invoice.payment_status}</Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" onClick={() => deleteInvoice(invoice.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default FinancialManagement;
