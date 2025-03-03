
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Plus, Edit, Trash2, Save, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/supabase";
import { toast } from "sonner";

const formSchema = z.object({
  animal_id: z.string().min(1, { message: "Animal ID is required" }),
  species: z.string().min(1, { message: "Species is required" }),
  breed: z.string().min(1, { message: "Breed is required" }),
  age: z.string().min(1, { message: "Age is required" }),
  health_status: z.string().min(1, { message: "Health status is required" }),
  notes: z.string().optional(),
});

const LivestockManagement = () => {
  const [animals, setAnimals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      animal_id: "",
      species: "",
      breed: "",
      age: "",
      health_status: "",
      notes: "",
    },
  });

  const fetchAnimals = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('livestock')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setAnimals(data || []);
    } catch (error) {
      console.error('Error fetching livestock:', error);
      toast.error('Failed to load livestock data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Create livestock table if it doesn't exist
    const createLivestockTable = async () => {
      try {
        // Check if table exists first
        const { error: checkError } = await supabase
          .from('livestock')
          .select('count(*)')
          .limit(1);
        
        if (checkError && checkError.code === '42P01') {
          // Table doesn't exist, create it
          const { error: createError } = await supabase.rpc('create_livestock_table');
          if (createError) throw createError;
          console.log('Livestock table created successfully');
        }
        
        fetchAnimals();
      } catch (error) {
        console.error('Error setting up livestock table:', error);
        toast.error('Failed to initialize livestock table');
        setIsLoading(false);
      }
    };
    
    createLivestockTable();
  }, []);

  const onSubmit = async (values) => {
    try {
      if (isEditing) {
        const { error } = await supabase
          .from('livestock')
          .update(values)
          .eq('id', editingId);
        
        if (error) throw error;
        toast.success('Livestock record updated successfully');
      } else {
        const { error } = await supabase
          .from('livestock')
          .insert([values]);
        
        if (error) throw error;
        toast.success('Livestock record added successfully');
      }
      
      resetForm();
      fetchAnimals();
    } catch (error) {
      console.error('Error saving livestock:', error);
      toast.error(isEditing ? 'Failed to update record' : 'Failed to add record');
    }
  };

  const handleEdit = (animal) => {
    setIsEditing(true);
    setEditingId(animal.id);
    setShowForm(true);
    
    form.reset({
      animal_id: animal.animal_id,
      species: animal.species,
      breed: animal.breed,
      age: animal.age,
      health_status: animal.health_status,
      notes: animal.notes || "",
    });
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this record?')) {
      try {
        const { error } = await supabase
          .from('livestock')
          .delete()
          .eq('id', id);
        
        if (error) throw error;
        toast.success('Livestock record deleted successfully');
        fetchAnimals();
      } catch (error) {
        console.error('Error deleting livestock:', error);
        toast.error('Failed to delete record');
      }
    }
  };

  const resetForm = () => {
    form.reset({
      animal_id: "",
      species: "",
      breed: "",
      age: "",
      health_status: "",
      notes: "",
    });
    setIsEditing(false);
    setEditingId(null);
    setShowForm(false);
  };

  const getHealthStatusColor = (status) => {
    switch (status) {
      case 'Healthy':
        return 'bg-green-100 text-green-800';
      case 'Sick':
        return 'bg-red-100 text-red-800';
      case 'Under Treatment':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Livestock Management</CardTitle>
        <Button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2">
          {showForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          {showForm ? 'Cancel' : 'Add Animal'}
        </Button>
      </CardHeader>
      <CardContent>
        {showForm && (
          <Card className="mb-6 border border-gray-200">
            <CardContent className="pt-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="animal_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Animal ID</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter animal ID" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="species"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Species</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a species" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Cow">Cow</SelectItem>
                            <SelectItem value="Goat">Goat</SelectItem>
                            <SelectItem value="Chicken">Chicken</SelectItem>
                            <SelectItem value="Sheep">Sheep</SelectItem>
                            <SelectItem value="Pig">Pig</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="breed"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Breed</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter breed" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="age"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Age (in months)</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter age in months" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="health_status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Health Status</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select health status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Healthy">Healthy</SelectItem>
                            <SelectItem value="Sick">Sick</SelectItem>
                            <SelectItem value="Under Treatment">Under Treatment</SelectItem>
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
                      <FormItem className="md:col-span-2">
                        <FormLabel>Notes (Optional)</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Enter any additional notes" 
                            className="min-h-[80px]" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="flex justify-end gap-2 md:col-span-2 mt-4">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={resetForm}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" className="flex items-center gap-2">
                      <Save className="h-4 w-4" />
                      {isEditing ? 'Update' : 'Save'}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        )}
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            {animals.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No livestock records found. Add your first animal by clicking the button above.</p>
              </div>
            ) : (
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Animal ID</TableHead>
                      <TableHead>Species</TableHead>
                      <TableHead>Breed</TableHead>
                      <TableHead>Age (months)</TableHead>
                      <TableHead>Health Status</TableHead>
                      <TableHead>Timestamp</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {animals.map((animal) => (
                      <TableRow key={animal.id}>
                        <TableCell className="font-medium">{animal.animal_id}</TableCell>
                        <TableCell>{animal.species}</TableCell>
                        <TableCell>{animal.breed}</TableCell>
                        <TableCell>{animal.age}</TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getHealthStatusColor(animal.health_status)}`}>
                            {animal.health_status}
                          </span>
                        </TableCell>
                        <TableCell>
                          {new Date(animal.created_at).toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleEdit(animal)}
                              className="h-8 w-8 p-0"
                            >
                              <Edit className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleDelete(animal.id)}
                              className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Delete</span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default LivestockManagement;
