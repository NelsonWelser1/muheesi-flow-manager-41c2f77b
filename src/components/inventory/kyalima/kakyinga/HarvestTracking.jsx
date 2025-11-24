import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Coffee, Plus, Edit, Trash2, Calendar } from 'lucide-react';
import { supabase } from '@/integrations/supabase/supabase';
import { useToast } from "@/components/ui/use-toast";
import { format } from 'date-fns';

const HarvestTracking = () => {
  const { toast } = useToast();
  const [harvests, setHarvests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingHarvest, setEditingHarvest] = useState(null);
  const [formData, setFormData] = useState({
    harvest_date: '',
    quantity_kg: '',
    harvester_name: '',
    field_section: '',
    quality_grade: '',
    notes: ''
  });

  useEffect(() => {
    fetchHarvests();
  }, []);

  const fetchHarvests = async () => {
    try {
      const { data, error } = await supabase
        .from('kakyinga_fresh_harvest')
        .select('*')
        .order('harvest_date', { ascending: false });

      if (error) throw error;
      setHarvests(data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch harvest records",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingHarvest) {
        const { error } = await supabase
          .from('kakyinga_fresh_harvest')
          .update(formData)
          .eq('id', editingHarvest.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Harvest record updated successfully"
        });
      } else {
        const { error } = await supabase
          .from('kakyinga_fresh_harvest')
          .insert([formData]);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Harvest recorded successfully"
        });
      }

      setIsDialogOpen(false);
      resetForm();
      fetchHarvests();
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this harvest record?')) return;

    try {
      const { error } = await supabase
        .from('kakyinga_fresh_harvest')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Harvest record deleted successfully"
      });

      fetchHarvests();
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleEdit = (harvest) => {
    setEditingHarvest(harvest);
    setFormData({
      harvest_date: harvest.harvest_date,
      quantity_kg: harvest.quantity_kg,
      harvester_name: harvest.harvester_name,
      field_section: harvest.field_section,
      quality_grade: harvest.quality_grade,
      notes: harvest.notes || ''
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      harvest_date: '',
      quantity_kg: '',
      harvester_name: '',
      field_section: '',
      quality_grade: '',
      notes: ''
    });
    setEditingHarvest(null);
  };

  const totalHarvested = harvests.reduce((sum, h) => sum + Number(h.quantity_kg), 0);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <Coffee className="h-5 w-5" />
            Fresh Coffee Harvest Tracking
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Total Harvested: {totalHarvested.toFixed(2)} kg
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Record Harvest
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingHarvest ? 'Edit Harvest Record' : 'Record Fresh Coffee Harvest'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Harvest Date *</Label>
                  <Input
                    type="date"
                    value={formData.harvest_date}
                    onChange={(e) => setFormData({ ...formData, harvest_date: e.target.value })}
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
                  <Label>Harvester Name *</Label>
                  <Input
                    value={formData.harvester_name}
                    onChange={(e) => setFormData({ ...formData, harvester_name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Field Section *</Label>
                  <Input
                    value={formData.field_section}
                    onChange={(e) => setFormData({ ...formData, field_section: e.target.value })}
                    placeholder="e.g., Section A, North Field"
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
                  placeholder="Additional observations or remarks"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingHarvest ? 'Update' : 'Record'} Harvest
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
              <TableHead>Harvester</TableHead>
              <TableHead>Field Section</TableHead>
              <TableHead>Quality Grade</TableHead>
              <TableHead>Notes</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {harvests.map((harvest) => (
              <TableRow key={harvest.id}>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {format(new Date(harvest.harvest_date), 'MMM dd, yyyy')}
                  </div>
                </TableCell>
                <TableCell className="font-medium">{Number(harvest.quantity_kg).toFixed(2)} kg</TableCell>
                <TableCell>{harvest.harvester_name}</TableCell>
                <TableCell>{harvest.field_section}</TableCell>
                <TableCell>
                  <span className="capitalize">{harvest.quality_grade.replace('_', ' ')}</span>
                </TableCell>
                <TableCell>{harvest.notes}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(harvest)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(harvest.id)}
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

export default HarvestTracking;
