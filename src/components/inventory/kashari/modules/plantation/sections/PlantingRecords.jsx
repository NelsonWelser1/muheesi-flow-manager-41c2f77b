
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon, PlusCircle, Search } from 'lucide-react';
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from 'date-fns';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";

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

  // Load records from localStorage on component mount
  useEffect(() => {
    const savedRecords = localStorage.getItem('plantingRecords');
    if (savedRecords) {
      try {
        const parsedRecords = JSON.parse(savedRecords);
        
        // Convert date strings back to Date objects
        const recordsWithDates = parsedRecords.map(record => ({
          ...record,
          date: record.date ? new Date(record.date) : null,
          createdAt: record.createdAt ? new Date(record.createdAt) : new Date()
        }));
        
        setRecords(recordsWithDates);
      } catch (error) {
        console.error('Error parsing planting records from localStorage:', error);
      }
    }
  }, []);

  // Save records to localStorage whenever records change
  useEffect(() => {
    localStorage.setItem('plantingRecords', JSON.stringify(records));
  }, [records]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!date || !cropType || !variety || !plotId || !area) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const newRecord = {
      id: Date.now(),
      date,
      cropType,
      variety,
      plotId,
      area: Number(area),
      seedsQuantity,
      fertilizer,
      workers,
      notes,
      createdAt: new Date()
    };
    
    setRecords(prevRecords => [newRecord, ...prevRecords]);
    
    toast({
      title: "Record added successfully",
      description: "Your planting record has been saved.",
      variant: "default",
    });
    
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
  };

  const filteredRecords = records.filter(record => {
    if (!searchTerm) return true;
    
    const search = searchTerm.toLowerCase();
    return (
      (record.cropType && cropTypes.find(c => c.value === record.cropType)?.label.toLowerCase().includes(search)) ||
      (record.variety && record.variety.toLowerCase().includes(search)) ||
      (record.plotId && record.plotId.toLowerCase().includes(search)) ||
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
                  min="0"
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
            
            <Button type="submit" className="w-full md:w-auto">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Planting Record
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
          {filteredRecords.length === 0 ? (
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
                      <TableCell>{cropTypes.find(c => c.value === record.cropType)?.label || 'N/A'}</TableCell>
                      <TableCell>{record.variety || 'N/A'}</TableCell>
                      <TableCell>{record.plotId || 'N/A'}</TableCell>
                      <TableCell>{record.area} acres</TableCell>
                      <TableCell>{record.seedsQuantity || 'N/A'}</TableCell>
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
