
import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
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
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCattleFattening } from "../../../../hooks/useCattleFattening";
import { format, subDays, differenceInDays } from 'date-fns';

const weightRecordSchema = z.object({
  tagNumber: z.string().min(1, { message: "Tag number is required" }),
  recordDate: z.string().min(1, { message: "Date is required" }),
  weight: z.string().transform(value => parseFloat(value) || 0)
    .refine(value => value > 0, { message: "Weight must be greater than 0" }),
  feedingRegime: z.string().min(1, { message: "Feeding regime is required" }),
  notes: z.string().optional(),
});

const CattleGrowth = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [weightRecords, setWeightRecords] = useState([]);
  const [growthAnalytics, setGrowthAnalytics] = useState({
    topPerformers: [],
    averageDailyGain: 0,
    feedEfficiencyByRegime: {}
  });
  const { fatteningData, updateFatteningProgram } = useCattleFattening('kashari');
  const [cattleOptions, setCattleOptions] = useState([]);
  const [selectedCattle, setSelectedCattle] = useState(null);
  const [cattleGrowthHistory, setCattleGrowthHistory] = useState([]);
  
  const form = useForm({
    resolver: zodResolver(weightRecordSchema),
    defaultValues: {
      tagNumber: "",
      recordDate: new Date().toISOString().split('T')[0],
      weight: "",
      feedingRegime: "standard",
      notes: "",
    },
  });

  useEffect(() => {
    // Extract cattle options from fattening data
    if (fatteningData && fatteningData.length > 0) {
      const options = fatteningData.map(animal => ({
        value: animal.tag_number,
        label: `${animal.tag_number} - ${animal.name || 'Unnamed'}`,
        data: animal
      }));
      setCattleOptions(options);
      
      // Generate sample weight records for demonstration
      generateSampleWeightRecords(fatteningData);
      
      // Calculate growth analytics
      calculateGrowthAnalytics(fatteningData);
    }
  }, [fatteningData]);
  
  const generateSampleWeightRecords = (cattleData) => {
    const sampleRecords = [];
    
    cattleData.slice(0, 8).forEach(animal => {
      // Create 3-5 weight records for each animal
      const recordCount = 3 + Math.floor(Math.random() * 3);
      
      for (let i = 0; i < recordCount; i++) {
        // Calculate a date (more recent records first)
        const recordDate = subDays(new Date(), i * 7);
        
        // Calculate a weight with some random growth
        // Starting with entry weight and adding some random growth
        const baseWeight = animal.entry_weight;
        const daysSinceEntry = differenceInDays(recordDate, new Date(animal.entry_date));
        const randomGrowth = (Math.random() * 0.5 + 0.5) * daysSinceEntry;
        const weight = baseWeight + randomGrowth;
        
        sampleRecords.push({
          id: `wr-${Math.random().toString(36).substring(2, 9)}`,
          tagNumber: animal.tag_number,
          animalName: animal.name || 'Unnamed',
          recordDate: format(recordDate, 'yyyy-MM-dd'),
          weight: weight.toFixed(1),
          feedingRegime: animal.feeding_regime,
          notes: ""
        });
      }
    });
    
    // Sort by date (newest first)
    sampleRecords.sort((a, b) => new Date(b.recordDate) - new Date(a.recordDate));
    
    setWeightRecords(sampleRecords);
  };
  
  const calculateGrowthAnalytics = (cattleData) => {
    // Calculate top performers
    const topPerformers = [...cattleData]
      .filter(animal => animal.daily_gain)
      .sort((a, b) => b.daily_gain - a.daily_gain)
      .slice(0, 5)
      .map(animal => ({
        tagNumber: animal.tag_number,
        name: animal.name || 'Unnamed',
        dailyGain: animal.daily_gain.toFixed(2),
        breed: animal.breed
      }));
      
    // Calculate average daily gain
    const totalGain = cattleData.reduce((sum, animal) => sum + (animal.daily_gain || 0), 0);
    const averageDailyGain = cattleData.length > 0 ? totalGain / cattleData.length : 0;
    
    // Calculate feed efficiency by regime
    const regimeGroups = {};
    cattleData.forEach(animal => {
      const regime = animal.feeding_regime;
      if (!regimeGroups[regime]) {
        regimeGroups[regime] = { count: 0, totalGain: 0 };
      }
      regimeGroups[regime].count++;
      regimeGroups[regime].totalGain += (animal.daily_gain || 0);
    });
    
    const feedEfficiencyByRegime = {};
    Object.keys(regimeGroups).forEach(regime => {
      const group = regimeGroups[regime];
      feedEfficiencyByRegime[regime] = {
        averageGain: group.count > 0 ? (group.totalGain / group.count).toFixed(2) : 0,
        count: group.count
      };
    });
    
    setGrowthAnalytics({
      topPerformers,
      averageDailyGain: averageDailyGain.toFixed(2),
      feedEfficiencyByRegime
    });
  };
  
  const handleCattleSelect = (tagNumber) => {
    const animal = cattleOptions.find(option => option.value === tagNumber)?.data;
    setSelectedCattle(animal);
    
    if (animal) {
      // Get weight records for this animal
      const history = weightRecords
        .filter(record => record.tagNumber === tagNumber)
        .sort((a, b) => new Date(a.recordDate) - new Date(b.recordDate));
      
      setCattleGrowthHistory(history);
    }
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      // Find the animal
      const animal = fatteningData.find(a => a.tag_number === data.tagNumber);
      
      if (!animal) {
        toast({
          title: "Error",
          description: "Animal not found",
          variant: "destructive",
        });
        return;
      }
      
      // Create the weight record
      const newRecord = {
        id: `wr-${Math.random().toString(36).substring(2, 9)}`,
        tagNumber: data.tagNumber,
        animalName: animal.name || 'Unnamed',
        recordDate: data.recordDate,
        weight: parseFloat(data.weight).toFixed(1),
        feedingRegime: data.feedingRegime,
        notes: data.notes
      };
      
      // Get existing notes as an object
      let notesObj = {};
      try {
        notesObj = animal.notes ? JSON.parse(animal.notes) : {};
      } catch (e) {
        notesObj = { additionalNotes: animal.notes };
      }
      
      // Add or update weight records array in the notes object
      if (!notesObj.weightRecords) {
        notesObj.weightRecords = [];
      }
      notesObj.weightRecords.push({
        date: data.recordDate,
        weight: parseFloat(data.weight),
        feedingRegime: data.feedingRegime,
        notes: data.notes
      });
      
      // Update current weight if this is the most recent record
      const recordDate = new Date(data.recordDate);
      const currentDate = new Date();
      
      if (!animal.latest_weight_date || 
          recordDate > new Date(animal.latest_weight_date)) {
        
        // Calculate new daily gain
        const entryDate = new Date(animal.entry_date);
        const daysSinceEntry = differenceInDays(recordDate, entryDate);
        const weightGain = parseFloat(data.weight) - animal.entry_weight;
        const dailyGain = daysSinceEntry > 0 ? weightGain / daysSinceEntry : 0;
        
        // Update the animal record with new weight and calculated daily gain
        await updateFatteningProgram(animal.id, {
          current_weight: parseFloat(data.weight),
          daily_gain: dailyGain,
          feeding_regime: data.feedingRegime,
          latest_weight_date: data.recordDate,
          notes: JSON.stringify(notesObj)
        });
      } else {
        // Just update the notes
        await updateFatteningProgram(animal.id, {
          notes: JSON.stringify(notesObj)
        });
      }
      
      // Add to local state
      setWeightRecords(prev => [newRecord, ...prev]);
      
      // If this is the currently selected animal, update its history
      if (selectedCattle && selectedCattle.tag_number === data.tagNumber) {
        setCattleGrowthHistory(prev => [...prev, newRecord].sort(
          (a, b) => new Date(a.recordDate) - new Date(b.recordDate)
        ));
      }
      
      form.reset();
      
      toast({
        title: "Success",
        description: "Weight record added successfully",
      });
    } catch (error) {
      console.error("Error adding weight record:", error);
      toast({
        title: "Error",
        description: "Failed to add weight record",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Tabs defaultValue="records" className="w-full">
      <TabsList className="grid grid-cols-3 mb-4">
        <TabsTrigger value="records">Weight Records</TabsTrigger>
        <TabsTrigger value="analysis">Growth Analysis</TabsTrigger>
        <TabsTrigger value="individual">Individual Animal Growth</TabsTrigger>
      </TabsList>
      
      <TabsContent value="records">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Add Weight Record</CardTitle>
              <CardDescription>Record animal weights to track growth performance</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="weight"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Weight (kg)*</FormLabel>
                          <FormControl>
                            <Input type="number" step="0.1" {...field} />
                          </FormControl>
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
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Notes</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Any additional notes" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button type="submit" disabled={isSubmitting} className="w-full">
                    {isSubmitting ? "Adding Record..." : "Add Weight Record"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Recent Weight Records</CardTitle>
              <CardDescription>Recent weight measurements for all animals</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tag #</TableHead>
                    <TableHead>Animal</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Weight (kg)</TableHead>
                    <TableHead>Feeding Regime</TableHead>
                    <TableHead>Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {weightRecords.length > 0 ? (
                    weightRecords.map(record => (
                      <TableRow key={record.id}>
                        <TableCell>{record.tagNumber}</TableCell>
                        <TableCell>{record.animalName}</TableCell>
                        <TableCell>{record.recordDate}</TableCell>
                        <TableCell>{record.weight}</TableCell>
                        <TableCell className="capitalize">{record.feedingRegime}</TableCell>
                        <TableCell>{record.notes || "N/A"}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-4">No weight records found</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </TabsContent>
      
      <TabsContent value="analysis">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Average Daily Gain</CardTitle>
                <CardDescription>Overall herd performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-green-600">{growthAnalytics.averageDailyGain} kg/day</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Feed Efficiency</CardTitle>
                <CardDescription>Average daily gain by feeding regime</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Object.entries(growthAnalytics.feedEfficiencyByRegime).map(([regime, data]) => (
                    <div key={regime} className="flex justify-between items-center">
                      <span className="capitalize">{regime}</span>
                      <div className="flex items-center">
                        <span className="font-semibold">{data.averageGain} kg/day</span>
                        <span className="text-muted-foreground text-sm ml-2">({data.count} animals)</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Herd Summary</CardTitle>
                <CardDescription>Current statistics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Total Animals:</span>
                    <span className="font-semibold">{fatteningData?.length || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Average Current Weight:</span>
                    <span className="font-semibold">
                      {fatteningData && fatteningData.length > 0 
                        ? (fatteningData.reduce((sum, animal) => sum + animal.current_weight, 0) / fatteningData.length).toFixed(1)
                        : 0} kg
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Average Target Weight:</span>
                    <span className="font-semibold">
                      {fatteningData && fatteningData.length > 0 
                        ? (fatteningData.reduce((sum, animal) => sum + animal.target_weight, 0) / fatteningData.length).toFixed(1)
                        : 0} kg
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Animals</CardTitle>
              <CardDescription>Animals with highest daily weight gain</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tag #</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Breed</TableHead>
                    <TableHead>Daily Gain (kg/day)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {growthAnalytics.topPerformers.length > 0 ? (
                    growthAnalytics.topPerformers.map((animal, index) => (
                      <TableRow key={`top-${index}`}>
                        <TableCell>{animal.tagNumber}</TableCell>
                        <TableCell>{animal.name}</TableCell>
                        <TableCell>{animal.breed}</TableCell>
                        <TableCell>{animal.dailyGain}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-4">No data available</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </TabsContent>
      
      <TabsContent value="individual">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Individual Animal Growth</CardTitle>
              <CardDescription>Select an animal to view its growth history</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4">
                <div className="w-full">
                  <Select onValueChange={handleCattleSelect}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select an animal" />
                    </SelectTrigger>
                    <SelectContent>
                      {cattleOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {selectedCattle && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-4 bg-gray-100 rounded-md">
                        <div className="text-sm font-medium">Starting Weight</div>
                        <div className="text-2xl font-bold">{selectedCattle.entry_weight} kg</div>
                        <div className="text-sm text-muted-foreground">
                          {format(new Date(selectedCattle.entry_date), 'MMM d, yyyy')}
                        </div>
                      </div>
                      
                      <div className="p-4 bg-gray-100 rounded-md">
                        <div className="text-sm font-medium">Current Weight</div>
                        <div className="text-2xl font-bold">{selectedCattle.current_weight} kg</div>
                        <div className="text-sm text-muted-foreground">
                          {selectedCattle.latest_weight_date ? 
                            `Updated ${format(new Date(selectedCattle.latest_weight_date), 'MMM d, yyyy')}` : 
                            'No recent update'}
                        </div>
                      </div>
                      
                      <div className="p-4 bg-gray-100 rounded-md">
                        <div className="text-sm font-medium">Daily Gain</div>
                        <div className="text-2xl font-bold">{selectedCattle.daily_gain?.toFixed(2) || '0.00'} kg/day</div>
                        <div className="text-sm text-muted-foreground">
                          Target: {selectedCattle.target_weight} kg
                        </div>
                      </div>
                    </div>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle>Weight History</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Date</TableHead>
                              <TableHead>Weight (kg)</TableHead>
                              <TableHead>Feeding Regime</TableHead>
                              <TableHead>Notes</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {cattleGrowthHistory.length > 0 ? (
                              cattleGrowthHistory.map((record, index) => (
                                <TableRow key={`history-${index}`}>
                                  <TableCell>{record.recordDate}</TableCell>
                                  <TableCell>{record.weight}</TableCell>
                                  <TableCell className="capitalize">{record.feedingRegime}</TableCell>
                                  <TableCell>{record.notes || "N/A"}</TableCell>
                                </TableRow>
                              ))
                            ) : (
                              <TableRow>
                                <TableCell colSpan={4} className="text-center py-4">No weight history available</TableCell>
                              </TableRow>
                            )}
                          </TableBody>
                        </Table>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default CattleGrowth;
