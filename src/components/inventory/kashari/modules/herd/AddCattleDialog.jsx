
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { PlusCircle } from "lucide-react";
import { useCattleInventory } from '@/hooks/useCattleInventory';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

// Basic validation schema for cattle registration
const cattleRegistrationSchema = z.object({
  tag_number: z.string().min(2, { message: "Tag number is required" }),
  name: z.string().optional(),
  type: z.enum(['dairy', 'beef', 'mixed'], { 
    required_error: "Cattle type is required" 
  }),
  breed: z.string().min(2, { message: "Breed is required" }),
  health_status: z.enum(['good', 'critical', 'needs_attention'], { 
    required_error: "Health status is required" 
  })
});

const AddCattleDialog = () => {
  const { addCattle } = useCattleInventory();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const form = useForm({
    resolver: zodResolver(cattleRegistrationSchema),
    defaultValues: {
      tag_number: '',
      name: '',
      type: 'dairy',
      breed: '',
      health_status: 'good'
    }
  });

  const onSubmit = async (data) => {
    try {
      await addCattle.mutateAsync(data);
      setIsDialogOpen(false);
      form.reset();
    } catch (error) {
      console.error("Error adding cattle:", error);
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <PlusCircle className="h-4 w-4" />
          Add Cattle
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Register New Cattle</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Form fields for cattle registration */}
          <div>
            <label>Tag Number</label>
            <input 
              {...form.register('tag_number')} 
              placeholder="Enter tag number" 
              className="w-full border p-2 rounded"
            />
            {form.formState.errors.tag_number && (
              <p className="text-red-500">{form.formState.errors.tag_number.message}</p>
            )}
          </div>
          
          {/* Add more form fields similarly */}
          
          <Button type="submit" className="w-full">
            Register Cattle
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddCattleDialog;
