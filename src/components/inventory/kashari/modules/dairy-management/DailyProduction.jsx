
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Bug } from "lucide-react";
import { useDairyProductionData } from './hooks/useDairyProductionData';

const DailyProduction = () => {
  const { form, handleSubmit, debugForm, isSubmitting } = useDairyProductionData();

  const onSubmit = (data) => {
    console.log('Form submitted with data:', data);
    handleSubmit(data);
  };

  const handleDebugClick = () => {
    const formValues = debugForm();
    console.log('Debug button clicked. Current form state:', formValues);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Daily Milk Production</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-end mb-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={handleDebugClick}
            className="flex items-center gap-2"
          >
            <Bug className="h-4 w-4" /> Debug Form
          </Button>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantity (Liters)</FormLabel>
                  <FormControl>
                    <Input 
                      id="quantity" 
                      type="number" 
                      placeholder="Enter quantity" 
                      {...field} 
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="fat_content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fat Content (%)</FormLabel>
                  <FormControl>
                    <Input 
                      id="fatContent" 
                      type="number" 
                      step="0.1" 
                      placeholder="Enter fat content" 
                      {...field} 
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Input 
                      id="notes" 
                      placeholder="Additional notes" 
                      {...field} 
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Recording...' : 'Record Production'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default DailyProduction;
