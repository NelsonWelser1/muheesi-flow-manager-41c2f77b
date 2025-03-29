
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useEffect } from "react";
import { useCattleFattening } from "../../../../hooks/useCattleFattening";

const cattleRegistrationSchema = z.object({
  tagNumber: z.string().min(1, { message: "Tag number is required" }),
  name: z.string().optional(),
  breed: z.string().min(1, { message: "Breed is required" }),
  gender: z.string().min(1, { message: "Gender is required" }),
  dateOfBirth: z.string().optional(),
  acquisitionDate: z.string().min(1, { message: "Acquisition date is required" }),
  initialWeight: z.string().transform(value => parseFloat(value) || 0),
  currentWeight: z.string().transform(value => parseFloat(value) || 0),
  targetWeight: z.string().transform(value => parseFloat(value) || 0),
  feedingRegime: z.string().min(1, { message: "Feeding regime is required" }),
  coatColor: z.string().optional(),
  hornStatus: z.string().optional(),
  physicalCharacteristics: z.string().optional(),
  healthStatus: z.string().min(1, { message: "Health status is required" }),
  notes: z.string().optional(),
});

const CattleRegistration = () => {
  const { toast } = useToast();
  const { addFatteningProgram } = useCattleFattening('kashari');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm({
    resolver: zodResolver(cattleRegistrationSchema),
    defaultValues: {
      tagNumber: "",
      name: "",
      breed: "",
      gender: "male",
      dateOfBirth: "",
      acquisitionDate: new Date().toISOString().split('T')[0],
      initialWeight: "",
      currentWeight: "",
      targetWeight: "",
      feedingRegime: "standard",
      coatColor: "",
      hornStatus: "horned",
      physicalCharacteristics: "",
      healthStatus: "healthy",
      notes: "",
    },
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      // Format the data to match fatteningProgram structure
      const cattleData = {
        tag_number: data.tagNumber,
        name: data.name,
        breed: data.breed,
        date_of_birth: data.dateOfBirth || null,
        entry_weight: parseFloat(data.initialWeight),
        current_weight: parseFloat(data.currentWeight),
        target_weight: parseFloat(data.targetWeight),
        entry_date: data.acquisitionDate,
        feeding_regime: data.feedingRegime,
        status: 'active',
        notes: JSON.stringify({
          gender: data.gender,
          coatColor: data.coatColor,
          hornStatus: data.hornStatus,
          physicalCharacteristics: data.physicalCharacteristics,
          healthStatus: data.healthStatus,
          additionalNotes: data.notes
        })
      };

      // Add the cattle to the fattening program
      const success = await addFatteningProgram(cattleData);
      if (success) {
        form.reset();
        toast({
          title: "Success",
          description: "Cattle registered successfully",
        });
      }
    } catch (error) {
      console.error("Error registering cattle:", error);
      toast({
        title: "Error",
        description: "Failed to register cattle",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cattle Registration</CardTitle>
        <CardDescription>Register a new animal in the herd</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Identification Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Identification</h3>
                
                <FormField
                  control={form.control}
                  name="tagNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tag Number*</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name (Optional)</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="breed"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Breed*</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select breed" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Boran">Boran</SelectItem>
                          <SelectItem value="Ankole Longhorn">Ankole Longhorn</SelectItem>
                          <SelectItem value="Hereford">Hereford</SelectItem>
                          <SelectItem value="Aberdeen">Aberdeen</SelectItem>
                          <SelectItem value="Angus">Angus</SelectItem>
                          <SelectItem value="Charolais">Charolais</SelectItem>
                          <SelectItem value="Mixed">Mixed</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gender*</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              {/* Date and Weight Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Dates & Weight</h3>
                
                <FormField
                  control={form.control}
                  name="dateOfBirth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date of Birth (if known)</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="acquisitionDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Acquisition Date*</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="initialWeight"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Initial Weight (kg)*</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.1" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="currentWeight"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Current Weight (kg)*</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.1" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="targetWeight"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Target Weight (kg)*</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.1" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>
            
            {/* Physical Characteristics */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Physical Characteristics</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField
                  control={form.control}
                  name="coatColor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Coat Color</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="e.g. Black, Brown, White" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="hornStatus"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Horn Status</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="horned">Horned</SelectItem>
                          <SelectItem value="polled">Polled (Naturally Hornless)</SelectItem>
                          <SelectItem value="dehorned">Dehorned</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="feedingRegime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Feeding Regime*</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="standard">Standard</SelectItem>
                          <SelectItem value="intensive">Intensive</SelectItem>
                          <SelectItem value="premium">Premium</SelectItem>
                          <SelectItem value="specialized">Specialized</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="physicalCharacteristics"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Physical Characteristics (Optional)</FormLabel>
                    <FormControl>
                      <Textarea 
                        {...field} 
                        placeholder="Distinctive markings, body condition score, frame size, etc." 
                        className="h-20"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            {/* Health Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Health Information</h3>
              
              <FormField
                control={form.control}
                name="healthStatus"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Health Status*</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="healthy">Healthy</SelectItem>
                        <SelectItem value="minor_issues">Minor health issues</SelectItem>
                        <SelectItem value="treatment">Under treatment</SelectItem>
                        <SelectItem value="quarantine">In quarantine</SelectItem>
                        <SelectItem value="observation">Under observation</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Additional Notes</FormLabel>
                    <FormControl>
                      <Textarea 
                        {...field} 
                        placeholder="Any additional information about the animal" 
                        className="h-20"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? "Registering..." : "Register Cattle"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default CattleRegistration;
