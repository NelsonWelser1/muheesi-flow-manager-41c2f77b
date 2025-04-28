
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import AddHealthRecordForm from './AddHealthRecordForm';
import { useHealthRecords } from '@/hooks/useHealthRecords';
import { supabase } from '@/integrations/supabase/supabase';

const AddHealthRecordDialog = ({ cattleData: propsCattleData = [] }) => {
  const [open, setOpen] = React.useState(false);
  const [cattleData, setCattleData] = useState(propsCattleData);
  const [loading, setLoading] = useState(propsCattleData.length === 0);
  const { refetch } = useHealthRecords();

  // Fetch cattle data if none provided
  useEffect(() => {
    const fetchCattleData = async () => {
      if (propsCattleData.length === 0) {
        try {
          setLoading(true);
          const { data, error } = await supabase
            .from('cattle_inventory')
            .select('id, tag_number, name');
          
          if (error) throw error;
          setCattleData(data || []);
        } catch (error) {
          console.error('Error fetching cattle data:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchCattleData();
  }, [propsCattleData.length]);

  // Close dialog and refetch data
  const handleSuccess = () => {
    setOpen(false);
    refetch(); // Refresh the records after successful submission
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <Button 
          className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white hover:opacity-90"
          disabled={loading}
        >
          <PlusCircle className="h-4 w-4" />
          Add Health Record
        </Button>
      </Dialog.Trigger>
      <DialogContent className="sm:max-w-[900px]">
        <AddHealthRecordForm
          onCancel={() => setOpen(false)}
          onSuccess={handleSuccess}
          cattleData={cattleData}
        />
      </DialogContent>
    </Dialog>
  );
};

export default AddHealthRecordDialog;
