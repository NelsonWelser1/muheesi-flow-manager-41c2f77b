
import React from 'react';
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Stethoscope, Save } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const HealthRecordsForm = ({ cattleData, onSubmit, isSubmitting }) => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const { toast } = useToast();

  const recordTypes = [
    "Vaccination", "Treatment", "Examination", "Deworming"
  ];

  const handleFormSubmit = async (data) => {
    try {
      await onSubmit(data);
      reset();
      toast({
        title: "Success",
        description: "Health record added successfully",
      });
    } catch (error) {
      console.error("Error adding health record:", error);
      toast({
        title: "Error",
        description: "Failed to add health record. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-xl flex items-center gap-2">
          <Stethoscope className="h-5 w-5 text-purple-500" />
          Add Health Record
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cattleId">Select Cattle <span className="text-red-500">*</span></Label>
              <Select onValueChange={(value) => register("cattleId").onChange({ target: { value } })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select cattle" />
                </SelectTrigger>
                <SelectContent>
                  {cattleData.map((cattle) => (
                    <SelectItem key={cattle.id} value={cattle.id}>
                      {cattle.tagNumber} - {cattle.name || "Unnamed"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.cattleId && <p className="text-red-500 text-sm">{errors.cattleId.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="recordDate">Record Date <span className="text-red-500">*</span></Label>
              <Input
                id="recordDate"
                type="date"
                defaultValue={new Date().toISOString().slice(0, 10)}
                {...register("recordDate", { required: "Date is required" })}
              />
              {errors.recordDate && <p className="text-red-500 text-sm">{errors.recordDate.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="recordType">Record Type <span className="text-red-500">*</span></Label>
              <Select onValueChange={(value) => register("recordType").onChange({ target: { value } })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select record type" />
                </SelectTrigger>
                <SelectContent>
                  {recordTypes.map((type) => (
                    <SelectItem key={type} value={type.toLowerCase()}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.recordType && <p className="text-red-500 text-sm">{errors.recordType.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="administeredBy">Administered By</Label>
              <Input
                id="administeredBy"
                placeholder="Name of vet or caretaker"
                {...register("administeredBy")}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description <span className="text-red-500">*</span></Label>
            <Textarea
              id="description"
              placeholder="Describe the treatment, vaccination or examination"
              {...register("description", { required: "Description is required" })}
              className="min-h-[80px]"
            />
            {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="treatment">Treatment/Medication</Label>
              <Input
                id="treatment"
                placeholder="Medication or treatment provided"
                {...register("treatment")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="nextDueDate">Next Due Date</Label>
              <Input
                id="nextDueDate"
                type="date"
                {...register("nextDueDate")}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              placeholder="Additional notes or observations"
              {...register("notes")}
              className="min-h-[80px]"
            />
          </div>

          <div className="flex justify-end">
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              Save Record
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default HealthRecordsForm;
