
import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { 
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useCattleFattening } from "../../../../hooks/useCattleFattening";
import { format } from 'date-fns';

const healthRecordSchema = z.object({
  tagNumber: z.string().min(1, { message: "Tag number is required" }),
  recordDate: z.string().min(1, { message: "Date is required" }),
  recordType: z.string().min(1, { message: "Record type is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  treatment: z.string().optional(),
  performedBy: z.string().optional(),
  notes: z.string().optional(),
});

const CattleHealth = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [healthRecords, setHealthRecords] = useState([]);
  const { fatteningData, updateFatteningProgram } = useCattleFattening('kashari');
  const [cattleOptions, setCattleOptions] = useState([]);
  
  const form = useForm({
    resolver: zodResolver(healthRecordSchema),
    defaultValues: {
      tagNumber: "",
      recordDate: new Date().toISOString().split('T')[0],
      recordType: "examination",
      description: "",
      treatment: "",
      performedBy: "",
      notes: "",
    },
  });

  useEffect(() => {
    // Extract cattle options from fattening data
    if (fatteningData && fatteningData.length > 0) {
      const options = fatteningData.map(animal => ({
        value: animal.tag_number,
        label: `${animal.tag_number} - ${animal.name || 'Unnamed'}`
      }));
      setCattleOptions(options);
      
      // Generate some sample health records for demonstration
      const sampleRecords = [];
      fatteningData.slice(0, 5).forEach(animal => {
        const recordDate = new Date();
        recordDate.setDate(recordDate.getDate() - Math.floor(Math.random() * 30));
        
        sampleRecords.push({
          id: `hr-${Math.random().toString(36).substring(2, 9)}`,
          tagNumber: animal.tag_number,
          animalName: animal.name || 'Unnamed',
          recordDate: format(recordDate, 'yyyy-MM-dd'),
          recordType: ['vaccination', 'examination', 'treatment'][Math.floor(Math.random() * 3)],
          description: 'Routine health check',
          treatment: 'None required',
          performedBy: 'Dr. John Doe',
          notes: 'Animal in good health'
        });
      });
      
      setHealthRecords(sampleRecords);
    }
  }, [fatteningData]);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      // Find the animal in the fattening data
      const animal = fatteningData.find(a => a.tag_number === data.tagNumber);
      
      if (!animal) {
        toast({
          title: "Error",
          description: "Animal not found",
          variant: "destructive",
        });
        return;
      }
      
      // Create the health record
      const newRecord = {
        id: `hr-${Math.random().toString(36).substring(2, 9)}`,
        tagNumber: data.tagNumber,
        animalName: animal.name || 'Unnamed',
        recordDate: data.recordDate,
        recordType: data.recordType,
        description: data.description,
        treatment: data.treatment,
        performedBy: data.performedBy,
        notes: data.notes
      };
      
      // Get existing notes as an object
      let notesObj = {};
      try {
        notesObj = animal.notes ? JSON.parse(animal.notes) : {};
      } catch (e) {
        notesObj = { additionalNotes: animal.notes };
      }
      
      // Add or update health records array in the notes object
      if (!notesObj.healthRecords) {
        notesObj.healthRecords = [];
      }
      notesObj.healthRecords.push({
        date: data.recordDate,
        type: data.recordType,
        description: data.description,
        treatment: data.treatment,
        performedBy: data.performedBy,
        notes: data.notes
      });
      
      // Update the animal's health status if this is a recent record
      if (data.recordType === 'treatment') {
        notesObj.healthStatus = 'under treatment';
        notesObj.lastTreatmentDate = data.recordDate;
      }
      
      // Update the animal record
      await updateFatteningProgram(animal.id, {
        notes: JSON.stringify(notesObj)
      });
      
      // Add to local state
      setHealthRecords(prev => [...prev, newRecord]);
      
      form.reset();
      
      toast({
        title: "Success",
        description: "Health record added successfully",
      });
    } catch (error) {
      console.error("Error adding health record:", error);
      toast({
        title: "Error",
        description: "Failed to add health record",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Add Health Record</CardTitle>
          <CardDescription>Record vaccinations, treatments, or health examinations</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="tagNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Animal*</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select animal" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {cattleOptions.map(option => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="recordDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date*</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="recordType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Record Type*</FormLabel>
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
                          <SelectItem value="examination">Examination</SelectItem>
                          <SelectItem value="vaccination">Vaccination</SelectItem>
                          <SelectItem value="treatment">Treatment</SelectItem>
                          <SelectItem value="surgery">Surgery</SelectItem>
                          <SelectItem value="medication">Medication</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description*</FormLabel>
                    <FormControl>
                      <Textarea 
                        {...field} 
                        placeholder="Describe the procedure, symptoms, or reason for the record" 
                        className="h-20"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="treatment"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Treatment/Medication</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter treatment details" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="performedBy"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Performed By</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Veterinarian or staff name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Additional Notes</FormLabel>
                    <FormControl>
                      <Textarea 
                        {...field} 
                        placeholder="Any additional information" 
                        className="h-20"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? "Adding Record..." : "Add Health Record"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Health Records</CardTitle>
          <CardDescription>Recent health records for all animals</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tag #</TableHead>
                <TableHead>Animal</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Treatment</TableHead>
                <TableHead>Performed By</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {healthRecords.length > 0 ? (
                healthRecords.map(record => (
                  <TableRow key={record.id}>
                    <TableCell>{record.tagNumber}</TableCell>
                    <TableCell>{record.animalName}</TableCell>
                    <TableCell>{record.recordDate}</TableCell>
                    <TableCell className="capitalize">{record.recordType}</TableCell>
                    <TableCell>{record.description}</TableCell>
                    <TableCell>{record.treatment || "N/A"}</TableCell>
                    <TableCell>{record.performedBy || "N/A"}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-4">No health records found</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default CattleHealth;
