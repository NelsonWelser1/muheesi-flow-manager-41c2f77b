
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon, PlusCircle } from 'lucide-react';
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from 'date-fns';
import { usePlantationData } from '@/hooks/usePlantationData';

const CropPlanning = () => {
  const { cropsData, loading, error } = usePlantationData();
  const [cropType, setCropType] = useState('');
  const [variety, setVariety] = useState('');
  const [plantingDate, setPlantingDate] = useState(null);
  const [harvestDate, setHarvestDate] = useState(null);
  const [area, setArea] = useState('');
  const [notes, setNotes] = useState('');
  const [plans, setPlans] = useState([]);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    const newPlan = {
      id: Date.now(),
      cropType,
      variety,
      plantingDate,
      harvestDate,
      area: Number(area),
      notes
    };
    setPlans([...plans, newPlan]);
    
    // Reset form
    setCropType('');
    setVariety('');
    setPlantingDate(null);
    setHarvestDate(null);
    setArea('');
    setNotes('');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Crop Planning</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <label className="text-sm font-medium">Planting Date</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {plantingDate ? format(plantingDate, 'PPP') : <span>Select date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={plantingDate}
                      onSelect={setPlantingDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Expected Harvest Date</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {harvestDate ? format(harvestDate, 'PPP') : <span>Select date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={harvestDate}
                      onSelect={setHarvestDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
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
              
              <div className="space-y-2 md:col-span-2">
                <label htmlFor="notes" className="text-sm font-medium">Notes</label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Additional planting instructions and notes"
                  rows={3}
                />
              </div>
            </div>
            
            <Button type="submit" className="w-full md:w-auto">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Crop Plan
            </Button>
          </form>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Planned Crops</CardTitle>
        </CardHeader>
        <CardContent>
          {plans.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground">
              No crop plans added yet. Use the form above to create plans.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {plans.map(plan => (
                <Card key={plan.id} className="bg-accent/30">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">{cropTypes.find(c => c.value === plan.cropType)?.label} - {plan.variety}</h3>
                        <div className="text-sm text-muted-foreground mt-1">
                          <p>Planting: {plan.plantingDate ? format(plan.plantingDate, 'PPP') : 'N/A'}</p>
                          <p>Harvest: {plan.harvestDate ? format(plan.harvestDate, 'PPP') : 'N/A'}</p>
                          <p>Area: {plan.area} acres</p>
                        </div>
                        {plan.notes && (
                          <p className="mt-2 text-sm border-t pt-2">{plan.notes}</p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      
      {!loading && cropsData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Crop Data from Database</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {cropsData.map(crop => (
                <Card key={crop.id} className="bg-primary/10">
                  <CardContent className="p-4">
                    <h3 className="font-semibold">{crop.name} - {crop.variety}</h3>
                    <div className="text-sm text-muted-foreground mt-1">
                      <p>Status: {crop.status}</p>
                      <p>Area: {crop.area} acres</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CropPlanning;
