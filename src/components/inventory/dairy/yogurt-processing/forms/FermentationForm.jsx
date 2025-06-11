
import React from 'react';
import { useForm } from 'react-hook-form';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from '@/integrations/supabase/supabase';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const FermentationForm = () => {
  const { toast } = useToast();
  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  const onSubmit = async (data) => {
    try {
      const { error } = await supabase
        .from('yogurt_fermentation')
        .insert([{
          ...data,
          ph_readings: JSON.stringify([{ time: new Date().toISOString(), ph: data.ph_reading }]),
          operator_id: 'current-user-id', // Replace with actual user ID from auth context
        }]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Fermentation record added successfully",
      });

      reset();
    } catch (error) {
      console.error('Error submitting fermentation data:', error);
      toast({
        title: "Error",
        description: "Failed to add fermentation record",
        variant: "destructive",
      });
    }
  };

  const handlePrint = async () => {
    try {
      const formElement = document.getElementById('fermentation-form');
      const canvas = await html2canvas(formElement);
      const pdf = new jsPDF();
      
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, 210, 297);
      pdf.save('fermentation-record.pdf');
      
      toast({
        title: "Success",
        description: "Form printed to PDF successfully",
      });
    } catch (error) {
      console.error('Error printing form:', error);
      toast({
        title: "Error",
        description: "Failed to print form",
        variant: "destructive",
      });
    }
  };

  const handleShare = async () => {
    try {
      // Example using Web Share API
      if (navigator.share) {
        await navigator.share({
          title: 'Fermentation Record',
          text: 'Yogurt fermentation process details',
          url: window.location.href
        });
      } else {
        // Fallback
        toast({
          title: "Info",
          description: "Sharing not supported on this device",
        });
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Fermentation Process</CardTitle>
      </CardHeader>
      <CardContent>
        <form id="fermentation-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="batch_id">Batch ID</Label>
              <Input
                {...register('batch_id', { required: true })}
                placeholder="Enter batch ID"
              />
            </div>

            <div>
              <Label htmlFor="start_date_time">Start Date & Time</Label>
              <Input
                type="datetime-local"
                {...register('start_date_time', { required: true })}
              />
            </div>

            <div>
              <Label htmlFor="target_temp">Target Temperature (°C)</Label>
              <Input
                type="number"
                step="0.1"
                {...register('target_temp', { required: true })}
              />
            </div>

            <div>
              <Label htmlFor="ph_reading">pH Reading</Label>
              <Input
                type="number"
                step="0.01"
                {...register('ph_reading', { required: true })}
              />
            </div>

            <div>
              <Label htmlFor="duration">Duration (hours)</Label>
              <Input
                type="number"
                {...register('duration', { required: true, min: 0 })}
              />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="observations">Observations</Label>
              <Textarea
                {...register('observations')}
                placeholder="Enter observations about consistency and texture"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-4 justify-end">
            <Button type="button" variant="outline" onClick={handlePrint}>
              Print Form
            </Button>
            <Button type="button" variant="outline" onClick={handleShare}>
              Share
            </Button>
            <Button type="submit">Submit Record</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default FermentationForm;
