
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon, PlusCircle, Loader } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from 'date-fns';
import { useToast } from "@/components/ui/use-toast";
import { showErrorToast } from "@/components/ui/notifications";

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

const AddHarvestForm = ({ onSubmit, isLoading }) => {
  const [date, setDate] = useState(null);
  const [cropType, setCropType] = useState('');
  const [variety, setVariety] = useState('');
  const [plotId, setPlotId] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState('kg');
  const [quality, setQuality] = useState('good');
  const [workers, setWorkers] = useState('');
  const [notes, setNotes] = useState('');
  const { toast } = useToast();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted with data:", { date, cropType, variety, plotId, quantity, unit, quality, workers, notes });
    
    if (!date) {
      showErrorToast(toast, "Please select a harvest date");
      return;
    }
    
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
    
    const { success } = await onSubmit(recordData);
    
    if (success) {
      console.log("Reset form after successful submission");
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

  return (
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
  );
};

export default AddHarvestForm;
