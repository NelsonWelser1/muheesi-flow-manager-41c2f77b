
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/integrations/supabase/supabase';

const AddEditCattleDialog = ({ open, onOpenChange, onSubmit, isLoading, cattleId }) => {
  const [formData, setFormData] = useState({
    tag_number: '',
    name: '',
    cattle_type: 'Dairy Cow',
    breed: '',
    date_of_birth: '',
    weight: '',
    status: 'active'
  });
  const [isLoadingCattle, setIsLoadingCattle] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchCattleDetails = async () => {
      if (!cattleId) {
        // Reset form for new cattle
        setFormData({
          tag_number: '',
          name: '',
          cattle_type: 'Dairy Cow',
          breed: '',
          date_of_birth: '',
          weight: '',
          status: 'active'
        });
        return;
      }
      
      setIsLoadingCattle(true);
      try {
        const { data, error } = await supabase
          .from('cattle_inventory')
          .select('*')
          .eq('id', cattleId)
          .single();
          
        if (error) throw error;
        
        // Format date to YYYY-MM-DD for input element
        let formattedDate = '';
        if (data.date_of_birth) {
          formattedDate = new Date(data.date_of_birth).toISOString().split('T')[0];
        }
        
        setFormData({
          ...data,
          date_of_birth: formattedDate
        });
      } catch (error) {
        console.error('Error fetching cattle details:', error);
        toast({
          title: "Error",
          description: "Failed to fetch cattle details.",
          variant: "destructive",
        });
      } finally {
        setIsLoadingCattle(false);
      }
    };
    
    fetchCattleDetails();
  }, [cattleId, toast]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSelectChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.tag_number.trim()) {
      toast({
        title: "Validation Error",
        description: "Tag number is required.",
        variant: "destructive",
      });
      return;
    }
    
    // Convert weight to number
    const processedData = {
      ...formData,
      weight: formData.weight ? parseFloat(formData.weight) : null
    };
    
    onSubmit(processedData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>{cattleId ? 'Edit Cattle' : 'Add New Cattle'}</DialogTitle>
          <DialogDescription>
            {cattleId 
              ? 'Update the information for this cattle.' 
              : 'Enter the details for the new cattle.'}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="tag_number">Tag Number*</Label>
                <Input
                  id="tag_number"
                  name="tag_number"
                  value={formData.tag_number}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cattle_type">Type</Label>
                <Select 
                  value={formData.cattle_type} 
                  onValueChange={(value) => handleSelectChange('cattle_type', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Dairy Cow">Dairy Cow</SelectItem>
                    <SelectItem value="Bull">Bull</SelectItem>
                    <SelectItem value="Heifer">Heifer</SelectItem>
                    <SelectItem value="Calf">Calf</SelectItem>
                    <SelectItem value="Steer">Steer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="breed">Breed</Label>
                <Input
                  id="breed"
                  name="breed"
                  value={formData.breed}
                  onChange={handleChange}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date_of_birth">Date of Birth</Label>
                <Input
                  id="date_of_birth"
                  name="date_of_birth"
                  type="date"
                  value={formData.date_of_birth}
                  onChange={handleChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input
                  id="weight"
                  name="weight"
                  type="number"
                  value={formData.weight}
                  onChange={handleChange}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select 
                value={formData.status} 
                onValueChange={(value) => handleSelectChange('status', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="sold">Sold</SelectItem>
                  <SelectItem value="deceased">Deceased</SelectItem>
                  <SelectItem value="quarantined">Quarantined</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" type="button" onClick={() => onOpenChange(false)} disabled={isLoadingCattle || isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoadingCattle || isLoading}>
              {isLoading ? 'Saving...' : cattleId ? 'Update Cattle' : 'Add Cattle'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddEditCattleDialog;
