
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon, PlusCircle, Search, Loader } from 'lucide-react';
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from 'date-fns';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/integrations/supabase/supabase';
import { showSuccessToast, showErrorToast, showInfoToast } from "@/components/ui/notifications";

const PlantingRecords = () => {
  const [date, setDate] = useState(null);
  const [cropType, setCropType] = useState('');
  const [variety, setVariety] = useState('');
  const [plotId, setPlotId] = useState('');
  const [area, setArea] = useState('');
  const [seedsQuantity, setSeedsQuantity] = useState('');
  const [fertilizer, setFertilizer] = useState('');
  const [workers, setWorkers] = useState('');
  const [notes, setNotes] = useState('');
  const [records, setRecords] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const { toast } = useToast();
  
  const cropTypes = [
    { value: 'banana', label: 'Banana' },
    { value: 'coffee', label: 'Coffee' },
    { value: 'maize', label: 'Maize' },
    { value: 'beans', label: 'Beans' },
    { value: 'cassava', label: 'Cassava' }
  ];

  const varieties = {
    banana: ['Kibuzi', 'Mpologoma', 'Nakitembe', 'FHIA', 'Gonja'],
    coffee: ['Arabica', 'Robusta', 'Bourbon', 'Typica'],
    maize: ['Longe 5', 'Hybrid 6303', 'Local Variety'],
    beans: ['K132', 'NABE 15', 'NABE 16', 'NABE 17'],
    cassava: ['NASE 14', 'NASE 19', 'TME 14']
  };

  // Fetch records from Supabase on component mount
  useEffect(() => {
    fetchPlantingRecords();
  }, []);

  const fetchPlantingRecords = async () => {
    try {
      setIsFetching(true);
      const { data, error } = await supabase
        .from('planting_records')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching planting records:', error);
        showErrorToast(toast, `Failed to fetch records: ${error.message}`);
        return;
      }
      
      // Format dates for display
      const formattedRecords = data.map(record => ({
        ...record,
        date: new Date(record.date)
      }));
      
      setRecords(formattedRecords);
      console.log('Fetched planting records:', formattedRecords);
    } catch (error) {
      console.error('Unexpected error fetching records:', error);
      showErrorToast(toast, `Failed to fetch records: ${error.message}`);
    } finally {
      setIsFetching(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!date || !cropType || !variety || !plotId || !area) {
      showErrorToast(toast, "Please fill in all required fields.");
      return;
    }

    // Validate area is a number
    const areaNumber = parseFloat(area);
    if (isNaN(areaNumber) || areaNumber <= 0) {
      showErrorToast(toast, "Area must be a positive number.");
      return;
    }

    try {
      setIsLoading(true);
      
      // Prepare data for insertion
      const newRecord = {
        date: format(date, 'yyyy-MM-dd'),
        crop_type: cropType,
        variety,
        plot_id: plotId,
        area: areaNumber,
        seeds_quantity: seedsQuantity || null,
        fertilizer: fertilizer || null,
        workers: workers || null,
        notes: notes || null
      };
      
      // Insert into Supabase
      const { data, error } = await supabase
        .from('planting_records')
        .insert([newRecord])
        .select();
      
      if (error) {
        console.error('Error inserting planting record:', error);
        showErrorToast(toast, `Failed to save record: ${error.message}`);
        return;
      }
      
      // Update local records state with the newly inserted record
      const insertedRecord = {
        ...data[0],
        date: new Date(data[0].date)
      };
      
      setRecords(prevRecords => [insertedRecord, ...prevRecords]);
      
      showSuccessToast(toast, "Planting record saved successfully.");
      
      // Reset form
      setDate(null);
      setCropType('');
      setVariety('');
      setPlotId('');
      setArea('');
      setSeedsQuantity('');
      setFertilizer('');
      setWorkers('');
      setNotes('');
    } catch (error) {
      console.error('Unexpected error saving record:', error);
      showErrorToast(toast, `Failed to save record: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredRecords = records.filter(record => {
    if (!searchTerm) return true;
    
    const search = searchTerm.toLowerCase();
    return (
      (record.crop_type && cropTypes.find(c => c.value === record.crop_type)?.label.toLowerCase().includes(search)) ||
      (record.variety && record.variety.toLowerCase().includes(search)) ||
      (record.plot_id && record.plot_id.toLowerCase().includes(search)) ||
      (record.notes && record.notes.toLowerCase().includes(search))
    );
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Add Planting Record</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Planting Date</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, 'PPP') : <span>Select date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="cropType" className="text-sm font-medium">Crop Type</label>
                <Select 
                  value={cropType} 
                  onValueChange={(value) => {
                    setCropType(value);
                    setVariety('');
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select crop type" />
                  </SelectTrigger>
                  <SelectContent>
                    {cropTypes.map(crop => (
                      <SelectItem key={crop.value} value={crop.value}>
                        {crop.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="variety" className="text-sm font-medium">Variety</label>
                <Select 
                  value={variety} 
                  onValueChange={setVariety}
                  disabled={!cropType}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select variety" />
                  </SelectTrigger>
                  <SelectContent>
                    {cropType && varieties[cropType]?.map(var_item => (
                      <SelectItem key={var_item} value={var_item}>
                        {var_item}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="plotId" className="text-sm font-medium">Plot ID/Name</label>
                <Input
                  id="plotId"
                  value={plotId}
                  onChange={(e) => setPlotId(e.target.value)}
                  placeholder="E.g., North Field, Plot A5"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="area" className="text-sm font-medium">Area (acres)</label>
                <Input
                  id="area"
                  type="number"
                  min="0.1"
                  step="0.1"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  placeholder="Area in acres"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="seedsQuantity" className="text-sm font-medium">Seeds/Seedlings Quantity</label>
                <Input
                  id="seedsQuantity"
                  value={seedsQuantity}
                  onChange={(e) => setSeedsQuantity(e.target.value)}
                  placeholder="E.g., 50 kg, 200 seedlings"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="fertilizer" className="text-sm font-medium">Fertilizer Used</label>
                <Input
                  id="fertilizer"
                  value={fertilizer}
                  onChange={(e) => setFertilizer(e.target.value)}
                  placeholder="Type and amount"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="workers" className="text-sm font-medium">Workers Involved</label>
                <Input
                  id="workers"
                  value={workers}
                  onChange={(e) => setWorkers(e.target.value)}
                  placeholder="Names or number of workers"
                />
              </div>
              
              <div className="space-y-2 md:col-span-2 lg:col-span-3">
                <label htmlFor="notes" className="text-sm font-medium">Notes</label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Additional notes about the planting operation"
                  rows={3}
                />
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full md:w-auto"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                  Saving Record...
                </>
              ) : (
                <>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Planting Record
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
          <CardTitle>Planting Records</CardTitle>
          <div className="relative w-full md:w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search records..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
        </CardHeader>
        <CardContent>
          {isFetching ? (
            <div className="flex justify-center items-center py-8">
              <Loader className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2 text-lg">Loading records...</span>
            </div>
          ) : filteredRecords.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground">
              {records.length === 0 
                ? "No planting records added yet. Use the form above to add records."
                : "No matching records found. Try a different search term."}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Crop</TableHead>
                    <TableHead>Variety</TableHead>
                    <TableHead>Plot</TableHead>
                    <TableHead>Area</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRecords.map(record => (
                    <TableRow key={record.id}>
                      <TableCell>{record.date ? format(new Date(record.date), 'dd/MM/yyyy') : 'N/A'}</TableCell>
                      <TableCell>{cropTypes.find(c => c.value === record.crop_type)?.label || record.crop_type || 'N/A'}</TableCell>
                      <TableCell>{record.variety || 'N/A'}</TableCell>
                      <TableCell>{record.plot_id || 'N/A'}</TableCell>
                      <TableCell>{record.area} acres</TableCell>
                      <TableCell>{record.seeds_quantity || 'N/A'}</TableCell>
                      <TableCell className="max-w-xs truncate">{record.notes || 'N/A'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PlantingRecords;
