
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
import { showSuccessToast, showErrorToast } from "@/components/ui/notifications";
import { useHarvestRecords } from "@/hooks/useHarvestRecords";

const HarvestRecords = () => {
  const [date, setDate] = useState(null);
  const [cropType, setCropType] = useState('');
  const [variety, setVariety] = useState('');
  const [plotId, setPlotId] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState('kg');
  const [quality, setQuality] = useState('good');
  const [workers, setWorkers] = useState('');
  const [notes, setNotes] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();
  
  // Use the custom hook for harvest records
  const { 
    records, 
    isLoading, 
    isFetching, 
    fetchHarvestRecords, 
    saveHarvestRecord 
  } = useHarvestRecords();

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

  const units = [
    { value: 'kg', label: 'Kilograms (kg)' },
    { value: 'tons', label: 'Tons' },
    { value: 'bags', label: 'Bags' },
    { value: 'bunches', label: 'Bunches' },
    { value: 'crates', label: 'Crates' }
  ];

  const qualityOptions = [
    { value: 'excellent', label: 'Excellent' },
    { value: 'good', label: 'Good' },
    { value: 'average', label: 'Average' },
    { value: 'poor', label: 'Poor' }
  ];

  // Fetch records from Supabase on component mount
  useEffect(() => {
    fetchHarvestRecords();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const recordData = {
      date,
      cropType,
      variety,
      plotId,
      quantity,
      unit,
      quality,
      workers,
      notes
    };
    
    const { success } = await saveHarvestRecord(recordData);
    
    if (success) {
      // Reset form
      setDate(null);
      setCropType('');
      setVariety('');
      setPlotId('');
      setQuantity('');
      setUnit('kg');
      setQuality('good');
      setWorkers('');
      setNotes('');
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
          <CardTitle>Add Harvest Record</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Harvest Date</label>
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
                <label htmlFor="quantity" className="text-sm font-medium">Quantity</label>
                <div className="flex space-x-2">
                  <Input
                    id="quantity"
                    type="number"
                    min="0"
                    step="0.1"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    placeholder="Amount harvested"
                    className="flex-1"
                  />
                  <Select value={unit} onValueChange={setUnit}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Unit" />
                    </SelectTrigger>
                    <SelectContent>
                      {units.map(u => (
                        <SelectItem key={u.value} value={u.value}>
                          {u.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="quality" className="text-sm font-medium">Quality</label>
                <Select value={quality} onValueChange={setQuality}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select quality" />
                  </SelectTrigger>
                  <SelectContent>
                    {qualityOptions.map(q => (
                      <SelectItem key={q.value} value={q.value}>
                        {q.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
                  placeholder="Additional notes about the harvest"
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
                  Add Harvest Record
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
          <CardTitle>Harvest Records</CardTitle>
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
                ? "No harvest records added yet. Use the form above to add records."
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
                    <TableHead>Quantity</TableHead>
                    <TableHead>Quality</TableHead>
                    <TableHead>Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRecords.map(record => (
                    <TableRow key={record.id}>
                      <TableCell>{record.date ? format(new Date(record.date), 'dd/MM/yyyy') : 'N/A'}</TableCell>
                      <TableCell>{cropTypes.find(c => c.value === record.crop_type)?.label || 'N/A'}</TableCell>
                      <TableCell>{record.variety || 'N/A'}</TableCell>
                      <TableCell>{record.plot_id || 'N/A'}</TableCell>
                      <TableCell>{record.quantity} {record.unit}</TableCell>
                      <TableCell>
                        <span className={`capitalize ${
                          record.quality === 'excellent' ? 'text-green-600' : 
                          record.quality === 'good' ? 'text-green-500' : 
                          record.quality === 'average' ? 'text-yellow-500' : 
                          'text-red-500'
                        }`}>
                          {record.quality}
                        </span>
                      </TableCell>
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

export default HarvestRecords;
