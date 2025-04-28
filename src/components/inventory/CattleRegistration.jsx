
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { useCattleInventory } from '@/hooks/useCattleInventory';
import { RotateCcw, Save, Loader2 } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";

const CattleRegistration = () => {
  const { toast } = useToast();
  const { addCattle } = useCattleInventory('kashari');
  
  // Form state
  const [formData, setFormData] = useState({
    tag_number: '',
    name: '',
    type: '',
    breed: '',
    date_of_birth: '',
    weight: '',
    health_status: 'good',
    purchase_date: '',
    notes: ''
  });

  const cattleBreeds = [
    "Holstein-Friesian", "Jersey", "Guernsey", "Ayrshire", "Brown Swiss",
    "Ankole", "Boran", "Sahiwal", "N'Dama", "Zebu", "Nganda", "Mixed-breed"
  ];

  const cattleTypes = [
    "Dairy Cow", "Bull", "Heifer", "Calf", "Steer"
  ];

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleReset = () => {
    setFormData({
      tag_number: '',
      name: '',
      type: '',
      breed: '',
      date_of_birth: '',
      weight: '',
      health_status: 'good',
      purchase_date: '',
      notes: ''
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.tag_number || !formData.type || !formData.breed) {
      toast({
        title: "Missing required fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const payload = {
      ...formData,
      weight: formData.weight ? parseFloat(formData.weight) : null
    };

    try {
      await addCattle.mutateAsync(payload);
      handleReset();
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-medium mb-4">Register New Cattle</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="tag_number">Tag Number <span className="text-red-500">*</span></Label>
            <Input 
              id="tag_number" 
              value={formData.tag_number}
              onChange={handleChange}
              placeholder="KF-2023-001" 
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input 
              id="name" 
              value={formData.name}
              onChange={handleChange}
              placeholder="Cattle name (optional)" 
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="type">Type <span className="text-red-500">*</span></Label>
            <Select 
              value={formData.type} 
              onValueChange={(value) => handleSelectChange('type', value)}
            >
              <SelectTrigger id="type">
                <SelectValue placeholder="Select cattle type" />
              </SelectTrigger>
              <SelectContent>
                {cattleTypes.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="breed">Breed <span className="text-red-500">*</span></Label>
            <Select 
              value={formData.breed} 
              onValueChange={(value) => handleSelectChange('breed', value)}
            >
              <SelectTrigger id="breed">
                <SelectValue placeholder="Select breed" />
              </SelectTrigger>
              <SelectContent>
                {cattleBreeds.map(breed => (
                  <SelectItem key={breed} value={breed}>{breed}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="date_of_birth">Date of Birth</Label>
            <Input 
              id="date_of_birth" 
              type="date" 
              value={formData.date_of_birth}
              onChange={handleChange}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="weight">Weight (kg)</Label>
            <Input 
              id="weight" 
              type="number" 
              min="0"
              step="0.1"
              placeholder="Weight in kg"
              value={formData.weight}
              onChange={handleChange}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="health_status">Health Status</Label>
            <Select 
              value={formData.health_status} 
              onValueChange={(value) => handleSelectChange('health_status', value)}
            >
              <SelectTrigger id="health_status">
                <SelectValue placeholder="Select health status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="excellent">Excellent</SelectItem>
                <SelectItem value="good">Good</SelectItem>
                <SelectItem value="fair">Fair</SelectItem>
                <SelectItem value="poor">Poor</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="purchase_date">Purchase Date</Label>
            <Input 
              id="purchase_date" 
              type="date"
              value={formData.purchase_date}
              onChange={handleChange}
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="notes">Notes</Label>
          <Textarea 
            id="notes" 
            placeholder="Additional information about the cattle" 
            className="min-h-[100px]"
            value={formData.notes}
            onChange={handleChange}
          />
        </div>
        
        <div className="flex justify-end gap-2">
          <Button 
            type="button" 
            variant="outline" 
            onClick={handleReset}
            className="flex items-center gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </Button>
          <Button 
            type="submit" 
            disabled={addCattle.isPending}
            className="flex items-center gap-2"
          >
            {addCattle.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            Register Cattle
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default CattleRegistration;
