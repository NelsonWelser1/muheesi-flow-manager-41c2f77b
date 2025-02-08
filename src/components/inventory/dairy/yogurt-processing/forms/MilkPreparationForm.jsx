
import React from 'react';
import { useForm } from 'react-hook-form';
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from '@/integrations/supabase/supabase';
import { useSupabaseAuth } from '@/integrations/supabase/auth';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const MilkPreparationForm = () => {
  const { toast } = useToast();
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const auth = useSupabaseAuth();
  const session = auth?.session;

  const onSubmit = async (data) => {
    try {
      if (!session?.user) {
        throw new Error('You must be logged in to submit records');
      }

      const pre_standardization_fat = Number(data.pre_standardization_fat);
      const target_fat = Number(data.target_fat);

      if (pre_standardization_fat > 99.99 || target_fat > 99.99) {
        throw new Error('Fat percentage must be less than 99.99%');
      }

      const { error } = await supabase
        .from('yogurt_milk_preparation')
        .insert([{
          ...data,
          pre_standardization_fat,
          target_fat,
          milk_volume: Number(data.milk_volume),
          homogenization_duration: Number(data.homogenization_duration),
          operator_id: session.user.id,
        }]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Milk preparation record added successfully",
      });

      reset();
    } catch (error) {
      console.error('Error submitting milk preparation data:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to add milk preparation record",
        variant: "destructive",
      });
    }
  };

  const handlePrint = async () => {
    try {
      const formElement = document.getElementById('milk-preparation-form');
      const canvas = await html2canvas(formElement);
      const pdf = new jsPDF();
      
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, 210, 297);
      pdf.save('milk-preparation-record.pdf');
      
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
      if (navigator.share) {
        await navigator.share({
          title: 'Milk Preparation Record',
          text: 'Yogurt milk preparation process details',
          url: window.location.href
        });
      } else {
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
        <CardTitle>Milk Preparation & Standardization</CardTitle>
      </CardHeader>
      <CardContent>
        <form id="milk-preparation-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="date_time">Date & Time</Label>
              <Input
                type="datetime-local"
                {...register('date_time', { required: true })}
              />
            </div>

            <div>
              <Label htmlFor="batch_id">Batch ID</Label>
              <Input
                {...register('batch_id', { required: true })}
                placeholder="Enter batch ID"
              />
            </div>

            <div>
              <Label htmlFor="milk_volume">Milk Volume (Liters)</Label>
              <Input
                type="number"
                step="0.01"
                {...register('milk_volume', { 
                  required: true, 
                  min: 0,
                  valueAsNumber: true 
                })}
              />
            </div>

            <div>
              <Label htmlFor="pre_standardization_fat">Pre-standardization Fat %</Label>
              <Input
                type="number"
                step="0.01"
                {...register('pre_standardization_fat', { 
                  required: true, 
                  min: 0,
                  max: 99.99,
                  valueAsNumber: true
                })}
              />
              {errors.pre_standardization_fat && (
                <span className="text-sm text-red-500">Fat % must be between 0 and 99.99</span>
              )}
            </div>

            <div>
              <Label htmlFor="target_fat">Target Fat %</Label>
              <Input
                type="number"
                step="0.01"
                {...register('target_fat', { 
                  required: true, 
                  min: 0,
                  max: 99.99,
                  valueAsNumber: true
                })}
              />
              {errors.target_fat && (
                <span className="text-sm text-red-500">Fat % must be between 0 and 99.99</span>
              )}
            </div>

            <div>
              <Label htmlFor="homogenizer_id">Homogenizer ID</Label>
              <Input
                {...register('homogenizer_id', { required: true })}
                placeholder="Enter homogenizer ID"
              />
            </div>

            <div>
              <Label htmlFor="homogenization_duration">Homogenization Duration (minutes)</Label>
              <Input
                type="number"
                {...register('homogenization_duration', { 
                  required: true, 
                  min: 0,
                  valueAsNumber: true
                })}
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

export default MilkPreparationForm;
