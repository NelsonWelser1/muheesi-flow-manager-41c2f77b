import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ClipboardList, Plus, Edit, Trash2, Calendar, Check, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/supabase';
import { useToast } from "@/hooks/use-toast";
import { format } from 'date-fns';
import KakyingaExportActions from './KakyingaExportActions';
import { 
  processRequisitionData,
  exportRequisitionsToPDF,
  exportRequisitionsToExcel,
  exportRequisitionsToCSV
} from '@/utils/kakyinga/kakyingaExport';

const RequisitionSystem = () => {
  const { toast } = useToast();
  const [requisitions, setRequisitions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingReq, setEditingReq] = useState(null);
  const [formData, setFormData] = useState({
    requisition_number: '',
    request_date: '',
    requested_by: '',
    category: '',
    item_name: '',
    quantity: '',
    priority: 'medium',
    estimated_cost: '',
    justification: '',
    notes: ''
  });

  useEffect(() => {
    fetchRequisitions();
  }, []);

  const fetchRequisitions = async () => {
    try {
      const { data, error } = await supabase
        .from('kakyinga_requisitions')
        .select('*')
        .order('request_date', { ascending: false });

      if (error) throw error;
      setRequisitions(data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch requisitions",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generateReqNumber = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `KAK-REQ-${year}${month}-${random}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const dataToSubmit = editingReq 
        ? formData 
        : { ...formData, requisition_number: generateReqNumber() };

      if (editingReq) {
        const { error } = await supabase
          .from('kakyinga_requisitions')
          .update(dataToSubmit)
          .eq('id', editingReq.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Requisition updated successfully"
        });
      } else {
        const { error } = await supabase
          .from('kakyinga_requisitions')
          .insert([dataToSubmit]);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Requisition submitted successfully"
        });
      }

      setIsDialogOpen(false);
      resetForm();
      fetchRequisitions();
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleApprove = async (id) => {
    try {
      const { error } = await supabase
        .from('kakyinga_requisitions')
        .update({ 
          status: 'approved',
          approved_date: new Date().toISOString().split('T')[0]
        })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Requisition approved"
      });

      fetchRequisitions();
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleReject = async (id) => {
    try {
      const { error } = await supabase
        .from('kakyinga_requisitions')
        .update({ status: 'rejected' })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Requisition rejected"
      });

      fetchRequisitions();
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this requisition?')) return;

    try {
      const { error } = await supabase
        .from('kakyinga_requisitions')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Requisition deleted successfully"
      });

      fetchRequisitions();
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleEdit = (req) => {
    setEditingReq(req);
    setFormData({
      requisition_number: req.requisition_number,
      request_date: req.request_date,
      requested_by: req.requested_by,
      category: req.category,
      item_name: req.item_name,
      quantity: req.quantity,
      priority: req.priority,
      estimated_cost: req.estimated_cost || '',
      justification: req.justification,
      notes: req.notes || ''
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      requisition_number: '',
      request_date: '',
      requested_by: '',
      category: '',
      item_name: '',
      quantity: '',
      priority: 'medium',
      estimated_cost: '',
      justification: '',
      notes: ''
    });
    setEditingReq(null);
  };

  const getStatusBadge = (status) => {
    const variants = {
      pending: 'secondary',
      approved: 'default',
      rejected: 'destructive'
    };
    return <Badge variant={variants[status]}>{status}</Badge>;
  };

  const getPriorityBadge = (priority) => {
    const colors = {
      low: 'bg-blue-100 text-blue-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-red-100 text-red-800'
    };
    return <Badge className={colors[priority]}>{priority}</Badge>;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <ClipboardList className="h-5 w-5" />
              Requisition System
            </CardTitle>
            <Dialog open={isDialogOpen} onOpenChange={(open) => {
              setIsDialogOpen(open);
              if (!open) resetForm();
            }}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  New Requisition
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{editingReq ? 'Edit Requisition' : 'New Requisition Request'}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Request Date *</Label>
                      <Input
                        type="date"
                        value={formData.request_date}
                        onChange={(e) => setFormData({ ...formData, request_date: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Requested By *</Label>
                      <Input
                        value={formData.requested_by}
                        onChange={(e) => setFormData({ ...formData, requested_by: e.target.value })}
                        placeholder="Your name"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Category *</Label>
                      <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="food">Food & Provisions</SelectItem>
                          <SelectItem value="tools">Tools & Equipment</SelectItem>
                          <SelectItem value="fuel">Fuel & Energy</SelectItem>
                          <SelectItem value="repair_parts">Repair Parts</SelectItem>
                          <SelectItem value="safety">Safety Equipment</SelectItem>
                          <SelectItem value="cleaning">Cleaning Supplies</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Item Name *</Label>
                      <Input
                        value={formData.item_name}
                        onChange={(e) => setFormData({ ...formData, item_name: e.target.value })}
                        placeholder="Specific item needed"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Quantity *</Label>
                      <Input
                        value={formData.quantity}
                        onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                        placeholder="e.g., 5 bags, 20 liters"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Priority *</Label>
                      <Select value={formData.priority} onValueChange={(value) => setFormData({ ...formData, priority: value })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Estimated Cost (UGX)</Label>
                      <Input
                        type="number"
                        value={formData.estimated_cost}
                        onChange={(e) => setFormData({ ...formData, estimated_cost: e.target.value })}
                        placeholder="Approximate cost"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Justification *</Label>
                    <Input
                      value={formData.justification}
                      onChange={(e) => setFormData({ ...formData, justification: e.target.value })}
                      placeholder="Why is this item needed?"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Additional Notes</Label>
                    <Input
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      placeholder="Any other relevant information"
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">
                      {editingReq ? 'Update' : 'Submit'} Requisition
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
          
          <KakyingaExportActions
            data={requisitions}
            recordType="Requisitions"
            defaultFileName="kakyinga-requisitions"
            showDateFilter={true}
            processDataFn={processRequisitionData}
            exportPdfFn={exportRequisitionsToPDF}
            exportExcelFn={exportRequisitionsToExcel}
            exportCsvFn={exportRequisitionsToCSV}
          />
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Req #</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Requested By</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Item</TableHead>
              <TableHead>Qty</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requisitions.map((req) => (
              <TableRow key={req.id}>
                <TableCell className="font-medium">{req.requisition_number}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {format(new Date(req.request_date), 'MMM dd')}
                  </div>
                </TableCell>
                <TableCell>{req.requested_by}</TableCell>
                <TableCell className="capitalize">{req.category.replace('_', ' ')}</TableCell>
                <TableCell>{req.item_name}</TableCell>
                <TableCell>{req.quantity}</TableCell>
                <TableCell>{getPriorityBadge(req.priority)}</TableCell>
                <TableCell>{getStatusBadge(req.status)}</TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    {req.status === 'pending' && (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleApprove(req.id)}
                          title="Approve"
                        >
                          <Check className="h-4 w-4 text-green-600" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleReject(req.id)}
                          title="Reject"
                        >
                          <X className="h-4 w-4 text-red-600" />
                        </Button>
                      </>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(req)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(req.id)}
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

export default RequisitionSystem;
