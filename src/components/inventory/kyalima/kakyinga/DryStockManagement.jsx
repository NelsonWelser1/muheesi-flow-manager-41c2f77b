import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Package, Plus, Edit, Trash2, Calendar } from 'lucide-react';
import { supabase } from '@/integrations/supabase/supabase';
import { useToast } from "@/components/ui/use-toast";
import { format } from 'date-fns';

const DryStockManagement = () => {
  const { toast } = useToast();
  const [stocks, setStocks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingStock, setEditingStock] = useState(null);
  const [formData, setFormData] = useState({
    entry_date: '',
    quantity_kg: '',
    source: '',
    quality_grade: '',
    moisture_content: '',
    batch_number: '',
    location: '',
    notes: ''
  });

  useEffect(() => {
    fetchStocks();
  }, []);

  const fetchStocks = async () => {
    try {
      const { data, error } = await supabase
        .from('kakyinga_dry_coffee_stock')
        .select('*')
        .order('entry_date', { ascending: false });

      if (error) throw error;
      setStocks(data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch dry stock records",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingStock) {
        const { error } = await supabase
          .from('kakyinga_dry_coffee_stock')
          .update(formData)
          .eq('id', editingStock.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Stock record updated successfully"
        });
      } else {
        const { error } = await supabase
          .from('kakyinga_dry_coffee_stock')
          .insert([formData]);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Stock added successfully"
        });
      }

      setIsDialogOpen(false);
      resetForm();
      fetchStocks();
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this stock record?')) return;

    try {
      const { error } = await supabase
        .from('kakyinga_dry_coffee_stock')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Stock record deleted successfully"
      });

      fetchStocks();
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleEdit = (stock) => {
    setEditingStock(stock);
    setFormData({
      entry_date: stock.entry_date,
      quantity_kg: stock.quantity_kg,
      source: stock.source,
      quality_grade: stock.quality_grade,
      moisture_content: stock.moisture_content || '',
      batch_number: stock.batch_number || '',
      location: stock.location,
      notes: stock.notes || ''
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      entry_date: '',
      quantity_kg: '',
      source: '',
      quality_grade: '',
      moisture_content: '',
      batch_number: '',
      location: '',
      notes: ''
    });
    setEditingStock(null);
  };

  const totalStock = stocks.reduce((sum, s) => sum + Number(s.quantity_kg), 0);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Dry Coffee Stock Management
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Total In Stock: {totalStock.toFixed(2)} kg
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Stock
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingStock ? 'Edit Stock Record' : 'Add Dry Coffee Stock'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Entry Date *</Label>
                  <Input
                    type="date"
                    value={formData.entry_date}
                    onChange={(e) => setFormData({ ...formData, entry_date: e.target.value })}
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
                  <Label>Source *</Label>
                  <Select value={formData.source} onValueChange={(value) => setFormData({ ...formData, source: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select source" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dry_beds">Dry Beds</SelectItem>
                      <SelectItem value="taplines">Taplines</SelectItem>
                      <SelectItem value="direct_purchase">Direct Purchase</SelectItem>
                      <SelectItem value="existing_stock">Existing Stock</SelectItem>
                    </SelectContent>
                  </Select>
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
                <div className="space-y-2">
                  <Label>Moisture Content (%)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={formData.moisture_content}
                    onChange={(e) => setFormData({ ...formData, moisture_content: e.target.value })}
                    placeholder="e.g., 12.5"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Batch Number</Label>
                  <Input
                    value={formData.batch_number}
                    onChange={(e) => setFormData({ ...formData, batch_number: e.target.value })}
                    placeholder="e.g., KAK-2024-001"
                  />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label>Storage Location *</Label>
                  <Input
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g., Warehouse A, Section 1"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Notes</Label>
                <Input
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Additional information"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingStock ? 'Update' : 'Add'} Stock
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
              <TableHead>Quantity (kg)</TableHead>
              <TableHead>Source</TableHead>
              <TableHead>Grade</TableHead>
              <TableHead>Moisture %</TableHead>
              <TableHead>Batch</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {stocks.map((stock) => (
              <TableRow key={stock.id}>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {format(new Date(stock.entry_date), 'MMM dd, yyyy')}
                  </div>
                </TableCell>
                <TableCell className="font-medium">{Number(stock.quantity_kg).toFixed(2)} kg</TableCell>
                <TableCell className="capitalize">{stock.source.replace('_', ' ')}</TableCell>
                <TableCell className="capitalize">{stock.quality_grade.replace('_', ' ')}</TableCell>
                <TableCell>{stock.moisture_content ? `${stock.moisture_content}%` : '-'}</TableCell>
                <TableCell>{stock.batch_number || '-'}</TableCell>
                <TableCell>{stock.location}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(stock)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(stock.id)}
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

export default DryStockManagement;
