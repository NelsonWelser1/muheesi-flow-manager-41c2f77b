
import React, { useState } from 'react';
import { Calendar, Syringe, Activity } from "lucide-react";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useHealthRecords } from '@/hooks/useHealthRecords';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { PlusCircle } from "lucide-react";
import { FlaskConical, ArrowLeft, Save } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";

// Form validation schema
const formSchema = z.object({
  cattle_id: z.string({
    required_error: "Cattle is required",
  }),
  record_date: z.string({
    required_error: "Record date is required",
  }),
  record_type: z.string({
    required_error: "Record type is required",
  }),
  description: z.string({
    required_error: "Description is required",
  }).min(3, {
    message: "Description must be at least 3 characters",
  }),
  treatment: z.string().optional(),
  administered_by: z.string().optional(),
  next_due_date: z.string().optional(),
  notes: z.string().optional(),
});

const AddHealthRecordForm = ({ onCancel, onSuccess, cattleData = [] }) => {
  const { toast } = useToast();
  const { addHealthRecord } = useHealthRecords();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      record_date: new Date().toISOString().split('T')[0],
      record_type: "",
      description: "",
      treatment: "",
      administered_by: "",
      next_due_date: "",
      notes: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      console.log("Form data being submitted:", data);
      await addHealthRecord.mutateAsync(data);
      form.reset();
      if (onSuccess) onSuccess();
      else if (onCancel) onCancel();
    } catch (error) {
      console.error('Form submission error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to add health record",
        variant: "destructive",
      });
    }
  };

  const handleAutoSubmit = () => {
    // Fill form with test data
    form.setValue("cattle_id", cattleData[0]?.id || "");
    form.setValue("record_type", "vaccination");
    form.setValue("description", "Routine vaccination");
    form.setValue("treatment", "FMD Vaccine");
    form.setValue("administered_by", "Dr. Veterinarian");
    form.setValue("next_due_date", new Date(Date.now() + 30*24*60*60*1000).toISOString().split('T')[0]);
    form.setValue("notes", "No adverse reactions observed");
  };

  return (
    <div className="space-y-6">
      {onCancel && (
        <Button 
          variant="ghost" 
          onClick={onCancel} 
          className="flex items-center gap-1 p-0 h-auto mb-2"
        >
          <ArrowLeft size={16} /> Back to Health Records
        </Button>
      )}

      <div className="flex items-center gap-2 mb-2">
        <FlaskConical size={20} className="text-purple-500" />
        <h2 className="text-xl font-semibold">Add Health Record</h2>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="cattle_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select Cattle <span className="text-red-500">*</span></FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select cattle" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {cattleData.map(cattle => (
                        <SelectItem key={cattle.id} value={cattle.id}>
                          {cattle.tag_number} - {cattle.name || 'Unnamed'}
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
              name="record_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Record Date <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="record_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Record Type <span className="text-red-500">*</span></FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select record type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="vaccination">Vaccination</SelectItem>
                    <SelectItem value="treatment">Treatment</SelectItem>
                    <SelectItem value="examination">Examination</SelectItem>
                    <SelectItem value="deworming">Deworming</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description <span className="text-red-500">*</span></FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Describe the treatment, vaccination or examination" 
                    className="min-h-[100px]" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="treatment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Treatment/Medication</FormLabel>
                  <FormControl>
                    <Input placeholder="Medication or treatment provided" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="administered_by"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Administered By</FormLabel>
                  <FormControl>
                    <Input placeholder="Name of vet or caretaker" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="next_due_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Next Due Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
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
                  <Textarea
                    placeholder="Additional notes or observations"
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-between space-x-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleAutoSubmit} 
              className="flex items-center gap-1"
            >
              Test Auto-Submit
            </Button>
            
            <Button 
              type="submit" 
              disabled={addHealthRecord.isPending}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Save Record
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

const AddHealthRecordDialog = ({ cattleData = [] }) => {
  const [open, setOpen] = React.useState(false);
  const { refetch } = useHealthRecords();

  const handleSuccess = () => {
    setOpen(false);
    refetch(); 
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white hover:opacity-90"
          disabled={cattleData.length === 0}
        >
          <PlusCircle className="h-4 w-4" />
          Add Health Record
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[900px]">
        <DialogHeader>
          <DialogTitle>Add Health Record</DialogTitle>
        </DialogHeader>
        <AddHealthRecordForm
          onCancel={() => setOpen(false)}
          onSuccess={handleSuccess}
          cattleData={cattleData}
        />
      </DialogContent>
    </Dialog>
  );
};

const HealthRecordsView = () => {
  const { healthRecords, isLoading, error, refetch } = useHealthRecords();
  const [filterType, setFilterType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [cattleData, setCattleData] = useState([
    { id: '1', tag_number: 'KMF-001', name: 'Bella' },
    { id: '2', tag_number: 'KMF-002', name: 'Daisy' },
    { id: '3', tag_number: 'KMF-003', name: 'Lola' },
  ]);
  
  const totalRecords = healthRecords?.length || 0;
  const vaccinationCount = healthRecords?.filter(r => r.record_type === 'vaccination').length || 0;
  const treatmentCount = healthRecords?.filter(r => r.record_type === 'treatment').length || 0;
  
  const filteredRecords = healthRecords?.filter(record => {
    const matchesType = filterType === 'all' || record.record_type === filterType;
    const matchesSearch = searchTerm === '' || 
      (record.cattle_inventory?.tag_number?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (record.description?.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesType && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Cattle Health Records</h2>
        <div className="flex space-x-2">
          <Button onClick={() => refetch()} variant="outline">Refresh Data</Button>
          <AddHealthRecordDialog cattleData={cattleData} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 border-l-4 border-purple-500">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-muted-foreground">Total Records</p>
              <h3 className="text-2xl font-bold">{totalRecords}</h3>
            </div>
            <Calendar className="h-8 w-8 text-purple-500 opacity-80" />
          </div>
        </Card>
        
        <Card className="p-4 border-l-4 border-blue-500">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-muted-foreground">Vaccinations</p>
              <h3 className="text-2xl font-bold">{vaccinationCount}</h3>
            </div>
            <Syringe className="h-8 w-8 text-blue-500 opacity-80" />
          </div>
        </Card>
        
        <Card className="p-4 border-l-4 border-green-500">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-muted-foreground">Treatments</p>
              <h3 className="text-2xl font-bold">{treatmentCount}</h3>
            </div>
            <Activity className="h-8 w-8 text-green-500 opacity-80" />
          </div>
        </Card>
      </div>

      <div className="flex justify-between items-center gap-4">
        <div className="flex-1">
          <Input 
            placeholder="Search by tag or description..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="examination">Examinations</SelectItem>
            <SelectItem value="vaccination">Vaccinations</SelectItem>
            <SelectItem value="treatment">Treatments</SelectItem>
            <SelectItem value="surgery">Surgeries</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <ScrollArea className="h-[400px]">
          <div className="rounded-md border">
            <table className="w-full">
              <thead className="bg-muted/50 sticky top-0">
                <tr>
                  <th className="p-3 text-left font-medium">Tag #</th>
                  <th className="p-3 text-left font-medium">Record Type</th>
                  <th className="p-3 text-left font-medium">Date</th>
                  <th className="p-3 text-left font-medium">Description</th>
                  <th className="p-3 text-left font-medium">Treatment</th>
                  <th className="p-3 text-left font-medium">Next Due</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr className="border-t">
                    <td className="p-3" colSpan="6">
                      <p className="text-center text-muted-foreground">Loading health records...</p>
                    </td>
                  </tr>
                ) : error ? (
                  <tr className="border-t">
                    <td className="p-3" colSpan="6">
                      <p className="text-center text-red-500">Error loading health records: {error.message}</p>
                    </td>
                  </tr>
                ) : filteredRecords && filteredRecords.length > 0 ? (
                  filteredRecords.map(record => (
                    <tr key={record.id} className="border-t hover:bg-muted/50 transition-colors">
                      <td className="p-3">{record.cattle_inventory?.tag_number || 'N/A'}</td>
                      <td className="p-3 capitalize">{record.record_type}</td>
                      <td className="p-3">{new Date(record.record_date).toLocaleDateString()}</td>
                      <td className="p-3">{record.description}</td>
                      <td className="p-3">{record.treatment || 'N/A'}</td>
                      <td className="p-3">{record.next_due_date ? new Date(record.next_due_date).toLocaleDateString() : 'N/A'}</td>
                    </tr>
                  ))
                ) : (
                  <tr className="border-t">
                    <td className="p-3" colSpan="6">
                      <p className="text-center text-muted-foreground">No health records found</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </ScrollArea>
      </Card>
    </div>
  );
};

export default HealthRecordsView;
