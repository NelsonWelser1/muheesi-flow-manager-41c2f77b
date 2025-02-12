import React from 'react';
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

const LabelingForm = ({ onSubmit }) => {
  const { register, handleSubmit, reset, setValue } = useForm();
  const { toast } = useToast();
  const [date, setDate] = React.useState();

  const handleFormSubmit = async (data) => {
    try {
      console.log('Labeling data:', data);
      onSubmit?.(data);
      toast({
        title: "Success",
        description: "Labeling details have been saved successfully.",
      });
      reset();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save labeling details.",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Batch ID</Label>
          <Input {...register("batchId", { required: true })} placeholder="Enter batch ID" />
        </div>

        <div className="space-y-2">
          <Label>Production Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : "Select production date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(newDate) => {
                  setDate(newDate);
                  setValue("productionDate", newDate?.toISOString());
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label>Brand Name</Label>
          <Input {...register("brandName")} placeholder="Enter brand name" />
        </div>

        <div className="space-y-2">
          <Label>Product Name</Label>
          <Input {...register("productName")} placeholder="Enter product name" />
        </div>

        <div className="space-y-2">
          <Label>Net Weight</Label>
          <Input 
            type="number" 
            {...register("netWeight", { min: 0 })}
            placeholder="Enter net weight" 
          />
        </div>

        <div className="space-y-2">
          <Label>Barcode Number</Label>
          <Input {...register("barcode")} placeholder="Enter barcode number" />
        </div>

        <div className="space-y-2 col-span-2">
          <Label>Ingredients</Label>
          <Textarea
            {...register("ingredients")}
            placeholder="Enter ingredients list"
            className="min-h-[100px]"
          />
        </div>

        <div className="space-y-2 col-span-2">
          <Label>Nutritional Information</Label>
          <Textarea
            {...register("nutritionalInfo")}
            placeholder="Enter nutritional information"
            className="min-h-[100px]"
          />
        </div>

        <div className="space-y-2 col-span-2">
          <Label>Storage Instructions</Label>
          <Input 
            {...register("storageInstructions")}
            placeholder="Enter storage instructions"
          />
        </div>
      </div>

      <Button type="submit" className="w-full">Save Labeling Details</Button>
    </form>
  );
};

export default LabelingForm;
