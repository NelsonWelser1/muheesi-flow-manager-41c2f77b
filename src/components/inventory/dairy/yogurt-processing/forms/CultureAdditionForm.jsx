
import React from 'react';
import { useForm } from 'react-hook-form';
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from '@/integrations/supabase/supabase';
import { useSupabaseAuth } from '@/integrations/supabase/auth';

const CultureAdditionForm = () => {
  const { toast } = useToast();
  const auth = useSupabaseAuth();
  const { register, handleSubmit, setValue, formState: { errors }, reset } = useForm({
    defaultValues: {
      yogurt_type: '',
      culture_type: '',
      culture_quantity: '',
      additives: '',
      pre_fermentation_temp: '',
      expected_duration: ''
    }
  });

  const onSubmit = async (data) => {
    try {
      if (!auth?.session?.user?.id) {
        toast({
          title: "Authentication Error",
          description: "You must be logged in to submit records",
          variant: "destructive",
        });
        return;
      }

      // Convert additives string to array format expected by PostgreSQL
      const additivesList = data.additives
        ? `{${data.additives.split(',').map(item => item.trim()).join(',')}}`
        : '{}';

      const { error } = await supabase
        .from('yogurt_culture_addition')
        .insert([{
          ...data,
          additives: additivesList,
          batch_id: `BATCH-${Date.now()}`,
          date_time: new Date().toISOString(),
          operator_id: auth.session.user.id
        }]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Culture addition record added successfully",
      });

      reset();
    } catch (error) {
      console.error('Error submitting culture addition data:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to add culture addition record",
        variant: "destructive",
      });
    }
  };

  const handleYogurtTypeChange = (value) => {
    setValue('yogurt_type', value);
  };

  if (!auth?.session) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Culture Addition & Fermentation Setup</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Please log in to submit culture addition records.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Culture Addition & Fermentation Setup</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="yogurt_type">Type of Yogurt</Label>
              <Select onValueChange={handleYogurtTypeChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select yogurt type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="plain">Plain</SelectItem>
                  <SelectItem value="flavored">Flavored</SelectItem>
                  <SelectItem value="greek">Greek-style</SelectItem>
                  <SelectItem value="low-fat">Low-Fat</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="culture_type">Culture Type</Label>
              <Input
                {...register('culture_type', { required: "Culture type is required" })}
                placeholder="Enter culture type"
              />
              {errors.culture_type && (
                <p className="text-sm text-red-500">{errors.culture_type.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="culture_quantity">Culture Quantity (g/mL)</Label>
              <Input
                type="number"
                step="0.01"
                {...register('culture_quantity', { 
                  required: "Culture quantity is required",
                  min: { value: 0, message: "Quantity must be positive" }
                })}
              />
              {errors.culture_quantity && (
                <p className="text-sm text-red-500">{errors.culture_quantity.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="additives">Additives (comma separated)</Label>
              <Input
                {...register('additives')}
                placeholder="e.g., sugar, vanilla, pectin"
              />
            </div>

            <div>
              <Label htmlFor="pre_fermentation_temp">Pre-Fermentation Temperature (°C)</Label>
              <Input
                type="number"
                step="0.1"
                {...register('pre_fermentation_temp', { 
                  required: "Temperature is required" 
                })}
              />
              {errors.pre_fermentation_temp && (
                <p className="text-sm text-red-500">{errors.pre_fermentation_temp.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="expected_duration">Expected Duration (hours)</Label>
              <Input
                type="number"
                {...register('expected_duration', { 
                  required: "Duration is required",
                  min: { value: 0, message: "Duration must be positive" }
                })}
              />
              {errors.expected_duration && (
                <p className="text-sm text-red-500">{errors.expected_duration.message}</p>
              )}
            </div>
          </div>

          <Button type="submit" className="w-full">Submit Record</Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default CultureAdditionForm;
