import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DollarSign, Plus, Edit, Trash2, Calendar } from 'lucide-react';
import { supabase } from '@/integrations/supabase/supabase';
import { useToast } from "@/components/ui/use-toast";
import { format } from 'date-fns';

const SalesRecords = () => {
  const { toast } = useToast();
  const [sales, setSales] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSale, setEditingSale] = useState(null);
  const [formData, setFormData] = useState({
    sale_date: '',
    buyer_name: '',
    buyer_contact: '',
    destination: '',
    quantity_kg: '',
    price_per_kg: '',
    total_amount: '',
    payment_method: '',
    money_received_by: '',
    quality_grade: '',
    notes: ''
  });

  useEffect(() => {
    fetchSales();
  }, []);

  useEffect(() => {
    if (formData.quantity_kg && formData.price_per_kg) {
      const total = Number(formData.quantity_kg) * Number(formData.price_per_kg);
      setFormData(prev => ({ ...prev, total_amount: total.toFixed(2) }));
    }
  }, [formData.quantity_kg, formData.price_per_kg]);

  const fetchSales = async () => {
    try {
      const { data, error } = await supabase
        .from('kakyinga_coffee_sales')
        .select('*')
        .order('sale_date', { ascending: false });

      if (error) throw error;
      setSales(data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch sales records",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingSale) {
        const { error } = await supabase
          .from('kakyinga_coffee_sales')
          .update(formData)
          .eq('id', editingSale.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Sale record updated successfully"
        });
      } else {
        const { error } = await supabase
          .from('kakyinga_coffee_sales')
          .insert([formData]);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Sale recorded successfully"
        });
      }

      setIsDialogOpen(false);
      resetForm();
      fetchSales();
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this sale record?')) return;

    try {
      const { error } = await supabase
        .from('kakyinga_coffee_sales')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Sale record deleted successfully"
      });

      fetchSales();
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleEdit = (sale) => {
    setEditingSale(sale);
    setFormData({
      sale_date: sale.sale_date,
      buyer_name: sale.buyer_name,
      buyer_contact: sale.buyer_contact || '',
      destination: sale.destination,
      quantity_kg: sale.quantity_kg,
      price_per_kg: sale.price_per_kg,
      total_amount: sale.total_amount,
      payment_method: sale.payment_method,
      money_received_by: sale.money_received_by,
      quality_grade: sale.quality_grade,
      notes: sale.notes || ''
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      sale_date: '',
      buyer_name: '',
      buyer_contact: '',
      destination: '',
      quantity_kg: '',
      price_per_kg: '',
      total_amount: '',
      payment_method: '',
      money_received_by: '',
      quality_grade: '',
      notes: ''
    });
    setEditingSale(null);
  };

  const totalRevenue = sales.reduce((sum, s) => sum + Number(s.total_amount), 0);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Coffee Sales Records
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Total Revenue: UGX {totalRevenue.toLocaleString()}
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Record Sale
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingSale ? 'Edit Sale Record' : 'Record Coffee Sale'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Sale Date *</Label>
                  <Input
                    type="date"
                    value={formData.sale_date}
                    onChange={(e) => setFormData({ ...formData, sale_date: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Buyer Name *</Label>
                  <Input
                    value={formData.buyer_name}
                    onChange={(e) => setFormData({ ...formData, buyer_name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Buyer Contact</Label>
                  <Input
                    value={formData.buyer_contact}
                    onChange={(e) => setFormData({ ...formData, buyer_contact: e.target.value })}
                    placeholder="Phone or email"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Destination *</Label>
                  <Input
                    value={formData.destination}
                    onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                    placeholder="Where coffee is going"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Quantity (kg) *</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.quantity_kg}
                    onChange={(e) => setFormData({ ...formData, quantity_kg: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Price per kg (UGX) *</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.price_per_kg}
                    onChange={(e) => setFormData({ ...formData, price_per_kg: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Total Amount (UGX)</Label>
                  <Input
                    type="number"
                    value={formData.total_amount}
                    readOnly
                    className="bg-muted"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Payment Method *</Label>
                  <Select value={formData.payment_method} onValueChange={(value) => setFormData({ ...formData, payment_method: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cash">Cash</SelectItem>
                      <SelectItem value="mobile_money">Mobile Money</SelectItem>
                      <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                      <SelectItem value="check">Check</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Money Received By *</Label>
                  <Input
                    value={formData.money_received_by}
                    onChange={(e) => setFormData({ ...formData, money_received_by: e.target.value })}
                    placeholder="Name of person who received payment"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Quality Grade *</Label>
                  <Select value={formData.quality_grade} onValueChange={(value) => setFormData({ ...formData, quality_grade: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select grade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="premium">Premium</SelectItem>
                      <SelectItem value="grade_a">Grade A</SelectItem>
                      <SelectItem value="grade_b">Grade B</SelectItem>
                      <SelectItem value="standard">Standard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Notes</Label>
                <Input
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Additional details"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingSale ? 'Update' : 'Record'} Sale
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Buyer</TableHead>
              <TableHead>Destination</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Price/kg</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead>Received By</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sales.map((sale) => (
              <TableRow key={sale.id}>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {format(new Date(sale.sale_date), 'MMM dd, yyyy')}
                  </div>
                </TableCell>
                <TableCell>{sale.buyer_name}</TableCell>
                <TableCell>{sale.destination}</TableCell>
                <TableCell>{Number(sale.quantity_kg).toFixed(2)} kg</TableCell>
                <TableCell>UGX {Number(sale.price_per_kg).toLocaleString()}</TableCell>
                <TableCell className="font-medium">UGX {Number(sale.total_amount).toLocaleString()}</TableCell>
                <TableCell className="capitalize">{sale.payment_method.replace('_', ' ')}</TableCell>
                <TableCell>{sale.money_received_by}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(sale)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(sale.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default SalesRecords;
