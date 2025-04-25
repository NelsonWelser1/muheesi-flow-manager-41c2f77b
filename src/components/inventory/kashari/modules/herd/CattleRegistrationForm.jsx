
import React from 'react';
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Label } from "@/components/ui/label";
import { Beef, Save, RotateCcw, Loader2 } from "lucide-react";
import { useCattleInventory } from '@/hooks/useCattleInventory';

const CattleRegistrationForm = () => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const { toast } = useToast();
  const { addCattle } = useCattleInventory('kashari');

  const cattleBreeds = [
    "Holstein-Friesian", "Jersey", "Guernsey", "Ayrshire", "Brown Swiss",
    "Ankole", "Boran", "Sahiwal", "N'Dama", "Zebu", "Nganda", "Mixed-breed"
  ];

  const cattleTypes = [
    "Dairy Cow", "Bull", "Heifer", "Calf", "Steer"
  ];

  const handleFormSubmit = async (data) => {
    try {
      // Format data before submission
      const formattedData = {
        ...data,
        weight: data.weight ? parseFloat(data.weight) : null,
      };

      // Submit to Supabase via our custom hook
      await addCattle.mutateAsync(formattedData);
      
      // Reset form after successful submission
      reset();
    } catch (error) {
      console.error("Error in form submission:", error);
      // Toast notification is handled in the hook's onError
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-xl flex items-center gap-2">
          <Beef className="h-5 w-5 text-orange-500" />
          Register New Cattle
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tagNumber">Tag Number <span className="text-red-500">*</span></Label>
              <Input
                id="tagNumber"
                placeholder="KF-2023-001"
                {...register("tag_number", { required: "Tag number is required" })}
              />
              {errors.tag_number && <p className="text-red-500 text-sm">{errors.tag_number.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="Cattle name (optional)"
                {...register("name")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Type <span className="text-red-500">*</span></Label>
              <Select 
                onValueChange={(value) => register("type").onChange({ target: { value } })} 
                defaultValue=""
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select cattle type" />
                </SelectTrigger>
                <SelectContent>
                  {cattleTypes.map((type) => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.type && <p className="text-red-500 text-sm">{errors.type.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="breed">Breed <span className="text-red-500">*</span></Label>
              <Select 
                onValueChange={(value) => register("breed").onChange({ target: { value } })}
                defaultValue=""
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select breed" />
                </SelectTrigger>
                <SelectContent>
                  {cattleBreeds.map((breed) => (
                    <SelectItem key={breed} value={breed}>{breed}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.breed && <p className="text-red-500 text-sm">{errors.breed.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="dateOfBirth">Date of Birth</Label>
              <Input
                id="dateOfBirth"
                type="date"
                {...register("date_of_birth")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="weight">Weight (kg)</Label>
              <Input
                id="weight"
                type="number"
                min="0"
                step="0.1"
                placeholder="Weight in kg"
                {...register("weight", { 
                  valueAsNumber: true,
                  validate: value => !value || value > 0 || "Weight must be greater than 0" 
                })}
              />
              {errors.weight && <p className="text-red-500 text-sm">{errors.weight.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="healthStatus">Health Status</Label>
              <Select 
                defaultValue="good"
                onValueChange={(value) => register("health_status").onChange({ target: { value } })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select health status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="excellent">Excellent</SelectItem>
                  <SelectItem value="good">Good</SelectItem>
                  <SelectItem value="fair">Fair</SelectItem>
                  <SelectItem value="poor">Poor</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="purchaseDate">Purchase Date</Label>
              <Input
                id="purchaseDate"
                type="date"
                {...register("purchase_date")}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              placeholder="Additional information about the cattle"
              className="min-h-[100px]"
              {...register("notes")}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => reset()}
              className="flex items-center gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Reset
            </Button>
            <Button 
              type="submit" 
              disabled={addCattle.isPending}
              className="flex items-center gap-2"
            >
              {addCattle.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              Register Cattle
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default CattleRegistrationForm;
