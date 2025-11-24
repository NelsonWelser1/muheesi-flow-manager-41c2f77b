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
