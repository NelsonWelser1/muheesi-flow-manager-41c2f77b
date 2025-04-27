
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import HealthRecordForm from './HealthRecordForm';
import { useToast } from "@/components/ui/use-toast";
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/supabase';

const HealthRecordDialog = ({ 
  trigger,
  title = "Add Health Record", 
  initialValues = null,
  onSuccess,
  cattleId = null
}) => {
  const [open, setOpen] = useState(false);
  const [cattleData, setCattleData] = useState([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchCattleData = async () => {
      try {
        setLoading(true);
        let query = supabase
          .from('cattle_inventory')
          .select('id, tag_number, name');

        if (cattleId) {
          query = query.eq('id', cattleId);
        }

        const { data, error } = await query;
        
        if (error) throw error;
        setCattleData(data || []);
      } catch (error) {
        console.error('Error fetching cattle data:', error);
        toast({
          title: "Error",
          description: "Failed to load cattle data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    if (open) {
      fetchCattleData();
    }
  }, [open, cattleId, toast]);

  const handleFormSuccess = () => {
    setOpen(false);
    if (onSuccess) onSuccess();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger ? (
        <DialogTrigger asChild>
          {trigger}
        </DialogTrigger>
      ) : (
        <DialogTrigger asChild>
          <Button 
            variant="default" 
            className="flex items-center gap-2"
          >
            <PlusCircle className="h-4 w-4" />
            Add Health Record
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          {loading ? (
            <div className="text-center py-4">Loading cattle data...</div>
          ) : cattleData.length === 0 ? (
            <div className="text-center py-4">No cattle found. Please add cattle first.</div>
          ) : (
            <HealthRecordForm
              cattleData={cattleData}
              initialValues={initialValues}
              onSuccess={handleFormSuccess}
              onCancel={() => setOpen(false)}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default HealthRecordDialog;
